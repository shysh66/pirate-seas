# Pirate Seas — Technical Architecture

Companion to: *Game Design & Curriculum Map* and the Island 3/4 specs.

## 1. Requirements & Constraints

**Functional:** ~30+ islands driven by a content schema (no per-island code); 7 activity types + boss dialogues as reusable components; per-item SRS scheduler; two modes (Pre-Readers / Readers); English audio everywhere, Hebrew UI (RTL); optional recording + constrained ASR; coins/pearls economy + Trading Post + home island; parent dashboard; analytics hooks per the research triggers.

**Non-functional:**
- Tablet-first (iPad + Android tablets), phones and browser secondary. Landscape-primary on tablets.
- Must run well on *old, cheap family tablets* — the realistic Israeli household device. Budget for 2GB-RAM Android tablets: no heavy 3D, aggressive asset lazy-loading, 60fps not required for learning activities (30fps acceptable).
- **Offline-first.** Kids play in cars and rooms without Wi-Fi. Everything needed to play downloaded islands must work offline; sync is opportunistic.
- Child privacy: COPPA/GDPR-K posture from day one — no third-party ad/attribution SDKs, minimal PII (a nickname and profile avatar; parent email lives only in the parent account).
- Small team assumption: one codebase, boring choices, content pipeline that non-developers (a teacher/writer) can author in.

## 2. Stack Decisions (with trade-offs)

| Decision | Choice | Why / trade-off |
|---|---|---|
| Framework | **Expo (React Native) + expo-router**, managed workflow | One codebase → iOS/Android/web (react-native-web). Trade-off: web build of RN is heavier than a native web app; acceptable since browser is the tertiary target. Bare workflow only if a native module forces it (none currently does). |
| Animation/game feel | **react-native-reanimated + react-native-gesture-handler + Skia (@shopify/react-native-skia)** for activity scenes; **Lottie** for character animations | Full game engines (Unity/Godot) are overkill for 2D card/drag activities and would kill the one-codebase goal. Skia gives performant 2D drawing on all three platforms. Trade-off: complex particle/physics moments (bridge wobble) are hand-built — fine, they're small. |
| Audio | **expo-audio**, all clips pre-recorded MP3/OGG bundled per island pack | No runtime TTS for learning content — recorded native speaker is a pedagogical requirement. TTS only as a dev-time placeholder pipeline. |
| Local data | **SQLite (expo-sqlite)** for SRS state, progress, economy; **MMKV/AsyncStorage** for settings | SRS needs queries ("items due before X, island ≤ N, state ≥ learning") — that's a database, not a JSON blob. |
| State mgmt | **Zustand** (small stores: session, profile, economy) on top of SQLite as source of truth | Redux is ceremony we don't need; React Query enters only for backend sync. |
| Backend | **Minimal managed BaaS (Supabase or Firebase)**: auth (parent), progress backup/sync, parent dashboard data, remote config, content-pack CDN | The game must not depend on a live backend to function (offline-first). Trade-off: vendor lock-in vs. months of saved infra work — accept it, isolate behind a `SyncService` interface. |
| ASR | **On-device first**: iOS SFSpeechRecognizer / Android SpeechRecognizer via a thin native module (or expo-speech-recognition), constrained matching on our side; web: Web Speech API where available, else mic-record-only | Cloud ASR (e.g., Azure Pronunciation Assessment) is more accurate but adds cost, latency, privacy review, and an online dependency for a feature the design treats as a *bonus*. Revisit if analytics show on-device acceptance is too poor (research trigger b). Child audio is never uploaded by default. |
| Analytics | **Self-hosted/privacy-safe (PostHog self-host or Supabase events table)** | Third-party analytics SDKs are a COPPA liability. Events are pseudonymous, batched, sync-when-online. |

## 3. High-Level Component Diagram

```
┌─────────────────────────── App (Expo) ───────────────────────────┐
│                                                                   │
│  Screens (expo-router)                                            │
│   ├── World Map / Island Map                                      │
│   ├── ActivityHost ◄── renders one of 8 activity components       │
│   │     listen-tap · match · word-builder · sound-match           │
│   │     listen-do · chunk-bridge · treasure-dive · boss-dialogue  │
│   ├── Trading Post · Home Island · Parent Zone (gated)            │
│                                                                   │
│  Engines (pure TS, UI-free, unit-tested)                          │
│   ├── ContentEngine   — loads/validates island packs              │
│   ├── SRSEngine       — item states, due queue, injection quota   │
│   ├── SessionDirector — builds each level's item list             │
│   │                     (new + 20-30% review, adaptive rules)     │
│   ├── EconomyEngine   — coins/pearls rules, purchases             │
│   ├── DialogueEngine  — boss script runner (turns, branches)      │
│   └── SpeechGate      — constrained ASR matching, thresholds      │
│                                                                   │
│  Services                                                         │
│   ├── AudioService (preload per level, duck/queue)                │
│   ├── Persistence (SQLite repo layer)                             │
│   ├── SyncService (backup, remote config, content packs)  ──────┼──► BaaS + CDN
│   └── Analytics (event queue, offline buffer)             ──────┼──► events store
└───────────────────────────────────────────────────────────────────┘
```

The four engines are pure TypeScript with zero React imports — they run in Jest, in a CLI content-linter, and eventually server-side for the dashboard, unchanged.

## 4. Project Structure

```
app/                      # expo-router screens
  (game)/map.tsx  island/[id].tsx  level/[id].tsx  boss/[id].tsx
  (meta)/shop.tsx  home-island.tsx  parent/...
src/
  engines/  content/ srs/ session/ economy/ dialogue/ speech/
  activities/            # the 8 activity components (one folder each,
                         #  self-contained: component + mechanics + tests)
  components/            # shared UI: WordTile, PlankTile, PaintBucketTile,
                         #  TwinStickerTile, ResponseCard, ParrotFeedback, MasteryFlag
  services/  audio/ persistence/ sync/ analytics/
  i18n/                  # he.json UI strings, RTL helpers, <EnglishText> wrapper
  theme/
content/                 # authored content, NOT code
  islands/ island-003.json  island-004.json ...
  schema/  island.schema.json  (JSON Schema, CI-validated)
  audio/   island-003/ *.mp3   shared/parrot/*.mp3
  art/     island-003/ ...
tools/
  content-lint.ts        # validates packs: schema, audio files exist,
                         #  vocab only uses taught items, decodability check
  tts-placeholder.ts     # generates temp audio for authoring before recording
```

## 5. Island Content Schema (the contract everything runs on)

Every island is one JSON file + an asset folder. No island ships code. Excerpt of `island.schema.json` expressed as an example (Island 4, abridged):

```jsonc
{
  "id": "island-004",
  "sea": 1,
  "name": { "en": "Rainbow Reef", "he": "שונית הקשת" },
  "unlock": { "requires": "island-003", "srsKnownPct": 80 },
  "grammarFocus": ["it-is-adj", "adj-order", "plural-s"],

  "items": [
    { "id": "w.red",   "type": "word",  "en": "red",   "pos": "adj",
      "audio": "red.mp3", "audioSlow": "red_slow.mp3",
      "image": "swatch_red.png", "decodable": true },
    { "id": "w.three", "type": "word",  "en": "three", "pos": "num",
      "audio": "three.mp3", "audioSlow": "three_slow.mp3",
      "image": "num_3.png", "minimalPair": "tree" },
    { "id": "c.what-color", "type": "chunk", "en": "What color is it?",
      "audio": "chunk_whatcolor.mp3", "tiles": ["What","color","is","it?"] }
  ],

  "levels": [
    { "n": 1, "activity": "listen-tap",
      "intro": [["w.red","w.blue","w.green","w.yellow","w.orange"],
                ["w.one","w.two","w.three","w.four","w.five"]],
      "sceneScript": "painted-reef" },
    { "n": 5, "activity": "chunk-bridge",
      "mechanics": ["plank-copula", "paint-bucket", "twin-sticker"],
      "sentences": [
        { "tiles": ["It","is","a","red","shell"], "plank": "is",
          "paint": {"adj":"red","noun":"shell"} },
        { "tiles": ["three","star","-s"], "twin": true }
      ]}
  ],

  "boss": {
    "npc": "rainbow-octopus",
    "turns": [
      { "id": "t2", "npcAudio": "boss_whatcolor_{color}.mp3",
        "vars": { "color": ["red","blue","yellow","purple"] },
        "responses": [
          { "tiles": ["It's","{color}!"], "advance": true, "sparkle": true },
          { "tiles": ["{color}!"], "advance": true,
            "modelBack": "boss_model_its_{color}.mp3" }
        ],
        "mic": { "target": "it's {color}", "altTargets": ["{color}"] } }
    ]
  },

  "shields": [
    { "id": "color-caller", "he": "יודע/ת צבעים",
      "criteria": { "itemsKnown": ["w.red","..."], "bossTurns": ["t2","t3"] } }
  ],

  "shop": [
    { "id": "sail-green", "price": { "coins": 30 },
      "dialogueChunks": ["c.how-many", "c.please"] }
  ],

  "analytics": { "watch": ["adjOrderErrors", "pluralSOmission", "minPairAccuracy"] }
}
```

**Content pipeline:** author JSON (teacher-friendly; eventually a small web editor) → `content-lint` in CI validates schema, asset existence, decodability of Word-Builder items against the phonics progression, and the golden rule *every word used anywhere (shop names, boss lines, commands) must already be a taught item or introduced in this island* → pack is zipped and pushed to CDN → app downloads island packs ahead of the player's frontier (current +2), verifies hash, stores locally.

## 6. SRS Engine

**Model:** per-item record `(profileId, itemId, state, streak, easiness, dueAt, lastSeen, introducedAt)` in SQLite. States: `new → learning → known → mastered → rusty` (rusty = mastered + overdue > decay window).

**Scheduling:** modified Leitner with the research-mandated intervals as defaults — 1, 3, 7, 14, 30 days — stored in **remote config** so trigger (a) from the research ("retention below expectations → shorten intervals") is a config change, not an app release. Correct unassisted retrieval promotes; assisted/incorrect demotes one step and reschedules same-session (end-of-level retry queue).

**SessionDirector contract (what makes it a game, not flashcards):**
- Level item list = level's scripted new items + review quota (20–30%) of due items filtered to *compatible activity types* (a number word can appear in listen-tap; a chunk can't appear in word-builder).
- Treasure Dive = pure due-queue, capped at ~90 seconds of content.
- Adaptive narrowing: 3 consecutive errors → reduce distractor count, switch to slow audio, add picture hints; recover gradually.
- Island unlock check reads `srsKnownPct` live — the map fog is a database query.

## 7. Boss DialogueEngine

A tiny interpreter over the `boss.turns` script: variable substitution (`{color}` drawn per-run for replay variation), turn advance rules, `modelBack` audio for accepted-but-partial answers, branch turns (Island 3's "sad → cookie" is `"branchOn": "im-sad"`), and a `mic` block handed to SpeechGate. The engine is deliberately dumb — all richness lives in content. If an LLM partner is ever added (Sea 3, per the design's guardrails), it slots in as one new turn type `"llm-constrained"` behind a feature flag, with the independent safety layer server-side; nothing else changes.

## 8. SpeechGate (constrained ASR)

Flow: mic button → record (max 6s) → on-device ASR with, where the platform supports it, a biased/contextual phrase list of the expected targets → normalize (lowercase, strip punctuation, number-word folding) → fuzzy match (Levenshtein on phonemes where available, else words) against `target` + `altTargets` → score band: ★★★ close match / ★★ partial (any target word present) / ★ we heard you trying (speech detected). **No band blocks progress; ★ is still a celebration.** Playback of the child's clip next to the model is always offered (self-monitoring — pedagogically the most defensible feedback we have given child-ASR error rates). Recordings stay on device and are deleted after playback unless a parent explicitly enables "share with parent."
Thresholds and the ★ rubric live in remote config (research trigger b). If ASR is unavailable (old device, web without Web Speech), the mic button becomes record-and-playback only — same UX, no scoring.

## 9. RTL / LTR Handling (the fiddly part)

- App-level: Hebrew UI, `I18nManager.forceRTL(true)` at first launch; all layout uses `start/end`, never `left/right`.
- **`<EnglishText>` wrapper component** forces `direction:'ltr'`, `writingDirection:'ltr'`, `textAlign` per context, and Latin font — used for *every* piece of English learning content. Lint rule bans raw `<Text>` with Latin content in activity components.
- Word tiles/bridges lay out LTR inside an RTL app: LTR is set on the English *content* containers (the prompt stage, the tile/card row) — **not** on the activity screen as a whole, which also holds Hebrew headings and buttons that must stay RTL. So drag targets, letter order, and reading direction match English without left-aligning the surrounding chrome.
- Mixed lines (Hebrew hint containing an English word) use Unicode isolates (FSI/PDI) via an i18n helper to prevent bidi scrambling.
- Web target: verify with `dir="rtl"` on the document + LTR islands — bidi bugs differ per platform, so the E2E suite includes screenshot tests of Level 5 tile layouts on all three platforms.

## 10. Data Model (SQLite, local source of truth)

```
profiles(id, nickname, mode, avatarJson, createdAt)
srs_items(profileId, itemId, state, streak, dueAt, lastSeen, introducedAt)
progress(profileId, islandId, levelN, stars, completedAt)
shields(profileId, shieldId, earnedAt)
economy(profileId, coins, pearls)
inventory(profileId, itemId, placementJson)      -- home island layout
event_queue(id, type, payloadJson, createdAt, synced)
content_packs(islandId, version, hash, path, downloadedAt)
```

Multiple child profiles per device (siblings) from day one — it's much harder to retrofit. Sync = last-write-wins per table row keyed by `(profileId, updatedAt)`; conflicts are rare (one child, usually one device) and losing a few coins is acceptable; SRS merges take the *more conservative* state (lower) on conflict so we never overestimate knowledge.

## 11. Analytics Events (mapped to research triggers)

`item_attempt {itemId, activity, correct, assisted, latencyMs}` · `copula_omitted` / `adj_order_error` / `plural_s_omitted {context}` · `asr_attempt {band, skipped}` · `level_result {durationS, abandoned}` · `session {lengthS, levelsPlayed}` · `purchase {itemId, dialogueCompleted}`.
Dashboards watch exactly the research's four triggers: day-7 retention curve, ASR retry/skip rate, session-length drop-off, (and for the future AI partner: safety flags). All remote-config knobs — SRS intervals, ASR thresholds, micro-lesson length — map 1:1 to those triggers.

## 12. Build & Release

- EAS Build + Submit; channels: dev / staging / production; OTA updates (expo-updates) for JS + content-pointer changes — most curriculum fixes ship without store review.
- Web deployed to **Vercel** (added once the basic app exists — phase 2+): `npx expo export --platform web` produces a static build that Vercel serves from its CDN with preview deployments per PR (each pull request gets a shareable URL — very useful for playtesting curriculum changes with remote testers). Content packs stay on the BaaS/CDN bucket; Vercel hosts only the app shell, so island updates don't require a redeploy.
- Vercel is also the natural home for the adjacent web properties as they appear: the parent dashboard web view, the future content-editor app (phase 5), and the marketing/landing site — same platform, same preview-deploy workflow. If a thin server piece is ever needed in front of the BaaS (e.g., the independent safety layer for the future LLM boss partner), Vercel serverless functions are an option, but the default remains: no custom backend.
- **Status: the Vercel path above is intent, and is not yet delivering it.** Git-triggered builds are not wired, because the GitHub account that owns the repository and the Vercel account that holds the project are different identities — so a push publishes nothing and every deploy has to be issued by hand from the CLI. That means **no per-PR preview URLs yet**, which is precisely the capability the phase-2 plan leans on for remote playtesting; wiring it means importing the repository into a Vercel account that can read it and letting the Vercel GitHub app build on push. Production deploys are currently refused outright — `"reason": "deploy_failed", "message": "Not authorized"` at the build step, while reads on the same CLI session succeed, which points at an account-side permission or billing change rather than anything in the repository. `vercel.json` itself is correct and account-agnostic: `framework: null`, `buildCommand: npm run build:web`, `outputDirectory: dist`, and a catch-all rewrite to `/index.html`. That rewrite is **mandatory, not cosmetic** — `app.json` sets `web.output: "single"`, so the export is a single-page app and every deep link would 404 without it.
- CI: typecheck, engine unit tests, content-lint on every island JSON, Playwright web smoke (map → Island 3 Level 1 happy path), screenshot RTL tests. **Today `npm run ci` runs the first three only:** `tsc --noEmit`, `content_lint.py` over every pack, and the Jest engine suites. The Playwright smoke and the RTL screenshot tests are not written, so browser verification is still manual — which is also why the hosted build command is `npm run build:web` alone and never `npm run ci`, keeping Python out of the build image.
- Store compliance: Kids category on both stores → no third-party trackers, parent gate (math question) in front of Parent Zone and any external links, privacy policy in Hebrew + English.

## 13. Phased Delivery

1. **Walking skeleton (2–3 wks):** Expo app, map screen, ContentEngine + one activity (listen-tap) driven by island-003.json, SQLite persistence, audio service. Proves schema → screen pipeline.
2. **Island 3 vertical slice:** all 7 activities + boss + SRS + economy stub. This is the playtest build (≥5 kids per mode, per the spec's DoD). At the end of this phase, hook up **Vercel** for the web build — PR preview URLs make remote playtesting and stakeholder demos trivial from this point on. **Status: the web build and its Vercel config landed, but the preview URLs did not** — see §12. Until that is wired, remote playtesting has no shareable build and the DoD runs have to happen on a local dev server.
3. **Island 4 + template hardening:** paint-bucket/twin-sticker components, content-lint golden rules, remote config.
4. **Meta layer:** Trading Post dialogue purchases, home island, parent dashboard v1, sync.
5. **Content factory:** author Sea 1 remaining islands purely in JSON — zero new code is the success criterion.

### 13.1 Phase 1 known limitations

Accepted for the walking skeleton, not defects to fix inside it:

- **Pre-readers cannot complete Level 1.** `ItemCard` has no artwork — the pack names an image per item but Phase 1 ships none, so a card is the English word on a blank tile. A pre-reader, by definition, has nothing there to map the audio onto. Readers mode is playable because the prompt word is written out and can be matched against the labels. Resolved when real art lands; until then exercise the activity on a `readers` profile.
- **Placeholder audio is silent** (`tools/gen-placeholder-audio.mjs` writes zero-signal mp3s), so the audio path proves preload, queueing and timing but not comprehension — which is the other half of why the pre-reader path is unplayable today.
- **The web build has no landscape guarantee.** `orientation: "landscape"` in `app.json` is compiled into the iOS `Info.plist` and the Android manifest only; browsers ignore it, so a tablet held portrait renders the game into a shape nothing was laid out for (it reads as clipped markers on the island map). Native builds are unaffected. Deferred rather than fixed because the remedy is a `@media (orientation: portrait)` prompt with its own Hebrew copy — UI that isn't part of the skeleton.

### 13.2 Phase 2 decisions and known gaps

Deliberate for the playtest build. Each one is a place where the code degrades on
purpose rather than reshaping `island-003.json` — the invariant for this phase was that
authored content is not edited.

**That invariant was deliberately suspended once, for the shields only.** Three of island-003's
four can-do shields could not be earned by any amount of play, and a playtest whose credentials are
unreachable measures nothing, so `island-003.json` was edited under explicit sign-off. Everything
else below still holds, and the exception is scoped to the shield criteria — no level, item, or
boss turn was touched. Details are under *Content the code works around*.

**Interaction decisions**

- **Tap-to-place, not drag,** in Word Builder (3A) and the Bridge (L5). Dragging would mean
  `react-native-gesture-handler` plus `react-native-reanimated`, and the target device is a
  cheap Android tablet; tapping a tile then a slot costs nothing in learning terms. The
  Bridge's copula gap stays visible and blocking either way, which is the mechanic that
  matters. One consequence: the plank slot is excluded from left-to-right fill, because a
  plain leftmost fill would make the gap unreachable with tiles I / am / happy.
- **The boss is tap-only.** No microphone, no ASR, no SpeechGate. `mic` blocks are authored
  on all seven turns and read past; spec §5 invites speech on every turn but says a tap
  always suffices, so the dialogue is complete without them, not degraded.
- **The unlock rule is enforced on the routes, not only on the map.** `/level/N` and
  `/boss/island-003` read the same derived markers the map draws and land on a notice when the
  level is locked, so a typed or bookmarked URL cannot pay stars and coins for a level whose
  predecessors were never played. Both guards read live rather than pinning on entry: a level
  cannot re-lock while it is being played, and the boss's own progress row sits past the last
  level so it is not one of the markers the boss guard reads. The cost is on verification, not
  on children — a browser driver can no longer jump straight to a level, which is why the DoD
  runs play the island in order.

**Content the code works around**

- **`unlock.requires` is never enforced.** Island-003 requires `island-000`, which does not
  exist in the repo. The field is shape-validated and otherwise ignored, so the island is
  reachable. Enforcing it would lock the only playable island behind a missing one.
- **`treasure-dive.sources` naming `island-000` is filtered out,** and the due queue falls
  back to island-003's own items ordered by `dueAt` then `introducedAt`. The fallback is
  load-bearing: L6 authors zero item references, so without it a child who reaches it in one
  sitting gets an empty level.
- **The boss's turn-3 clip cannot resolve.** `boss_t3_nice_{nameSting}.mp3` is templated and
  t3 declares no `vars`, so there is no recording and no way to pick one. `AudioService.play`
  throws on an unknown clip, so every authored clip name is filtered through `has()` before it
  reaches the player and t3 plays silent. `content_lint` now checks that every non-templated
  clip a pack names exists on disk.
- **`shuffle.timeGreeting` is read and ignored.** Spec §5 wants a "Good morning!" opener
  before noon, but the pack authors no morning line for t1 — no `vars`, no alternate `npcEn`,
  and the island's only "good morning" is a lowercase vocabulary item. Honouring the flag
  would mean writing Morgan's dialogue in code. `shuffle.turnOrderGroups` *is* implemented,
  so replays still vary.
- **Three island-003 shields were unearnable, and this is the one place content was edited.**
  `greeter`, `my-name-is` and `how-are-you` each demanded evidence no amount of play could produce:
  no level scores `c.my-name-is` or `c.im-fine` at all, and `greeter` asked for a streak of 3 on
  greeting words a single playthrough grades at most twice. `greeter` also required `w.bye`, which
  enters play only through level 2's `readers`-gated word round and so was unreachable for
  pre-readers in particular. The fix drops those three item references and relaxes `greeter` to
  `itemsMinState: 'learning'`. Nothing was lost by dropping them: the can-do evidence each stood in
  for is already required by the same shield's `bossTurns`, where the child must actually produce
  the phrase. The rejected alternative was opening level 2's word round to pre-readers, which would
  show written English to children who cannot read it.
- **All four island-004 shields have earnability problems,** and none are fixable from content
  alone. Two read `adjOrderAccuracyPct` and `pluralSInclusionPct`, which the paint-bucket and
  twin-sticker mechanics would produce and those are Phase 3; the other two ask for `known`, a
  streak of 3, on words their levels grade once or twice, and `counter` names two digits no
  pre-readers level scores at all. `content_lint` warns rather than errors here: from the content
  side a typo and an unshipped mechanic look identical, and a child playing across several days can
  lift a streak through Treasure Dive in a way no static count can see. Tuning this pack is a
  Phase 3 task, deliberately not started.

**Model decisions**

- **`ItemState` stores three values** — `learning`, `known`, `mastered`. `new` is the absence
  of a row and `rusty` is derived from a mastered row overdue past the decay window. Storing
  only what a row can hold keeps `itemsMinState` an ordinal comparison for the shields, where
  `rusty` ranks with `mastered`: a shield already earned is not taken back because a review
  fell due.
- **The mastery flag reads the scheduler, not the stars,** so one clean pass of a level leaves
  it at 0%. Three unassisted returns are what promote an item. That reads like a bug and is
  what a retention meter has to do.
- **Star thresholds are absolute first-try counts,** so review items injected into a level
  raise the item count without raising the bar — review can only help a child's star count.
- **`metrics` stores the latest value, not the best.** The table is keyed by name and knows
  nothing about which direction is good, so a `MAX` would be right for a hit rate and wrong
  for the next metric that measures a problem. `copulaInclusionPct` is measured in L5 and read
  at the boss, which is why the table exists at all.
- **The boss takes a progress row at `n = 7`,** one past the last real level, so that finishing
  it is remembered. Without it every replay would mint another 25 coins and another pearl. The
  map builds markers from the island's own level numbers, so nothing renders it.
- **Pearls have no sink until the Trading Post** (Phase 4), so the purse is the only place a
  pearl is visible and the count only grows.
- **A finished level or boss is written as one transaction.** Completing level 6 writes nine
  scheduler rows, a progress row, a metrics row and a coin award; as separate statements a failure
  midway left partial state — most visibly coins paid for a level whose stars never landed. The
  driver gained a transaction wrapper and both `finishLevel` and `finishBoss` now commit or roll
  back as a unit. A failed write is deliberately **never retried**: the COMMIT may have landed
  before the error surfaced, and retrying would pay the reward twice. It surfaces to the child as
  the map's save-error banner instead, with the level replayable.

**Gaps a playtest cannot close**

- **Placeholder audio is still silent,** which caps what the playtest measures: mechanics and
  pacing, yes; comprehension, no. Worst in the pre-readers dive, where two of the three bubble
  kinds are pure guessing without a clip — around 30 recorded island-003 clips is the
  highest-value non-code input before the DoD playtest.
- **The barnacled-treasure visual never fires.** `rusty` needs a mastered item overdue by
  days, and a single-session profile has none. The code path exists and is unit-tested; no
  child will see it.
- **Three shields ask only for `itemsMinState: 'learning'`,** which a single assisted answer
  satisfies, so they are awarded on weaker evidence than their can-do statement claims. This is the
  accepted price of the content fix above: at `learning` they are earnable, and at `known` they were
  not earnable at all. It is signed off rather than overlooked. The honest resolution is more scored
  exposure of the greeting words across levels so `known` becomes reachable, which is content
  authoring beyond this phase — so do not simply re-tighten the floor.
- **On web, the database can be destroyed underneath the app, and no amount of care in this
  codebase prevents it.** `expo-sqlite` on web is wa-sqlite over OPFS, and the OPFS directory has
  been observed enumerating **zero** entries while the browser still reports the old `fileSystem`
  byte usage — files unlinked out from under a worker that still holds sync access handles. Ten
  occurrences, proven not to originate here: the only `removeEntry` in the worker bundle sits in a
  function nothing calls, and the web `deleteDatabaseAsync` is an empty stub. It has two faces:
  mid-session it is a save-failure banner, and at boot it kills the map with
  `Error code 10: disk I/O error`. Recovery reopens the connection and, failing that, reloads the
  page once — but reopening cannot help on its own, because the worker and VFS are process-wide
  singletons that nothing re-creates, so a fresh connection inherits the dead VFS. **The practical
  consequences: progress is checkpointed per level rather than per island, so a loss costs one
  level and not a session; and a playtest device may lose its profile between sittings.** A hard
  reload with a cleared profile is the only reliable remedy, and it starts the child over.

## 14. What to Revisit as It Grows

- ASR quality data may justify a cloud pronunciation service (parent-consented, batched) — keep SpeechGate's interface ready.
- If web usage surprises upward, evaluate a dedicated PWA shell around the same engines.
- Content editor web app once a non-developer authors island #7.
- The LLM boss partner (Sea 3) — server-side, feature-flagged, independent safety layer; the DialogueEngine already reserves the turn type.

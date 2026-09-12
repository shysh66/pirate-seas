# Pirate Seas — English Adventure

> **Current implementation:** a dependency-free, browser-playable Island 3 MVP lives at
> [`index.html`](index.html). It implements the seven-level flow, both learner modes, Hebrew RTL
> UI with LTR English activities, local progress, rewards, and browser speech synthesis for
> development. The documents below remain the product and production architecture roadmap; the
> Expo/SQLite/audio pipeline they describe has not yet been restored to this repository.

To run the MVP locally, open `index.html` in a browser. Vercel serves it with no build step.

An English-learning game for **Hebrew-speaking children aged roughly 4–10**, taking them from zero
to **CEFR A2** (simple conversations, everyday vocabulary, basic past/present/future). Two modes run
the whole way through: **Pre-Readers** (no text dependency at all) and **Readers**.

The frame is piracy: three **Seas** (CEFR bands), each holding thematic **Islands** (units), each
island a run of **Levels** ending in a boss conversation. Built with Expo + React Native so one
codebase covers tablet, phone and browser.

This file is the entry point: the principles the design rests on, the design itself, the delivery
plan, and where the build currently stands. The four documents in [`docs/`](docs/) hold the full
detail — see [Document map](#document-map).

---

## Status

This repository was reconstructed from the design documents on 2026-09-12. The former Expo source
and its test history referenced below are not present in this checkout. The current browser MVP has
been syntax-checked with `node --check app.js`; its feature gaps are intentional next milestones.

| Phase | State |
|---|---|
| 1 — Browser MVP / Island 3 | **Implemented** in this repository |
| 2 — Production Expo vertical slice | Planned: restore native architecture, tests, SQLite, recorded assets |
| 3 — Island 4 + template hardening | Not started |
| 4 — Meta layer | Not started |
| 5 — Content factory | Not started |

**Two things block the Phase 2 playtest, neither of them code:**

1. **Audio is silent.** `tools/gen-placeholder-audio.mjs` writes zero-signal mp3s, so the audio path
   proves preload, queueing and timing but not comprehension. Around **30 island-003 clips recorded
   by a native speaker** is the highest-value input the project can receive right now. It hits
   pre-readers hardest, where audio carries all target language.
2. **The hosted web build is stale.** Production deploys are refused by Vercel with
   `"reason": "deploy_failed", "message": "Not authorized"` while reads on the same CLI session
   succeed, which points at an account-side permission or billing change rather than anything in
   this repo. `vercel.json` is correct and account-agnostic. The live bundle therefore predates
   `f448b4c` and `55afdcc`.

---

## Game principles

Drawn from the pedagogy research; the full reasoning and citations are in
[`docs/game-design-curriculum-a2.md`](docs/game-design-curriculum-a2.md) §1.

1. **Listening first, but invite output early.** Every item is introduced receptively before
   production, and non-verbal responses (tap, point) are always accepted. The "silent period" is
   contested, so no long pre-production phase is ever *enforced* — optional repeat-after-me
   speaking is invited from the first island and never penalised.
2. **Comprehensible input as the on-ramp, pushed output as the road.** Content sits at i+1 (5–8 new
   words per level, 25–40 per island), but input alone is not treated as sufficient: every unit ends
   in guided production.
3. **Teach chunks, not just words.** Formulaic language ("What's your name?", "Can I have...?") is
   taught and drilled as whole units. This is the fastest route to conversation.
4. **Spaced repetition disguised as gameplay.** Every item carries a memory state
   (New → Learning → Known → Mastered) on a Leitner scheduler. Old items resurface as treasure in
   later islands, and islands unlock on **retention**, not merely completion.
5. **Dual coding on every item.** Word = picture + English audio + English text (Readers only).
   Never text alone.
6. **Retrieval practice over re-exposure.** Once an item leaves New, levels favour recall over
   recognition.
7. **Low affective filter, feedback that produces uptake.** No fail states and no timers on learning
   tasks. Bare recasts are avoided — children hear them as repetition — in favour of **model and
   parrot**: show and say the full correct form, highlight the fixed part, invite a cheerful repeat,
   retry the item later in the session.
8. **Intrinsic integration.** The English *is* the mechanic. The parrot obeys only English commands;
   the chest opens on the right word. Never a quiz bolted onto an unrelated loop.
9. **Self-Determination Theory.** Autonomy (choose the island, choose how to spend), competence
   (visible mastery meter, adaptive difficulty), relatedness (a parrot companion who learns alongside).
10. **Short sessions.** Levels run 3–5 minutes; a session is 2–3 levels plus a review, 10–15 minutes.
    Streaks are gentle and repairable.

### The Hebrew-specific layer

This is what distinguishes the curriculum from a generic English course. Hebrew-speaking children do
not know the Latin alphabet or left-to-right reading, so that is a taught curriculum stage rather
than an assumption. The UI is RTL while all English content must be explicitly forced LTR.

Predictable L1 interference errors, each targeted by a specific mechanic rather than left to chance:

| Hebrew-driven error | Mechanic that targets it |
|---|---|
| Missing copula — "I happy" (Hebrew has no present-tense copula) | The **bridge plank**: am/is is a visually required, blocking piece in sentence building |
| No indefinite article — "I have dog" | "a/an" are separate tiles in assembly |
| Adjective order — "house big" (*bayit gadol*) | Order-sensitive puzzles with gentle recasts |
| "I have" (*yesh li* = "there is to me") | Taught as a chunk, never word-by-word |
| Questions without "do" — "You like pizza?" | Question chunks taught whole |
| Present simple vs progressive (one Hebrew present) | Contrasted visually: static picture vs animation |
| Phonology — think/this, w/v, ship/sheep | Minimal-pair listening games ("Parrot Ears") |

Hebrew is scaffolding for **instructions and grammar insight only** — never a crutch inside an
activity — and it fades as mastery grows. Loanwords (telefon, pizza, banana) are used for early
wins, with the false-friend counterpart (טוסט, טרמפ, פנצ'ר) handled contrastively later.

---

## Design

```
Pirate Seas (game)
└── Sea (world / CEFR band)        3 seas: Pre-A1, A1, A2
    └── Island (thematic unit)     8-12 islands per sea
        └── Level (one activity)   5-7 levels per island + Boss
```

### The standard seven-level island cycle

| # | Level type | Skill | Pedagogy |
|---|---|---|---|
| 1 | Listen & Tap | Receptive vocabulary | Dual coding, comprehensible input |
| 2 | Picture Match | Recognition to recall | Retrieval practice |
| 3 | Word Builder (Readers) / Sound Match (Pre-Readers) | Spelling / phonological awareness | Form focus |
| 4 | Listen & Do | Following commands | Total Physical Response |
| 5 | Chunk Assembly | Sentence building from tiles | Chunking, syntax |
| 6 | Treasure Dive | Mixed review of *earlier* islands | Spaced repetition, interleaving |
| 7 | Boss: Talk to the Captain | Guided dialogue | Communicative output |

All seven are implemented, driven entirely by island JSON. **Island 3 "Name Island"** is the built
vertical slice, chosen because it carries the critical copula lesson at level 5. Level 3 splits by
mode into two different activities sharing one route.

### Modes

| | Pre-Readers (approx. 4–6) | Readers (approx. 7–10) |
|---|---|---|
| Instructions | Demo animation, icons, replay button | Hebrew text plus icons |
| English form | Audio + picture only | Audio + picture + English text |
| Letter/spelling levels | Hidden, unlocked later | Included from Sea 1 |
| Session length | 5–10 min | 10–15 min |
| Boss dialogue | Tap pictures, then repeat aloud | Read, choose, record |

### Progress, assessment and economy

- **Can-do shields, not scores.** Progress is reported as positive functional milestones ("Can greet
  and introduce yourself"), collected on the ship's sail. There is no failing grade anywhere.
- **Embedded formative assessment.** Every tap updates the per-item mastery model; there are no
  visible tests. The mastery meter reads the **scheduler**, not stars, so one clean pass of a level
  leaves an island at 0% — three unassisted returns are what promote an item.
- **Gold coins** are earned for practice and persistence, never accuracy alone — base amount per
  level plus a small first-try bonus. **Pearls** come only from can-do shields, so functional
  language milestones rather than grinding buy the best gear.
- **Guardrails:** cosmetic and expressive purchases only, no pay-to-skip, no loot boxes, no scarcity
  timers, no leaderboards for this age, no real-money purchases by the child.

### Deliberately not built yet

Microphone and ASR (the boss is tap-only), the Trading Post and home island, the parent dashboard,
sync, remote config, real artwork and recorded audio, and any AI conversation partner. Scripted
branching dialogue is the default and an AI partner would be a carefully piloted upgrade, never a
launch feature — the child-safety literature on open LLM chat with minors drives that.

---

## Delivery plan

1. **Walking skeleton.** Expo app, map screen, ContentEngine plus one activity driven by
   `island-003.json`, SQLite persistence, audio service. Proves the schema-to-screen pipeline.
   *Complete.*
2. **Island 3 vertical slice.** All seven activities, the boss, SRS, economy stub. This is the
   playtest build; its Definition of Done is **five or more children per mode** playing the island
   end to end. *Code complete.*
3. **Island 4 plus template hardening.** Paint-bucket and twin-sticker mechanics, content-lint
   golden rules, remote config.
4. **Meta layer.** Trading Post purchases, home island, parent dashboard v1, sync.
5. **Content factory.** Author the rest of Sea 1 purely in JSON — **zero new code is the success
   criterion.**

Phase 2 was executed in seven staged checkpoints, each ending on green CI plus a browser check. The
decisions taken along the way, and the gaps left open on purpose, are recorded in
[`docs/tech-architecture.md`](docs/tech-architecture.md) §13.2.

---

## Engineering guardrails

Binding constraints, not preferences:

- **Engines and services contain zero React imports.** They are pure TypeScript and unit-tested as
  such. Anything testable lives in an engine, never in a component.
- **No third-party analytics or ad SDKs, and no network calls at all** in the current phase.
- **Target old, cheap Android tablets.** Avoid heavy dependencies; landscape-first. Phase 2 added
  **zero** new dependencies — which is why tile interaction is tap-to-place rather than drag, since
  dragging would have pulled in `react-native-gesture-handler` and `react-native-reanimated`.
- **Island JSON is the contract.** If the schema or a pack is ambiguous or missing something the code
  needs, the code degrades gracefully and the gap is documented — the content format is not silently
  reshaped. The one deliberate exception to date is the shield fix in `55afdcc`.
- **Kids-category compliance:** no third-party trackers, a parent gate in front of any external link,
  privacy policy in Hebrew and English.

---

## Known limitations

The full list is in [`docs/tech-architecture.md`](docs/tech-architecture.md) §13.1–13.2. The ones
that will shape whatever you touch next:

- **Silent placeholder audio caps what a playtest can measure** — mechanics and pacing yes,
  comprehension no. Worst in the pre-readers Treasure Dive, where two of three bubble kinds are pure
  guessing without a clip.
- **Browser storage can be wiped out from under the app.** On web, `expo-sqlite` is wa-sqlite over
  OPFS, and the OPFS directory has been observed emptying while the browser still reports the old
  byte usage — ten occurrences, proven not to originate in this codebase. It surfaces either
  mid-session as a save-failure banner or at boot as `Error code 10: disk I/O error`. `f448b4c` added
  a reconnect-and-reload recovery path, which contains the damage but does not prevent the loss;
  progress is checkpointed per level for this reason. Do not treat it as fixed.
- **`unlock.requires` is never enforced**, because island-003 requires a non-existent `island-000`.
  Enforcing it would lock the only playable island behind a missing one.
- **Treasure Dive authors no items of its own**, so its content comes entirely from the due queue,
  with a fallback to island-003's items when nothing is due. That fallback is load-bearing: without
  it, a child reaching level 6 in one sitting gets an empty level.
- **Island 4's shields cannot all be earned.** Two read `adjOrderAccuracyPct` and
  `pluralSInclusionPct`, which the Phase 3 paint-bucket and twin-sticker mechanics would produce; the
  rest ask for streaks that a single playthrough cannot reach. `content_lint` warns rather than
  errors, because from the content side a typo and an unshipped mechanic look identical.
- **The barnacled-treasure visual never fires** in a playtest. `rusty` needs a mastered item overdue
  by days and a single-session profile has none. The path exists and is unit-tested; no child will
  see it.
- **Remote playtesting has no shareable build.** Per-PR preview URLs were the plan's mechanism for
  getting the game in front of testers, and they were never wired; the hosted deploy is additionally
  blocked. Until that is resolved, the Definition of Done runs have to happen on a local dev server.

---

## Document map

| Document | What it holds |
|---|---|
| [`docs/game-design-curriculum-a2.md`](docs/game-design-curriculum-a2.md) | Design principles, Hebrew adaptations, the full zero-to-A2 curriculum across three seas, economy, assessment, pitfalls |
| [`docs/tech-architecture.md`](docs/tech-architecture.md) | Stack decisions, component diagram, island content schema, SRS engine, dialogue engine, RTL/LTR handling, data model, phased delivery, per-phase decisions and gaps |
| [`docs/island-3-name-island-spec.md`](docs/island-3-name-island-spec.md) | The built vertical slice: learning objectives, content inventory, level-by-level design, full boss script, audio production list |
| [`docs/island-4-rainbow-reef-spec.md`](docs/island-4-rainbow-reef-spec.md) | The next island, authored but not yet playable |

---

## Running it

```bash
npm install
```

Everything needed is committed, so a fresh clone runs as-is.

| Command | Purpose |
|---|---|
| `npm run web` | Dev server in the browser — the primary target while art and audio are placeholders |
| `npm run ci` | Typecheck, content lint, and the full Jest suite. Must be green before any commit |
| `npm run typecheck` | `tsc --noEmit` alone |
| `npm run lint:content` | Validate every island pack against the schema and the earnability rules |
| `npm run test` | Jest engine tests only |
| `npm run build:web` | Static web export into `dist/` (what the host builds) |
| `npm run gen:art` / `npm run gen:audio` | Regenerate placeholder art and silent audio. Never overwrites an existing file, so real assets dropped in are safe |

`npm run ci` deliberately is **not** the hosted build command — `build:web` alone is, so the build
image never needs Python for `content_lint`.

# English Adventure — Game Design & Curriculum Map (Zero → CEFR A2)

**Target learners:** Hebrew-speaking children, wide age range (approx. 4–10), two modes: Pre-Readers and Readers
**Goal:** functional English at CEFR A2 (simple conversations, everyday vocabulary, basic past/present/future)
**Platform:** React Native + Expo (tablet-first; phones and browser via react-native-web)
**Working theme:** Pirate Seas — three Seas (worlds), each containing thematic Islands (units), each with 5–7 Levels

---

## 1. Design Principles (from the pedagogy research)

1. **Listening first, but invite output early.** Every new word/chunk is introduced receptively (hear + see) before production, and non-verbal responses (tap, drag, point) are always allowed to lower anxiety. However, the research notes the "silent period" is a contested concept — so the game never *enforces* a long pre-production phase: low-stakes repeat-after-me speaking is invited from the first island, always optional and never penalized.
2. **Comprehensible input as the on-ramp, pushed output as the road.** Content stays at i+1: mostly known language plus a small number of new items (5–8 new words per level, 25–40 per island). But input alone is not sufficient (Swain's output hypothesis; the research flags i+1 as contested as a sole doctrine) — every unit ends in guided *production*: say the chunk, use it in a mini-dialogue.
3. **Teach chunks, not just words.** Formulaic language ("What's your name?", "I don't like...", "Can I have...?") is taught as whole units and drilled as building blocks — this is the fastest route to conversation.
4. **Spaced repetition disguised as gameplay.** Every vocabulary item has a memory state (New → Learning → Known → Mastered) driven by a Leitner-style scheduler. Old items resurface as "treasure" in later islands. Islands unlock on *retention*, not just level completion.
5. **Dual coding on every item.** Word = picture + English audio + English text (Readers mode). Never text alone.
6. **Retrieval practice over re-exposure.** Levels favor recall tasks (produce/choose from memory) over recognition once an item leaves the "New" state.
7. **Low affective filter, feedback that produces uptake.** No fail states, no timers on learning tasks (timers only in optional challenge modes). On errors, avoid bare recasts — research shows children often mistake them for mere repetition and uptake is low. Instead use **"model and parrot"**: the parrot shows *and says* the full correct form, highlights the fixed part, and invites a cheerful repeat; the item is retried later in the same session. Explicit correction is reserved for high-value recurring errors (e.g., the missing copula). Rewards are given for practice and persistence, not only correctness.
8. **Intrinsic integration.** The English *is* the game mechanic: you open the treasure chest by saying/choosing the right word; the parrot only obeys English commands. Avoid "answer a quiz to earn game time."
9. **Self-Determination Theory.** Autonomy: child chooses which unlocked island to sail to and how to spend coins. Competence: visible mastery meter per island, adaptive difficulty. Relatedness: a companion character (parrot) who learns alongside the child and celebrates progress.
10. **Short sessions.** Levels are 3–5 minutes; a session loop of 2–3 levels + 1 review ≈ 10–15 minutes. Daily-streak mechanic is gentle (streak "repair" available, no punishing resets).

---

## 2. Hebrew-Specific Adaptations (L1 scaffolding)

The original research assumed a shared L1; here is the Hebrew-specific layer:

**Script & directionality.** Hebrew children do not know the Latin alphabet or left-to-right reading. This is a real curriculum stage, not an assumption. Sea 1 includes dedicated letter/phonics islands (Readers mode) teaching Latin letters, LTR reading direction, and basic sound–letter mapping. Pre-Readers skip letter levels entirely (audio/picture tasks instead) and unlock them later.

**UI directionality.** The Hebrew UI is RTL; English learning content is LTR. Expo's I18nManager handles RTL layout, but every English-content component must be explicitly forced LTR.

**Predictable Hebrew-speaker errors — targeted explicitly by the curriculum:**
- Omitting "am/is/are" (Hebrew has no present-tense copula): "I happy" → dedicated copula levels early in Sea 1, with the verb visually highlighted as a required "bridge plank" in sentence-building.
- No indefinite article in Hebrew: "I have dog" → article tiles ("a/an") are separate draggable pieces in sentence assembly.
- Adjective order ("house big" from Hebrew bayit gadol) → order-sensitive sentence puzzles with gentle recasts.
- "I have" (Hebrew yesh li = "there is to me") → taught as a chunk, never word-by-word translation.
- Question formation without "do" ("You like pizza?") → question chunks taught whole ("Do you like...?").
- Present simple vs. present progressive (both map to one Hebrew present) → contrasted visually: static picture vs. animation.
- Phonology: /θ, ð/ (think/this), /w/ vs /v/, short vs long vowels (ship/sheep), word-final clusters → minimal-pair listening games ("Parrot Ears") sprinkled through all seas.

**Early wins via loanwords.** The research's cognate finding (cognateness predicts word recognition second only to frequency) translates to Hebrew via its many English loanwords (telefon, pizza, banana, internet, sport...). Island 0 leans on these so children succeed immediately and feel English is partly familiar. The false-friends counterpart also applies: some loanwords drifted in meaning (טוסט = a grilled sandwich, not "toast"; טרמפ = a hitchhiked ride, not "tramp"; פנצ'ר = any mishap, not just a "puncture") — handle these with contrastive mini-games in later islands, as the research recommends for false friends.

**Language of scaffolding.**
- Readers mode: instructions and grammar hints in Hebrew text; all target content in English text + native-speaker English audio.
- Pre-Readers mode: zero text dependency. Instructions delivered by demonstration animation + icon system + a universal "show me again" button. English audio carries all target language.

---

## 3. Game Structure

```
Pirate Seas (game)
└── Sea (world / CEFR band)        3 seas: Pre-A1, A1, A2
    └── Island (thematic unit)     8–12 islands per sea
        └── Level (one activity)   5–7 levels per island + Boss level
```

**Island anatomy (the standard 7-level cycle):**
| # | Level type | Skill | Pedagogy |
|---|-----------|-------|----------|
| 1 | Listen & Tap | Receptive vocab | Dual coding, comprehensible input |
| 2 | Picture Match | Recognition → recall | Retrieval practice |
| 3 | Word Builder (Readers) / Sound Match (Pre-Readers) | Spelling / phonological awareness | Form focus |
| 4 | Listen & Do | Following commands (move your pirate) | TPR |
| 5 | Chunk Assembly | Sentence building from tiles | Chunking, syntax |
| 6 | Treasure Hunt | Mixed review of *earlier* islands | Spaced repetition, interleaving |
| 7 | Boss: Talk to the Captain | Guided dialogue (choose + optionally record) | Communicative output |

**Unlock rule:** next island opens when the boss level is passed *and* ≥80% of the island's vocabulary is at "Known" state in the SRS. If retention is low, the map shows "fog" and the parrot suggests a Treasure Hunt replay.

### 3.1 Rewards System & The Trading Post (shop)

**Currencies.**
- **Gold Coins** — the everyday currency, earned for *practice and persistence* (per the SDT/extrinsic-rewards research: never for accuracy alone). Sources: completing any level (base amount + small bonus for first-try items), the daily 90-second Treasure Dive review, and streak milestones (with streak-repair forgiveness).
- **Pearls** — rare currency earned only from **can-do shields** (boss milestones). Pearls buy signature items, making functional language milestones — not grinding — the path to the coolest gear.

**The Trading Post.** A merchant ship docked at every island. Critically, the shop is itself a language activity (intrinsic integration): the shopkeeper speaks English, and buying requires using taught chunks — tap-to-build or say "Can I have the red hat, please?" / "How much is the telescope?" — directly recycling the Food Lagoon, Market Island, and politeness chunks. The shop is effectively a free-form communicative task disguised as spending money. In Pre-Readers mode the same exchange happens via picture choices + repeat-aloud.

**What's for sale — adjusted to theme and level.** Shop stock unlocks with progression, and item names use *only vocabulary already taught*, so browsing the shop is disguised review:

| Sea | Coin items (examples) | Pearl items (shield-gated) |
|---|---|---|
| 1 — Calm Sea | pirate clothes in taught colors ("a red hat", "blue boots"), parrot colors/accessories, simple toys for the cabin | first ship upgrade (rowboat → sloop), animal companion from Animal Island |
| 2 — Trade Winds | sails & flags, weather effects for your island (rain cloud, rainbow), room furniture for the cabin (recycles Home Harbor vocab), sports gear for the avatar | ship figurehead, town building for your home island, pet tricks ("My parrot can dance!") |
| 3 — Far Ocean | legendary captain outfits, comparative-themed gear ("the biggest hat", "a faster ship"), story props for the four-picture narration stage | golden ship (final upgrade), Pirate King's map table, crew NPCs who greet you in English |

**Home island (the spending sink).** Each child has a customizable home island — placing purchased furniture, buildings, and pets. It doubles as a language space: tapping any owned item says its English name, and periodic "visitor" NPCs ask about it ("What's in your room?" → "There's a lamp on the table"), turning the collection into spontaneous There is/are practice.

**Design guardrails (from the research):**
- Cosmetic and expressive only — no purchasable learning advantages, no pay-to-skip.
- Rewards celebrate effort and communication; accuracy earns at most a small bonus, so weaker learners aren't starved of the economy.
- No loot boxes, no gambling mechanics, no artificial scarcity timers, no real-money purchases by the child. If the product later adds real-money cosmetics, they go through a parent-gated store only, COPPA/GDPR-K compliant, with no ads and no purchase prompts shown to the child in-game.
- Autonomy by design: the child always has several affordable options and free choice of what to buy — the shop is the game's main autonomy outlet under SDT.
- Prices scale gently with sea level so early coins keep their value and returning players always have something attainable within 1–2 sessions.

**Speaking ladder (optional, never blocking).** Spoken output is scaffolded in six rungs of increasing freedom, mapped to the seas:

1. *Listen-and-repeat / mimicry* with recording playback (self-monitoring) — Sea 1
2. *Multiple-choice speaking* — the child speaks one of 2–3 offered responses; constrained ASR (matching against a known target phrase) is far more reliable than open dictation — Sea 1–2
3. *Sentence frames / cloze speaking* — "I like ___" with picture prompts — Sea 2
4. *Guided branching dialogues* — each turn has a small set of acceptable spoken responses — Sea 2–3
5. *Structured role-play & information-gap tasks* — Sea 3
6. *Semi-open production* with generous acceptance — top of Sea 3 only

**ASR rules (children's word error rates run 2–5× adults', worse for non-native speakers):** always constrain the expected response; forgiving thresholds; unlimited no-penalty retries and a skip button; ASR output is a *hint*, never a verdict — it awards bonus stars for recognizable attempts and never marks a child wrong or gates progress. Targeted pronunciation feedback (CAPT) is limited to a small set of high-value Hebrew→English segmental contrasts (th, w/v, short-vs-long vowels) with explicit, visual, mimicry-based feedback — segmentals are where CAPT evidence is strongest.

**If an AI conversation partner is added (Sea 3 boss):** narrow scripted pedagogical persona and topic set only, no open-ended free chat, an independent real-time safety layer separate from the conversational model, age-appropriate output filtering, no data harvesting, and full parental transparency/logs. The child-safety literature on open LLM chatbots with minors is alarming enough that fully scripted branching dialogue is the default; a constrained AI partner is a carefully-piloted upgrade, not a launch feature.

---

## 4. Curriculum Map: Zero → A2

Vocabulary backbone: the Cambridge Young Learners wordlists — Pre-A1 Starters ≈ 450–500 headwords, A1 Movers ≈ +400, A2 Flyers ≈ +500 (including 92 irregular verbs); cumulative ≈ 1,400–1,500 words plus ~120 conversational chunks, organized around Cambridge's ~20 fixed thematic categories. These lists are age-designed, CEFR-mapped, and explicitly built as "a bridge from beginner to A2" — they map exactly onto the three seas. (Counts are widely-cited approximations; treat as scope guidance, not gospel.)

**Pacing expectation (set stakeholder expectations early):** guided-learning-hour estimates of 100–200 hours per CEFR level are for motivated adults; primary-age learners need substantially more. Design for a consistent short daily habit over *months per sea*, not weeks.

### Sea 1 — "The Calm Sea" (Pre-A1 / Starters) — 10 islands

| # | Island | Vocabulary (~) | Chunks & functions | Grammar focus |
|---|--------|---------------|--------------------|---------------|
| 0 | Harbor (tutorial) | loanwords: pizza, banana, telephone, internet... (15) | Hello! Bye! Yes / No | — |
| 1 | Letter Cove A* | Latin letters a–m, LTR reading | — | Sound–letter mapping |
| 2 | Letter Cove B* | Letters n–z, first CVC words (cat, dog, sun) | — | Blending |
| 3 | Name Island | greetings, boy, girl, friend, teacher (20) | What's your name? I'm... How are you? | I am / you are (copula!) |
| 4 | Rainbow Reef | colors, numbers 1–10 (22) | How many? What color is it? It's... | It is + adj; plural -s |
| 5 | Animal Island | pets & farm animals (28) | I like / I don't like... | Indefinite article a/an |
| 6 | Family Bay | family members, he/she (18) | This is my mother. Who's this? | Possessive my/your; he/she is |
| 7 | Food Lagoon | food & drink (30) | I like / Can I have...? please, thank you | I like + noun; don't like |
| 8 | Body & Face Isle | body parts (20) | Touch your nose! I have two eyes | I have; imperatives (TPR-heavy) |
| 9 | Toy Island | toys, big/small, in/on/under (25) | Where is...? It's in the box | Prepositions of place |
| 10 | School Rock | classroom objects, open/close/sit (25) | Open your book! What's this? It's a... | this/that; imperatives |

*Islands 1–2 appear only in Readers mode (or unlock later for Pre-Readers). Pre-Readers get "Sound Coves" instead: rhyme, syllable clapping, first-sound games.

**Sea 1 boss (Captain's Test):** a 6-turn guided dialogue — greet, give your name, say your age, name a favorite animal/food, count objects, say goodbye.

### Sea 2 — "The Trade Winds" (A1 / Movers) — 10 islands

| # | Island | Vocabulary (~) | Chunks & functions | Grammar focus |
|---|--------|---------------|--------------------|---------------|
| 11 | Morning Island | daily routines, days of week (28) | I get up at... What time is it? | Present simple I/you/we |
| 12 | Clock Tower Isle | time, numbers 11–100 (20) | It's seven o'clock / half past... | Present simple 3rd person -s |
| 13 | Weather Isle | weather, seasons (22) | What's the weather like? It's raining | Present progressive |
| 14 | Clothes Cove | clothes (24) | Put on your coat! I'm wearing... | Progressive vs simple (contrast!) |
| 15 | Can-Do Volcano | action verbs: swim, jump, fly, climb (26) | Can you...? I can / can't | can/can't |
| 16 | Town Island | places in town, transport (30) | Where's the...? Go straight, turn left | There is/are; directions |
| 17 | Home Harbor | rooms, furniture (28) | There's a lamp in my room | There is/are + prepositions |
| 18 | Hobby Bay | sports & leisure (26) | Do you like swimming? I love/hate -ing | like + -ing; Do you...? questions |
| 19 | Market Island | food II, quantities (24) | How much is it? I want... Have you got...? | some/any; have got |
| 20 | Feelings Reef | emotions, health basics (20) | I'm happy/tired. What's the matter? | Why...? Because... |

**Sea 2 boss:** Cambridge Movers-style — a "put X under Y" picture-scene task (TPR), a spot-the-difference between two islands ("In my picture there are three boats!"), then a role-play of a full day: tell the time, describe weather, say what you can do, ask for directions, buy something at the market (8–10 turn branching dialogue).

### Sea 3 — "The Far Ocean" (A2 / Flyers) — 14 islands

| # | Island | Vocabulary (~) | Chunks & functions | Grammar focus |
|---|--------|---------------|--------------------|---------------|
| 21 | Yesterday Isle | time expressions, common verbs (24) | Yesterday I played... | Past simple regular |
| 22 | Story Cave | story/adventure verbs (26) | went, saw, ate, had... | Past simple irregular |
| 23 | Question Isle | question words review (18) | What did you do? Where did you go? | Past questions with did |
| 24 | Tomorrow Isle | future plans, months (22) | I'm going to visit... / I will help you! | going to; will |
| 25 | Compare Cliffs | adjectives II (26) | bigger than, the best | Comparatives & superlatives |
| 26 | Journey Island | travel, holidays (28) | I went to... by plane. It was fun! | Past + opinions |
| 27 | Health Haven | illness, body II (22) | I've got a headache. You should rest | should/shouldn't |
| 28 | Job Dock | occupations (22) | She's a doctor. I want to be... | want to + verb |
| 29 | Nature Isle | world around us: forest, river, animals II (28) | The whale is the biggest animal | Superlatives, facts |
| 30 | Always-Never Isle | adverbs of frequency (16) | I always brush my teeth | always/sometimes/never |
| 31 | Connect Isle | linking a story (14) | first, then, after that, because, but | Connectors |
| 32 | Ever-Ever Isle | experiences, been/seen/done (18) | Have you ever...? I've never... | Present perfect |
| 33 | Storm Story Isle | storytelling verbs II (20) | While I was sailing, I saw... | Past continuous; when/while |
| 34 | Conversation Cape | fillers, politeness, invitations (24) | Really? Me too! Shall we...? Would you like...? It's fun, isn't it? | Tag questions; invitations, suggestions, apologies, requests |

**Sea 3 / game boss:** modeled on the Cambridge A2 Flyers Speaking format — (1) spot-the-difference between two pirate scenes, (2) narrate a four-picture story ("First... then... after that..."), (3) a semi-open branching conversation with the Pirate King: introduce yourself, tell a short past story, describe plans, compare two things, handle a misunderstanding ("Sorry, can you say that again?"). Completing it = A2 conversational profile achieved.

### Spaced-repetition overlay (cross-sea)
- Each item carries an SRS state; review intervals ≈ 1, 3, 7, 14, 30 days.
- The daily session always begins with a 90-second "Treasure Dive" of due items.
- Islands inject 20–30% review items from prior islands into every level (interleaving).
- "Rusty word" mechanic: mastered words that decay resurface as barnacle-covered treasure to polish.

---

## 5. Assessment & Adaptivity
- **Embedded formative assessment:** every tap/utterance updates the per-item mastery model; there are no visible "tests."
- **Can-do shields, not scores.** Mirroring the Cambridge Young Learners philosophy, progress is reported as positive functional milestones ("Can greet and introduce yourself" ⭐⭐⭐, "Can tell a simple past story" ⭐⭐), earned as collectible shields on the ship's sail. There is no failing grade anywhere in the game; results always state what the child *can* do.
- **Placement:** returning/older kids take a disguised placement voyage (adaptive 5-minute activity) to skip ahead.
- **Adaptive difficulty:** per-level item selection favors items at the edge of mastery; 3 consecutive errors → level temporarily narrows to fewer options + stronger scaffolds (picture hints, slower audio).
- **Parent dashboard (Hebrew):** words known/learning, minutes practiced, current island, CEFR-band progress bar, weekly email summary.

## 6. Modes Summary

| | Pre-Readers (≈4–6) | Readers (≈7–10) |
|---|---|---|
| Instructions | demo animation + icons + replay button | Hebrew text (+ icons) |
| English form | audio + picture only | audio + picture + English text |
| Letter/spelling levels | hidden (unlock later) | included from Sea 1 |
| Session length | 5–10 min | 10–15 min |
| Boss dialogues | tap-to-choose pictures, then repeat aloud | read + choose + record |

## 7. Pitfalls to Avoid (from the research)
- **Chocolate-covered broccoli:** never bolt quizzes onto an unrelated game loop — the language must *be* the mechanic (Habgood & Ainsworth's intrinsic-integration finding is one of the strongest in the literature).
- **The input trap:** the common failure of language apps — excellent at recognition/input, thin on productive speaking. This game's differentiator is the speaking ladder and dialogue bosses; pilot-test them rigorously with real children, since this is exactly where independent efficacy evidence is weakest across the industry.
- **Bare recasts:** children hear them as repetition, not correction — always make the fix visible/audible and invite a repeat.
- **Leaderboards for this age:** skip them (anxiety + demotivation of lower-skill kids); use personal-best, can-do shields, and cooperative goals instead.
- **Translation-heavy design:** Hebrew is scaffolding for *instructions and grammar insight*, not a crutch inside activities; fade it as mastery grows.
- **ASR as a gate:** children's ASR error rates are 2–5× adults' — recognition is a hint, feedback is celebratory and optional.
- **Streak punishment & dark patterns:** streaks with forgiveness ("streak repair"), no guilt-based notifications aimed at children, no FOMO timers, no ads, COPPA/GDPR-K-compliant analytics.
- **Open AI chat with minors:** documented safety risks — scripted branching dialogue by default; any AI partner is narrow, guardrailed, logged, and parent-transparent.
- **Teaching isolated words to A2:** without chunk drilling and dialogue practice, kids pass vocab levels but can't converse.
- **Unrealistic timelines:** adult-based hour estimates understate children's needs — plan for months per sea and communicate this to parents in the dashboard.

## 8. Data-Driven Adjustment Triggers (from the research)
- Retention below spaced-practice expectations → shorten SRS intervals, increase retrieval frequency.
- High ASR retry/skip rates (frustration signal) → loosen thresholds or fall back to multiple-choice speaking.
- Session drop-off → shorten micro-lessons further.
- Any safety incident with an AI partner → disable it, revert to fully scripted dialogue.

## 9. Next Steps
1. Detail one island end-to-end (Island 3 "Name Island" recommended — it carries the critical copula lesson) — screens, item list, audio script.
2. Tech architecture: Expo project structure, SRS engine, content pipeline (JSON island schema), RTL handling, constrained-ASR approach.
3. Playable prototype of Island 3 + world map.
4. Content production plan: native-speaker audio recording, illustration style guide, Hebrew UI copy.

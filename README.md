# Pirate Seas — English Adventure

Pirate Seas is a browser-based English-learning game for Hebrew-speaking children. The current build starts with no assumed English or Latin-alphabet knowledge and combines listening and reading in one guided journey.

## Implemented now

- Starting Harbor (נמל ההתחלה) as the first-run experience.
- The Launching Cove: six foundation units and 26 core missions.
- Eleven activity types, including boat navigation, sound sorting, memory matching, word transformation, construction, dialogue, and checkpoints.
- Name Island rebuilt as a seven-mission content pack using the same activity framework.
- Sequential unlocks, replayable completed missions, coins, unit pearls, local persistence, and migration from the earlier prototype save.
- Hebrew RTL interface with isolated LTR English content.
- Per-item receptive, literacy, and guided-production evidence with a due-review dock; completion is kept separate from remembered knowledge.
- Idempotent mission and unit reward transactions with stable attempt IDs.
- A vendor-neutral recorded-audio manifest and player with slower device speech as the fallback.

The app remains a prototype. The audio inventory is ready, but its reviewed neural or human MP3 files still need to be produced; device speech remains the fallback. Production also requires reviewed artwork. Completing screens is not presented as evidence of CEFR proficiency.

## Run locally

Serve the folder with any static HTTP server and open `index.html`. Vercel serves the repository without a build step.

Run the automated checks with:

```bash
node --check app.js
node scripts/build-audio-manifest.cjs --check
node tests/smoke.cjs
```

The checks validate the 123-clip audio inventory, content contract, all 33 implemented missions, combined learning track, activity variety, item evidence, spaced review, transactional rewards, progression, persistence, retry behavior, and generated inline handlers.

## Documents

- [`docs/whole-game-design-abc-a2.md`](docs/whole-game-design-abc-a2.md): definitive journey from Starting Harbor through A1, plus the A2 roadmap.
- [`island-3-name-island-spec.md`](island-3-name-island-spec.md): original Name Island design input.
- [`island-4-rainbow-reef-spec.md`](island-4-rainbow-reef-spec.md): Rainbow Reef design input.
- [`tech-architecture.md`](tech-architecture.md): longer-term production architecture.
- [`game-design-curriculum-a2.md`](game-design-curriculum-a2.md): earlier curriculum research and roadmap.

## Next milestone

Finish M1 by producing and reviewing the inventoried neural audio files and running a repeat tablet playtest. Then use the reusable unit contract to implement Rainbow Reef.

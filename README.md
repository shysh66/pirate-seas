# Pirate Seas — English Adventure

Pirate Seas is a browser-based English-learning game for Hebrew-speaking children. The current build starts with no assumed English or Latin-alphabet knowledge and provides separate listening and reading paths.

## Implemented now

- Welcome Harbor as the first-run experience.
- The Launching Cove: six foundation units and 26 core missions.
- Letter-sound introduction, listening choices, word blending, sequencing, case matching, and a foundations checkpoint.
- Pre-reader substitutions for compulsory spelling and letter-matching activities.
- Name Island rebuilt as a seven-mission content pack using the same activity framework.
- Sequential unlocks, replayable completed missions, coins, unit pearls, local persistence, and migration from the earlier prototype save.
- Hebrew RTL interface with isolated LTR English content.

The app remains a prototype. Browser speech synthesis is temporary; production requires reviewed human recordings and artwork. Completing screens is not presented as evidence of CEFR proficiency.

## Run locally

Serve the folder with any static HTTP server and open `index.html`. Vercel serves the repository without a build step.

Run the automated checks with:

```bash
node --check app.js
node tests/smoke.cjs
```

The smoke suite validates the content contract, all 33 implemented missions, both learner paths, progression, persistence, retry behavior, rewards, and generated inline handlers.

## Documents

- [`docs/whole-game-design-abc-a2.md`](docs/whole-game-design-abc-a2.md): definitive journey from Welcome Harbor through A1, plus the A2 roadmap.
- [`island-3-name-island-spec.md`](island-3-name-island-spec.md): original Name Island design input.
- [`island-4-rainbow-reef-spec.md`](island-4-rainbow-reef-spec.md): Rainbow Reef design input.
- [`tech-architecture.md`](tech-architecture.md): longer-term production architecture.
- [`game-design-curriculum-a2.md`](game-design-curriculum-a2.md): earlier curriculum research and roadmap.

## Next milestone

Review the foundation phonics sequence and recordings with an early-literacy/English specialist, replace speech synthesis with recorded assets, and use the reusable unit contract to implement Rainbow Reef.

# Pirate Seas audio production

The game looks up reviewed recordings in `manifest.json` before using device speech synthesis. Every clip begins as `needed`. A clip is used only after its manifest status becomes `ready`; this prevents a missing or unreviewed file from silently replacing the fallback voice.

## Production workflow

1. Run `node scripts/build-audio-manifest.cjs` after changing any spoken content.
2. Generate or record both files listed for each entry: the normal learner version and the supportive slower version.
3. Use one consistent US-English adult voice. Keep words natural rather than exaggerated. Do not generate isolated phonemes without specialist review.
4. Review pronunciation, pacing, and rights; set `pronunciationReview` and `rights` to the reviewer/reference used.
5. Change `status` to `ready` only when both MP3 files exist.
6. Run `node scripts/build-audio-manifest.cjs --check` and the smoke suite.

Recommended delivery format is mono MP3 with consistent perceived loudness. Keep lossless source masters outside the deployed bundle so clips can be revised later.

The manifest is vendor-neutral: a neural TTS export can be used for the prototype, and files can later be replaced by reviewed human recordings without changing activity code or learner progress.

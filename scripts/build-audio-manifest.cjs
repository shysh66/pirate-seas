const { createHash } = require('node:crypto');
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const { dirname, join } = require('node:path');
const vm = require('node:vm');

const root = join(__dirname, '..');
const manifestPath = join(root, 'audio', 'manifest.json');

function loadContent() {
  const app = { innerHTML: '' };
  const windowObject = {};
  const context = vm.createContext({
    console,
    document: { querySelector: () => app },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    window: windowObject,
    setTimeout: () => 1
  });
  vm.runInContext(readFileSync(join(root, 'app.js'), 'utf8'), context);
  return windowObject.PirateSeas.CONTENT;
}

function lookupKey(text) {
  return String(text).toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']+/g, ' ').trim().replace(/\s+/g, ' ');
}

function clipId(text) {
  const slug = lookupKey(text).replace(/'/g, '').replace(/\s+/g, '-').slice(0, 48) || 'clip';
  const hash = createHash('sha1').update(text).digest('hex').slice(0, 7);
  return `${slug}-${hash}`;
}

function recordingCategory(text) {
  if (/^[a-z]$/i.test(text.trim())) return 'phoneme-or-letter';
  if (/[.!?].*[.!?]/.test(text)) return 'dialogue';
  return text.trim().split(/\s+/).length <= 2 ? 'word-or-chunk' : 'phrase';
}

function collectSpeech(content) {
  const values = new Set([
    'Listen and choose', 'Tap and listen', 'Listen', 'Sort the words', 'Find the matching pairs',
    'Flag. Choose a flag', 'Hello', 'This is my flag. Goodbye!'
  ]);
  const spokenKeys = new Set(['say', 'audio', 'result', 'npc', 'good', 'word']);
  const visit = value => {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      if (spokenKeys.has(key) && typeof child === 'string') values.add(child);
      visit(child);
    }
  };
  visit(content);
  for (const unit of content) {
    for (const mission of unit.missions) {
      for (const flag of mission.flags || []) {
        values.add(`Flag. ${flag.audio}. My flag.`);
        values.add(`This is my ${flag.audio}`);
      }
      for (const pair of mission.pairs || []) {
        if (Array.isArray(pair)) values.add(`${pair[0]}, ${pair[1]}`);
      }
    }
  }
  return [...values].map(text => String(text).trim()).filter(Boolean).sort((a, b) => lookupKey(a).localeCompare(lookupKey(b)));
}

function buildManifest(existing = { clips: {} }) {
  const clips = {};
  for (const text of collectSpeech(loadContent())) {
    const id = clipId(text);
    const key = lookupKey(text);
    const previous = existing.clips?.[key] || {};
    clips[key] = {
      id,
      text,
      locale: 'en-US',
      category: recordingCategory(text),
      normal: `audio/en-US/${id}.mp3`,
      supportive: `audio/en-US/${id}-slow.mp3`,
      status: previous.status || 'needed',
      pronunciationReview: previous.pronunciationReview || 'pending',
      rights: previous.rights || 'pending'
    };
  }
  return { version: 1, locale: 'en-US', source: 'neural-or-human-recording', clips };
}

function serialize(manifest) { return `${JSON.stringify(manifest, null, 2)}\n`; }

let existing = { clips: {} };
if (existsSync(manifestPath)) existing = JSON.parse(readFileSync(manifestPath, 'utf8'));
const expected = serialize(buildManifest(existing));
if (process.argv.includes('--check')) {
  if (!existsSync(manifestPath)) throw new Error('audio/manifest.json is missing; run node scripts/build-audio-manifest.cjs');
  const actual = readFileSync(manifestPath, 'utf8').replace(/\r\n/g, '\n');
  if (actual !== expected) throw new Error('audio/manifest.json is stale; run node scripts/build-audio-manifest.cjs');
  const manifest = JSON.parse(actual);
  for (const clip of Object.values(manifest.clips)) {
    if (clip.status !== 'ready') continue;
    for (const path of [clip.normal, clip.supportive]) {
      if (!existsSync(join(root, path))) throw new Error(`Ready audio file is missing: ${path}`);
    }
  }
  console.log(`Audio manifest valid: ${Object.keys(manifest.clips).length} clips inventoried.`);
} else {
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, expected);
  console.log(`Wrote ${manifestPath}`);
}

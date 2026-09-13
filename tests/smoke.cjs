const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const app = { innerHTML: '' };
const feedback = { textContent: '', className: '' };
const saved = new Map();
const spoken = [];
const naturalVoice = { name: 'Samantha', lang: 'en-US', localService: true, default: false };
const windowObject = {};
const context = vm.createContext({
  console,
  document: { querySelector: selector => selector === '#app' ? app : selector === '#feedback' ? feedback : null },
  localStorage: { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value), removeItem: key => saved.delete(key) },
  window: windowObject,
  setTimeout: fn => { fn(); return 1; },
  SpeechSynthesisUtterance: function (text) { this.text = text; },
  speechSynthesis: {
    cancel() {},
    getVoices: () => [
      { name: 'Robot Compact', lang: 'en-US', localService: true, default: true },
      naturalVoice
    ],
    addEventListener() {},
    speak: utterance => spoken.push(utterance)
  }
});
windowObject.speechSynthesis = context.speechSynthesis;
vm.runInContext(readFileSync('app.js', 'utf8'), context);

const run = code => vm.runInContext(code, context);
const api = windowObject.PirateSeas;

function decodeHandler(value) {
  return value.replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
}

function validateHandlers() {
  for (const [, handler] of app.innerHTML.matchAll(/onclick="([^"]*)"/g)) new vm.Script(decodeHandler(handler));
}

assert.deepEqual(Array.from(api.validateContent()), [], 'Content contract must be valid');
run('speak("flag")');
assert.equal(spoken.at(-1).voice, naturalVoice, 'Speech should prefer a natural English voice');
assert.equal(spoken.at(-1).rate, .58, 'Single words should be spoken especially slowly');
assert.equal(spoken.at(-1).pitch, .96, 'Speech should use a calmer pitch');
run('speak("This is my flag. Goodbye!")');
assert.equal(spoken.at(-1).rate, .62, 'Short phrases should use the young-learner pace');
assert.equal(api.CONTENT.filter(unit => unit.world === 'foundations').length, 6);
assert.equal(api.CONTENT.filter(unit => unit.world === 'foundations').reduce((sum, unit) => sum + unit.missions.length, 0), 26);
assert.equal(api.CONTENT.find(unit => unit.id === 'P01').missions.length, 7);
assert(new Set(api.CONTENT.flatMap(unit => unit.missions.map(mission => mission.kind))).size >= 10, 'The journey should contain at least ten distinct activity types');
for (const mission of api.CONTENT.find(unit => unit.id === 'F00').missions) {
  assert([...mission.instructionHe].length <= 30, `${mission.id}: Starting Harbor instruction is too long for young children`);
}
assert.match(app.innerHTML, /מפת ההתחלה/, 'The game should open directly on the large map');
assert.match(app.innerHTML, /מסלול משולב/);
assert.doesNotMatch(app.innerHTML, /mode-title/, 'Separate track selection should be removed');
assert.equal((app.innerHTML.match(/class="counter-tooltip"/g) || []).length, 2, 'Reward counters should explain coins and shells');
assert.match(app.innerHTML, /מרוויחים 10 מטבעות/);
assert.match(app.innerHTML, /מקבלים צדף אחד/);
validateHandlers();

assert.match(app.innerHTML, /מפת ההתחלה/);
assert.match(app.innerHTML, /נמל ההתחלה/);
assert.doesNotMatch(app.innerHTML, /נמל ברוכים הבאים/, 'The first location should use its new name');
assert.match(app.innerHTML, /אי השמות/);
assert.match(app.innerHTML, /class="sea-map"/, 'Main screen should render a visual sea map');
assert.match(app.innerHTML, /class="sea-route-lines"/, 'Visual map should connect locations with a route');
assert.equal((app.innerHTML.match(/class="map-location/g) || []).length, 7, 'Visual map should show every location');
assert.equal((app.innerHTML.match(/class="location-tooltip"/g) || []).length, 7, 'Every location should expose hover information');
assert.match(app.innerHTML, /מה לומדים כאן\?/);
assert.match(app.innerHTML, /map-location location-0[^>]*current/, 'Current location should be highlighted');
assert.match(app.innerHTML, /map-location location-1[^>]*locked[^>]*aria-disabled="true"/, 'Future locations should remain locked and focusable');

for (const unit of api.CONTENT) {
  for (const base of unit.missions) {
    const mission = api.modeMission(base);
    if (['choice', 'checkpoint', 'sail'].includes(mission.kind)) {
      for (const round of mission.rounds || []) assert(round.options.some(option => option.id === round.answer), `${mission.id}: answer missing in combined track`);
    }
    if (mission.kind === 'swap') for (const round of mission.rounds) assert(round.choices.includes(round.answer), `${mission.id}: replacement letter missing`);
    if (mission.kind === 'sort') for (const item of mission.items) assert(mission.buckets.some(bucket => bucket.id === item.bucket), `${mission.id}: sorting bucket missing`);
    if (mission.kind === 'memory') assert(mission.pairs.length >= 3, `${mission.id}: memory game needs several pairs`);
    for (const turn of mission.turns || []) assert(turn.options.includes(turn.good), `${mission.id}: dialogue answer missing`);
  }
}

run("state = freshState(); showWorld()");

function finishAuthoredMission(unit, mission, index) {
  run(`startMission(${JSON.stringify(unit.id)}, ${index})`);
  validateHandlers();
  const active = api.modeMission(mission);
  if (active.kind === 'choice' || active.kind === 'checkpoint') {
    for (const round of active.rounds) run(`chooseAnswer(${JSON.stringify(round.answer)})`);
  } else if (active.kind === 'sail') {
    for (const round of active.rounds) run(`chooseSail(${JSON.stringify(round.answer)})`);
  } else if (active.kind === 'collect') {
    for (const item of active.items) run(`collectItem(${JSON.stringify(item.id)})`);
  } else if (active.kind === 'sort') {
    for (const item of active.items) {
      run(`selectSortItem(${JSON.stringify(item.id)})`);
      run(`chooseSortBucket(${JSON.stringify(item.bucket)})`);
    }
  } else if (active.kind === 'sequence') {
    active.target.forEach((token, tokenIndex) => run(`selectToken(${JSON.stringify(token)}, ${tokenIndex})`));
    run('checkSequence()');
  } else if (active.kind === 'flag') {
    run(`chooseFlag(${JSON.stringify(active.flags[0].id)}); finishFlag()`);
  } else if (active.kind === 'case') {
    for (const pair of active.pairs) run(`chooseCase(${JSON.stringify(pair[1])})`);
  } else if (active.kind === 'swap') {
    for (const round of active.rounds) run(`chooseSwap(${JSON.stringify(round.answer)})`);
  } else if (active.kind === 'memory') {
    for (const pair of active.pairs) {
      run(`flipMemory(${JSON.stringify(`${pair.id}:picture`)})`);
      run(`flipMemory(${JSON.stringify(`${pair.id}:word`)})`);
    }
  } else if (active.kind === 'dialogue') {
    for (const turn of active.turns) run(`chooseDialogue(${JSON.stringify(turn.good)})`);
  } else {
    assert.fail(`Unhandled mission kind ${active.kind}`);
  }
}

for (const unit of api.CONTENT) {
  for (let index = 0; index < unit.missions.length; index++) finishAuthoredMission(unit, unit.missions[index], index);
}

const finalState = api.getState();
for (const unit of api.CONTENT) assert.equal(finalState.progress[unit.id], unit.missions.length, `${unit.id} should complete`);
assert.equal(finalState.pearls, api.CONTENT.length, 'One pearl should be awarded per completed unit');
assert(finalState.coins > 0, 'Coins should be awarded');
assert(saved.has('pirate-seas-v2'), 'Progress should persist');

const reloadApp = { innerHTML: '' };
const reloadWindow = {};
const reloadContext = vm.createContext({
  document: { querySelector: selector => selector === '#app' ? reloadApp : feedback },
  localStorage: context.localStorage,
  window: reloadWindow,
  setTimeout: fn => { fn(); return 1; }
});
vm.runInContext(readFileSync('app.js', 'utf8'), reloadContext);
assert.match(reloadApp.innerHTML, /מפת ההתחלה/, 'Saved learners should resume at the map');
assert.match(reloadApp.innerHTML, new RegExp(`🪙 ${finalState.coins}`), 'Saved rewards should survive reload');

// Repair the v2 migration that incorrectly marked every foundation location complete.
const badV2 = {
  version: 2, mode: 'reader', coins: 17, pearls: 0,
  progress: Object.fromEntries(api.CONTENT.filter(unit => unit.world === 'foundations').map(unit => [unit.id, unit.missions.length]))
};
badV2.progress.P01 = 2;
const migrationStore = new Map([['pirate-seas-v2', JSON.stringify(badV2)]]);
const migrationApp = { innerHTML: '' };
const migrationWindow = {};
vm.runInContext(readFileSync('app.js', 'utf8'), vm.createContext({
  document: { querySelector: selector => selector === '#app' ? migrationApp : feedback },
  localStorage: { getItem: key => migrationStore.get(key) ?? null, setItem: (key, value) => migrationStore.set(key, value) },
  window: migrationWindow,
  setTimeout: fn => { fn(); return 1; }
}));
const repairedState = migrationWindow.PirateSeas.getState();
assert.equal(repairedState.version, 4);
assert.equal(repairedState.mode, 'combined');
assert.equal(repairedState.progress.F00 || 0, 0, 'Auto-completed foundations should reset to mission 1');
assert.equal(repairedState.progress.P01, 2, 'Existing Name Island progress should be preserved');
assert.equal(repairedState.coins, 17, 'Existing rewards should be preserved');

// Replaying mission 1 of a completed location stays inside that location.
run("state = freshState(); state.progress.F00 = 4; startMission('F00', 0); chooseAnswer('hello')");
assert.match(app.innerHTML, /למשימה הבאה במקום הזה/);
assert.match(app.innerHTML, /startMission\('F00',1\)/);
assert.doesNotMatch(app.innerHTML, /showUnit\('F01'\)/);

run("state = freshState(); state.progress.P01 = 4; startMission('P01', 4)");
run("selectToken('happy', 2); selectToken('I', 0); selectToken('am', 1); checkSequence()");
assert.match(app.innerHTML, /I am happy/);
assert.match(app.innerHTML, /selectToken\(&quot;I&quot;,0\)/);

run("state = freshState(); state.progress.F01 = 3; startMission('F01', 3)");
assert.match(app.innerHTML, /הניחו את הצלילים משמאל לימין/);
assert.match(app.innerHTML, /selectToken/);
validateHandlers();

run("state = freshState(); state.progress.F00 = 2; startMission('F00', 2)");
assert.match(app.innerHTML, /data-kind="sail"/);
assert.match(app.innerHTML, /class="helm-controls"/);

run("state = freshState(); state.progress.F00 = 3; startMission('F00', 3)");
assert.equal((app.innerHTML.match(/class="flag-choice/g) || []).length, 4, 'Flag mission should offer four actual flag designs');
assert.match(app.innerHTML, /class="flag-preview empty"/);
assert.match(app.innerHTML, />flag</);
run("chooseFlag('star')");
assert.match(app.innerHTML, /class="flag-preview ready"/);
assert.match(app.innerHTML, /My flag!/);
assert.match(app.innerHTML, /flag-choice selected/);

run("state = freshState(); state.progress.F03 = 0; startMission('F03', 0)");
assert.match(app.innerHTML, /data-kind="sort"/);
assert.match(app.innerHTML, /class="bucket-grid"/);

run("state = freshState(); state.progress.F03 = 3; startMission('F03', 3)");
assert.match(app.innerHTML, /data-kind="swap"/);
assert.match(app.innerHTML, /class="word-machine english"/);

run("state = freshState(); state.progress.P01 = 1; startMission('P01', 1)");
assert.match(app.innerHTML, /data-kind="memory"/);
assert.equal((app.innerHTML.match(/class="memory-card/g) || []).length, 8);
validateHandlers();

console.log(`Passed: ${api.CONTENT.length} units, 33 missions, 11 activity types, combined learning track, persistence, retries, and inline handlers.`);

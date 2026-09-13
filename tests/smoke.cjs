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
const audioManifest = JSON.parse(readFileSync('audio/manifest.json', 'utf8'));

function decodeHandler(value) {
  return value.replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
}

function validateHandlers() {
  for (const [, handler] of app.innerHTML.matchAll(/onclick="([^"]*)"/g)) new vm.Script(decodeHandler(handler));
}

assert.deepEqual(Array.from(api.validateContent()), [], 'Content contract must be valid');
assert.equal(api.freshState().version, 5, 'New saves should use the evidence-aware schema');
assert.deepEqual(Object.keys(api.freshState().memory), []);
assert(Object.keys(audioManifest.clips).length >= 100, 'Every spoken line should be inventoried for recording');
assert(Object.values(audioManifest.clips).every(clip => clip.normal.endsWith('.mp3') && clip.supportive.endsWith('-slow.mp3')));
run('speak("flag")');
assert.equal(spoken.at(-1).voice, naturalVoice, 'Speech should prefer a natural English voice');
assert.equal(spoken.at(-1).rate, .58, 'Single words should be spoken especially slowly');
assert.equal(spoken.at(-1).pitch, .96, 'Speech should use a calmer pitch');
run('speak("This is my flag. Goodbye!")');
assert.equal(spoken.at(-1).rate, .62, 'Short phrases should use the young-learner pace');
run("state = freshState(); startMission('F00', 0); chooseAnswer('boat')");
assert.equal(spoken.at(-1).text, 'Boat', 'A tapped picture should speak its own word, not repeat Hello');
assert.equal(run('session.round'), 0, 'Speaking a wrong picture must not advance the mission');
run('state = freshState(); showWorld()');
assert.equal(api.CONTENT.filter(unit => unit.world === 'foundations').length, 6);
assert.equal(api.CONTENT.filter(unit => unit.world === 'foundations').reduce((sum, unit) => sum + unit.missions.length, 0), 26);
const nameIsland = api.CONTENT.find(unit => unit.id === 'P01');
assert.equal(nameIsland.missions.length, 7);
assert.equal(nameIsland.missions[0].kind, 'collect', 'Name Island should introduce people before testing retrieval');
assert.deepEqual(Array.from(nameIsland.missions[2].target), ['m', 'a', 'n'], 'Name Island literacy should use an eligible word instead of untaught ir');
assert.equal(nameIsland.missions[3].models.length, 2, 'New action verbs should be modeled before the command challenge');
const rainbowReef = api.CONTENT.find(unit => unit.id === 'P02');
const countingCove = api.CONTENT.find(unit => unit.id === 'P03');
assert.equal(rainbowReef.missions.length, 7, 'Rainbow Reef should be a complete seven-mission chapter');
assert.equal(countingCove.missions.length, 7, 'Counting Cove should be a complete seven-mission chapter');
assert.equal(api.CONTENT.indexOf(rainbowReef), api.CONTENT.indexOf(nameIsland) + 1, 'Rainbow Reef should follow Name Island');
assert.equal(api.CONTENT.indexOf(countingCove), api.CONTENT.indexOf(rainbowReef) + 1, 'Counting Cove should follow Rainbow Reef');
assert.deepEqual(Array.from(rainbowReef.missions[0].items, item => item.id), ['red', 'blue', 'yellow', 'green', 'orange', 'pink', 'black', 'white']);
assert.deepEqual(Array.from(rainbowReef.missions[1].pairs, pair => pair.id), ['one', 'two', 'three', 'four', 'five']);
assert.deepEqual(Array.from(countingCove.missions.slice(0, 2).flatMap(mission => mission.items), item => item.id), [
  'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'
]);
assert.deepEqual(Array.from(countingCove.missions[2].items, item => item.id), ['circle', 'square', 'triangle']);
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
assert.equal((app.innerHTML.match(/class="map-location/g) || []).length, api.CONTENT.length, 'Visual map should show every location');
assert.equal((app.innerHTML.match(/class="location-tooltip"/g) || []).length, api.CONTENT.length, 'Every location should expose hover information');
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
    for (const model of active.models || []) run(`previewModel(${JSON.stringify(model.id)})`);
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
assert(finalState.evidence.length > 50, 'Activities should emit item-level learning evidence');
assert(Object.keys(finalState.memory).length > 30, 'Activities should create per-skill memory records');
const missionCount = api.CONTENT.reduce((sum, unit) => sum + unit.missions.length, 0);
assert.equal(Object.keys(finalState.transactions).filter(key => key.startsWith('mission:')).length, missionCount, 'Each mission reward should have one transaction');
assert.equal(Object.keys(finalState.transactions).filter(key => key.startsWith('unit:')).length, api.CONTENT.length, 'Each unit reward should have one transaction');
assert(Object.values(finalState.memory).every(record => record.level < 3), 'Same-session success must not be presented as remembered knowledge');
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
assert.equal(repairedState.version, 5);
assert.equal(repairedState.mode, 'combined');
assert.equal(repairedState.progress.F00 || 0, 0, 'Auto-completed foundations should reset to mission 1');
assert.equal(repairedState.progress.P01, 2, 'Existing Name Island progress should be preserved');
assert.equal(repairedState.coins, 17, 'Existing rewards should be preserved');

// Reward commits are idempotent even if completion is delivered twice.
run("state = freshState(); startMission('F00', 0); chooseAnswer('hello')");
const onceRewarded = api.getState().coins;
run('completeMission()');
assert.equal(api.getState().coins, onceRewarded, 'A repeated completion callback must not duplicate coins');
assert.equal(Object.keys(api.getState().transactions).filter(key => key === 'mission:F00-M01').length, 1);

// A delayed independent retrieval advances memory and leaves an auditable review event.
run("state = freshState(); startMission('F00', 0); chooseAnswer('hello')");
assert.equal(api.getState().memory['receptive:hello'].level, 1, 'First success should schedule learning, not mastery');
run("state.memory['receptive:hello'].dueAt = 0; showWorld()");
assert.match(app.innerHTML, /1 פריטים מחכים לתרגול קצר/);
run('startReview()');
assert.match(app.innerHTML, /חזרה מרווחת/);
run("chooseReview('hello')");
assert.equal(api.getState().memory['receptive:hello'].level, 2, 'A later independent retrieval should advance one interval');
assert(api.getState().evidence.some(event => event.activity === 'spaced-review' && event.itemId === 'hello'));

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

run("state = freshState(); state.progress.P01 = 3; startMission('P01', 3)");
assert.match(app.innerHTML, /קודם מכירים את הפעולות/);
assert.equal((app.innerHTML.match(/class="card"[^>]*disabled/g) || []).length, 3, 'Command choices should wait until both actions are heard');
const gatedRound = run('session.round');
run("chooseAnswer('wave')");
assert.equal(run('session.round'), gatedRound, 'Direct calls must not bypass the action-model gate');
assert.match(feedback.textContent, /קודם שומעים/);
run("previewModel('wave'); previewModel('walk')");
assert.equal((app.innerHTML.match(/class="card"[^>]*disabled/g) || []).length, 0, 'Modeled actions should unlock the command choices');
assert.equal(api.getState().evidence.filter(event => event.activity === 'model').length, 2);

run("state = freshState(); state.progress.P02 = 3; startMission('P02', 3)");
assert.match(app.innerHTML, /two red shells/, 'Rainbow Reef should combine visible color and quantity evidence');
assert.match(app.innerHTML, /🔴🔴/);
run("state = freshState(); state.progress.P02 = 6; startMission('P02', 6)");
assert.match(app.innerHTML, /Hear Rainbow Octopus/, 'Rainbow Reef dialogue should use its own character');

run("state = freshState(); state.progress.P03 = 5; startMission('P03', 5)");
assert.match(app.innerHTML, /purple circle/, 'Counting Cove should reuse colors while sorting shapes');
assert.equal((app.innerHTML.match(/class="sound-bucket/g) || []).length, 3);
run("state = freshState(); state.progress.P03 = 6; startMission('P03', 6)");
assert.match(app.innerHTML, /Hear Cargo Keeper/, 'Counting Cove dialogue should use its own character');

console.log(`Passed: ${api.CONTENT.length} units, ${api.CONTENT.reduce((sum, unit) => sum + unit.missions.length, 0)} missions, 11 activity types, audio inventory, evidence, spaced review, transactional rewards, three Pre-A1 chapters, persistence, retries, and inline handlers.`);

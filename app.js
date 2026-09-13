/* Pirate Seas — dependency-free curriculum prototype. */
const STORAGE_KEY = "pirate-seas-v2";

const O = (id, emoji, audio = id, label = id) => ({ id, emoji, audio, label });
const L = (id, emoji, sound, name = id.toUpperCase()) => O(id, emoji, sound, name);

const CONTENT = [
  {
    id: "F00", world: "foundations", icon: "⚓", nameHe: "נמל ברוכים הבאים", nameEn: "Welcome Harbor",
    summaryHe: "פוגשים את התוכי ולומדים להקשיב, לבחור, לנוע ולעצור.", reward: 20,
    missions: [
      { id: "F00-M01", icon: "👋", nameHe: "שלום, תוכי!", kind: "choice", instructionHe: "התוכי אומר Hello. געו ביד שמנופפת.", rounds: [
        { say: "Hello!", answer: "hello", options: [O("hello", "👋", "Hello!"), O("boat", "⛵", "Boat"), O("parrot", "🦜", "Parrot")] }
      ] },
      { id: "F00-M02", icon: "🔊", nameHe: "בודקים את הצליל", kind: "collect", instructionHe: "געו בכל תמונה. התוכי ישמיע את המילה.", items: [O("listen", "👂", "Listen"), O("look", "👀", "Look"), O("yes", "👍", "Yes"), O("no", "👎", "No")] },
      { id: "F00-M03", icon: "⛵", nameHe: "הסירה זזה", kind: "choice", instructionHe: "הקשיבו ועזרו לסירה לנוע או לעצור.", rounds: [
        { say: "Go!", answer: "go", options: [O("go", "▶️", "Go"), O("stop", "⏹️", "Stop")] },
        { say: "Stop!", answer: "stop", options: [O("go", "▶️", "Go"), O("stop", "⏹️", "Stop")] },
        { say: "Go!", answer: "go", options: [O("go", "▶️", "Go"), O("stop", "⏹️", "Stop")] }
      ] },
      { id: "F00-M04", icon: "🚩", nameHe: "הדגל שלי", kind: "flag", instructionHe: "בחרו דגל לסירה, ואז אמרו Goodbye לנמל.", flags: ["🐚", "⭐", "🦜", "🌈"] }
    ]
  },
  {
    id: "F01", world: "foundations", icon: "🏮", nameHe: "אותיות הפנסים", nameEn: "Lantern Letters",
    summaryHe: "מגלים את הצלילים s, a, t, p, i, n ומחברים אותם למילים ראשונות.", reward: 25,
    missions: [
      { id: "F01-M01", icon: "✨", nameHe: "s · a · t", kind: "collect", instructionHe: "הדליקו כל פנס ושמעו את הצליל.", items: [L("s", "☀️", "s, sun"), L("a", "🍎", "a, apple"), L("t", "🐯", "t, tiger")] },
      { id: "F01-M02", icon: "✨", nameHe: "p · i · n", kind: "collect", instructionHe: "שלושה פנסים חדשים מחכים לכם.", items: [L("p", "🐷", "p, pig"), L("i", "🦎", "i, iguana"), L("n", "👃", "n, nose")] },
      { id: "F01-M03", icon: "👂", nameHe: "הצליל הראשון", kind: "choice", instructionHe: "שמעו את הצליל ובחרו את התמונה שמתחילה בו.", rounds: [
        { say: "s", answer: "sun", options: [O("sun", "☀️", "sun"), O("pig", "🐷", "pig"), O("nose", "👃", "nose")] },
        { say: "p", answer: "pig", options: [O("tiger", "🐯", "tiger"), O("pig", "🐷", "pig"), O("apple", "🍎", "apple")] },
        { say: "n", answer: "nose", options: [O("nose", "👃", "nose"), O("sun", "☀️", "sun"), O("tiger", "🐯", "tiger")] }
      ], readerPrompt: "איזו תמונה מתחילה באות המוצגת?" },
      { id: "F01-M04", icon: "🧩", nameHe: "מחברים צלילים", kind: "sequence", instructionHe: "הניחו את הצלילים משמאל לימין ובנו sat.", say: "s, a, t, sat", target: ["s", "a", "t"], picture: "🧍", result: "sat",
        preVariant: { kind: "choice", instructionHe: "שמעו את המילה ובחרו את התמונה.", rounds: [{ say: "sat", answer: "sat", options: [O("sat", "🧍", "sat"), O("pin", "📌", "pin"), O("tap", "👆", "tap")] }] } }
    ]
  },
  {
    id: "F02", world: "foundations", icon: "🏖️", nameHe: "חוף הבקבוקים", nameEn: "Bottle Beach",
    summaryHe: "מכירים m, d, g, o, c, k ובונים map, cat, dog.", reward: 25,
    missions: [
      { id: "F02-M01", icon: "🍾", nameHe: "m · d · g", kind: "collect", instructionHe: "פתחו את הבקבוקים ושמעו את הצלילים.", items: [L("m", "🗺️", "m, map"), L("d", "🐶", "d, dog"), L("g", "🎁", "g, gift")] },
      { id: "F02-M02", icon: "🍾", nameHe: "o · c · k", kind: "collect", instructionHe: "עוד שלושה צלילים הגיעו לחוף.", items: [L("o", "🐙", "o, octopus"), L("c", "🐱", "c, cat"), L("k", "🔑", "k, key")] },
      { id: "F02-M03", icon: "🔎", nameHe: "מה מתחיל כך?", kind: "choice", instructionHe: "הקשיבו ובחרו את התמונה המתאימה.", rounds: [
        { say: "m", answer: "map", options: [O("map", "🗺️", "map"), O("dog", "🐶", "dog"), O("cat", "🐱", "cat")] },
        { say: "d", answer: "dog", options: [O("map", "🗺️", "map"), O("dog", "🐶", "dog"), O("key", "🔑", "key")] },
        { say: "c, cat", answer: "cat", options: [O("cat", "🐱", "cat"), O("gift", "🎁", "gift"), O("dog", "🐶", "dog")] }
      ] },
      { id: "F02-M04", icon: "⚙️", nameHe: "מכונת המילים", kind: "sequence", instructionHe: "הכניסו את הצלילים לפי הסדר ובנו dog.", say: "d, o, g, dog", target: ["d", "o", "g"], picture: "🐶", result: "dog",
        preVariant: { kind: "choice", instructionHe: "איזו תמונה היא dog?", rounds: [{ say: "dog", answer: "dog", options: [O("cat", "🐱", "cat"), O("dog", "🐶", "dog"), O("map", "🗺️", "map")] }] } }
    ]
  },
  {
    id: "F03", world: "foundations", icon: "🌊", nameHe: "לגונת התנועות", nameEn: "Short-Vowel Lagoon",
    summaryHe: "מבדילים בין תנועות קצרות ומשנים צליל אחד במילה.", reward: 25,
    missions: [
      { id: "F03-M01", icon: "👂", nameHe: "e או u", kind: "choice", instructionHe: "הקשיבו למילה ובחרו את התמונה.", rounds: [
        { say: "pen", answer: "pen", options: [O("pen", "🖊️", "pen"), O("sun", "☀️", "sun")] },
        { say: "sun", answer: "sun", options: [O("pen", "🖊️", "pen"), O("sun", "☀️", "sun")] }
      ] },
      { id: "F03-M02", icon: "🪷", nameHe: "r · h · b", kind: "collect", instructionHe: "געו בפרחים ושמעו צליל ומילה.", items: [L("r", "🏃", "r, run"), L("h", "🎩", "h, hat"), L("b", "🛏️", "b, bed")] },
      { id: "F03-M03", icon: "🪷", nameHe: "f · l", kind: "collect", instructionHe: "השלימו את גינת הצלילים.", items: [L("f", "🐟", "f, fish"), L("l", "🦁", "l, lion"), L("e", "🥚", "e, egg"), L("u", "☂️", "u, umbrella")] },
      { id: "F03-M04", icon: "🪄", nameHe: "מחליפים צליל", kind: "choice", instructionHe: "המילה משתנה בצליל אחד. בחרו את התמונה החדשה.", rounds: [
        { say: "hat. Change a to o. hot.", answer: "hot", options: [O("hat", "🎩", "hat"), O("hot", "🥵", "hot"), O("bed", "🛏️", "bed")] },
        { say: "pen. Change p to h. hen.", answer: "hen", options: [O("pen", "🖊️", "pen"), O("hen", "🐔", "hen"), O("sun", "☀️", "sun")] }
      ] }
    ]
  },
  {
    id: "F04", world: "foundations", icon: "🔭", nameHe: "מצפה האלף־בית", nameEn: "Alphabet Lookout",
    summaryHe: "משלימים את j, v, w, x, y, z, qu ומתקנים את שלט המצפה.", reward: 30,
    missions: [
      { id: "F04-M01", icon: "🔭", nameHe: "j · v · w", kind: "collect", instructionHe: "הביטו במצפה ושמעו שלושה צלילים.", items: [L("j", "🫙", "j, jam"), L("v", "🚐", "v, van"), L("w", "🌊", "w, wave")] },
      { id: "F04-M02", icon: "🔭", nameHe: "x · y · z", kind: "collect", instructionHe: "גלו את הצלילים בקצה האלף־בית.", items: [L("x", "📦", "x, box"), L("y", "🪀", "y, yo-yo"), L("z", "🤐", "z, zip")] },
      { id: "F04-M03", icon: "👑", nameHe: "q עם u", kind: "choice", instructionHe: "q ו־u מפליגות יחד. בחרו את queen.", rounds: [{ say: "qu, queen", answer: "queen", options: [O("queen", "👑", "queen"), O("van", "🚐", "van"), O("box", "📦", "box")] }] },
      { id: "F04-M04", icon: "🔡", nameHe: "גדולה וקטנה", kind: "case", instructionHe: "התאימו לכל אות קטנה את האות הגדולה שלה.", pairs: [["s", "S"], ["m", "M"], ["w", "W"]],
        preVariant: { kind: "choice", instructionHe: "שמעו w או v ובחרו את התמונה.", rounds: [{ say: "w, wave", answer: "wave", options: [O("wave", "🌊", "wave"), O("van", "🚐", "van")] }, { say: "v, van", answer: "van", options: [O("wave", "🌊", "wave"), O("van", "🚐", "van")] }] } },
      { id: "F04-M05", icon: "🪧", nameHe: "מתקנים את השלט", kind: "sequence", instructionHe: "סדרו את האותיות החסרות משמאל לימין.", say: "x, y, z", target: ["x", "y", "z"], picture: "🪧", result: "xyz",
        preVariant: { kind: "collect", instructionHe: "המצפה הושלם. געו בתמונות וחזרו על המילים.", items: [O("jam", "🫙", "jam"), O("van", "🚐", "van"), O("wave", "🌊", "wave"), O("box", "📦", "box"), O("zip", "🤐", "zip")] } }
    ]
  },
  {
    id: "F05", world: "foundations", icon: "💡", nameHe: "מגדלור המילים", nameEn: "First-Word Lighthouse",
    summaryHe: "מחברים, מפרקים וקוראים מילים קצרות שכבר הכרנו.", reward: 40,
    missions: [
      { id: "F05-M01", icon: "🔦", nameHe: "קוראים באור", kind: "choice", instructionHe: "שמעו את המילה ובחרו את התמונה.", rounds: [
        { say: "cat", answer: "cat", options: [O("cat", "🐱", "cat"), O("dog", "🐶", "dog"), O("hat", "🎩", "hat")] },
        { say: "map", answer: "map", options: [O("map", "🗺️", "map"), O("sun", "☀️", "sun"), O("pen", "🖊️", "pen")] },
        { say: "hat", answer: "hat", options: [O("cat", "🐱", "cat"), O("hat", "🎩", "hat"), O("bed", "🛏️", "bed")] }
      ] },
      { id: "F05-M02", icon: "🧱", nameHe: "בונים cat", kind: "sequence", instructionHe: "שמעו ובנו cat משמאל לימין.", say: "c, a, t, cat", target: ["c", "a", "t"], picture: "🐱", result: "cat",
        preVariant: { kind: "choice", instructionHe: "שמעו cat ובחרו את התמונה.", rounds: [{ say: "cat", answer: "cat", options: [O("cat", "🐱", "cat"), O("dog", "🐶", "dog"), O("map", "🗺️", "map")] }] } },
      { id: "F05-M03", icon: "🔁", nameHe: "משנים מילה", kind: "choice", instructionHe: "הקשיבו לשינוי ובחרו את התוצאה.", rounds: [
        { say: "cat. Change c to h. hat.", answer: "hat", options: [O("cat", "🐱", "cat"), O("hat", "🎩", "hat"), O("hot", "🥵", "hot")] },
        { say: "dog. Change d to l. log.", answer: "log", options: [O("dog", "🐶", "dog"), O("log", "🪵", "log"), O("map", "🗺️", "map")] }
      ] },
      { id: "F05-M04", icon: "🖼️", nameHe: "משפט קטן", kind: "choice", instructionHe: "שמעו a red hat ובחרו את התמונה.", rounds: [{ say: "a red hat", answer: "red-hat", options: [O("red-hat", "🎩🔴", "a red hat", "a red hat"), O("red-cat", "🐱🔴", "a red cat", "a red cat"), O("hot-sun", "☀️🥵", "hot sun", "hot sun")] }] },
      { id: "F05-M05", icon: "🏆", nameHe: "מדליקים את המגדלור", kind: "checkpoint", instructionHe: "שלוש משימות קצרות ידליקו את המגדלור.", rounds: [
        { say: "s", answer: "sun", options: [O("sun", "☀️", "sun"), O("map", "🗺️", "map"), O("dog", "🐶", "dog")] },
        { say: "dog", answer: "dog", options: [O("cat", "🐱", "cat"), O("dog", "🐶", "dog"), O("hat", "🎩", "hat")] },
        { say: "a red hat", answer: "red-hat", options: [O("red-hat", "🎩🔴", "a red hat", "a red hat"), O("cat", "🐱", "cat"), O("sun", "☀️", "sun")] }
      ] }
    ]
  },
  {
    id: "P01", world: "pre-a1", icon: "🏝️", nameHe: "אי השמות", nameEn: "Name Island",
    summaryHe: "אומרים שלום, מציגים את עצמנו ופוגשים חברים חדשים.", reward: 50,
    missions: [
      { id: "P01-M01", icon: "👂", nameHe: "פוגשים את האי", kind: "choice", instructionHe: "הקשיבו ובחרו את התמונה.", rounds: [
        { say: "teacher", answer: "teacher", options: [O("teacher", "🧑‍🏫"), O("boy", "👦"), O("girl", "👧")] },
        { say: "friend", answer: "friend", options: [O("friend", "🧑‍🤝‍🧑"), O("teacher", "🧑‍🏫"), O("girl", "👧")] },
        { say: "girl", answer: "girl", options: [O("boy", "👦"), O("girl", "👧"), O("friend", "🧑‍🤝‍🧑")] }
      ] },
      { id: "P01-M02", icon: "🃏", nameHe: "זוגות של חברים", kind: "choice", instructionHe: "שמעו את הצדף ומצאו את התמונה.", rounds: [
        { say: "boy", answer: "boy", options: [O("boy", "👦"), O("girl", "👧"), O("teacher", "🧑‍🏫")] },
        { say: "goodbye", answer: "goodbye", options: [O("hello", "👋"), O("goodbye", "⛵"), O("friend", "🧑‍🤝‍🧑")] }
      ] },
      { id: "P01-M03", icon: "🔤", nameHe: "בונים girl", kind: "sequence", instructionHe: "סדרו את האותיות ובנו girl.", say: "girl", target: ["g", "i", "r", "l"], picture: "👧", result: "girl",
        preVariant: { kind: "choice", instructionHe: "איזו תמונה מתחילה בצליל b?", rounds: [{ say: "b, boy", answer: "boy", options: [O("boy", "👦"), O("cat", "🐱"), O("sun", "☀️")] }] } },
      { id: "P01-M04", icon: "🦜", nameHe: "התוכי אומר", kind: "choice", instructionHe: "הקשיבו לפקודה ובחרו מה לעשות.", rounds: [{ say: "Wave to the girl!", answer: "wave-girl", options: [O("wave-boy", "👋👦", "Wave to the boy", "Wave to the boy"), O("wave-girl", "👋👧", "Wave to the girl", "Wave to the girl"), O("walk-teacher", "🚶🧑‍🏫", "Walk to the teacher", "Walk to the teacher")] }] },
      { id: "P01-M05", icon: "🌉", nameHe: "גשר המילים", kind: "sequence", instructionHe: "בנו את המשפט I am happy משמאל לימין.", say: "I am happy", target: ["I", "am", "happy"], picture: "🌉", result: "I am happy" },
      { id: "P01-M06", icon: "💎", nameHe: "אוצר מילים", kind: "choice", instructionHe: "הקשיבו למילה ישנה ומצאו את האוצר.", rounds: [
        { say: "hello", answer: "hello", options: [O("hello", "👋"), O("goodbye", "⛵"), O("friend", "🧑‍🤝‍🧑")] },
        { say: "happy", answer: "happy", options: [O("happy", "😊"), O("sad", "😢"), O("teacher", "🧑‍🏫")] },
        { say: "friend", answer: "friend", options: [O("friend", "🧑‍🤝‍🧑"), O("boy", "👦"), O("girl", "👧")] }
      ] },
      { id: "P01-M07", icon: "🏴‍☠️", nameHe: "קפטן מורגן", kind: "dialogue", instructionHe: "בחרו תשובה ועזרו לקפטן להכיר אתכם.", turns: [
        { npc: "Ahoy! Hello!", good: "Hello!", options: ["Hello!", "Goodbye!"] },
        { npc: "What's your name?", good: "My name is Captain!", options: ["My name is Captain!", "Goodbye!"] },
        { npc: "How are you?", good: "I'm happy!", options: ["I'm happy!", "I happy"] },
        { npc: "Who is this?", good: "This is my friend!", options: ["This is my friend!", "This friend"] },
        { npc: "Welcome to Name Island! Goodbye!", good: "Goodbye!", options: ["Goodbye!", "Hello!"] }
      ] }
    ]
  }
];

const UNIT_BY_ID = Object.fromEntries(CONTENT.map(unit => [unit.id, unit]));
const app = document.querySelector("#app");
let session = null;
let state = loadState();

function freshState() {
  return { version: 3, routeVersion: 1, mode: null, coins: 0, pearls: 0, avatar: "🦜", flag: null, progress: {}, attempts: {} };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.version === 3) return { ...freshState(), ...saved, progress: saved.progress || {}, attempts: saved.attempts || {} };
    if (saved?.version === 2) {
      const migrated = { ...freshState(), ...saved, version: 3, routeVersion: 1, progress: { ...(saved.progress || {}) }, attempts: saved.attempts || {} };
      const foundations = CONTENT.filter(unit => unit.world === "foundations");
      const wasAutoCompleted = saved.pearls === 0 && foundations.every(unit => (saved.progress?.[unit.id] || 0) >= unit.missions.length);
      if (wasAutoCompleted) foundations.forEach(unit => { delete migrated.progress[unit.id]; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    const old = JSON.parse(localStorage.getItem("pirate-seas-mvp"));
    if (old?.mode) {
      const migrated = freshState();
      migrated.mode = old.mode;
      migrated.coins = old.coins || 0;
      migrated.pearls = old.pearls || 0;
      migrated.progress.P01 = Math.max(0, Math.min(7, old.level || 0));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch { /* fall through */ }
  return freshState();
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function esc(value) { return String(value).replace(/[&<>\"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[char]); }
function jsArg(value) { return esc(JSON.stringify(value)); }
function shuffle(list) { return [...list].sort(() => Math.random() - .5); }
function speak(text) {
  if ("speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined") {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = .78;
    speechSynthesis.speak(utterance);
  }
}

function getProgress(unitId) { return Math.min(state.progress[unitId] || 0, UNIT_BY_ID[unitId].missions.length); }
function isComplete(unitId) { return getProgress(unitId) >= UNIT_BY_ID[unitId].missions.length; }
function unitUnlocked(index) { return index === 0 || isComplete(CONTENT[index - 1].id); }
function currentUnitIndex() { const found = CONTENT.findIndex((unit, index) => unitUnlocked(index) && !isComplete(unit.id)); return found < 0 ? CONTENT.length - 1 : found; }
function activeMission(unit) { return Math.min(getProgress(unit.id), unit.missions.length - 1); }
function modeMission(mission) { return state.mode === "pre" && mission.preVariant ? { ...mission, ...mission.preVariant, id: mission.id, nameHe: mission.nameHe, icon: mission.icon } : mission; }

function header(showMapButton = false) {
  return `<header class="topbar"><div class="brand"><span class="brand-mark">🏴‍☠️</span><div><h1>Pirate Seas</h1><p>הרפתקת אנגלית</p></div></div><div class="purse"><span>🪙 ${state.coins}</span><span>🦪 ${state.pearls}</span>${showMapButton ? `<button class="secondary" onclick="showWorld()">↩ למפה</button>` : ""}</div></header>`;
}

function shell(content, options = {}) {
  app.innerHTML = `<div class="app-shell">${header(Boolean(options.back))}${content}<p class="footer-note">אב־טיפוס: קול הדפדפן משמש זמנית במקום הקלטות אנושיות.</p></div>`;
}

function showWelcome() {
  const route = CONTENT.map((unit, index) => `<div class="welcome-stop ${index === 0 ? "current" : ""}"><span>${unit.icon}</span><small>${esc(unit.nameHe)}</small></div>`).join("");
  app.innerHTML = `<div class="app-shell">${header(false)}<section class="panel hero welcome-harbor"><div class="hero-art">⚓ 🦜 ⛵</div><p class="eyebrow">Welcome Harbor</p><h2>ההרפתקה מתחילה כאן</h2><p class="lead">לא צריך לדעת אנגלית או את האלף־בית. התוכי יראה, ישמיע ויעזור בכל צעד.</p><section class="welcome-map" aria-label="מפת המסע מנמל ברוכים הבאים עד אי השמות"><div class="map-title"><span>🗺️</span><div><b>מפת המסע</b><small>מהנמל אל אי השמות</small></div></div><div class="welcome-route">${route}</div></section><div class="mode-picker"><button class="mode" onclick="chooseMode('pre')"><span class="emoji">🎧</span><span class="mode-title">מסלול הקשבה</span><small>תמונות, צלילים והדגמות</small></button><button class="mode" onclick="chooseMode('reader')"><span class="emoji">📖</span><span class="mode-title">מסלול קריאה</span><small>צלילים, אותיות ומילים</small></button></div><p class="safe-note">אפשר לעצור בכל זמן. אין שעון ואין פסילה.</p></section><p class="footer-note">עברית מימין לשמאל · English stays left to right</p></div>`;
}

function chooseMode(mode) { state.mode = mode; saveState(); showWorld(); }
function resetGame() { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem("pirate-seas-mvp"); state = freshState(); session = null; showWelcome(); }

function showWorld() {
  if (!state.mode) return showWelcome();
  const currentIndex = currentUnitIndex();
  const cards = CONTENT.map((unit, index) => {
    const unlocked = unitUnlocked(index);
    const progress = getProgress(unit.id);
    const done = isComplete(unit.id);
    const current = index === currentIndex && !done;
    const percent = Math.round(progress / unit.missions.length * 100);
    const status = done ? "הושלם" : unlocked ? `${progress} מתוך ${unit.missions.length} משימות` : "נעול — ייפתח אחרי המקום הקודם";
    return `<button class="map-location location-${index} ${done ? "done" : ""} ${current ? "current" : ""} ${unlocked ? "" : "locked"}" aria-label="${esc(unit.nameHe)}, ${status}" aria-describedby="location-tip-${index}" ${unlocked ? `onclick="showUnit('${unit.id}')"` : `aria-disabled="true"`}><span class="location-landmark"><span class="location-emoji" aria-hidden="true">${done ? "✅" : unit.icon}</span>${current ? `<span class="current-ship" aria-hidden="true">⛵</span>` : ""}</span><span class="location-plaque"><b>${esc(unit.nameHe)}</b><small class="english">${esc(unit.nameEn)}</small><small>${done ? "הושלם" : unlocked ? `<bdi>${progress} / ${unit.missions.length}</bdi> משימות` : "ייפתח בהמשך"}</small><span class="location-percent">${percent}%</span></span><span class="location-tooltip" id="location-tip-${index}" role="tooltip"><b>מה לומדים כאן?</b><span>${esc(unit.summaryHe)}</span><small><bdi>${unit.missions.length}</bdi> משימות · ${status}</small></span></button>`;
  }).join("");
  const foundationDone = CONTENT.filter(unit => unit.world === "foundations" && isComplete(unit.id)).length;
  shell(`<section class="panel world-panel"><div class="world-heading"><div><p class="eyebrow">The Launching Cove</p><h2>מפת ההתחלה</h2><p>בנו את הסירה, האירו את המגדלור ואז הפליגו לאי השמות.</p></div><button class="secondary" onclick="showWelcome()">שינוי מסלול</button></div><div class="voyage-progress"><span>יסודות ${foundationDone} / 6</span><div class="meter"><span style="width:${foundationDone / 6 * 100}%"></span></div></div><div class="sea-map"><div class="map-compass" aria-hidden="true">✦<small>צ</small></div><span class="map-decoration cloud" aria-hidden="true">☁️</span><span class="map-decoration whale" aria-hidden="true">🐋</span><span class="map-decoration waves" aria-hidden="true">〰 〰 〰</span><svg class="sea-route-lines" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true"><path class="route-shadow" d="M875 120 C790 55 710 180 625 120 S460 60 375 120 S205 180 125 120 C55 205 55 315 125 390 C205 330 295 450 375 390 S545 330 625 390"/><path class="route-dashes" d="M875 120 C790 55 710 180 625 120 S460 60 375 120 S205 180 125 120 C55 205 55 315 125 390 C205 330 295 450 375 390 S545 330 625 390"/></svg><div class="world-route">${cards}</div></div><div class="map-legend"><span><i class="legend-dot current-dot"></i>המקום הנוכחי</span><span><i class="legend-dot done-dot"></i>הושלם</span><span><i class="legend-dot locked-dot"></i>נעול</span></div><div class="map-actions"><button class="secondary" onclick="resetGame()">התחלה חדשה</button><span>המשימה הבאה: ${esc(CONTENT[currentIndex].nameHe)}</span></div></section>`);
}

function showUnit(unitId) {
  const unit = UNIT_BY_ID[unitId];
  const index = CONTENT.indexOf(unit);
  if (!unit || !unitUnlocked(index)) return showWorld();
  const progress = getProgress(unit.id);
  const done = isComplete(unit.id);
  const nodes = unit.missions.map((mission, missionIndex) => {
    const available = done || missionIndex <= progress;
    const complete = missionIndex < progress || done;
    return `<button class="level-node ${complete ? "done" : ""} ${available ? "" : "locked"}" ${available ? `onclick="startMission('${unit.id}',${missionIndex})"` : "disabled"}><span>${complete ? "✅" : mission.icon}</span><small>${missionIndex + 1}</small><small>${esc(mission.nameHe)}</small></button>`;
  }).join("");
  const percent = Math.round(progress / unit.missions.length * 100);
  shell(`<section class="panel"><div class="island-hero ${unit.world === "foundations" ? "foundation-hero" : ""}"><p class="eyebrow english">${esc(unit.nameEn)}</p><h2>${esc(unit.nameHe)}</h2><p>${esc(unit.summaryHe)}</p><button class="primary" onclick="startMission('${unit.id}',${done ? 0 : activeMission(unit)})">${done ? "שחקו שוב" : "המשיכו"}</button></div><div class="mastery"><div class="mastery-label"><span>התקדמות במקום</span><span>${percent}%</span></div><div class="meter"><span style="width:${percent}%"></span></div></div><div class="path-heading"><b>המשימות בתוך ${esc(unit.nameHe)}</b><span>מסיימים לפי הסדר לפני שמפליגים למקום הבא</span></div><div class="level-path ${unit.missions.length <= 5 ? "short-path" : ""}">${nodes}</div></section>`, { back: true });
}

function startMission(unitId, missionIndex) {
  const unit = UNIT_BY_ID[unitId];
  if (!unit || missionIndex < 0 || missionIndex >= unit.missions.length) return showWorld();
  const progress = getProgress(unitId);
  if (!isComplete(unitId) && missionIndex > progress) return showUnit(unitId);
  session = { unitId, missionIndex, round: 0, selected: [], collected: [], mistakes: 0 };
  renderMission();
}

function activityFrame(mission, body, extra = "") {
  const unit = UNIT_BY_ID[session.unitId];
  shell(`<section class="panel activity-panel ${extra}"><div class="screen-header"><button class="secondary" onclick="showUnit('${unit.id}')">↩ חזרה</button><div class="activity-top"><div class="activity-kicker">${esc(unit.nameHe)} · ${session.missionIndex + 1}/${unit.missions.length}</div><h2>${mission.icon} ${esc(mission.nameHe)}</h2></div><button class="help-button" aria-label="השמעת ההוראה" onclick="speak(${jsArg(instructionAudio(mission))})">🔊</button></div><p class="instruction">${esc(mission.instructionHe)}</p>${body}<div id="feedback" class="feedback" aria-live="assertive"></div></section>`, { back: true });
}

function instructionAudio(mission) {
  if (mission.kind === "choice" || mission.kind === "checkpoint") return mission.rounds?.[session?.round || 0]?.say || "Listen and choose";
  if (mission.kind === "collect") return "Tap and listen";
  if (mission.kind === "sequence") return mission.say || mission.result;
  if (mission.kind === "dialogue") return mission.turns?.[session?.round || 0]?.npc || "Hello";
  return "Listen";
}

function renderMission() {
  const base = UNIT_BY_ID[session.unitId].missions[session.missionIndex];
  const mission = modeMission(base);
  const renderer = RENDERERS[mission.kind];
  if (!renderer) return activityFrame(mission, `<p>המשימה עדיין לא זמינה.</p>`);
  renderer(mission);
}

function optionCard(option, handler = "chooseAnswer") {
  const text = state.mode === "reader" ? `<span class="english option-label">${esc(option.label || option.id)}</span>` : `<span class="listen-label">🔊</span>`;
  return `<button class="card" data-answer="${esc(option.id)}" onclick="${handler}(${jsArg(option.id)})"><span class="emoji">${option.emoji}</span>${text}</button>`;
}

const RENDERERS = {
  choice(mission) { renderChoice(mission); },
  checkpoint(mission) { renderChoice(mission, true); },
  collect(mission) {
    const remaining = mission.items.filter(item => !session.collected.includes(item.id));
    const cards = mission.items.map(item => `<button class="card ${session.collected.includes(item.id) ? "collected" : ""}" onclick="collectItem(${jsArg(item.id)})"><span class="emoji">${item.emoji}</span>${state.mode === "reader" ? `<span class="english option-label">${esc(item.label)}</span>` : `<span>${session.collected.includes(item.id) ? "✓" : "🔊"}</span>`}</button>`).join("");
    activityFrame(mission, `<div class="prompt"><span class="emoji">${remaining.length ? "🦜" : "✨"}</span><span>${remaining.length ? `נשארו ${remaining.length}` : "שמענו את כולם!"}</span></div><div class="card-grid">${cards}</div><div class="status-row"><span class="status-chip english">${session.collected.length} / ${mission.items.length}</span></div>`);
  },
  sequence(mission) {
    const used = session.selected.map(entry => entry.index);
    const available = shuffle(mission.target.map((token, index) => ({ token, index })).filter(entry => !used.includes(entry.index)));
    activityFrame(mission, `<div class="prompt english"><span class="emoji">${mission.picture || "🧩"}</span><button class="secondary" onclick="speak(${jsArg(mission.say || mission.result)})">🔊 Listen</button></div><div class="sentence english">${session.selected.length ? session.selected.map(entry => esc(entry.token)).join(" ") : "_ _ _"}</div><div class="tile-bank english">${available.map(entry => `<button class="tile" onclick="selectToken(${jsArg(entry.token)},${entry.index})">${esc(entry.token)}</button>`).join("")}</div><p class="center"><button class="primary" onclick="checkSequence()">בדיקה ✓</button> <button class="secondary" onclick="clearSequence()">ניקוי</button></p>`);
  },
  flag(mission) {
    activityFrame(mission, `<div class="prompt"><span class="emoji">${state.flag || "⛵"}</span><span>${state.flag ? "הדגל מוכן!" : "בחרו סמל"}</span></div><div class="flag-grid">${mission.flags.map(flag => `<button class="flag ${state.flag === flag ? "selected" : ""}" onclick="chooseFlag(${jsArg(flag)})">${flag}</button>`).join("")}</div><p class="center"><button class="primary" ${state.flag ? "" : "disabled"} onclick="finishFlag()">Goodbye! 👋</button></p>`);
  },
  case(mission) {
    const pair = mission.pairs[session.round];
    const options = shuffle(mission.pairs.map(candidate => candidate[1]));
    activityFrame(mission, `<div class="prompt english"><span class="case-letter">${esc(pair[0])}</span></div><div class="choice-grid english">${options.map(letter => `<button class="choice case-choice" onclick="chooseCase(${jsArg(letter)})">${esc(letter)}</button>`).join("")}</div><div class="status-row"><span class="status-chip english">${session.round + 1} / ${mission.pairs.length}</span></div>`);
  },
  dialogue(mission) {
    const turn = mission.turns[session.round];
    activityFrame(mission, `<div class="boss-scene"><figure>🏴‍☠️</figure><div class="prompt english">${esc(turn.npc)}<br><button class="secondary" onclick="speak(${jsArg(turn.npc)})">🔊 Hear Captain Morgan</button></div></div><div class="choice-grid">${shuffle(turn.options).map(option => `<button class="choice english" onclick="chooseDialogue(${jsArg(option)})">${esc(option)}</button>`).join("")}</div><p class="center"><button class="secondary" onclick="speak(${jsArg(turn.good)})">🎤 Say it with me</button></p><div class="status-row"><span class="status-chip english">${session.round + 1} / ${mission.turns.length}</span></div>`, "boss");
  }
};

function renderChoice(mission, checkpoint = false) {
  const round = mission.rounds[session.round];
  const options = shuffle(round.options);
  const visiblePrompt = state.mode === "reader" ? `<span id="spoken" class="english">${esc(round.say)}</span>` : `<span>הקשיבו</span>`;
  activityFrame(mission, `<div class="prompt ${checkpoint ? "checkpoint-prompt" : ""}"><span class="emoji">${checkpoint ? "💡" : "🦜"}</span>${visiblePrompt}<br><button class="secondary" onclick="speak(${jsArg(round.say)})">🔊 שמעו שוב</button></div><div class="card-grid">${options.map(option => optionCard(option)).join("")}</div><div class="status-row"><span class="status-chip english">${session.round + 1} / ${mission.rounds.length}</span>${checkpoint ? `<span class="status-chip">אורות <bdi>${session.round} / ${mission.rounds.length}</bdi></span>` : ""}</div>`);
  setTimeout(() => speak(round.say), 180);
}

function feedback(message, good = false) {
  const node = document.querySelector("#feedback");
  if (!node) return;
  node.textContent = message;
  node.className = `feedback ${good ? "good" : "try"}`;
}

function chooseAnswer(choice) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const round = mission.rounds[session.round];
  if (choice !== round.answer) {
    session.mistakes++;
    state.attempts[mission.id] = (state.attempts[mission.id] || 0) + 1;
    saveState();
    feedback("כמעט. הקשיבו שוב ונסו עוד פעם.");
    speak(round.say);
    return;
  }
  feedback("מעולה!", true);
  speak(round.options.find(option => option.id === choice)?.audio || round.say);
  session.round++;
  if (session.round >= mission.rounds.length) return setTimeout(completeMission, 500);
  setTimeout(renderMission, 500);
}

function collectItem(itemId) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const item = mission.items.find(candidate => candidate.id === itemId);
  if (!item) return;
  if (!session.collected.includes(itemId)) session.collected.push(itemId);
  speak(item.audio);
  if (session.collected.length >= mission.items.length) {
    renderMission();
    feedback("כל האורות דולקים!", true);
    return setTimeout(completeMission, 650);
  }
  renderMission();
  feedback("יופי! המשיכו לפריט הבא.", true);
}

function selectToken(token, index) { if (!session.selected.some(entry => entry.index === index)) session.selected.push({ token, index }); renderMission(); }
function clearSequence() { session.selected = []; renderMission(); }
function checkSequence() {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const answer = session.selected.map(entry => entry.token).join(" ");
  const target = mission.target.join(" ");
  if (answer === target) { feedback(`${mission.result || target} — מצוין!`, true); speak(mission.result || target); return setTimeout(completeMission, 600); }
  session.mistakes++;
  session.selected = [];
  renderMission();
  feedback("הצלילים חזרו למקום. הקשיבו ובנו משמאל לימין.");
  speak(mission.say || mission.result);
}

function chooseFlag(flag) { state.flag = flag; saveState(); renderMission(); speak("My flag"); }
function finishFlag() { if (state.flag) { speak("Goodbye!"); completeMission(); } }

function chooseCase(letter) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const pair = mission.pairs[session.round];
  if (letter !== pair[1]) { feedback("נסו שוב. חפשו את אותה צורה גדולה."); return; }
  speak(`${pair[0]}, ${pair[1]}`);
  session.round++;
  if (session.round >= mission.pairs.length) return setTimeout(completeMission, 450);
  renderMission();
}

function chooseDialogue(choice) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const turn = mission.turns[session.round];
  if (choice !== turn.good) { feedback("הקפטן מדגים את התשובה. נסו אותה יחד."); speak(turn.good); return; }
  feedback("Wonderful!", true);
  speak(choice);
  session.round++;
  if (session.round >= mission.turns.length) return setTimeout(completeMission, 550);
  setTimeout(renderMission, 500);
}

function completeMission() {
  const unit = UNIT_BY_ID[session.unitId];
  const completedIndex = session.missionIndex;
  const progressBefore = getProgress(unit.id);
  const replayingCompletedLocation = progressBefore >= unit.missions.length;
  const firstCompletion = progressBefore === completedIndex;
  if (firstCompletion) {
    state.progress[unit.id] = completedIndex + 1;
    state.coins += 10;
    if (state.progress[unit.id] === unit.missions.length) {
      state.coins += unit.reward;
      state.pearls += 1;
    }
    saveState();
  }
  const unitDone = isComplete(unit.id);
  const nextIndex = CONTENT.indexOf(unit) + 1;
  const nextUnit = CONTENT[nextIndex];
  const hasAnotherMissionHere = completedIndex < unit.missions.length - 1;
  const title = replayingCompletedLocation ? `ממשיכים לתרגל ב${unit.nameHe}` : unitDone ? `${unit.nameHe} הושלם!` : "כל הכבוד, חברי צוות!";
  const message = replayingCompletedLocation ? "נשארים במקום הזה וממשיכים בין המשימות שלו." : unitDone ? `הרווחתם פנינה ופתחתם את ${nextUnit ? esc(nextUnit.nameHe) : "הים הבא"}.` : `המשימה נשמרה. ${firstCompletion ? "קיבלתם 10 מטבעות." : "תרגול חוזר תמיד זמין."}`;
  let primaryAction = "";
  if (replayingCompletedLocation && hasAnotherMissionHere) primaryAction = `<button class="primary" onclick="startMission('${unit.id}',${completedIndex + 1})">למשימה הבאה במקום הזה</button>`;
  else if (replayingCompletedLocation) primaryAction = `<button class="primary" onclick="showUnit('${unit.id}')">לכל משימות המקום</button>`;
  else if (!unitDone) primaryAction = `<button class="primary" onclick="startMission('${unit.id}',${completedIndex + 1})">למשימה הבאה במקום הזה</button>`;
  else if (nextUnit) primaryAction = `<button class="primary" onclick="showUnit('${nextUnit.id}')">השלמנו כאן — מפליגים אל ${esc(nextUnit.nameHe)}</button>`;
  shell(`<section class="panel completion"><div class="hero-art">${unitDone && !replayingCompletedLocation ? "🏆✨🦜" : "✨🪙✨"}</div><h2>${esc(title)}</h2><p class="lead">${message}</p><div class="completion-actions">${primaryAction}<button class="secondary" onclick="showUnit('${unit.id}')">משימות ${esc(unit.nameHe)}</button><button class="secondary" onclick="showWorld()">למפה הכללית</button></div></section>`, { back: true });
}

function validateContent() {
  const errors = [];
  const ids = new Set();
  for (const unit of CONTENT) {
    if (ids.has(unit.id)) errors.push(`Duplicate unit ${unit.id}`);
    ids.add(unit.id);
    unit.missions.forEach(mission => {
      if (ids.has(mission.id)) errors.push(`Duplicate mission ${mission.id}`);
      ids.add(mission.id);
      for (const variant of [mission, mission.preVariant].filter(Boolean)) {
        if (["choice", "checkpoint"].includes(variant.kind)) {
          variant.rounds?.forEach((round, index) => {
            if (!round.options.some(option => option.id === round.answer)) errors.push(`${mission.id} round ${index + 1}: answer missing`);
          });
        }
        if (variant.kind === "dialogue") variant.turns?.forEach((turn, index) => {
          if (!turn.options.includes(turn.good)) errors.push(`${mission.id} turn ${index + 1}: response missing`);
        });
      }
    });
  }
  const foundationCount = CONTENT.filter(unit => unit.world === "foundations").reduce((sum, unit) => sum + unit.missions.length, 0);
  if (foundationCount !== 26) errors.push(`Expected 26 foundation missions, found ${foundationCount}`);
  return errors;
}

window.PirateSeas = { CONTENT, UNIT_BY_ID, freshState, validateContent, modeMission, startMission, showWorld, showUnit, resetGame, getState: () => state, setState: next => { state = next; } };
state.mode ? showWorld() : showWelcome();

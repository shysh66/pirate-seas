/* Pirate Seas MVP — client-side only. Recorded asset playback replaces speak() in production. */
const words = [
  { en: "hello", emoji: "👋" }, { en: "goodbye", emoji: "⛵" },
  { en: "boy", emoji: "👦" }, { en: "girl", emoji: "👧" },
  { en: "teacher", emoji: "🧑‍🏫" }, { en: "friend", emoji: "🧑‍🤝‍🧑" },
  { en: "happy", emoji: "😊" }, { en: "sad", emoji: "😢" }
];
const levels = [
  { icon: "👂", name: "Listen & Tap", he: "הקשיבו ובחרו" },
  { icon: "🃏", name: "Picture Match", he: "מצאו זוגות" },
  { icon: "🔤", name: "Sound / Word", he: "אוזני התוכי" },
  { icon: "🦜", name: "Listen & Do", he: "התוכי אומר" },
  { icon: "🌉", name: "Bridge", he: "בנו את הגשר" },
  { icon: "💎", name: "Treasure Dive", he: "צלילת אוצר" },
  { icon: "🏴‍☠️", name: "Captain Morgan", he: "דברו עם הקפטן" }
];
const app = document.querySelector("#app");
let state = load();

function load() { try { return JSON.parse(localStorage.getItem("pirate-seas-mvp")) || { mode: null, level: 0, coins: 0, pearls: 0, seen: 0 }; } catch { return { mode:null, level:0, coins:0, pearls:0, seen:0 }; } }
function save() { localStorage.setItem("pirate-seas-mvp", JSON.stringify(state)); }
function speak(text) { if ("speechSynthesis" in window) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = .8; speechSynthesis.speak(u); } }
function esc(value) { return String(value).replace(/[&<>"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"})[char]); }
function header(back = false) { return `<header class="topbar"><div class="brand"><span class="brand-mark">🏴‍☠️</span><div><h1>Pirate Seas</h1><p>הרפתקת אנגלית</p></div></div><div class="purse"><span>🪙 ${state.coins}</span><span>🦪 ${state.pearls}</span>${back ? `<button class="secondary" onclick="showMap()">↩ למפה</button>` : ""}</div></header>`; }
function shell(content, className="") { app.innerHTML = `<div class="app-shell">${header(className !== "welcome")}${content}<p class="footer-note">MVP לפיתוח: הקול בדפדפן מחליף זמנית הקלטות של דובר/ת אנגלית.</p></div>`; }
function shuffle(list) { return [...list].sort(() => Math.random() - .5); }

function showWelcome() {
  app.innerHTML = `<div class="app-shell">${header()}<section class="panel hero"><div class="hero-art">🏝️ 🦜 ⛵</div><h2>ברוכים הבאים ל־Pirate Seas</h2><p class="lead">לומדים אנגלית עם התוכי, אוספים אוצרות ומדברים עם קפטנים. בחרו איך תרצו לשחק.</p><div class="mode-picker"><button class="mode" onclick="chooseMode('pre')"><span class="emoji">🎧</span>טרום־קוראים<small>תמונות, צלילים והדגמות</small></button><button class="mode" onclick="chooseMode('reader')"><span class="emoji">📖</span>קוראים<small>תמונות, צלילים ומילים באנגלית</small></button></div><button class="secondary" onclick="resetGame()">התחלה חדשה</button></section><p class="footer-note">עברית מימין לשמאל · English activities stay left to right</p></div>`;
}
function chooseMode(mode) { state.mode = mode; save(); showMap(); }
function resetGame() { localStorage.removeItem("pirate-seas-mvp"); state = load(); showWelcome(); }

function showMap() {
  if (!state.mode) return showWelcome();
  const mastery = Math.min(100, Math.round((state.level / 7) * 100));
  const nodes = levels.map((level, index) => { const status = index < state.level ? "done" : index === state.level ? "" : "locked"; return `<button class="level-node ${status}" ${index > state.level ? "disabled" : ""} onclick="startLevel(${index})"><span>${index < state.level ? "✅" : level.icon}</span><small>${index + 1}</small><small>${level.he}</small></button>`; }).join("");
  shell(`<section class="panel"><div class="island-hero"><h2>אי השמות</h2><p>הכירו את תושבי החוף, בנו גשר עם <b class="english">am / are</b>, וסיימו בשיחה עם קפטן מורגן.</p><button class="primary" onclick="startLevel(${state.level >= 7 ? 6 : state.level})">${state.level >= 7 ? "שחקו שוב" : "המשיכו להרפתקה"}</button></div><div class="mastery"><div class="mastery-label"><span>דגל השליטה שלי</span><span>${mastery}%</span></div><div class="meter"><span style="width:${mastery}%"></span></div></div><div class="level-path">${nodes}</div></section>`);
}
function startLevel(index) { if (index > state.level) return; if (index === 0) listenTap(); else if (index === 1) pictureMatch(); else if (index === 2) state.mode === "reader" ? wordBuilder() : soundMatch(); else if (index === 3) listenDo(); else if (index === 4) bridge(); else if (index === 5) treasureDive(); else boss(); }
function activity(title, subtitle, body, extra="") { shell(`<section class="panel ${extra}"><div class="screen-header"><button class="secondary" onclick="showMap()">↩ חזרה למפה</button><div class="activity-top"><div class="activity-kicker">אי השמות · ${esc(title)}</div><h2>${esc(subtitle)}</h2></div><span></span></div>${body}</section>`); }
function feedback(message, good=false) { const node = document.querySelector("#feedback"); node.textContent = message; node.className = `feedback ${good ? "good" : "try"}`; }
function finish(level) { const first = state.level === level; if (first) { state.level = level + 1; state.coins += level === 6 ? 25 : 10; if (level === 6) state.pearls += 1; save(); } activity("אוצר נמצא!", level === 6 ? "הקפטן מצדיע לכם!" : "כל הכבוד, חברי צוות!", `<div class="completion"><div class="hero-art">${level === 6 ? "🏴‍☠️🎉🦜" : "✨🪙✨"}</div><p class="lead">${level === 6 ? "סיימתם את אי השמות. חזרו לתרגל בכל זמן." : `קיבלתם ${first ? "10 מטבעות" : "חיוך נוסף מהתוכי"}!`}</p><button class="primary" onclick="showMap()">חזרה למפת האי</button></div>`); }

function listenTap() {
  let round = 0; let answer = shuffle(words)[0];
  const render = () => activity("Level 1", "פגשו את תושבי האי", `<p class="instruction">הקשיבו. על מי התוכי מדבר?</p><div class="prompt"><span class="emoji">🦜</span><span id="spoken" class="english">${answer.en}</span><br><button class="secondary" onclick="speak('${answer.en}')">🔊 שמעו שוב</button></div><div class="card-grid">${shuffle(words.slice(0, 6)).map(word => `<button class="card" onclick="listenChoice('${word.en}')"><span class="emoji">${word.emoji}</span>${state.mode === "reader" ? `<span class="english">${word.en}</span>` : "הקישו לבחירה"}</button>`).join("")}</div><div id="feedback" class="feedback"></div><div class="status-row"><span class="status-chip">${round + 1} / 4</span></div>`);
  window.listenChoice = choice => { if (choice === answer.en) { round++; if (round === 4) return finish(0); feedback("מעולה! התוכי שמח.", true); answer = shuffle(words)[0]; setTimeout(render, 700); } else { feedback("בואו נקשיב שוב יחד."); speak(answer.en); } }; render(); setTimeout(() => speak(answer.en), 250);
}
function pictureMatch() {
  let round = 0; let answer = shuffle(words)[0];
  const render = () => activity("Level 2", "מצאו את הזוג", `<p class="instruction">לחצו על הקליפה כדי לשמוע מילה, ואז התאימו לתמונה הנכונה.</p><div class="prompt"><span class="emoji">🐚</span><button class="primary" onclick="speak('${answer.en}')">🔊 הקליפה מדברת</button></div><div class="card-grid">${shuffle(words.slice(0, 6)).map(word => `<button class="card" onclick="matchChoice('${word.en}')"><span class="emoji">${word.emoji}</span>${state.mode === "reader" ? `<span class="english">${word.en}</span>` : ""}</button>`).join("")}</div><div id="feedback" class="feedback"></div><div class="status-row"><span class="status-chip">${round + 1} / 4</span></div>`);
  window.matchChoice = choice => { if (choice === answer.en) { round++; if(round === 4) return finish(1); feedback("זוג מושלם!", true); answer=shuffle(words)[0]; setTimeout(render,650); } else feedback("כמעט — הקשיבו לקליפה שוב."); }; render();
}
function wordBuilder() {
  const target = "girl"; let picked = [];
  const render = () => activity("Level 3", "מסר בבקבוק", `<p class="instruction">בנו את המילה מהאותיות.</p><div class="prompt english"><span class="emoji">👧</span>${picked.length ? picked.join("") : "_ _ _ _"}</div><div class="tile-bank english">${shuffle(target.split("")).map((letter, i) => `<button class="tile" onclick="letter('${letter}',${i})">${letter.toUpperCase()}</button>`).join("")}</div><div id="feedback" class="feedback"></div>`);
  window.letter = letter => { picked.push(letter); if(picked.join("") === target) { feedback("You built GIRL!", true); speak("girl"); return setTimeout(()=>finish(2), 900); } if(!target.startsWith(picked.join(""))) { picked=[]; feedback("נסו שוב — האות חזרה לבקבוק."); } render(); }; render();
}
function soundMatch() {
  const target = { en:"boy", emoji:"👦" }; activity("Level 3", "אוזני התוכי", `<p class="instruction">איזו תמונה מתחילה כמו <span class="english">b-b-boy</span>?</p><div class="prompt"><button class="primary english" onclick="speak('b b boy')">🔊 b-b-boy</button></div><div class="card-grid"><button class="card" onclick="soundChoice(false)"><span class="emoji">🐱</span></button><button class="card" onclick="soundChoice(true)"><span class="emoji">${target.emoji}</span></button><button class="card" onclick="soundChoice(false)"><span class="emoji">🌞</span></button></div><div id="feedback" class="feedback"></div>`); window.soundChoice = good => { if(good) { feedback("נכון! Boy מתחיל ב־B!",true); speak("boy"); setTimeout(()=>finish(2),800); } else feedback("הקשיבו שוב לתחילת המילה."); };
}
function listenDo() {
  const command = { text:"Wave to the girl!", emoji:"👧" }; activity("Level 4", "התוכי אומר", `<p class="instruction">הקשיבו לפקודה ובחרו מה לעשות.</p><div class="prompt english"><span class="emoji">🦜</span>${command.text}<br><button class="secondary" onclick="speak('${command.text}')">🔊 שוב</button></div><div class="choice-grid"><button class="choice" onclick="doChoice(false)"><span class="emoji">👦</span><span>Wave to the boy</span></button><button class="choice" onclick="doChoice(true)"><span class="emoji">${command.emoji}</span><span>Wave to the girl</span></button><button class="choice" onclick="doChoice(false)"><span class="emoji">🧑‍🏫</span><span>Walk to the teacher</span></button></div><div id="feedback" class="feedback"></div>`); window.doChoice = good => { if(good) { feedback("ביצעתם את הפקודה!", true); setTimeout(()=>finish(3),750); } else { feedback("התוכי מצביע ומנסה שוב."); speak(command.text); } }; setTimeout(()=>speak(command.text),200);
}
function bridge() {
  const tiles = ["I", "am", "happy"]; let picked = [];
  const render = () => activity("Level 5", "גשר המילים", `<p class="instruction">הניחו את המילים לפי הסדר. הגשר צריך את קרש ה־<span class="english">am</span> שלו!</p><div class="bridge">🪨 ━ <span>${picked.includes("I") ? "I" : "□"}</span> ━ <span class="gap">${picked.includes("am") ? "am" : ""}</span> ━ <span>${picked.includes("happy") ? "happy" : "□"}</span> ━ 🏝️</div><div class="tile-bank english">${shuffle(tiles.filter(tile => !picked.includes(tile))).map(tile => `<button class="tile ${tile === "am" ? "selected" : ""}" onclick="bridgeTile('${tile}')">${tile}</button>`).join("")}</div><div class="english sentence">${picked.join(" ") || "Choose a word"}</div><p style="text-align:center"><button class="primary" onclick="checkBridge()">GO! ⛵</button></p><div id="feedback" class="feedback"></div>`);
  window.bridgeTile = tile => { picked.push(tile); render(); };
  window.checkBridge = () => { if(picked.join(" ") === "I am happy") { feedback("The bridge is strong! I am happy!",true); speak("I am happy"); setTimeout(()=>finish(4),900); } else if(!picked.includes("am")) { feedback("אוי! חסר קרש. I ... AM ... happy!"); speak("I am happy"); } else { feedback("בואו נבנה לפי הסדר: I am happy."); speak("I am happy"); } }; render();
}
function treasureDive() {
  let round = 0; let answer = shuffle(words)[0];
  const render = () => activity("Level 6", "צלילת אוצר", `<p class="instruction">הבועה מחזיקה מילה ישנה. הקשיבו, ואז מצאו את האוצר הנכון.</p><div class="prompt"><span class="emoji">🫧💎</span><button class="primary english" onclick="speak('${answer.en}')">🔊 Listen</button></div><div class="card-grid">${shuffle(words.slice(0,5)).map(word=>`<button class="card" onclick="diveChoice('${word.en}')"><span class="emoji">${word.emoji}</span>${state.mode === "reader" ? `<span class="english">${word.en}</span>` : ""}</button>`).join("")}</div><div id="feedback" class="feedback"></div><div class="status-row"><span class="status-chip">אוצר ${round + 1} / 3</span></div>`);
  window.diveChoice = choice => { if(choice===answer.en) { round++; if(round===3) return finish(5); feedback("האוצר נוצץ!",true); answer=shuffle(words)[0]; setTimeout(render,650); } else feedback("הבועה מחכה — נסו להקשיב שוב."); }; render();
}
function boss() {
  const turns = [
    { npc:"Ahoy! Hello!", options:["Hello!","Goodbye!"], good:"Hello!" },
    { npc:"What's your name?", options:["My name is Captain!","Goodbye!"], good:"My name is Captain!" },
    { npc:"How are you?", options:["I'm happy!","I happy"], good:"I'm happy!" },
    { npc:"Who is this?", options:["This is my friend!","This friend"], good:"This is my friend!" },
    { npc:"Welcome to Name Island! Goodbye!", options:["Goodbye!","Hello!"], good:"Goodbye!" }
  ]; let turn = 0;
  const render = () => { const current=turns[turn]; activity("Level 7", "דברו עם קפטן מורגן", `<div class="boss panel"><figure>🏴‍☠️</figure><p class="instruction">בחרו תשובה. אפשר גם לחזור בקול אחרי הקפטן.</p><div class="prompt english">${current.npc}<br><button class="secondary" onclick="speak('${current.npc}')">🔊 Hear Captain Morgan</button></div><div class="choice-grid">${shuffle(current.options).map(option=>`<button class="choice english" onclick="bossChoice('${option.replace(/'/g,"\\'")}')">${option}</button>`).join("")}</div><div id="feedback" class="feedback"></div><p style="text-align:center"><button class="secondary" onclick="speak('${current.good}')">🎤 Say it with me</button></p></div>`, "boss"); };
  window.bossChoice = choice => { const current=turns[turn]; if(choice===current.good) { feedback("Wonderful!",true); speak(choice); turn++; if(turn===turns.length) return setTimeout(()=>finish(6),700); setTimeout(render,700); } else { feedback("הקפטן מחייך: בואו נגיד את זה יחד."); speak(current.good); } }; render();
}

showWelcome();

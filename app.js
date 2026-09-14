/* Pirate Seas — dependency-free curriculum prototype. */
const STORAGE_KEY = "pirate-seas-v2";
const STATE_VERSION = 5;
const CONTENT_VERSION = 4;
const DAY_MS = 24 * 60 * 60 * 1000;
const REVIEW_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30];
const MAX_EVIDENCE_EVENTS = 800;

const O = (id, emoji, audio = id, label = id) => ({ id, emoji, audio, label });
const L = (id, emoji, sound, name = id.toUpperCase()) => O(id, emoji, sound, name);

const CONTENT = [
  {
    id: "F00", world: "foundations", icon: "⚓", nameHe: "נמל ההתחלה", nameEn: "Starting Harbor",
    summaryHe: "פוגשים את התוכי ולומדים להקשיב, לבחור, לנוע ולעצור.", reward: 20,
    missions: [
      { id: "F00-M01", icon: "👋", nameHe: "שלום, תוכי!", kind: "collect", instructionHe: "געו בשתי הברכות ושמעו.", items: [O("hello", "👋", "Hello!"), O("goodbye", "🙋", "Goodbye!")] },
      { id: "F00-M02", icon: "🔊", nameHe: "בודקים את הצליל", kind: "collect", instructionHe: "געו בכל תמונה ושמעו.", items: [O("listen", "👂", "Listen"), O("look", "👀", "Look"), O("yes", "👍", "Yes"), O("no", "👎", "No")] },
      { id: "F00-M03", icon: "⛵", nameHe: "הסירה זזה", kind: "sail", instructionHe: "שמעו. השיטו או עצרו.", rounds: [
        { say: "Go!", answer: "go", options: [O("go", "▶️", "Go"), O("stop", "⏹️", "Stop")] },
        { say: "Stop!", answer: "stop", options: [O("go", "▶️", "Go"), O("stop", "⏹️", "Stop")] },
        { say: "Go!", answer: "go", options: [O("go", "▶️", "Go"), O("stop", "⏹️", "Stop")] }
      ] },
      { id: "F00-M04", icon: "🚩", nameHe: "הדגל שלי", kind: "flag", instructionHe: "בחרו דגל. געו ושמעו.", flags: [
        { id: "star", symbol: "⭐", color: "#2773c8", accent: "#ffd85c", audio: "star flag" },
        { id: "parrot", symbol: "🦜", color: "#e45b50", accent: "#ffd85c", audio: "parrot flag" },
        { id: "shell", symbol: "🐚", color: "#24a983", accent: "#fff0bd", audio: "shell flag" },
        { id: "rainbow", symbol: "🌈", color: "#7652af", accent: "#f5cf55", audio: "rainbow flag" }
      ] }
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
      ], readerPrompt: "איזו תמונה מתחילה בצליל הזה?" },
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
      ], readerPrompt: "איזו תמונה מתחילה בצליל הזה?" },
      { id: "F02-M04", icon: "⚙️", nameHe: "מכונת המילים", kind: "sequence", instructionHe: "הכניסו את הצלילים לפי הסדר ובנו dog.", say: "d, o, g, dog", target: ["d", "o", "g"], picture: "🐶", result: "dog",
        preVariant: { kind: "choice", instructionHe: "איזו תמונה היא dog?", rounds: [{ say: "dog", answer: "dog", options: [O("cat", "🐱", "cat"), O("dog", "🐶", "dog"), O("map", "🗺️", "map")] }] } }
    ]
  },
  {
    id: "F03", world: "foundations", icon: "🌊", nameHe: "לגונת התנועות", nameEn: "Short-Vowel Lagoon",
    summaryHe: "מבדילים בין תנועות קצרות ומשנים צליל אחד במילה.", reward: 25,
    missions: [
      { id: "F03-M01", icon: "🧺", nameHe: "e או u", kind: "sort", instructionHe: "בחרו תמונה ואז הניחו אותה בסל של הצליל e או u.", buckets: [
        { id: "e", label: "e", emoji: "🥚", audio: "e, egg" }, { id: "u", label: "u", emoji: "☂️", audio: "u, umbrella" }
      ], items: [
        { id: "pen", emoji: "🖊️", label: "pen", audio: "pen", bucket: "e" },
        { id: "bed", emoji: "🛏️", label: "bed", audio: "bed", bucket: "e" },
        { id: "hen", emoji: "🐔", label: "hen", audio: "hen", bucket: "e" },
        { id: "sun", emoji: "☀️", label: "sun", audio: "sun", bucket: "u" },
        { id: "run", emoji: "🏃", label: "run", audio: "run", bucket: "u" },
        { id: "cup", emoji: "🥤", label: "cup", audio: "cup", bucket: "u" }
      ] },
      { id: "F03-M02", icon: "🪷", nameHe: "r · h · b", kind: "collect", instructionHe: "געו בפרחים ושמעו צליל ומילה.", items: [L("r", "🏃", "r, run"), L("h", "🎩", "h, hat"), L("b", "🛏️", "b, bed")] },
      { id: "F03-M03", icon: "🪷", nameHe: "f · l", kind: "collect", instructionHe: "השלימו את גינת הצלילים.", items: [L("f", "🐟", "f, fish"), L("l", "🦁", "l, lion"), L("e", "🥚", "e, egg"), L("u", "☂️", "u, umbrella")] },
      { id: "F03-M04", icon: "🪄", nameHe: "מחליפים צליל", kind: "swap", instructionHe: "החליפו אות אחת במכונת המילים וצרו מילה חדשה.", rounds: [
        { say: "hat. Change a to o. hot.", from: "hat", replaceIndex: 1, answer: "o", choices: ["o", "e", "u"], result: "hot", emoji: "🥵" },
        { say: "pen. Change p to h. hen.", from: "pen", replaceIndex: 0, answer: "h", choices: ["h", "m", "t"], result: "hen", emoji: "🐔" }
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
      { id: "F05-M03", icon: "🔁", nameHe: "משנים מילה", kind: "swap", instructionHe: "החליפו את האות הראשונה ובנו את המילה החדשה.", rounds: [
        { say: "cat. Change c to h. hat.", from: "cat", replaceIndex: 0, answer: "h", choices: ["h", "m", "s"], result: "hat", emoji: "🎩" },
        { say: "dog. Change d to l. log.", from: "dog", replaceIndex: 0, answer: "l", choices: ["l", "p", "c"], result: "log", emoji: "🪵" }
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
      { id: "P01-M01", icon: "👂", nameHe: "פוגשים את האי", kind: "collect", instructionHe: "געו בכל דמות ושמעו מי היא.", items: [O("teacher", "🧑‍🏫"), O("boy", "👦"), O("girl", "👧"), O("friend", "🧑‍🤝‍🧑")] },
      { id: "P01-M02", icon: "🃏", nameHe: "זוגות של חברים", kind: "memory", instructionHe: "הפכו שני קלפים בכל תור ומצאו זוג של תמונה ומילה.", pairs: [
        { id: "boy", emoji: "👦", word: "boy" },
        { id: "girl", emoji: "👧", word: "girl" },
        { id: "teacher", emoji: "🧑‍🏫", word: "teacher" },
        { id: "friend", emoji: "🧑‍🤝‍🧑", word: "friend" }
      ] },
      { id: "P01-M03", icon: "🔤", nameHe: "בונים man", kind: "sequence", instructionHe: "סדרו את הצלילים ובנו man.", say: "m, a, n, man", target: ["m", "a", "n"], picture: "👨", result: "man",
        preVariant: { kind: "choice", instructionHe: "איזו תמונה מתחילה בצליל b?", rounds: [{ say: "b, boy", answer: "boy", options: [O("boy", "👦"), O("cat", "🐱"), O("sun", "☀️")] }] } },
      { id: "P01-M04", icon: "🦜", nameHe: "התוכי אומר", kind: "choice", instructionHe: "געו בפעולות, הקשיבו ואז בחרו.", models: [O("wave", "👋", "Wave"), O("walk", "🚶", "Walk")], rounds: [{ say: "Wave to the girl!", answer: "wave-girl", options: [O("wave-boy", "👋👦", "Wave to the boy", "Wave to the boy"), O("wave-girl", "👋👧", "Wave to the girl", "Wave to the girl"), O("walk-teacher", "🚶🧑‍🏫", "Walk to the teacher", "Walk to the teacher")] }] },
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
  },
  {
    id: "P02", world: "pre-a1", icon: "🌈", nameHe: "שונית הקשת", nameEn: "Rainbow Reef",
    summaryHe: "מכירים צבעים, סופרים מאחת עד חמש ומתארים אוצר צבעוני.", reward: 55,
    missions: [
      { id: "P02-M01", icon: "🎨", nameHe: "צובעים את השונית", kind: "collect", instructionHe: "געו בכל צבע ושמעו.", items: [
        O("red", "🔴", "red"), O("blue", "🔵", "blue"), O("yellow", "🟡", "yellow"), O("green", "🟢", "green"),
        O("orange", "🟠", "orange"), O("pink", "🩷", "pink"), O("black", "⚫", "black"), O("white", "⚪", "white")
      ] },
      { id: "P02-M02", icon: "⭐", nameHe: "כוכבים בזוגות", kind: "memory", instructionHe: "מצאו תמונה ומספר תואמים.", pairs: [
        { id: "one", emoji: "⭐", word: "one" },
        { id: "two", emoji: "⭐⭐", word: "two" },
        { id: "three", emoji: "⭐⭐⭐", word: "three" },
        { id: "four", emoji: "⭐⭐⭐⭐", word: "four" },
        { id: "five", emoji: "⭐⭐⭐⭐⭐", word: "five" }
      ] },
      { id: "P02-M03", icon: "🐙", nameHe: "איזה צבע?", kind: "choice", instructionHe: "שמעו ובחרו צבע.", rounds: [
        { say: "red", answer: "red", options: [O("red", "🔴", "red"), O("blue", "🔵", "blue"), O("yellow", "🟡", "yellow")] },
        { say: "green", answer: "green", options: [O("orange", "🟠", "orange"), O("green", "🟢", "green"), O("pink", "🩷", "pink")] },
        { say: "black", answer: "black", options: [O("white", "⚪", "white"), O("blue", "🔵", "blue"), O("black", "⚫", "black")] }
      ] },
      { id: "P02-M04", icon: "🐚", nameHe: "צבע וכמות", kind: "choice", instructionHe: "שמעו ומצאו את הקבוצה.", rounds: [
        { say: "two red shells", answer: "two-red-shells", options: [O("one-red-shell", "🔴", "one red shell", "one red shell"), O("two-red-shells", "🔴🔴", "two red shells", "two red shells"), O("two-blue-shells", "🔵🔵", "two blue shells", "two blue shells")] },
        { say: "three blue stars", answer: "three-blue-stars", options: [O("three-blue-stars", "🔵🔵🔵", "three blue stars", "three blue stars"), O("two-blue-stars", "🔵🔵", "two blue stars", "two blue stars"), O("three-green-stars", "🟢🟢🟢", "three green stars", "three green stars")] },
        { say: "five yellow stars", answer: "five-yellow-stars", options: [O("four-yellow-stars", "🟡🟡🟡🟡", "four yellow stars", "four yellow stars"), O("five-orange-stars", "🟠🟠🟠🟠🟠", "five orange stars", "five orange stars"), O("five-yellow-stars", "🟡🟡🟡🟡🟡", "five yellow stars", "five yellow stars")] }
      ] },
      { id: "P02-M05", icon: "🪣", nameHe: "בונים תיאור", kind: "sequence", instructionHe: "בנו: a red shell", say: "a red shell", target: ["a", "red", "shell"], picture: "🔴🐚", result: "a red shell" },
      { id: "P02-M06", icon: "💎", nameHe: "אוצר הקשת", kind: "checkpoint", instructionHe: "שמעו ומצאו את האוצר.", rounds: [
        { say: "Hello!", answer: "hello", options: [O("hello", "👋", "Hello!"), O("goodbye", "⛵", "Goodbye!"), O("friend", "🧑‍🤝‍🧑", "friend")] },
        { say: "a green star", answer: "green-star", options: [O("green-star", "🟢⭐", "a green star", "a green star"), O("yellow-star", "🟡⭐", "a yellow star", "a yellow star"), O("green-shell", "🟢🐚", "a green shell", "a green shell")] },
        { say: "four shells", answer: "four-shells", options: [O("three-shells", "🐚🐚🐚", "three shells", "three shells"), O("four-shells", "🐚🐚🐚🐚", "four shells", "four shells"), O("five-shells", "🐚🐚🐚🐚🐚", "five shells", "five shells")] }
      ] },
      { id: "P02-M07", icon: "🐙", nameHe: "התמנון הצבעוני", kind: "dialogue", instructionHe: "עזרו לתמנון בצבעים ובספירה.", character: "🐙", speaker: "Rainbow Octopus", turns: [
        { npc: "Hello!", good: "Hello!", options: ["Hello!", "Goodbye!"] },
        { npc: "What color is it?", good: "It's red.", options: ["It's red.", "It's five."] },
        { npc: "How many shells?", good: "Three shells.", options: ["Three shells.", "A blue shell."] },
        { npc: "Look! What is it?", good: "It's a blue star.", options: ["It's a blue star.", "It's orange."] },
        { npc: "The reef is bright! Goodbye!", good: "Goodbye!", options: ["Goodbye!", "Hello!"] }
      ] }
    ]
  },
  {
    id: "P03", world: "pre-a1", icon: "🔢", nameHe: "מפרץ הספירה", nameEn: "Counting Cove",
    summaryHe: "סופרים משש עד עשרים, מזהים צורות ואומרים גיל וכמות.", reward: 60,
    missions: [
      { id: "P03-M01", icon: "📦", nameHe: "מטען 6 עד 12", kind: "collect", instructionHe: "געו בכל מספר ושמעו.", items: [
        O("six", "📦 × 6", "six"), O("seven", "📦 × 7", "seven"), O("eight", "📦 × 8", "eight"), O("nine", "📦 × 9", "nine"),
        O("ten", "📦 × 10", "ten"), O("eleven", "📦 × 11", "eleven"), O("twelve", "📦 × 12", "twelve")
      ] },
      { id: "P03-M02", icon: "🚢", nameHe: "מטען 13 עד 20", kind: "collect", instructionHe: "געו בכל מספר ושמעו.", items: [
        O("thirteen", "🚢 × 13", "thirteen"), O("fourteen", "🚢 × 14", "fourteen"), O("fifteen", "🚢 × 15", "fifteen"), O("sixteen", "🚢 × 16", "sixteen"),
        O("seventeen", "🚢 × 17", "seventeen"), O("eighteen", "🚢 × 18", "eighteen"), O("nineteen", "🚢 × 19", "nineteen"), O("twenty", "🚢 × 20", "twenty")
      ] },
      { id: "P03-M03", icon: "🔷", nameHe: "מגלים צורות", kind: "collect", instructionHe: "געו בכל צורה ושמעו.", items: [
        O("circle", "●", "circle"), O("square", "■", "square"), O("triangle", "▲", "triangle")
      ] },
      { id: "P03-M04", icon: "🚩", nameHe: "סופרים משלוחים", kind: "choice", instructionHe: "ספרו ובחרו את המשלוח.", rounds: [
        { say: "six flags", answer: "six-flags", options: [O("five-flags", "🚩🚩🚩🚩🚩", "five flags", "five flags"), O("six-flags", "🚩🚩🚩🚩🚩🚩", "six flags", "six flags"), O("seven-flags", "🚩🚩🚩🚩🚩🚩🚩", "seven flags", "seven flags")] },
        { say: "eight stars", answer: "eight-stars", options: [O("eight-stars", "★★★★★★★★", "eight stars", "eight stars"), O("nine-stars", "★★★★★★★★★", "nine stars", "nine stars"), O("seven-stars", "★★★★★★★", "seven stars", "seven stars")] },
        { say: "ten shells", answer: "ten-shells", options: [O("nine-shells", "🐚🐚🐚🐚🐚🐚🐚🐚🐚", "nine shells", "nine shells"), O("eleven-shells", "🐚🐚🐚🐚🐚🐚🐚🐚🐚🐚🐚", "eleven shells", "eleven shells"), O("ten-shells", "🐚🐚🐚🐚🐚🐚🐚🐚🐚🐚", "ten shells", "ten shells")] },
        { say: "twelve boxes", answer: "twelve-boxes", options: [O("twelve-boxes", "■■■■■■■■■■■■", "twelve boxes", "twelve boxes"), O("ten-boxes", "■■■■■■■■■■", "ten boxes", "ten boxes"), O("eleven-boxes", "■■■■■■■■■■■", "eleven boxes", "eleven boxes")] }
      ] },
      { id: "P03-M05", icon: "🎂", nameHe: "אומרים גיל", kind: "sequence", instructionHe: "בנו: I am seven", say: "I am seven", target: ["I", "am", "seven"], picture: "🎂", result: "I am seven" },
      { id: "P03-M06", icon: "🧺", nameHe: "ממיינים צורות", kind: "sort", instructionHe: "בחרו צורה ושימו בסל.", buckets: [
        { id: "circle", label: "circle", emoji: "●", audio: "circle" }, { id: "square", label: "square", emoji: "■", audio: "square" }, { id: "triangle", label: "triangle", emoji: "▲", audio: "triangle" }
      ], items: [
        { id: "purple-circle", emoji: "🟣 ●", label: "purple circle", audio: "purple circle", bucket: "circle" },
        { id: "brown-circle", emoji: "🟤 ●", label: "brown circle", audio: "brown circle", bucket: "circle" },
        { id: "purple-square", emoji: "🟪 ■", label: "purple square", audio: "purple square", bucket: "square" },
        { id: "brown-square", emoji: "🟫 ■", label: "brown square", audio: "brown square", bucket: "square" },
        { id: "gray-triangle", emoji: "🩶 ▲", label: "gray triangle", audio: "gray triangle", bucket: "triangle" },
        { id: "yellow-triangle", emoji: "🟡 ▲", label: "yellow triangle", audio: "yellow triangle", bucket: "triangle" }
      ] },
      { id: "P03-M07", icon: "🧑‍✈️", nameHe: "שומר המטען", kind: "dialogue", instructionHe: "ענו לשומר על מספרים וצורות.", character: "🧑‍✈️", speaker: "Cargo Keeper", turns: [
        { npc: "Hello!", good: "Hello!", options: ["Hello!", "Goodbye!"] },
        { npc: "How many flags?", good: "Seven flags.", options: ["Seven flags.", "A red flag."] },
        { npc: "How many circles?", good: "Ten circles.", options: ["Ten circles.", "A purple circle."] },
        { npc: "How old are you?", good: "I'm eight.", options: ["I'm eight.", "Eight circles."] },
        { npc: "The cargo is ready! Goodbye!", good: "Goodbye!", options: ["Goodbye!", "Hello!"] }
      ] }
    ]
  }
];

const UNIT_BY_ID = Object.fromEntries(CONTENT.map(unit => [unit.id, unit]));
const app = document.querySelector("#app");
let session = null;
let reviewSession = null;
let attemptSequence = 0;
let storageAvailable = true;
let state = loadState();

function freshState() {
  return {
    version: STATE_VERSION, routeVersion: 2, mode: "combined", coins: 0, pearls: 0, avatar: "🦜", flag: null,
    progress: {}, attempts: {}, replays: {}, memory: {}, evidence: [], transactions: {}
  };
}

function normalizeState(saved = {}) {
  return {
    ...freshState(), ...saved, version: STATE_VERSION, routeVersion: 2, mode: "combined",
    progress: { ...(saved.progress || {}) }, attempts: { ...(saved.attempts || {}) }, replays: { ...(saved.replays || {}) },
    memory: { ...(saved.memory || {}) }, evidence: Array.isArray(saved.evidence) ? saved.evidence.slice(-MAX_EVIDENCE_EVENTS) : [],
    transactions: { ...(saved.transactions || {}) }
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.version >= 3 && saved.version <= STATE_VERSION) return normalizeState(saved);
    if (saved?.version === 2) {
      const migrated = normalizeState(saved);
      const foundations = CONTENT.filter(unit => unit.world === "foundations");
      const wasAutoCompleted = saved.pearls === 0 && foundations.every(unit => (saved.progress?.[unit.id] || 0) >= unit.missions.length);
      if (wasAutoCompleted) foundations.forEach(unit => { delete migrated.progress[unit.id]; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    const old = JSON.parse(localStorage.getItem("pirate-seas-mvp"));
    if (old?.mode) {
      const migrated = freshState();
      migrated.coins = old.coins || 0;
      migrated.pearls = old.pearls || 0;
      migrated.progress.P01 = Math.max(0, Math.min(7, old.level || 0));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch { /* fall through */ }
  return freshState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    storageAvailable = true;
    return true;
  } catch {
    storageAvailable = false;
    return false;
  }
}

function createAttemptId(missionId = "activity") {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  attemptSequence += 1;
  return `${missionId}:${Date.now()}:${attemptSequence}`;
}

function memoryKey(skill, itemId) { return `${skill}:${String(itemId).toLowerCase()}`; }
function memoryStatus(level) { return level >= 5 ? "stable" : level >= 3 ? "known" : "learning"; }

function updateMemory(event) {
  const key = memoryKey(event.skill, event.itemId);
  const now = event.timestamp;
  const previous = state.memory[key] || { itemId: event.itemId, skill: event.skill, level: 0, status: "learning", dueAt: now, encounters: 0, struggles: 0 };
  const record = { ...previous, encounters: previous.encounters + 1, lastSeenAt: now, lastMissionId: event.missionId };
  if (event.correct === false) {
    record.level = Math.max(0, record.level - 1);
    record.struggles += 1;
    record.dueAt = now;
  } else if (event.correct === true && !event.assisted) {
    const retrievalIsDue = !previous.lastIndependentAt || now >= (previous.dueAt || 0);
    if (retrievalIsDue) record.level = Math.min(REVIEW_INTERVAL_DAYS.length - 1, record.level + 1);
    record.lastIndependentAt = now;
    record.dueAt = now + REVIEW_INTERVAL_DAYS[record.level] * DAY_MS;
  } else if (event.correct === true && event.assisted) {
    record.dueAt = Math.min(previous.dueAt || now, now);
  } else if (!previous.lastIndependentAt) {
    record.dueAt = now;
  }
  record.status = memoryStatus(record.level);
  record.lastResult = event.correct;
  state.memory[key] = record;
}

function recordEvidence(itemId, options = {}) {
  const context = session || reviewSession;
  if (!itemId || !context) return null;
  const currentMissionId = session ? UNIT_BY_ID[session.unitId]?.missions[session.missionIndex]?.id : context.sourceMissionId;
  const event = {
    id: createAttemptId("evidence"), attemptId: context.attemptId, missionId: options.missionId || currentMissionId,
    itemId: String(itemId), skill: options.skill || "receptive", activity: options.activity || "unknown",
    correct: options.correct ?? null, assisted: Boolean(options.assisted), responseType: options.responseType || "exposure",
    firstAttempt: options.firstAttempt ?? context.roundMistakes === 0, promptVariant: options.promptVariant ?? context.round ?? context.index,
    replayCount: state.replays[options.missionId || currentMissionId] || 0,
    contentVersion: CONTENT_VERSION, timestamp: options.timestamp || Date.now()
  };
  state.evidence.push(event);
  if (state.evidence.length > MAX_EVIDENCE_EVENTS) state.evidence.splice(0, state.evidence.length - MAX_EVIDENCE_EVENTS);
  updateMemory(event);
  saveState();
  return event;
}

function recordMistake(itemId, options = {}) {
  const mission = UNIT_BY_ID[session.unitId].missions[session.missionIndex];
  session.mistakes += 1;
  session.roundMistakes += 1;
  state.attempts[mission.id] = (state.attempts[mission.id] || 0) + 1;
  return recordEvidence(itemId, { ...options, correct: false, assisted: false, firstAttempt: session.roundMistakes === 1, missionId: mission.id });
}

function recordSuccess(itemId, options = {}) {
  const assisted = options.assisted ?? session.roundMistakes > 0;
  const event = recordEvidence(itemId, { ...options, correct: true, assisted, firstAttempt: session.roundMistakes === 0 });
  session.roundMistakes = 0;
  return event;
}
function esc(value) { return String(value).replace(/[&<>\"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[char]); }
function jsArg(value) { return esc(JSON.stringify(value)); }
function shuffle(list) { return [...list].sort(() => Math.random() - .5); }

const NATURAL_VOICE_NAMES = [
  /microsoft (aria|jenny|sonia).*natural/i,
  /samantha/i,
  /ava/i,
  /serena/i,
  /karen/i,
  /google (us|uk) english/i,
  /natural|neural|enhanced|premium/i
];
let englishVoice = null;
let audioManifest = { clips: {} };
let currentAudio = null;

function audioLookupKey(text) {
  return String(text).toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']+/g, " ").trim().replace(/\s+/g, " ");
}

function loadAudioManifest() {
  if (typeof fetch !== "function") return;
  fetch("audio/manifest.json")
    .then(response => response.ok ? response.json() : Promise.reject(new Error("audio manifest unavailable")))
    .then(manifest => { if (manifest?.clips) audioManifest = manifest; })
    .catch(() => { audioManifest = { clips: {} }; });
}

function chooseEnglishVoice() {
  if (!("speechSynthesis" in window) || typeof speechSynthesis.getVoices !== "function") return null;
  const voices = speechSynthesis.getVoices().filter(voice => /^en([-_]|$)/i.test(voice.lang || ""));
  englishVoice = voices.sort((a, b) => voiceScore(b) - voiceScore(a))[0] || null;
  return englishVoice;
}

function voiceScore(voice) {
  const preferred = NATURAL_VOICE_NAMES.findIndex(pattern => pattern.test(voice.name || ""));
  return (preferred < 0 ? 0 : 100 - preferred * 8)
    + (/^en-US$/i.test(voice.lang || "") ? 18 : 0)
    + (voice.localService ? 4 : 0)
    + (voice.default ? 2 : 0)
    - (/compact|e?speak|robot/i.test(voice.name || "") ? 40 : 0);
}

function speechRate(text, supportive = false) {
  const words = String(text).trim().split(/\s+/).filter(Boolean).length;
  const normalRate = words <= 2 ? .58 : words <= 6 ? .62 : .65;
  return supportive ? Math.max(.5, normalRate - .07) : normalRate;
}

function synthesizeSpeech(text, supportive = false) {
  if ("speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined") {
    const spokenText = String(text).replace(/\s+/g, " ").trim();
    if (!spokenText) return;
    const utterance = new SpeechSynthesisUtterance(spokenText);
    const voice = englishVoice || chooseEnglishVoice();
    utterance.lang = voice?.lang || "en-US";
    if (voice) utterance.voice = voice;
    utterance.rate = speechRate(spokenText, supportive);
    utterance.pitch = .96;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  }
}

function stopSpeech() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

function speak(text, options = {}) {
  const spokenText = String(text).replace(/\s+/g, " ").trim();
  if (!spokenText) return;
  stopSpeech();
  const clip = audioManifest.clips[audioLookupKey(spokenText)];
  const source = options.supportive ? clip?.supportive || clip?.normal : clip?.normal;
  if (clip?.status === "ready" && source && typeof Audio !== "undefined") {
    currentAudio = new Audio(source);
    currentAudio.preload = "auto";
    currentAudio.addEventListener("ended", () => { currentAudio = null; }, { once: true });
    const playback = currentAudio.play();
    if (playback?.catch) playback.catch(() => { currentAudio = null; synthesizeSpeech(spokenText, options.supportive); });
    return;
  }
  synthesizeSpeech(spokenText, options.supportive);
}

function replaySpeech(text) {
  const missionId = session ? UNIT_BY_ID[session.unitId]?.missions[session.missionIndex]?.id : reviewSession?.sourceMissionId;
  if (missionId) {
    state.replays[missionId] = (state.replays[missionId] || 0) + 1;
    saveState();
  }
  speak(text, { supportive: true });
}

if ("speechSynthesis" in window) {
  chooseEnglishVoice();
  if (typeof speechSynthesis.addEventListener === "function") speechSynthesis.addEventListener("voiceschanged", chooseEnglishVoice);
}
loadAudioManifest();

function getProgress(unitId) { return Math.min(state.progress[unitId] || 0, UNIT_BY_ID[unitId].missions.length); }
function isComplete(unitId) { return getProgress(unitId) >= UNIT_BY_ID[unitId].missions.length; }
function unitUnlocked(index) { return index === 0 || isComplete(CONTENT[index - 1].id); }
function currentUnitIndex() { const found = CONTENT.findIndex((unit, index) => unitUnlocked(index) && !isComplete(unit.id)); return found < 0 ? CONTENT.length - 1 : found; }
function activeMission(unit) { return Math.min(getProgress(unit.id), unit.missions.length - 1); }
function modeMission(mission) { return mission; }

function reviewPromptLibrary() {
  const prompts = new Map();
  for (const unit of CONTENT) {
    for (const mission of unit.missions) {
      if (!["choice", "checkpoint", "sail"].includes(mission.kind)) continue;
      for (const round of mission.rounds || []) {
        const key = memoryKey("receptive", round.answer);
        if (!prompts.has(key)) prompts.set(key, { key, itemId: round.answer, skill: "receptive", say: round.say, options: round.options, sourceMissionId: mission.id });
      }
    }
  }
  return prompts;
}

const REVIEW_PROMPTS = reviewPromptLibrary();

function dueReviewPrompts(at = Date.now()) {
  return Object.entries(state.memory)
    .filter(([key, record]) => record.dueAt <= at && REVIEW_PROMPTS.has(key))
    .sort(([, a], [, b]) => a.dueAt - b.dueAt)
    .map(([key]) => REVIEW_PROMPTS.get(key));
}

function evidenceSummary(unit) {
  const missionIds = new Set(unit.missions.map(mission => mission.id));
  const keys = new Set(state.evidence.filter(event => missionIds.has(event.missionId)).map(event => memoryKey(event.skill, event.itemId)));
  let practised = 0;
  let remembered = 0;
  for (const key of keys) {
    const record = state.memory[key];
    if (record) practised += 1;
    if (record?.level >= 3) remembered += 1;
  }
  return { practised, remembered };
}

function header(showMapButton = false) {
  return `<header class="topbar"><div class="brand"><span class="brand-mark">🏴‍☠️</span><div><h1>Pirate Seas</h1><p>הרפתקת אנגלית</p></div></div><div class="purse"><span class="reward-counter" tabindex="0" aria-describedby="coin-help"><span class="counter-value">🪙 ${state.coins}</span><span class="counter-tooltip" id="coin-help" role="tooltip"><b>מטבעות</b><small>מרוויחים 10 מטבעות בכל משימה ובונוס כשמסיימים מקום.</small></span></span><span class="reward-counter" tabindex="0" aria-describedby="shell-help"><span class="counter-value">🦪 ${state.pearls}</span><span class="counter-tooltip" id="shell-help" role="tooltip"><b>צדפים</b><small>מקבלים צדף אחד אחרי שמסיימים את כל המשימות במקום.</small></span></span>${showMapButton ? `<button class="secondary" onclick="showWorld()">↩ למפה</button>` : ""}</div></header>`;
}

function shell(content, options = {}) {
  const storageNote = storageAvailable ? "" : " · ההתקדמות נשמרת זמנית בלבד במכשיר הזה";
  app.innerHTML = `<div class="app-shell">${header(Boolean(options.back))}${content}<p class="footer-note">הקלטות מאושרות יושמעו כשיהיו זמינות; קול המכשיר הוא גיבוי זמני${storageNote}.</p></div>`;
}

function showWelcome() {
  state.mode = "combined";
  saveState();
  showWorld();
}

function chooseMode() { state.mode = "combined"; saveState(); showWorld(); }
function resetGame() { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem("pirate-seas-mvp"); state = freshState(); session = null; showWorld(); }

function showWorld() {
  if (!state.mode) return showWelcome();
  stopSpeech();
  session = null;
  reviewSession = null;
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
  const due = dueReviewPrompts();
  const reviewDock = `<div class="review-dock"><span aria-hidden="true">🧭</span><div><b>צלילת חזרה</b><small>${due.length ? `${due.length} פריטים מחכים לתרגול קצר` : "אין פריטים שמחכים עכשיו"}</small></div><button class="${due.length ? "primary" : "secondary"}" ${due.length ? "onclick=\"startReview()\"" : "disabled"}>${due.length ? "מתרגלים" : "הכול מוכן"}</button></div>`;
  shell(`<section class="panel world-panel"><div class="world-heading"><div><p class="eyebrow">The Launching Cove</p><h2>מפת ההתחלה</h2><p>בנו את הסירה, האירו את המגדלור והמשיכו מאי השמות אל שונית הקשת ומפרץ הספירה.</p></div><span class="combined-track">🎧 + 📖 מסלול משולב</span></div>${reviewDock}<div class="voyage-progress"><span>יסודות ${foundationDone} / 6</span><div class="meter"><span style="width:${foundationDone / 6 * 100}%"></span></div></div><div class="sea-map"><div class="map-compass" aria-hidden="true">✦<small>צ</small></div><span class="map-decoration cloud" aria-hidden="true">☁️</span><span class="map-decoration whale" aria-hidden="true">🐋</span><span class="map-decoration waves" aria-hidden="true">〰 〰 〰</span><svg class="sea-route-lines" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true"><path class="route-shadow" d="M900 120 C830 55 770 180 700 120 S570 55 500 120 S370 180 300 120 S170 55 100 120 C35 210 35 340 100 430 C170 365 230 490 300 430 S430 365 500 430 S630 490 700 430"/><path class="route-dashes" d="M900 120 C830 55 770 180 700 120 S570 55 500 120 S370 180 300 120 S170 55 100 120 C35 210 35 340 100 430 C170 365 230 490 300 430 S430 365 500 430 S630 490 700 430"/></svg><div class="world-route">${cards}</div></div><div class="map-legend"><span><i class="legend-dot current-dot"></i>המקום הנוכחי</span><span><i class="legend-dot done-dot"></i>הושלם</span><span><i class="legend-dot locked-dot"></i>נעול</span></div><div class="map-actions"><button class="secondary" onclick="resetGame()">התחלה חדשה</button><span>המשימה הבאה: ${esc(CONTENT[currentIndex].nameHe)}</span></div></section>`);
}

function showUnit(unitId) {
  const unit = UNIT_BY_ID[unitId];
  const index = CONTENT.indexOf(unit);
  if (!unit || !unitUnlocked(index)) return showWorld();
  stopSpeech();
  session = null;
  reviewSession = null;
  const progress = getProgress(unit.id);
  const done = isComplete(unit.id);
  const nodes = unit.missions.map((mission, missionIndex) => {
    const available = done || missionIndex <= progress;
    const complete = missionIndex < progress || done;
    return `<button class="level-node ${complete ? "done" : ""} ${available ? "" : "locked"}" ${available ? `onclick="startMission('${unit.id}',${missionIndex})"` : "disabled"}><span>${complete ? "✅" : mission.icon}</span><small>${missionIndex + 1}</small><small>${esc(mission.nameHe)}</small></button>`;
  }).join("");
  const percent = Math.round(progress / unit.missions.length * 100);
  const evidence = evidenceSummary(unit);
  shell(`<section class="panel"><div class="island-hero ${unit.world === "foundations" ? "foundation-hero" : ""}"><p class="eyebrow english">${esc(unit.nameEn)}</p><h2>${esc(unit.nameHe)}</h2><p>${esc(unit.summaryHe)}</p><button class="primary" onclick="startMission('${unit.id}',${done ? 0 : activeMission(unit)})">${done ? "שחקו שוב" : "המשיכו"}</button></div><div class="mastery"><div class="mastery-label"><span>התקדמות במקום</span><span>${percent}%</span></div><div class="meter"><span style="width:${percent}%"></span></div></div><div class="evidence-strip" aria-label="ראיות למידה"><span><b>${evidence.practised}</b><small>תורגלו</small></span><span><b>${evidence.remembered}</b><small>נזכרו אחרי זמן</small></span><p>השלמת משימה אינה נקראת שליטה. זיכרון מופיע רק אחרי חזרה מאוחרת.</p></div><div class="path-heading"><b>המשימות בתוך ${esc(unit.nameHe)}</b><span>מסיימים לפי הסדר לפני שמפליגים למקום הבא</span></div><div class="level-path ${unit.missions.length <= 5 ? "short-path" : ""}">${nodes}</div></section>`, { back: true });
}

function startMission(unitId, missionIndex) {
  const unit = UNIT_BY_ID[unitId];
  if (!unit || missionIndex < 0 || missionIndex >= unit.missions.length) return showWorld();
  const progress = getProgress(unitId);
  if (!isComplete(unitId) && missionIndex > progress) return showUnit(unitId);
  reviewSession = null;
  session = { unitId, missionIndex, attemptId: createAttemptId(unit.missions[missionIndex].id), startedAt: Date.now(), round: 0, roundMistakes: 0, selected: [], collected: [], modelsHeard: [], sorted: [], activeItem: null, memoryDeck: null, flipped: [], matched: [], mistakes: 0 };
  renderMission();
}

const ACTIVITY_LABELS = {
  choice: "משימת גילוי", checkpoint: "אתגר המגדלור", collect: "משימת חקר",
  sail: "משימת ניווט", sort: "משימת מיון", sequence: "משימת בנייה",
  flag: "משימת יצירה", case: "משימת התאמה", swap: "מכונת מילים",
  memory: "משחק זיכרון", dialogue: "שיחה עם דמות"
};

function activityFrame(mission, body, extra = "") {
  const unit = UNIT_BY_ID[session.unitId];
  shell(`<section class="panel activity-panel ${extra}" data-kind="${esc(mission.kind)}"><div class="screen-header"><button class="secondary" onclick="showUnit('${unit.id}')">↩ חזרה</button><div class="activity-top"><div class="activity-kicker">${esc(unit.nameHe)} · ${session.missionIndex + 1}/${unit.missions.length}</div><span class="activity-kind">${ACTIVITY_LABELS[mission.kind] || "משימה"}</span><h2>${mission.icon} ${esc(mission.nameHe)}</h2></div><button class="help-button" aria-label="השמעת ההוראה לאט" onclick="replaySpeech(${jsArg(instructionAudio(mission))})">🔊</button></div><p class="instruction">${esc(mission.instructionHe)}</p>${body}<div id="feedback" class="feedback" aria-live="assertive"></div></section>`, { back: true });
}

function instructionAudio(mission) {
  if (mission.kind === "choice" || mission.kind === "checkpoint") return mission.rounds?.[session?.round || 0]?.say || "Listen and choose";
  if (mission.kind === "sail" || mission.kind === "swap") return mission.rounds?.[session?.round || 0]?.say || "Listen";
  if (mission.kind === "collect") return "Tap and listen";
  if (mission.kind === "sort") return "Sort the words";
  if (mission.kind === "memory") return "Find the matching pairs";
  if (mission.kind === "flag") return "Flag. Choose a flag";
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

function optionCard(option, handler = "chooseAnswer", disabled = false) {
  const text = `<span class="english option-label">${esc(option.label || option.id)}</span>`;
  return `<button class="card" data-answer="${esc(option.id)}" ${disabled ? "disabled" : `onclick="${handler}(${jsArg(option.id)})"`}><span class="emoji">${option.emoji}</span>${text}</button>`;
}

const RENDERERS = {
  choice(mission) { renderChoice(mission); },
  checkpoint(mission) { renderChoice(mission, true); },
  sail(mission) {
    const round = mission.rounds[session.round];
    const progress = Math.round(session.round / mission.rounds.length * 100);
    activityFrame(mission, `<div class="sail-game"><div class="sail-command english"><small>Captain says</small><b>${esc(round.say)}</b><button class="secondary" onclick="replaySpeech(${jsArg(round.say)})">🔊</button></div><div class="sail-lane"><span class="sail-boat" style="--sail-progress:${progress}%">⛵</span><span class="sail-finish">🏝️</span></div><div class="helm-controls"><button class="helm-go" onclick="chooseSail('go')"><span>▶️</span><b class="english">GO</b></button><button class="helm-stop" onclick="chooseSail('stop')"><span>⚓</span><b class="english">STOP</b></button></div><div class="status-row"><span class="status-chip english">${session.round + 1} / ${mission.rounds.length}</span></div></div>`, "sail-activity");
    setTimeout(() => speak(round.say), 180);
  },
  collect(mission) {
    const remaining = mission.items.filter(item => !session.collected.includes(item.id));
    const cards = mission.items.map(item => `<button class="card ${session.collected.includes(item.id) ? "collected" : ""}" onclick="collectItem(${jsArg(item.id)})"><span class="emoji">${item.emoji}</span><span class="english option-label">${esc(item.label)}</span><small>${session.collected.includes(item.id) ? "✓" : "🔊 לחצו ושמעו"}</small></button>`).join("");
    activityFrame(mission, `<div class="prompt"><span class="emoji">${remaining.length ? "🦜" : "✨"}</span><span>${remaining.length ? `נשארו ${remaining.length}` : "שמענו את כולם!"}</span></div><div class="card-grid">${cards}</div><div class="status-row"><span class="status-chip english">${session.collected.length} / ${mission.items.length}</span></div>`);
  },
  sequence(mission) {
    const used = session.selected.map(entry => entry.index);
    const available = shuffle(mission.target.map((token, index) => ({ token, index })).filter(entry => !used.includes(entry.index)));
    activityFrame(mission, `<div class="prompt english"><span class="emoji">${mission.picture || "🧩"}</span><button class="secondary" onclick="replaySpeech(${jsArg(mission.say || mission.result)})">🔊 Listen</button></div><div class="sentence english">${session.selected.length ? session.selected.map(entry => esc(entry.token)).join(" ") : "_ _ _"}</div><div class="tile-bank english">${available.map(entry => `<button class="tile" onclick="selectToken(${jsArg(entry.token)},${entry.index})">${esc(entry.token)}</button>`).join("")}</div><p class="center"><button class="primary" onclick="checkSequence()">בדיקה ✓</button> <button class="secondary" onclick="clearSequence()">ניקוי</button></p>`);
  },
  sort(mission) {
    const remaining = mission.items.filter(item => !session.sorted.includes(item.id));
    const active = mission.items.find(item => item.id === session.activeItem);
    const itemButtons = remaining.map(item => `<button class="sort-item ${session.activeItem === item.id ? "selected" : ""}" onclick="selectSortItem(${jsArg(item.id)})"><span>${item.emoji}</span><b class="english">${esc(item.label)}</b><small>🔊</small></button>`).join("");
    const buckets = mission.buckets.map(bucket => `<button class="sound-bucket" ${active ? "" : "disabled"} onclick="chooseSortBucket(${jsArg(bucket.id)})"><span>${bucket.emoji}</span><b class="english">${esc(bucket.label)}</b><small>${session.sorted.filter(id => mission.items.find(item => item.id === id)?.bucket === bucket.id).length} בפנים</small></button>`).join("");
    activityFrame(mission, `<div class="sort-workbench"><div class="sort-tray">${itemButtons || `<div class="tray-complete">✨ כל התמונות מוינו!</div>`}</div><div class="sort-arrow">${active ? `${active.emoji} ↓` : "בחרו תמונה"}</div><div class="bucket-grid">${buckets}</div><div class="status-row"><span class="status-chip">מוינו <bdi>${session.sorted.length} / ${mission.items.length}</bdi></span></div></div>`, "sort-activity");
  },
  swap(mission) {
    const round = mission.rounds[session.round];
    const before = [...round.from].map((letter, index) => `<span class="${index === round.replaceIndex ? "changing" : ""}">${esc(letter)}</span>`).join("");
    const after = [...round.from].map((letter, index) => `<span class="${index === round.replaceIndex ? "word-gap" : ""}">${index === round.replaceIndex ? "?" : esc(letter)}</span>`).join("");
    activityFrame(mission, `<div class="word-machine english"><div class="machine-word">${before}</div><div class="machine-gears">⚙️ ➜ ⚙️</div><div class="machine-result">${after} <i>${round.emoji}</i></div></div><button class="secondary listen-swap" onclick="replaySpeech(${jsArg(round.say)})">🔊 ${esc(round.say)}</button><div class="letter-parts english">${shuffle(round.choices).map(letter => `<button onclick="chooseSwap(${jsArg(letter)})">${esc(letter)}</button>`).join("")}</div><div class="status-row"><span class="status-chip english">${session.round + 1} / ${mission.rounds.length}</span></div>`, "swap-activity");
    setTimeout(() => speak(round.say), 180);
  },
  memory(mission) {
    if (!session.memoryDeck) session.memoryDeck = shuffle(mission.pairs.flatMap(pair => [
      { key: `${pair.id}:picture`, pairId: pair.id, face: pair.emoji, word: pair.word, kind: "picture" },
      { key: `${pair.id}:word`, pairId: pair.id, face: pair.word, word: pair.word, kind: "word" }
    ]));
    const cards = session.memoryDeck.map(card => {
      const revealed = session.flipped.includes(card.key) || session.matched.includes(card.pairId);
      return `<button class="memory-card ${revealed ? "revealed" : ""} ${session.matched.includes(card.pairId) ? "matched" : ""}" aria-label="${revealed ? esc(card.word) : "קלף סגור"}" onclick="flipMemory(${jsArg(card.key)})"><span class="${card.kind === "word" ? "english" : ""}">${revealed ? esc(card.face) : "❓"}</span></button>`;
    }).join("");
    activityFrame(mission, `<div class="memory-board">${cards}</div><div class="status-row"><span class="status-chip">זוגות <bdi>${session.matched.length} / ${mission.pairs.length}</bdi></span></div>`, "memory-activity");
  },
  flag(mission) {
    const selected = selectedFlag(mission);
    const previewStyle = selected ? `--flag-color:${selected.color};--flag-accent:${selected.accent}` : "";
    const choices = mission.flags.map(flag => `<button class="flag-choice ${selected?.id === flag.id ? "selected" : ""}" aria-label="${esc(flag.audio)}" onclick="chooseFlag(${jsArg(flag.id)})"><span class="flag-cloth" style="--flag-color:${flag.color};--flag-accent:${flag.accent}"><b>${flag.symbol}</b></span><small class="english">flag</small></button>`).join("");
    activityFrame(mission, `<div class="flag-stage"><div class="flag-preview ${selected ? "ready" : "empty"}"><span class="flag-cloth" style="${previewStyle}"><b>${selected?.symbol || "?"}</b></span></div><div class="flag-words"><b>${selected ? "זה הדגל שלי!" : "זה דגל"}</b><span class="english">${selected ? "My flag!" : "flag"}</span><button class="secondary" onclick="replaySpeech(${jsArg(selected ? `This is my ${selected.audio}` : "flag")})">🔊</button></div></div><div class="flag-grid">${choices}</div><p class="center"><button class="primary flag-confirm" ${selected ? "" : "disabled"} onclick="finishFlag()"><span>🏴 זה הדגל שלי!</span><b class="english">My flag!</b></button></p>`, "flag-activity");
  },
  case(mission) {
    const pair = mission.pairs[session.round];
    const options = shuffle(mission.pairs.map(candidate => candidate[1]));
    activityFrame(mission, `<div class="prompt english"><span class="case-letter">${esc(pair[0])}</span></div><div class="choice-grid english">${options.map(letter => `<button class="choice case-choice" onclick="chooseCase(${jsArg(letter)})">${esc(letter)}</button>`).join("")}</div><div class="status-row"><span class="status-chip english">${session.round + 1} / ${mission.pairs.length}</span></div>`);
  },
  dialogue(mission) {
    const turn = mission.turns[session.round];
    activityFrame(mission, `<div class="boss-scene"><figure>${mission.character || "🏴‍☠️"}</figure><div class="prompt english">${esc(turn.npc)}<br><button class="secondary" onclick="replaySpeech(${jsArg(turn.npc)})">🔊 Hear ${esc(mission.speaker || "Captain Morgan")}</button></div></div><div class="choice-grid">${shuffle(turn.options).map(option => `<button class="choice english" onclick="chooseDialogue(${jsArg(option)})">${esc(option)}</button>`).join("")}</div><p class="center"><button class="secondary" onclick="replaySpeech(${jsArg(turn.good)})">🎤 Say it with me</button></p><div class="status-row"><span class="status-chip english">${session.round + 1} / ${mission.turns.length}</span></div>`, "boss");
  }
};

function renderChoice(mission, checkpoint = false) {
  const round = mission.rounds[session.round];
  const options = shuffle(round.options);
  const targetSymbol = round.say.split(",")[0].trim();
  const visiblePrompt = mission.readerPrompt
    ? `<small class="letter-question">${esc(mission.readerPrompt)}</small><span id="spoken" class="english target-letter">${esc(targetSymbol)}</span>`
    : `<span class="emoji" aria-hidden="true">${checkpoint ? "💡" : "🦜"}</span><span id="spoken" class="english">${esc(round.say)}</span>`;
  const replayLabel = session.unitId === "F00" ? "🔊 שמעו שוב" : "🔊";
  const modelsReady = !mission.models?.length || mission.models.every(model => session.modelsHeard.includes(model.id));
  const modelStrip = mission.models?.length ? `<div class="model-strip"><b>קודם מכירים את הפעולות</b><div>${mission.models.map(model => `<button class="${session.modelsHeard.includes(model.id) ? "heard" : ""}" onclick="previewModel(${jsArg(model.id)})"><span>${model.emoji}</span><small class="english">${esc(model.label)}</small><i>🔊</i></button>`).join("")}</div></div>` : "";
  activityFrame(mission, `${modelStrip}<div class="prompt ${mission.readerPrompt ? "letter-prompt" : ""} ${checkpoint ? "checkpoint-prompt" : ""}">${visiblePrompt}<br><button class="secondary replay-icon" aria-label="השמעת הצליל שוב" title="השמעת הצליל שוב" onclick="replaySpeech(${jsArg(round.say)})">${replayLabel}</button></div><div class="card-grid">${options.map(option => optionCard(option, "chooseAnswer", !modelsReady)).join("")}</div>${modelsReady ? "" : `<p class="model-hint">געו בשתי הפעולות כדי לפתוח את הבחירה.</p>`}<div class="status-row"><span class="status-chip english">${session.round + 1} / ${mission.rounds.length}</span>${checkpoint ? `<span class="status-chip">אורות <bdi>${session.round} / ${mission.rounds.length}</bdi></span>` : ""}</div>`);
  if (modelsReady) setTimeout(() => speak(round.say), 180);
}

function previewModel(modelId) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const model = mission.models?.find(candidate => candidate.id === modelId);
  if (!model) return;
  if (!session.modelsHeard.includes(model.id)) {
    session.modelsHeard.push(model.id);
    recordEvidence(model.id, { skill: "receptive", activity: "model", responseType: "exposure" });
  }
  speak(model.audio);
  renderMission();
}

function feedback(message, good = false) {
  const node = document.querySelector("#feedback");
  if (!node) return;
  node.textContent = message;
  node.className = `feedback ${good ? "good" : "try"}`;
}

function startReview() {
  const queue = dueReviewPrompts().slice(0, 5);
  if (!queue.length) return showWorld();
  session = null;
  reviewSession = { attemptId: createAttemptId("review"), index: 0, round: 0, roundMistakes: 0, correct: 0, queue, sourceMissionId: queue[0].sourceMissionId };
  renderReview();
}

function renderReview() {
  const prompt = reviewSession?.queue[reviewSession.index];
  if (!prompt) return finishReview();
  reviewSession.sourceMissionId = prompt.sourceMissionId;
  const options = shuffle(prompt.options);
  shell(`<section class="panel activity-panel review-activity"><div class="screen-header"><button class="secondary" onclick="showWorld()">↩ למפה</button><div class="activity-top"><div class="activity-kicker">${reviewSession.index + 1}/${reviewSession.queue.length}</div><span class="activity-kind">חזרה מרווחת</span><h2>🧭 צלילת חזרה</h2></div><button class="help-button" aria-label="השמעה איטית" onclick="replaySpeech(${jsArg(prompt.say)})">🔊</button></div><p class="instruction">שמעו ובחרו.</p><div class="prompt"><span class="emoji">🦜</span><span class="english">${esc(prompt.say)}</span><br><button class="secondary" onclick="replaySpeech(${jsArg(prompt.say)})">🔊 שמעו לאט</button></div><div class="card-grid">${options.map(option => optionCard(option, "chooseReview")).join("")}</div><div class="status-row"><span class="status-chip">${reviewSession.index + 1} / ${reviewSession.queue.length}</span></div><div id="feedback" class="feedback" aria-live="assertive"></div></section>`, { back: true });
  setTimeout(() => speak(prompt.say), 180);
}

function chooseReview(choice) {
  const prompt = reviewSession?.queue[reviewSession.index];
  if (!prompt) return;
  if (choice !== prompt.itemId) {
    const selected = prompt.options.find(option => option.id === choice);
    reviewSession.roundMistakes += 1;
    recordEvidence(prompt.itemId, { missionId: prompt.sourceMissionId, skill: prompt.skill, activity: "spaced-review", correct: false, assisted: false, responseType: "recognition", firstAttempt: reviewSession.roundMistakes === 1 });
    feedback("כמעט. שמעו שוב ונסו.");
    speak(selected?.audio || selected?.label || choice, { supportive: true });
    return;
  }
  const assisted = reviewSession.roundMistakes > 0;
  recordEvidence(prompt.itemId, { missionId: prompt.sourceMissionId, skill: prompt.skill, activity: "spaced-review", correct: true, assisted, responseType: "recognition", firstAttempt: !assisted });
  reviewSession.correct += 1;
  reviewSession.roundMistakes = 0;
  reviewSession.index += 1;
  reviewSession.round = reviewSession.index;
  feedback(assisted ? "יופי. נחזור על זה שוב בהמשך." : "נזכרתם לבד!", true);
  if (reviewSession.index >= reviewSession.queue.length) return setTimeout(finishReview, 500);
  setTimeout(renderReview, 500);
}

function finishReview() {
  const completed = reviewSession?.correct || 0;
  const total = reviewSession?.queue.length || 0;
  reviewSession = null;
  shell(`<section class="panel completion"><div class="hero-art">🧭✨</div><h2>החזרה נשמרה</h2><p class="lead">תרגלתם ${completed} מתוך ${total} פריטים. פריט נחשב “נזכר” רק אחרי הצלחה עצמאית בזמן מאוחר יותר.</p><div class="completion-actions"><button class="primary" onclick="showWorld()">חזרה למפה</button></div></section>`, { back: true });
}

function chooseAnswer(choice) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  if (mission.models?.some(model => !session.modelsHeard.includes(model.id))) {
    feedback("קודם שומעים את שתי הפעולות.");
    return;
  }
  const round = mission.rounds[session.round];
  if (choice !== round.answer) {
    const selected = round.options.find(option => option.id === choice);
    recordMistake(round.answer, { skill: "receptive", activity: mission.kind, responseType: "recognition" });
    feedback("כמעט. הקשיבו שוב ונסו עוד פעם.");
    speak(selected?.audio || selected?.label || choice, { supportive: true });
    return;
  }
  recordSuccess(round.answer, { skill: "receptive", activity: mission.kind, responseType: "recognition" });
  feedback("מעולה!", true);
  speak(round.options.find(option => option.id === choice)?.audio || round.say);
  session.round++;
  if (session.round >= mission.rounds.length) return setTimeout(completeMission, 500);
  setTimeout(renderMission, 500);
}

function chooseSail(action) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const round = mission.rounds[session.round];
  const selected = round.options.find(option => option.id === action);
  if (action !== round.answer) {
    recordMistake(round.answer, { skill: "receptive", activity: "sail", responseType: "action" });
    feedback(action === "go" ? "אופס, הקפטן ביקש לעצור ולהטיל עוגן." : "אופס, הקפטן ביקש להפליג קדימה.");
    speak(selected?.audio || selected?.label || action, { supportive: true });
    return;
  }
  recordSuccess(round.answer, { skill: "receptive", activity: "sail", responseType: "action" });
  feedback(action === "go" ? "הרוח במפרשים!" : "העוגן ירד בזמן!", true);
  speak(selected?.audio || selected?.label || action);
  session.round++;
  if (session.round >= mission.rounds.length) return setTimeout(completeMission, 600);
  setTimeout(renderMission, 500);
}

function selectSortItem(itemId) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const item = mission.items.find(candidate => candidate.id === itemId);
  if (!item || session.sorted.includes(itemId)) return;
  session.activeItem = itemId;
  speak(item.audio || item.label);
  renderMission();
  feedback("עכשיו בחרו את סל הצליל.", true);
}

function chooseSortBucket(bucketId) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const item = mission.items.find(candidate => candidate.id === session.activeItem);
  const bucket = mission.buckets.find(candidate => candidate.id === bucketId);
  if (!item) return feedback("קודם בחרו תמונה מהמגש.");
  if (item.bucket !== bucketId) {
    recordMistake(item.id, { skill: "receptive", activity: "sort", responseType: "classification" });
    feedback("שמעתם את הסל. נסו סל אחר.");
    speak(bucket?.audio || bucket?.label || bucketId, { supportive: true });
    return;
  }
  recordSuccess(item.id, { skill: "receptive", activity: "sort", responseType: "classification" });
  session.sorted.push(item.id);
  session.activeItem = null;
  speak(bucket?.audio || bucket?.label || bucketId);
  renderMission();
  feedback("בדיוק! התמונה נכנסה לסל הנכון.", true);
  if (session.sorted.length >= mission.items.length) setTimeout(completeMission, 650);
}

function chooseSwap(letter) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const round = mission.rounds[session.round];
  if (letter !== round.answer) {
    recordMistake(round.result, { skill: "literacy", activity: "swap", responseType: "construction" });
    feedback("החלק לא מתאים למכונה. נסו אות אחרת.");
    speak(letter, { supportive: true });
    return;
  }
  recordSuccess(round.result, { skill: "literacy", activity: "swap", responseType: "construction" });
  feedback(`${round.result} — המכונה הצליחה!`, true);
  speak(round.result);
  session.round++;
  if (session.round >= mission.rounds.length) return setTimeout(completeMission, 650);
  setTimeout(renderMission, 550);
}

function flipMemory(cardKey) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const card = session.memoryDeck?.find(candidate => candidate.key === cardKey);
  if (!card || session.matched.includes(card.pairId) || session.flipped.includes(cardKey) || session.flipped.length >= 2) return;
  session.flipped.push(cardKey);
  speak(card.word);
  renderMission();
  if (session.flipped.length < 2) return feedback("מצאו את בן הזוג של הקלף.", true);
  const [first, second] = session.flipped.map(key => session.memoryDeck.find(candidate => candidate.key === key));
  if (first.pairId === second.pairId && first.kind !== second.kind) {
    recordSuccess(first.word, { skill: "literacy", activity: "memory", responseType: "matching" });
    session.matched.push(first.pairId);
    session.flipped = [];
    renderMission();
    feedback("מצאנו זוג!", true);
    if (session.matched.length >= mission.pairs.length) setTimeout(completeMission, 650);
    return;
  }
  recordMistake(first.word, { skill: "literacy", activity: "memory", responseType: "matching" });
  feedback("אלה לא בני זוג. זכרו איפה הם!");
  setTimeout(() => { session.flipped = []; renderMission(); feedback("נסו זוג אחר."); }, 750);
}

function collectItem(itemId) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const item = mission.items.find(candidate => candidate.id === itemId);
  if (!item) return;
  if (!session.collected.includes(itemId)) {
    session.collected.push(itemId);
    recordEvidence(item.id, { skill: "receptive", activity: "collect", responseType: "exposure" });
  }
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
  if (answer === target) {
    recordSuccess(mission.result || target, { skill: "literacy", activity: "sequence", responseType: "construction" });
    feedback(`${mission.result || target} — מצוין!`, true);
    speak(mission.result || target);
    return setTimeout(completeMission, 600);
  }
  recordMistake(mission.result || target, { skill: "literacy", activity: "sequence", responseType: "construction" });
  session.selected = [];
  renderMission();
  feedback("הצלילים חזרו למקום. הקשיבו ובנו משמאל לימין.");
  speak(mission.say || mission.result);
}

function selectedFlag(mission) {
  return mission.flags.find(flag => flag.id === state.flag || flag.symbol === state.flag) || null;
}

function chooseFlag(flagId) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const flag = mission.flags.find(candidate => candidate.id === flagId);
  if (!flag) return;
  state.flag = flag.id;
  recordEvidence("flag", { skill: "receptive", activity: "flag", responseType: "creative-choice" });
  saveState();
  renderMission();
  feedback("דגל! זה הדגל שלי.", true);
  speak(`Flag. ${flag.audio}. My flag.`);
}

function finishFlag() {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const flag = selectedFlag(mission);
  if (!flag) return;
  feedback("זה הדגל שלי!", true);
  speak("This is my flag. Goodbye!");
  setTimeout(completeMission, 900);
}

function chooseCase(letter) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const pair = mission.pairs[session.round];
  if (letter !== pair[1]) {
    recordMistake(pair[0], { skill: "literacy", activity: "case", responseType: "matching" });
    feedback("נסו שוב. חפשו את אותה צורה גדולה.");
    speak(letter, { supportive: true });
    return;
  }
  recordSuccess(pair[0], { skill: "literacy", activity: "case", responseType: "matching" });
  speak(`${pair[0]}, ${pair[1]}`);
  session.round++;
  if (session.round >= mission.pairs.length) return setTimeout(completeMission, 450);
  renderMission();
}

function chooseDialogue(choice) {
  const mission = modeMission(UNIT_BY_ID[session.unitId].missions[session.missionIndex]);
  const turn = mission.turns[session.round];
  if (choice !== turn.good) {
    recordMistake(turn.good, { skill: "productive", activity: "dialogue", responseType: "guided-choice" });
    feedback("שמעתם את הבחירה. נסו תשובה אחרת.");
    speak(choice, { supportive: true });
    return;
  }
  recordSuccess(turn.good, { skill: "productive", activity: "dialogue", responseType: "guided-choice", assisted: true });
  feedback("Wonderful!", true);
  speak(choice);
  session.round++;
  if (session.round >= mission.turns.length) return setTimeout(completeMission, 550);
  setTimeout(renderMission, 500);
}

function completeMission() {
  const unit = UNIT_BY_ID[session.unitId];
  const mission = unit.missions[session.missionIndex];
  const completedIndex = session.missionIndex;
  const progressBefore = getProgress(unit.id);
  const replayingCompletedLocation = progressBefore >= unit.missions.length;
  const missionTransactionId = `mission:${mission.id}`;
  const firstCompletion = progressBefore === completedIndex && !state.transactions[missionTransactionId];
  if (firstCompletion) {
    state.progress[unit.id] = completedIndex + 1;
    state.coins += 10;
    state.transactions[missionTransactionId] = {
      id: missionTransactionId, attemptId: session.attemptId, missionId: mission.id, coins: 10, pearls: 0, committedAt: Date.now()
    };
    if (state.progress[unit.id] === unit.missions.length) {
      const unitTransactionId = `unit:${unit.id}`;
      if (!state.transactions[unitTransactionId]) {
        state.coins += unit.reward;
        state.pearls += 1;
        state.transactions[unitTransactionId] = {
          id: unitTransactionId, attemptId: session.attemptId, unitId: unit.id, coins: unit.reward, pearls: 1, committedAt: Date.now()
        };
      }
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

window.PirateSeas = { CONTENT, UNIT_BY_ID, freshState, validateContent, modeMission, startMission, startReview, dueReviewPrompts, evidenceSummary, showWorld, showUnit, resetGame, getState: () => state, setState: next => { state = next; } };
showWorld();

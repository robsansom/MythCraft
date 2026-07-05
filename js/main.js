/* MythCraft landing page — interactions.
   Recipes and lore below are lifted from (or written in the voice of)
   the game's authored StarterContent, so the site demo is the game. */

// ───────────────────────── Arc logotype ─────────────────────────
// Direct port of the game's MythArcTitle: each glyph's centre is measured
// with the real display font, then swept along a large circle so the middle
// of the word crests above the ends. Rotation and lift both derive from the
// same circle, which is what keeps every glyph on the arc (the previous
// approximation drifted on wide glyphs like M and T).
const arcMeasure = document.createElement("canvas").getContext("2d");

function buildArc(el) {
  const text = el.dataset.arcText || (el.dataset.arcText = el.textContent.trim());
  const size = parseFloat(getComputedStyle(el).fontSize);
  const radius = size * 4.45; // the game uses radius 280 at 63pt
  arcMeasure.font = `400 ${size}px "Lilita One", sans-serif`;

  const glyphs = [...text];
  const widths = glyphs.map((g) => arcMeasure.measureText(g === " " ? "\u00A0" : g).width);
  const total = widths.reduce((a, b) => a + b, 0);
  const maxAngle = total / 2 / radius;
  const drop = radius * (1 - Math.cos(maxAngle));

  el.textContent = "";
  let cursor = 0;
  glyphs.forEach((ch, i) => {
    const center = cursor + widths[i] / 2;
    cursor += widths[i];
    const angle = (center - total / 2) / radius;
    const span = document.createElement("span");
    span.textContent = ch === " " ? "\u00A0" : ch;
    span.style.transform =
      `translateY(${(radius - Math.cos(angle) * radius - drop / 2).toFixed(2)}px) ` +
      `rotate(${angle.toFixed(4)}rad)`;
    el.appendChild(span);
  });
}

function buildAllArcs() {
  document.querySelectorAll("[data-arc]").forEach(buildArc);
}

// Wait for Lilita One so glyph measurement uses the real metrics, and
// rebuild on resize because the font size is responsive.
document.fonts.ready.then(buildAllArcs);
buildAllArcs();
let arcResizeTimer;
addEventListener("resize", () => {
  clearTimeout(arcResizeTimer);
  arcResizeTimer = setTimeout(buildAllArcs, 150);
});

// ───────────────────────── Nav scroll state ─────────────────────────
const nav = document.getElementById("nav");
addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", scrollY > 40);
}, { passive: true });

// ───────────────────────── Scroll reveal ─────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });
document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

// ───────────────────────── The Oracle demo ─────────────────────────
// A pocket edition of the game's authored recipe spine (Chapter 1).
const chips = {
  chaos:       { name: "Chaos",       img: "chaos" },
  earth:       { name: "Earth",       img: "earth" },
  sky:         { name: "Sky",         img: "sky" },
  sea:         { name: "Sea",         img: "sea" },
  night:       { name: "Night",       img: "night" },
  storm:       { name: "Storm",       img: "storm" },
  fire:        { name: "Fire",        img: "fire" },
  fate:        { name: "Fate",        img: "fate" },
  gaia:          { name: "Gaia",          img: "gaia" },
  uranus:        { name: "Uranus",        img: "uranus" },
  nyx:           { name: "Nyx",           img: "nyx" },
  eros:          { name: "Eros",          img: "eros" },
  pontus:        { name: "Pontus",        img: "pontus" },
  tartarus:      { name: "Tartarus",      img: "tartarus" },
  titans:        { name: "Titans",        img: "titans" },
  cronus:        { name: "Cronus",        img: "cronus" },
  rhea:          { name: "Rhea",          img: "rhea" },
  cyclopes:      { name: "Cyclopes",      img: "cyclopes" },
  hecatoncheires:{ name: "Hecatoncheires",img: "hecatoncheires" },
  sickle:        { name: "Sickle",        img: "sickle" },
  zeus:          { name: "Zeus",          img: "zeus" },
  thunderbolt:   { name: "Thunderbolt",   img: "thunderbolt" },
  titanomachy:   { name: "Titanomachy",   img: "titanomachy" },
};

// Starter rack — the eight primordial forces, as in the game.
const starterRack = ["chaos", "earth", "sky", "sea", "night", "storm", "fire", "fate"];

// key: alphabetically sorted pair → result chip id + verdict line.
// These mirror the game's authored Chapter 1 spine (StarterContent.swift),
// with one demo shortcut: Zeus arrives from Cronus + Rhea (his actual
// parents) instead of the full hidden-child chain.
const recipes = {
  "chaos|earth":           { result: "gaia",           lore: "Mother of everything, grudge-holder of note. Cross her children and she remembers, for eons." },
  "chaos|night":           { result: "nyx",            lore: "The one primordial the king of the gods won't pick a fight with. Take the hint." },
  "chaos|fire":            { result: "eros",           lore: "Older than the gods and pettier than all of them. Nearly every disaster in this story started with a crush." },
  "earth|sea":             { result: "pontus",         lore: "The sea before there was a god to run it, all depth, no management." },
  "earth|night":           { result: "tartarus",       lore: "Rock bottom, and then keep digging. It's where you put the losers you really don't want crawling back." },
  "earth|sky":             { result: "uranus",         lore: "Father of the Titans and a deeply unpleasant landlord. His children did not take it well." },
  "gaia|uranus":           { result: "titans",         lore: "The first ruling family. Enormous, powerful, and absolutely terrible at parenting." },
  "gaia|storm":            { result: "cyclopes",       lore: "One eye each, zero patience, excellent with a forge. Keep them on your side." },
  "gaia|tartarus":         { result: "hecatoncheires", lore: "A hundred hands, fifty heads, and precisely one grudge. Uranus locked them away. Remember that." },
  "fate|titans":           { result: "cronus",         lore: "Overthrew his dad, then ate his own kids to avoid the karma. It did not work. It never does." },
  "earth|titans":          { result: "rhea",           lore: "Watched her husband swallow five children, then quietly handed him a rock for the sixth. Mothers find a way." },
  "gaia|hecatoncheires":   { result: "sickle",         lore: "Forged by a furious mother for one specific, unforgivable job. Uranus should have been kinder." },
  "cronus|rhea":           { result: "zeus",           lore: "The youngest, loudest, and most thunderbolt-prone of the family. About to make it everyone's problem." },
  "cyclopes|zeus":         { result: "thunderbolt",    lore: "A gift from the Cyclopes and the original 'we'll discuss this later.' There is no later." },
  "cronus|zeus":           { result: "titanomachy",    lore: "The war of gods and Titans. You may want to stand back.", clash: true },
};

const blockedLines = [
  "The Fates glance at each other. One of them laughs. That's a no.",
  "The Oracle squints at your offering. \u201CBold. Wrong, but bold.\u201D",
  "Nothing happens. Somewhere, an owl judges you.",
  "The myth does not go this way. The myth has standards.",
  "Zeus checked. It's not canon. He would know — most of it is his fault.",
];

const rackEl = document.getElementById("oracle-rack");
const slotA = document.getElementById("slot-a");
const slotB = document.getElementById("slot-b");
const resultEl = document.getElementById("oracle-result");
const verdictEl = document.getElementById("oracle-verdict");
const resetBtn = document.getElementById("oracle-reset");

let selection = [];
let unlocked = new Set(starterRack);
let isResolved = false;
let clearTimer = null;

function chipButton(id) {
  const chip = chips[id];
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "rack-chip";
  btn.dataset.chip = id;
  btn.innerHTML = `<img src="assets/chips/${chip.img}.png" alt="" /><span>${chip.name}</span>`;
  btn.addEventListener("click", () => pick(id, btn));
  return btn;
}

function renderRack() {
  rackEl.innerHTML = "";
  unlocked.forEach((id) => rackEl.appendChild(chipButton(id)));
}

function fillSlot(slot, id) {
  const chip = chips[id];
  slot.classList.add("filled");
  slot.innerHTML = `<img src="assets/chips/${chip.img}.png" alt="${chip.name}" /><b>${chip.name}</b>`;
}

function pick(id, btn) {
  // A fresh pick while the last result is on display sweeps the table first,
  // so eager clickers are never locked out.
  if (isResolved) clearTable();
  if (selection.length >= 2) return;
  selection.push(id);
  btn.classList.add("used");
  fillSlot(selection.length === 1 ? slotA : slotB, id);
  if (selection.length === 2) setTimeout(resolveCombine, 350);
}

function releaseRack() {
  document.querySelectorAll(".rack-chip.used").forEach((b) => b.classList.remove("used"));
}

function resolveCombine() {
  const key = [...selection].sort().join("|");
  const recipe = recipes[key];
  releaseRack();

  if (recipe) {
    if (recipe.clash && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      playClash(() => showResult(recipe));
    } else {
      showResult(recipe);
    }
  } else {
    resultEl.classList.add("blocked");
    resultEl.innerHTML = `<span class="slot-hint" style="font-size:34px">✕</span>`;
    verdictEl.textContent = blockedLines[Math.floor(Math.random() * blockedLines.length)];
    verdictEl.className = "oracle-verdict blocked";
    isResolved = true;
    clearTimer = setTimeout(clearTable, 2600);
  }
}

function showResult(recipe) {
  const chip = chips[recipe.result];
  resultEl.classList.remove("blocked");
  resultEl.classList.add("filled");
  resultEl.innerHTML = `<img src="assets/chips/${chip.img}.png" alt="${chip.name}" /><b>${chip.name}</b>`;
  verdictEl.textContent = `${chip.name} — ${recipe.lore}`;
  verdictEl.className = "oracle-verdict success";

  if (!unlocked.has(recipe.result)) {
    unlocked.add(recipe.result);
    const btn = chipButton(recipe.result);
    btn.classList.add("unlocked");
    rackEl.appendChild(btn);
  }
  isResolved = true;
  clearTimer = setTimeout(clearTable, 3400);
}

function clearTable() {
  clearTimeout(clearTimer);
  isResolved = false;
  selection = [];
  slotA.className = "oracle-slot";
  slotB.className = "oracle-slot";
  slotA.innerHTML = `<span class="slot-hint">Pick a chip</span>`;
  slotB.innerHTML = `<span class="slot-hint">Pick another</span>`;
  resultEl.className = "oracle-result";
  resultEl.innerHTML = `<span class="slot-hint">?</span>`;
  releaseRack();
}

resetBtn.addEventListener("click", () => {
  unlocked = new Set(starterRack);
  clearTable();
  verdictEl.textContent = "The table is set. The gods are watching.";
  verdictEl.className = "oracle-verdict";
  renderRack();
});

renderRack();

// ───────────────────────── Clash overlay ─────────────────────────
const clashOverlay = document.getElementById("clash-overlay");

function playClash(done) {
  clashOverlay.classList.add("active");
  // restart CSS animations
  clashOverlay.querySelectorAll("img, .clash-flash, .clash-title").forEach((el) => {
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  });
  const finish = () => {
    clashOverlay.classList.remove("active");
    clashOverlay.removeEventListener("click", finish);
    done();
  };
  clashOverlay.addEventListener("click", finish);
  setTimeout(finish, 2800);
}

// ───────────────────────── Codex marquee ─────────────────────────
const codexLore = {
  zeus:        "The youngest, loudest, and most thunderbolt-prone of the family. About to make it everyone's problem.",
  cronus:      "Overthrew his dad, then ate his own kids to avoid the karma. It did not work. It never does.",
  gaia:        "Mother of everything, grudge-holder of note. Cross her children and she remembers, for eons.",
  uranus:      "Father of the Titans and a deeply unpleasant landlord. His children did not take it well.",
  rhea:        "Watched her husband swallow five children, then quietly handed him a rock for the sixth. Mothers find a way.",
  poseidon:    "Vast, moody, and impossible to argue with. Bring a boat and good manners.",
  hades:       "Runs the largest kingdom in existence and still gets left off the party invites. He keeps a list.",
  hera:        "Queen of the gods, patron of marriage, sworn enemy of roughly half of Zeus's calendar.",
  athena:      "Born fully armed from her father's headache. The headache was mutual.",
  apollo:      "God of music, poetry, prophecy, and being extremely dramatic about all three.",
  artemis:     "Asked for eternal independence at age three. Got it. Never looked back.",
  hermes:      "Stole cattle on the day he was born. Made it everyone else's fault by sunset. A natural.",
  aphrodite:   "Rose from the sea foam and immediately caused problems on purpose.",
  medusa:      "Turns heroes to stone and critics to gravel. Her hair has opinions.",
  perseus:     "Beheaded a Gorgon using a mirror, winged sandals, and quite frankly outrageous luck.",
  pegasus:     "Born from a very bad day. Became everyone's favourite anyway. Horses can do that.",
  minotaur:    "Half man, half bull, all landlord's nightmare. The maze was for everyone's benefit.",
  heracles:    "Twelve labours, zero sick days. Strongest man alive; still couldn't lift his own reputation.",
  cerberus:    "Three heads, one very good boy. Do not throw the stick. He will bring back the underworld.",
  persephone:  "Six pomegranate seeds and suddenly she runs the underworld half the year. Read the fine print.",
  orpheus:     "Played the lyre so well death itself said yes. Then he looked back. Musicians.",
  achilles:    "Invincible everywhere except the one place his mother held him. Always the ankle. Always.",
  odysseus:    "Took ten years to sail home and made it everyone's problem. Great with horses, though.",
  "wooden-horse": "History's most suspicious gift. They brought it inside anyway. They always do.",
  eris:        "Wasn't invited to the wedding. Sent one golden apple. Started a decade of war. Efficient.",
  typhon:      "Gaia's final argument. A hundred heads and every one of them screaming. Zeus barely won.",
  prometheus:  "Stole fire, gave it to mortals, got an eternity of liver trouble. Still says it was worth it.",
  pandora:     "Given one box and one instruction. You know exactly what happened next.",
  thunderbolt: "A gift from the Cyclopes and the original 'we'll discuss this later.' There is no later.",
  olympus:     "The penthouse of the cosmos. Earned, never crafted. The view is to die for — many did.",
  titanomachy: "Ten years of war between gods and Titans. The sky kept the receipts.",
  chaos:       "Before anything, there was this. No light, no shape, no rules. Honestly, the good old days.",
  nyx:         "Older than the stars and entirely unbothered by them. Best not to wake her.",
  moirai:      "Three old women, one pair of shears, and a guest list that includes everyone. Yes, even you.",
  sickle:      "Forged by a furious mother for one specific, unforgivable job. Uranus should have been kinder.",
  "thunder-goose": "Nobody prayed for this. It answered anyway.",
  "plot-hole": "Even the Muses lose their place sometimes. Do not look directly into it.",
};

const marqueeChips = Object.keys(codexLore);
const cardImg = document.getElementById("codex-card-img");
const cardName = document.getElementById("codex-card-name");
const cardLore = document.getElementById("codex-card-lore");

function buildMarquee(el, ids) {
  // Two copies so the 50% translate loop is seamless.
  [...ids, ...ids].forEach((id) => {
    const img = document.createElement("img");
    img.src = `assets/chips/${id}.png`;
    img.alt = id.replace(/-/g, " ");
    img.loading = "lazy";
    const show = () => {
      cardImg.src = img.src;
      cardName.textContent = id.replace(/-/g, " ").toUpperCase();
      cardLore.textContent = codexLore[id];
    };
    img.addEventListener("mouseenter", show);
    img.addEventListener("click", show);
    el.appendChild(img);
  });
}

const half = Math.ceil(marqueeChips.length / 2);
buildMarquee(document.getElementById("marquee-1"), marqueeChips.slice(0, half));
buildMarquee(document.getElementById("marquee-2"), marqueeChips.slice(half));

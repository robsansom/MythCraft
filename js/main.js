/* MythCraft landing page — interactions.
   Recipes and lore below are lifted from (or written in the voice of)
   the game's authored StarterContent, so the site demo is the game. */

// ───────────────────────── Arc logotype ─────────────────────────
// Per-glyph rotation along a circle — the web port of MythArcTitle.
document.querySelectorAll("[data-arc]").forEach((el) => {
  const text = el.textContent.trim();
  el.textContent = "";
  const glyphs = [...text];
  const mid = (glyphs.length - 1) / 2;
  const degPerGlyph = 4.6;
  glyphs.forEach((ch, i) => {
    const span = document.createElement("span");
    span.textContent = ch === " " ? "\u00A0" : ch;
    const angle = (i - mid) * degPerGlyph;
    const lift = Math.cos(((i - mid) / mid || 0) * (Math.PI / 2));
    span.style.transform = `rotate(${angle}deg) translateY(${-lift * 0.22}em)`;
    el.appendChild(span);
  });
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
  gaia:        { name: "Gaia",        img: "gaia" },
  uranus:      { name: "Uranus",      img: "uranus" },
  nyx:         { name: "Nyx",         img: "nyx" },
  eros:        { name: "Eros",        img: "eros" },
  tartarus:    { name: "Tartarus",    img: "tartarus" },
  titans:      { name: "Titans",      img: "titans" },
  cronus:      { name: "Cronus",      img: "cronus" },
  cyclopes:    { name: "Cyclopes",    img: "cyclopes" },
  sickle:      { name: "Sickle",      img: "sickle" },
  zeus:        { name: "Zeus",        img: "zeus" },
  thunderbolt: { name: "Thunderbolt", img: "thunderbolt" },
  titanomachy: { name: "Titanomachy", img: "titanomachy" },
};

// Starter rack — the eight primordial forces, as in the game.
const starterRack = ["chaos", "earth", "sky", "sea", "night", "storm", "fire", "fate"];

// key: alphabetically sorted pair → result chip id + verdict line.
const recipes = {
  "chaos|earth":    { result: "gaia",        lore: "Mother of everything, grudge-holder of note. Cross her children and she remembers, for eons." },
  "chaos|night":    { result: "nyx",         lore: "The one primordial the king of the gods won't pick a fight with. Take the hint." },
  "chaos|fire":     { result: "eros",        lore: "Older than the gods and pettier than all of them. Nearly every disaster in this story started with a crush." },
  "earth|night":    { result: "tartarus",    lore: "Rock bottom, and then keep digging." },
  "earth|sky":      { result: "uranus",      lore: "Father of the Titans and a deeply unpleasant landlord. His children did not take it well." },
  "gaia|uranus":    { result: "titans",      lore: "The first ruling family. Enormous, powerful, and absolutely terrible at parenting." },
  "gaia|storm":     { result: "cyclopes",    lore: "One eye each, zero patience, excellent with a forge. Keep them on your side." },
  "fate|titans":    { result: "cronus",      lore: "Overthrew his dad, then ate his own kids to avoid the karma. It did not work. It never does." },
  "gaia|tartarus":  { result: "sickle",      lore: "Forged by a furious mother for one specific, unforgivable job. Uranus should have been kinder." },
  "cronus|fate":    { result: "zeus",        lore: "The youngest, loudest, and most thunderbolt-prone of the family. About to make it everyone's problem." },
  "cyclopes|zeus":  { result: "thunderbolt", lore: "A gift from the Cyclopes and the original 'we'll discuss this later.' There is no later." },
  "cronus|zeus":    { result: "titanomachy", lore: "The war of gods and Titans. You may want to stand back.", clash: true },
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

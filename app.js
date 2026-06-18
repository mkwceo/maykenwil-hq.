/* ============================================================
   Maykenwil HQ — dashboard « écran verrouillé »
   Horloge live, widgets en verre, tuiles de branches, dock,
   modal de détail. Tout le contenu vient de data.json.
   ============================================================ */

const state = { data: null };

const els = {
  wallpaper: document.getElementById("wallpaper"),
  date: document.getElementById("lc-date"),
  hh: document.getElementById("lc-hh"),
  mm: document.getElementById("lc-mm"),
  ss: document.getElementById("lc-ss"),
  holding: document.getElementById("lc-holding"),
  verdict: document.getElementById("sheet-verdict"),
  widgets: document.getElementById("widgets"),
  branches: document.getElementById("branches"),
  dock: document.getElementById("dock"),
  modal: document.getElementById("modal"),
  modalBackdrop: document.getElementById("modal-backdrop"),
};

/* -------------------------------------------------- utils */
function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
function pad(n) { return String(n).padStart(2, "0"); }
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

/* -------------------------------------------------- horloge live */
function tickClock() {
  const now = new Date();
  els.hh.textContent = pad(now.getHours());
  els.mm.textContent = pad(now.getMinutes());
  els.ss.textContent = pad(now.getSeconds());
  const d = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  els.date.textContent = cap(d);
}

/* -------------------------------------------------- wallpaper depuis le thème */
function applyTheme() {
  const colors = state.data.theme && Array.isArray(state.data.theme.wallpaper)
    ? state.data.theme.wallpaper : null;
  if (!colors || colors.length < 3) return;
  const [a, b, c, d, e] = colors;
  els.wallpaper.style.background = `
    radial-gradient(50% 50% at 18% 18%, ${hexA(c || a, 0.85)}, transparent 60%),
    radial-gradient(45% 45% at 82% 22%, ${hexA(d || b, 0.8)}, transparent 60%),
    radial-gradient(55% 55% at 25% 85%, ${hexA(b, 0.9)}, transparent 62%),
    radial-gradient(50% 50% at 85% 80%, ${hexA(a, 0.6)}, transparent 60%),
    linear-gradient(160deg, ${b}, ${e || "#0c0a1d"} 70%)`;
}
function hexA(hex, alpha) {
  const h = String(hex).replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* -------------------------------------------------- widgets (vue d'ensemble) */
function renderWidgets() {
  const o = state.data.overview;
  const { holding } = state.data;
  const pct = Math.max(0, Math.min(1, o.score / o.scoreMax));
  const R = 41;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - pct);

  els.holding.textContent = holding.name;
  els.verdict.textContent = o.verdict;

  els.widgets.classList.add("stagger");
  els.widgets.innerHTML = `
    <div class="widget w-2">
      <p class="widget-label"><span class="wl-icon">🎯</span> Score GO / NO-GO</p>
      <div class="score-w">
        <div class="gauge">
          <svg width="92" height="92" viewBox="0 0 92 92">
            <circle class="track" cx="46" cy="46" r="${R}"></circle>
            <circle class="fill" cx="46" cy="46" r="${R}"
              stroke-dasharray="${circ.toFixed(1)}"
              stroke-dashoffset="${circ.toFixed(1)}"
              data-offset="${offset.toFixed(1)}"></circle>
          </svg>
          <div class="gauge-center">
            <span class="gauge-score" data-count="${o.score}">0</span>
            <span class="gauge-max">/ ${esc(o.scoreMax)}</span>
          </div>
        </div>
        <div>
          <div class="score-verdict">${esc(o.verdict)}</div>
          <p class="score-desc">Décision conditionnée à la levée des points faibles avant la bascule en exécution.</p>
        </div>
      </div>
    </div>

    <div class="widget w-2">
      <p class="widget-label"><span class="wl-icon">🧭</span> Trajectoire</p>
      <div class="kv-main">${esc(o.phase)}</div>
      <div class="kv-note">${esc(o.phaseNote)}</div>
    </div>

    <div class="widget w-4">
      <p class="widget-label"><span class="wl-icon">⚖️</span> Règle anti-dispersion</p>
      <div class="kv-big">${esc(o.antiDispersionRule)}</div>
    </div>

    <div class="widget w-2">
      <p class="widget-label"><span class="wl-icon">💪</span> Forces clés</p>
      <ul class="mini-list">
        ${o.strengths.map((s) => `<li><span class="mi up">↑</span><span>${esc(s)}</span></li>`).join("")}
      </ul>
    </div>

    <div class="widget w-2">
      <p class="widget-label"><span class="wl-icon">⚠️</span> Faiblesses clés</p>
      <ul class="mini-list">
        ${o.weaknesses.map((w) => `<li><span class="mi down">↓</span><span>${esc(w)}</span></li>`).join("")}
      </ul>
    </div>

    <div class="widget w-4">
      <p class="widget-label"><span class="wl-icon">🏛️</span> Structure holding</p>
      <div class="kv-note" style="font-size:14px">${esc(holding.model)}</div>
    </div>
  `;

  animateGauge();
}

function animateGauge() {
  const fill = els.widgets.querySelector(".gauge .fill");
  const counter = els.widgets.querySelector(".gauge-score");
  if (!fill || !counter) return;

  requestAnimationFrame(() => { fill.style.strokeDashoffset = fill.dataset.offset; });

  const target = parseInt(counter.dataset.count, 10) || 0;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    counter.textContent = target; return;
  }
  const start = performance.now();
  function step(now) {
    const p = Math.min(1, (now - start) / 1100);
    counter.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* -------------------------------------------------- tuiles de branches */
function renderBranches() {
  els.branches.classList.add("stagger");
  els.branches.innerHTML = state.data.branches
    .map(
      (b) => `
      <button class="tile" data-id="${esc(b.id)}" style="--tile-accent:${esc(b.accent)}">
        <div class="tile-icon">${esc(b.icon || "•")}</div>
        <h3 class="tile-name">${esc(b.name)}</h3>
        <p class="tile-summary">${esc(b.summary || "")}</p>
        ${b.status ? `<span class="tile-status">${esc(b.status)}</span>` : ""}
      </button>`
    )
    .join("");

  els.branches.querySelectorAll(".tile").forEach((tile) => {
    tile.addEventListener("click", () => openModal(tile.dataset.id));
  });
}

/* -------------------------------------------------- dock */
function renderDock() {
  const apps = state.data.dock || [];
  els.dock.innerHTML = apps
    .map(
      (a) => `
      <div class="dock-app" style="--app-color:${esc(a.color || "#64748b")}" title="${esc(a.name)}">
        <span>${esc(a.icon || "•")}</span>
        <span class="tip">${esc(a.name)}</span>
      </div>`
    )
    .join("");
}

/* -------------------------------------------------- modal détail */
function openModal(id) {
  const b = state.data.branches.find((x) => x.id === id);
  if (!b) return;

  const highlights = b.highlights && b.highlights.length
    ? `<ul class="hl-list">${b.highlights.map((h) => `<li><span class="hl-dot"></span><span>${esc(h)}</span></li>`).join("")}</ul>`
    : `<p class="empty-note">Aucun point clé renseigné pour l'instant.</p>`;

  els.modal.style.setProperty("--m-accent", b.accent);
  els.modal.innerHTML = `
    <button class="modal-close" id="modal-close" aria-label="Fermer">✕</button>
    <div class="modal-hero">
      <div class="modal-icon" style="--m-accent:${esc(b.accent)}">${esc(b.icon || "•")}</div>
      <div>
        <h2 class="modal-title">${esc(b.name)}</h2>
        ${b.tagline ? `<div class="modal-tagline" style="--m-accent-text:${esc(b.accent)}">${esc(b.tagline)}</div>` : ""}
        <div class="modal-summary">${esc(b.summary || "")}</div>
      </div>
    </div>
    ${b.status ? `<span class="modal-status">${esc(b.status)}</span>` : ""}
    <p class="modal-cap">Points clés</p>
    ${highlights}
  `;

  document.getElementById("modal-close").addEventListener("click", closeModal);
  els.modalBackdrop.classList.add("show");
  els.modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  els.modalBackdrop.classList.remove("show");
  els.modal.classList.remove("show");
  document.body.style.overflow = "";
}

els.modalBackdrop.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* -------------------------------------------------- init */
async function init() {
  try {
    const res = await fetch("data.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.data = await res.json();
  } catch (err) {
    document.querySelector(".sheet").innerHTML =
      `<div class="sheet-handle"></div><p style="text-align:center">Impossible de charger <code>data.json</code>. Lancez un serveur local (ex. <code>python3 -m http.server</code>).</p>`;
    tickClock();
    setInterval(tickClock, 1000);
    console.error(err);
    return;
  }

  applyTheme();
  tickClock();
  setInterval(tickClock, 1000);
  renderWidgets();
  renderBranches();
  renderDock();
}

init();

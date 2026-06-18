/* ============================================================
   Maykenwil HQ — bento dashboard
   Contenu : data.json. Icônes : SVG inline (Feather-style).
   ============================================================ */

const state = { data: null };

/* -------------------------------------------------- SVG icon library */
const ICONS = {
  trophy:       `<path d="M8 21h8M12 17v4"/><path d="M5 4H2v4a4 4 0 004 4h1"/><path d="M19 4h3v4a4 4 0 01-4 4h-1"/><rect x="7" y="2" width="10" height="11" rx="1"/>`,
  ticket:       `<path d="M3 10.5v-1A2.5 2.5 0 013 5V4h18v1a2.5 2.5 0 010 5v1a2.5 2.5 0 010 5v1H3v-1a2.5 2.5 0 010-5z"/><line x1="9" y1="4" x2="9" y2="20" stroke-dasharray="2 2"/>`,
  truck:        `<rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>`,
  sparkles:     `<path d="M12 3l1.9 5.5 5.6 1-4.5 3.8 1.4 5.7L12 16l-4.4 3 1.4-5.7-4.5-3.8 5.6-1z"/><path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z"/><path d="M5 2l.6 1.8L7.4 4l-1.8.6L5 6.4l-.6-1.8L2.6 4l1.8-.6z"/>`,
  gem:          `<polygon points="12 2 22 9 17 22 7 22 2 9"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="17" y1="22" x2="12" y2="9"/><line x1="7" y1="22" x2="12" y2="9"/>`,
  compass:      `<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/>`,
  mail:         `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`,
  calendar:     `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  'file-text':  `<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
  message:      `<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>`,
  music:        `<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`,
  image:        `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>`,
  'cloud-sun':  `<path d="M17.5 19H9a7 7 0 113.4-13.1 7 7 0 016.1 8.1"/><line x1="22" y1="15" x2="22" y2="15"/><path d="M22 9a1 1 0 100-2 1 1 0 000 2z"/><circle cx="19" cy="12" r="3"/>`,
  settings:     `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06-.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>`,
  target:       `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,
  'trending-up':   `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>`,
  'trending-down': `<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>`,
  zap:          `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
  building:     `<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  'arrow-right': `<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`,
};

function makeIcon(name, extraClass) {
  const paths = ICONS[name] ?? ICONS.zap;
  const cls = "icon" + (extraClass ? " " + extraClass : "");
  return `<svg class="${cls}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

/* -------------------------------------------------- utils */
function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
function pad(n) { return String(n).padStart(2, "0"); }
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

/* -------------------------------------------------- live clock */
function tickClock() {
  const now = new Date();
  const hh = document.getElementById("clock-hh");
  const mm = document.getElementById("clock-mm");
  const dt = document.getElementById("clock-date");
  if (!hh) return;
  hh.textContent = pad(now.getHours());
  mm.textContent = pad(now.getMinutes());
  if (dt) dt.textContent = cap(now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }));
}

/* -------------------------------------------------- topbar */
function renderTopbar() {
  const bn = document.getElementById("brand-name");
  const ts = document.getElementById("topstatus");
  const o = state.data.overview;
  if (bn) bn.textContent = state.data.holding.shortName || state.data.holding.name;
  if (ts) ts.innerHTML = `
    <span class="status-pill">${esc(o.verdict)}</span>
    <span class="status-phase">${esc(o.phase)}</span>
  `;
}

/* -------------------------------------------------- overview bento */
function renderOverview() {
  const o = state.data.overview;
  const h = state.data.holding;
  const R = 38;
  const circ = +(2 * Math.PI * R).toFixed(2);
  const offset = +(circ * (1 - o.score / o.scoreMax)).toFixed(2);

  document.getElementById("overview").innerHTML = `

    <div class="tile s-2 r-2 clock-tile" style="--accent:#8b5cf6">
      <p class="tile-label">${makeIcon("zap")} Maykenwil HQ</p>
      <div class="clock-time">
        <span id="clock-hh">00</span><span class="clock-colon">:</span><span id="clock-mm">00</span>
      </div>
      <div id="clock-date" class="clock-date"></div>
    </div>

    <div class="tile s-2 r-2" style="--accent:#10b981">
      <p class="tile-label">${makeIcon("target")} Score GO / NO-GO</p>
      <div class="score-row">
        <div class="gauge">
          <svg width="88" height="88" viewBox="0 0 88 88">
            <circle class="track" cx="44" cy="44" r="${R}"/>
            <circle class="fill"  cx="44" cy="44" r="${R}"
              stroke-dasharray="${circ}" stroke-dashoffset="${circ}" data-offset="${offset}"/>
          </svg>
          <div class="gauge-center">
            <span class="gauge-score" data-count="${o.score}">0</span>
            <span class="gauge-max">/${esc(o.scoreMax)}</span>
          </div>
        </div>
        <div>
          <div class="score-verdict">${esc(o.verdict)}</div>
          <p class="score-desc">Décision conditionnée à la levée des faiblesses avant bascule.</p>
        </div>
      </div>
    </div>

    <div class="tile s-2" style="--accent:#0ea5e9">
      <p class="tile-label">${makeIcon("compass")} Trajectoire</p>
      <div class="kv-main">${esc(o.phase)}</div>
      <div class="kv-note">${esc(o.phaseNote)}</div>
    </div>

    <div class="tile s-4" style="--accent:#f59e0b">
      <p class="tile-label">${makeIcon("zap")} Règle anti-dispersion</p>
      <div class="banner-text">${esc(o.antiDispersionRule)}</div>
    </div>

    <div class="tile s-2" style="--accent:#10b981">
      <p class="tile-label">${makeIcon("trending-up")} Forces clés</p>
      <ul class="mini-list">
        ${o.strengths.map(s => `<li><span class="mi up">${makeIcon("trending-up")}</span><span>${esc(s)}</span></li>`).join("")}
      </ul>
    </div>

    <div class="tile s-2" style="--accent:#ef4444">
      <p class="tile-label">${makeIcon("trending-down")} Faiblesses clés</p>
      <ul class="mini-list">
        ${o.weaknesses.map(w => `<li><span class="mi down">${makeIcon("trending-down")}</span><span>${esc(w)}</span></li>`).join("")}
      </ul>
    </div>

    <div class="tile s-4" style="--accent:#8b5cf6">
      <p class="tile-label">${makeIcon("building")} Structure holding</p>
      <div class="kv-note" style="font-size:14px">${esc(h.model)}</div>
    </div>
  `;

  animateGauge();
  tickClock();
}

function animateGauge() {
  const fill = document.querySelector(".gauge .fill");
  const counter = document.querySelector(".gauge-score");
  if (!fill || !counter) return;

  const targetOffset = parseFloat(fill.dataset.offset);
  requestAnimationFrame(() => { fill.style.strokeDashoffset = targetOffset; });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    counter.textContent = counter.dataset.count;
    return;
  }
  const end = parseInt(counter.dataset.count, 10);
  const t0 = performance.now();
  (function step(now) {
    const p = Math.min(1, (now - t0) / 1100);
    counter.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

/* -------------------------------------------------- branch tiles */
function renderBranches() {
  const el = document.getElementById("branches");
  const cnt = document.getElementById("branch-count");
  if (cnt) cnt.textContent = state.data.branches.length;

  el.innerHTML = state.data.branches.map(b => `
    <button class="tile branch" data-id="${esc(b.id)}" style="--accent:${esc(b.accent)}">
      <div class="branch-top">
        <div class="icon-box">${makeIcon(b.icon)}</div>
        <span class="branch-arrow">${makeIcon("arrow-right")}</span>
      </div>
      <h3 class="branch-name">${esc(b.name)}</h3>
      <p class="branch-summary">${esc(b.summary || "")}</p>
      ${b.status ? `<span class="branch-status">${esc(b.status)}</span>` : ""}
    </button>
  `).join("");

  el.querySelectorAll(".branch").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.id));
  });
}

/* -------------------------------------------------- dock */
function renderDock() {
  document.getElementById("dock").innerHTML = (state.data.dock || []).map(a => `
    <div class="dock-app" style="--app-color:${esc(a.color || "#64748b")}" title="${esc(a.name)}">
      ${makeIcon(a.icon)}
      <span class="tip">${esc(a.name)}</span>
    </div>
  `).join("");
}

/* -------------------------------------------------- modal */
function openModal(id) {
  const b = state.data.branches.find(x => x.id === id);
  if (!b) return;
  const modal = document.getElementById("modal");
  const backdrop = document.getElementById("modal-backdrop");

  const highlights = b.highlights?.length
    ? `<ul class="hl-list">${b.highlights.map(h => `<li><span class="hl-dot"></span><span>${esc(h)}</span></li>`).join("")}</ul>`
    : `<p class="empty-note">Aucun point clé renseigné pour l'instant.</p>`;

  modal.style.setProperty("--m-accent", b.accent);
  modal.innerHTML = `
    <button class="modal-close" id="modal-close" aria-label="Fermer">✕</button>
    <div class="modal-hero">
      <div class="icon-box modal-icon" style="--accent:${esc(b.accent)}">${makeIcon(b.icon)}</div>
      <div>
        <h2 class="modal-title">${esc(b.name)}</h2>
        ${b.tagline ? `<div class="modal-tagline">${esc(b.tagline)}</div>` : ""}
        <p class="modal-summary">${esc(b.summary || "")}</p>
      </div>
    </div>
    ${b.status ? `<span class="modal-status">${esc(b.status)}</span>` : ""}
    <p class="modal-cap">Points clés</p>
    ${highlights}
  `;

  document.getElementById("modal-close").addEventListener("click", closeModal);
  backdrop.classList.add("show");
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal-backdrop").classList.remove("show");
  document.getElementById("modal").classList.remove("show");
  document.body.style.overflow = "";
}

document.getElementById("modal-backdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* -------------------------------------------------- init */
async function init() {
  try {
    const res = await fetch("data.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.data = await res.json();
  } catch (err) {
    document.body.innerHTML = `
      <div style="display:flex;height:100vh;align-items:center;justify-content:center;
                  font-family:Inter,sans-serif;color:#f4f4f6;text-align:center;padding:2rem">
        <div>
          <p style="font-size:1.1rem;margin-bottom:.5rem">Impossible de charger <code>data.json</code></p>
          <p style="opacity:.55;font-size:.9rem">Lancez un serveur local&nbsp;: <code>python3 -m http.server</code></p>
        </div>
      </div>`;
    console.error(err);
    return;
  }

  renderTopbar();
  renderOverview();
  renderBranches();
  renderDock();
  setInterval(tickClock, 1000);
}

init();

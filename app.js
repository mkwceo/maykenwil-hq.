/* ============================================================
   Maykenwil HQ — logique du dashboard
   Charge data.json, génère la sidebar, la vue d'ensemble et les
   vues de branche. Navigation par hash (#sport, #events, ...).
   Le design ne dépend jamais du contenu : tout vient de data.json.
   ============================================================ */

const state = { data: null };

const els = {
  nav: document.getElementById("nav"),
  view: document.getElementById("view"),
  sidebarFooter: document.getElementById("sidebar-footer"),
  brandName: document.getElementById("brand-name"),
  brandMark: document.getElementById("brand-mark"),
  sidebar: document.getElementById("sidebar"),
  scrim: document.getElementById("scrim"),
  menuToggle: document.getElementById("menu-toggle"),
};

/* -------------------------------------------------- utils */
function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// Couleur d'accent -> version "soft" translucide.
function softAccent(hex, alpha = 0.13) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getBranch(id) {
  return state.data.branches.find((b) => b.id === id);
}

/* -------------------------------------------------- sidebar */
function renderSidebar() {
  const { holding, branches } = state.data;

  els.brandName.textContent = holding.shortName || holding.name;
  els.brandMark.textContent = (holding.name || "M").trim().charAt(0).toUpperCase();

  let html = `
    <button class="nav-item" data-route="overview">
      <span class="nav-icon">◆</span>
      <span>Vue d'ensemble</span>
    </button>
    <div class="nav-section-label">Branches</div>
  `;

  html += branches
    .map(
      (b) => `
      <button class="nav-item" data-route="${esc(b.id)}"
        style="--ni-accent:${esc(b.accent)};--ni-accent-soft:${softAccent(b.accent)}">
        <span class="nav-icon" style="background:${softAccent(b.accent)}">${esc(b.icon || "•")}</span>
        <span>${esc(b.name)}</span>
        <span class="nav-dot"></span>
      </button>`
    )
    .join("");

  els.nav.innerHTML = html;

  els.nav.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      location.hash = item.dataset.route;
      closeSidebar();
    });
  });

  // Footer : badge phase
  els.sidebarFooter.innerHTML = `
    <div class="phase-badge">
      <span class="pb-label">Phase actuelle</span>
      <span class="pb-value">${esc(state.data.overview.phase)}</span>
      <span class="pb-pill">${esc(state.data.overview.verdict)}</span>
    </div>
  `;
}

function setActiveNav(route) {
  els.nav.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.route === route);
  });
}

/* -------------------------------------------------- vue d'ensemble */
function renderOverview() {
  const o = state.data.overview;
  const { holding, branches } = state.data;
  const pct = Math.max(0, Math.min(1, o.score / o.scoreMax));
  const R = 54;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - pct);

  els.view.innerHTML = `
    <header class="page-head animate-in">
      <div class="eyebrow">${esc(holding.name)}</div>
      <h1 class="page-title">Vue d'ensemble</h1>
      <p class="page-subtitle">Pilotage de la holding — ${esc(branches.length)} branches</p>
    </header>

    <div class="grid grid-overview stagger">
      <div class="card score-card">
        <div class="gauge">
          <svg width="132" height="132" viewBox="0 0 132 132">
            <circle class="track" cx="66" cy="66" r="${R}"></circle>
            <circle class="fill" cx="66" cy="66" r="${R}"
              stroke="var(--accent)"
              stroke-dasharray="${circ.toFixed(1)}"
              stroke-dashoffset="${circ.toFixed(1)}"
              data-offset="${offset.toFixed(1)}"></circle>
          </svg>
          <div class="gauge-center">
            <span class="gauge-score" data-count="${o.score}">0</span>
            <span class="gauge-max">/ ${esc(o.scoreMax)}</span>
          </div>
        </div>
        <div class="score-meta">
          <div class="verdict-pill">${esc(o.verdict)}</div>
          <p class="score-desc">Score GO / NO-GO actuel. Décision conditionnée à la levée des points faibles avant la bascule en exécution.</p>
        </div>
      </div>

      <div class="card">
        <p class="card-title">Trajectoire</p>
        <div class="kv">
          <span class="kv-main">${esc(o.phase)}</span>
          <span class="kv-note">${esc(o.phaseNote)}</span>
        </div>
      </div>
    </div>

    <div class="rule-banner animate-in" style="margin-top:18px">
      <div class="rb-icon">⚖️</div>
      <div>
        <div class="rb-label">Règle anti-dispersion</div>
        <div class="rb-text">${esc(o.antiDispersionRule)}</div>
      </div>
    </div>

    <div class="grid grid-2 stagger" style="margin-top:18px">
      <div class="card">
        <p class="card-title">Forces clés</p>
        <ul class="bullet-list">
          ${o.strengths.map((s) => `<li><span class="bi up">↑</span><span>${esc(s)}</span></li>`).join("")}
        </ul>
      </div>
      <div class="card">
        <p class="card-title">Faiblesses clés</p>
        <ul class="bullet-list">
          ${o.weaknesses.map((w) => `<li><span class="bi down">↓</span><span>${esc(w)}</span></li>`).join("")}
        </ul>
      </div>
    </div>

    <div class="card note-card animate-in" style="margin-top:18px">
      <div class="nc-icon">🏛️</div>
      <div class="nc-text"><strong>Structure :</strong> ${esc(holding.model)}</div>
    </div>

    <div class="section-label">Les 6 branches</div>
    <div class="grid grid-branches stagger">
      ${branches.map(branchCardHTML).join("")}
    </div>
  `;

  // Branch cards -> navigation
  els.view.querySelectorAll(".branch-card").forEach((card) => {
    card.addEventListener("click", () => { location.hash = card.dataset.route; });
  });

  animateGauge();
}

function branchCardHTML(b) {
  return `
    <div class="card branch-card" data-route="${esc(b.id)}"
      style="--bc-accent:${esc(b.accent)};--bc-accent-soft:${softAccent(b.accent)}">
      <div class="branch-icon">${esc(b.icon || "•")}</div>
      <div>
        <h3 class="branch-card-name">${esc(b.name)}</h3>
        <p class="branch-card-summary">${esc(b.summary || "")}</p>
      </div>
      <div class="branch-card-foot">
        ${b.status ? `<span class="branch-status">${esc(b.status)}</span>` : "<span></span>"}
        <span class="arrow">→</span>
      </div>
    </div>
  `;
}

function animateGauge() {
  const fill = els.view.querySelector(".gauge .fill");
  const counter = els.view.querySelector(".gauge-score");
  if (!fill || !counter) return;

  requestAnimationFrame(() => {
    fill.style.strokeDashoffset = fill.dataset.offset;
  });

  const target = parseInt(counter.dataset.count, 10) || 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) { counter.textContent = target; return; }

  const duration = 1000;
  const start = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    counter.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* -------------------------------------------------- vue branche */
function renderBranch(id) {
  const b = getBranch(id);
  if (!b) { location.hash = "overview"; return; }

  els.view.style.setProperty("--accent", b.accent);
  els.view.style.setProperty("--accent-soft", softAccent(b.accent));

  const highlights = b.highlights && b.highlights.length
    ? `<ul class="highlight-list">${b.highlights
        .map((h) => `<li><span class="hl-dot"></span><span>${esc(h)}</span></li>`)
        .join("")}</ul>`
    : `<p class="empty-note">Aucun point clé renseigné pour l'instant.</p>`;

  els.view.innerHTML = `
    <button class="back-link" id="back-link">← Vue d'ensemble</button>

    <div class="branch-hero animate-in">
      <div class="branch-hero-icon">${esc(b.icon || "•")}</div>
      <div class="branch-hero-text">
        <h1>${esc(b.name)}</h1>
        ${b.tagline ? `<div class="bh-tagline">${esc(b.tagline)}</div>` : ""}
        <div class="bh-summary">${esc(b.summary || "")}</div>
      </div>
    </div>

    <div class="grid stagger" style="margin-top:18px">
      ${b.status ? `
      <div class="card">
        <p class="card-title">Statut</p>
        <span class="detail-status-pill">${esc(b.status)}</span>
      </div>` : ""}

      <div class="card">
        <p class="card-title">Points clés</p>
        ${highlights}
      </div>
    </div>
  `;

  document.getElementById("back-link").addEventListener("click", () => {
    location.hash = "overview";
  });
}

/* -------------------------------------------------- routing */
function router() {
  const route = (location.hash || "#overview").slice(1) || "overview";
  els.view.style.removeProperty("--accent");
  els.view.style.removeProperty("--accent-soft");

  if (route === "overview" || !getBranch(route)) {
    setActiveNav("overview");
    if (route !== "overview" && location.hash) { location.hash = "overview"; return; }
    renderOverview();
  } else {
    setActiveNav(route);
    renderBranch(route);
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}

/* -------------------------------------------------- sidebar mobile */
function openSidebar() { els.sidebar.classList.add("open"); els.scrim.classList.add("show"); }
function closeSidebar() { els.sidebar.classList.remove("open"); els.scrim.classList.remove("show"); }

els.menuToggle.addEventListener("click", openSidebar);
els.scrim.addEventListener("click", closeSidebar);

/* -------------------------------------------------- init */
async function init() {
  try {
    const res = await fetch("data.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.data = await res.json();
  } catch (err) {
    els.view.innerHTML = `
      <div class="card" style="margin-top:40px">
        <p class="card-title">Erreur de chargement</p>
        <p>Impossible de charger <code>data.json</code>.</p>
        <p class="empty-note">Servez le dossier via un serveur local (ex. <code>python3 -m http.server</code>) — l'ouverture directe du fichier bloque <code>fetch</code>.</p>
      </div>`;
    console.error(err);
    return;
  }

  renderSidebar();
  window.addEventListener("hashchange", router);
  router();
}

init();

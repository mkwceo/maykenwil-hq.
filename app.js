/* ============================================================
   MAYKENWIL OS — Command Deck. Rendu depuis data.json.
   Horloge, compte à rebours mission, jauge, effet decrypt,
   overlay branche, lanceur d'apps. Système cohérent unique.
   ============================================================ */

const ICONS = {
  spark:     `<path d="M12 2l2.4 6.9L21 11l-6.6 2.1L12 20l-2.4-6.9L3 11l6.6-2.1z"/>`,
  mail:      `<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 6 9-6"/>`,
  notion:    `<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h8M8 11h8M8 15h5"/>`,
  drive:     `<path d="M8 3h8l5 9-4 7H7l-4-7z"/><path d="M8 3l-5 9h8M16 3l-4 9 4 7M3 12h18"/>`,
  github:    `<path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.2c0-1 .3-1.6.7-2 -3-.3-6-1.4-6-6.2a4.8 4.8 0 011.3-3.3 4.4 4.4 0 01.1-3.3s1-.3 3.4 1.3a11.6 11.6 0 016 0C18.2 2.2 19.2 2.5 19.2 2.5a4.4 4.4 0 01.1 3.3A4.8 4.8 0 0120.6 9c0 4.8-3 5.9-6 6.2.5.4.8 1.1.8 2.3V21"/>`,
  x:         `<path d="M4 4l16 16M20 4L4 20"/>`,
  instagram: `<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r=".7" fill="currentColor" stroke="none"/>`,
  youtube:   `<rect x="2.5" y="6" width="19" height="12" rx="3"/><path d="M10 9.2l5 2.8-5 2.8z" fill="currentColor" stroke="none"/>`,
  play:      `<path d="M7 4l13 8-13 8z"/>`,
  music:     `<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`,
  target:    `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>`,
};
const icon = (n,cls="") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||ICONS.target}</svg>`;
const esc = s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad = n => String(n).padStart(2,"0");
const statusLabel = s => ({active:"ACTIF",planning:"PLANIF",dormant:"DORMANT"}[s]||s.toUpperCase());

let DATA = null;

/* ---------- horloge ---------- */
function clock(){
  const n=new Date();
  document.getElementById("clock").textContent=`${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`;
  document.getElementById("date").textContent=n.toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"}).toUpperCase();
}

/* ---------- compte à rebours mission ---------- */
function countdown(){
  if(!DATA) return;
  const t=new Date(DATA.launchTarget).getTime()-Date.now();
  const d=Math.max(0,Math.floor(t/864e5)), h=Math.max(0,Math.floor(t/36e5)%24),
        m=Math.max(0,Math.floor(t/6e4)%60), s=Math.max(0,Math.floor(t/1e3)%60);
  document.getElementById("cd-d").textContent=d;
  document.getElementById("cd-h").textContent=pad(h);
  document.getElementById("cd-m").textContent=pad(m);
  document.getElementById("cd-s").textContent=pad(s);
}

/* ---------- effet decrypt ---------- */
function decrypt(el){
  const final=el.dataset.final||el.textContent; el.dataset.final=final;
  const chars="ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/<>#*"; let frame=0;
  const iv=setInterval(()=>{
    el.textContent=final.split("").map((c,i)=> c===" "?" ":(i<frame/2? final[i]:chars[Math.floor(Math.random()*chars.length)])).join("");
    frame++; if(frame/2>final.length){clearInterval(iv);el.textContent=final;}
  },28);
}

/* ---------- jauge ---------- */
function gauge(score){
  const R=48, C=2*Math.PI*R, fill=document.getElementById("gfill"), num=document.getElementById("gscore");
  fill.style.strokeDasharray=C.toFixed(1);
  fill.style.strokeDashoffset=C.toFixed(1);
  requestAnimationFrame(()=>{ fill.style.strokeDashoffset=(C*(1-score/100)).toFixed(1); });
  if(matchMedia("(prefers-reduced-motion:reduce)").matches){num.textContent=score;return;}
  const t0=performance.now();
  (function step(t){const p=Math.min(1,(t-t0)/1400);num.textContent=Math.round(score*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step);})(t0);
}

/* ---------- rendu ---------- */
function render(){
  const d=DATA;
  document.getElementById("founder").textContent="— "+d.founder.toUpperCase();
  document.getElementById("sysline").innerHTML=`
    <span class="sb"><span class="led"></span> ${esc(d.holding).toUpperCase()}</span>
    <span class="sb">PHASE · <b>${esc(d.globalPhase.replace("Phase 0 — ",""))}</b></span>
    <span class="sb">GO/NO-GO · <b>${d.goNoGoScore}</b></span>
    <span class="sb">CIBLE · <b>${esc(d.launchCity).toUpperCase()}</b></span>`;

  const lt=new Date(d.launchTarget);
  document.getElementById("launch-target").innerHTML=`T-0 → <b>${lt.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</b> · ${esc(d.launchCity)}`;

  document.getElementById("verdict").innerHTML=`${esc(d.verdict)}<small id="verdict-note">Décision conditionnée à la levée des points faibles avant la bascule en exécution.</small>`;
  gauge(d.goNoGoScore);

  document.getElementById("kv").innerHTML=`
    <div class="kv-row"><span class="k">Fondateur</span><span class="v">${esc(d.founder)}</span></div>
    <div class="kv-row"><span class="k">Holding</span><span class="v">${esc(d.holding)}</span></div>
    <div class="kv-row"><span class="k">Phase</span><span class="v">${esc(d.globalPhase)}</span></div>
    <div class="kv-row"><span class="k">Branches actives</span><span class="v">${d.branches.filter(b=>b.status==="active").length} / ${d.branches.length}</span></div>
    <div class="kv-row"><span class="k">MAJ</span><span class="v">${esc(d.lastUpdated)}</span></div>`;

  document.getElementById("bcount").textContent=d.branches.length;
  document.getElementById("branches").innerHTML=d.branches.map(b=>`
    <button class="bcard" data-id="${esc(b.id)}" style="--c:${esc(b.color)}">
      <div class="bc-top">
        <div><div class="bc-name">${esc(b.name)}</div><div class="bc-agency">${esc(b.agency||"—")}</div></div>
        <span class="bc-stat ${esc(b.status)}"><span class="d"></span>${statusLabel(b.status)}</span>
      </div>
      <div class="bc-rail"><i data-w="${b.progress}%"></i></div>
      <div class="bc-meta"><span>Avancement</span><b>${b.progress}%</b></div>
      <div class="bc-mile">${icon("target")}<span>${esc(b.keyMilestone)}</span></div>
    </button>`).join("");
  requestAnimationFrame(()=>document.querySelectorAll(".bc-rail i").forEach(i=>i.style.width=i.dataset.w));
  document.querySelectorAll(".bcard").forEach(c=>c.addEventListener("click",()=>openBranch(c.dataset.id)));

  document.getElementById("apps").innerHTML=(d.apps||[]).map(a=>`
    <a class="app" href="${esc(a.url)}" target="_blank" rel="noopener" title="${esc(a.name)}">
      ${icon(a.icon)}<span>${esc(a.name)}</span></a>`).join("");
}

/* ---------- overlay branche ---------- */
function openBranch(id){
  const b=DATA.branches.find(x=>x.id===id); if(!b) return;
  const ov=document.getElementById("ov"), box=document.getElementById("ov-box");
  box.style.setProperty("--c",b.color);
  box.innerHTML=`
    <button class="x" id="ov-x" aria-label="Fermer">✕</button>
    <div class="ov-name">${esc(b.name)}</div>
    <div class="ov-agency">${esc(b.agency||"—")} · ${esc(b.phase)}</div>
    ${b.slogan?`<div class="ov-slogan">« ${esc(b.slogan)} »</div>`:""}
    <div class="ov-rail"><i style="width:${b.progress}%"></i></div>
    <div class="bc-meta" style="font-family:var(--mono);font-size:10px;color:var(--faint)"><span>AVANCEMENT</span><b style="color:var(--text)">${b.progress}%</b></div>
    <div class="ov-grid">
      <div class="ov-cell"><div class="k">Statut</div><div class="v">${statusLabel(b.status)}</div></div>
      <div class="ov-cell"><div class="k">Responsable</div><div class="v">${esc(b.lead)}</div></div>
      <div class="ov-cell" style="grid-column:1/-1"><div class="k">Jalon clé</div><div class="v">${esc(b.keyMilestone)}</div></div>
    </div>
    <div class="ov-notes">${esc(b.notes)}</div>`;
  ov.classList.add("open");
  document.getElementById("ov-x").addEventListener("click",closeBranch);
}
function closeBranch(){document.getElementById("ov").classList.remove("open");}
document.getElementById("ov").addEventListener("click",e=>{if(e.target.id==="ov")closeBranch();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeBranch();});

/* ---------- second cerveau ---------- */
function brain(){window.open("https://claude.ai/new","_blank","noopener");}
document.getElementById("cmd-send").addEventListener("click",brain);
document.getElementById("cmd").addEventListener("keydown",e=>{if(e.key==="Enter")brain();});

/* ---------- init ---------- */
async function init(){
  clock(); setInterval(clock,1000);
  try{
    const r=await fetch("data.json",{cache:"no-store"}); DATA=await r.json();
  }catch(e){
    document.getElementById("branches").innerHTML=`<p style="color:var(--dim);font-family:var(--mono);font-size:12px">Lance un serveur local (python3 -m http.server) pour charger data.json.</p>`;
    return;
  }
  render();
  countdown(); setInterval(countdown,1000);
  document.querySelectorAll("[data-decrypt]").forEach(decrypt);
}
init();

/* PWA */
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));}

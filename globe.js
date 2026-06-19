/* ============================================================
   MAYKENWIL OS — Globe 3D des 6 branches (Three.js)
   Élément signature : nœuds lumineux + arcs de flux sur un globe.
   Lit data.json. Rotation auto, clic → drill-down branche.
   ============================================================ */
import * as THREE from "./vendor/three.module.js";

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const R = 1.6;

/* positions (lat,lng) des branches sur le globe */
const POS = {
  sport:       [18, 0],
  events:      [48, 58],
  northvision: [-12, 128],
  capital:     [-38, -158],
  beaute:      [38, -104],
  logistique:  [-28, -52],
};
/* liens (flux entre branches) */
const LINKS = [
  ["sport","events"], ["events","capital"], ["capital","northvision"],
  ["sport","capital"], ["sport","northvision"], ["logistique","sport"], ["events","beaute"],
];

function ll(lat, lng, r = R) {
  const phi = (90 - lat) * Math.PI / 180, th = (lng + 180) * Math.PI / 180;
  return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(th), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(th));
}
function glowTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const g = c.getContext("2d").createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,"rgba(255,255,255,1)"); g.addColorStop(.25,"rgba(255,255,255,.55)");
  g.addColorStop(1,"rgba(255,255,255,0)");
  const ctx = c.getContext("2d"); ctx.fillStyle = g; ctx.fillRect(0,0,128,128);
  return new THREE.CanvasTexture(c);
}

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 0.4, 5.2);

const root = new THREE.Group(); scene.add(root);       // tout le système
const globe = new THREE.Group(); root.add(globe);       // tourne

const GLOW = glowTexture();
const mobile = innerWidth < 760;

/* ---- sphère sombre + maillage ---- */
globe.add(new THREE.Mesh(
  new THREE.SphereGeometry(R*0.992, 48, 48),
  new THREE.MeshBasicMaterial({ color:0x0a121a })
));
const wire = new THREE.Mesh(
  new THREE.SphereGeometry(R, mobile?22:30, mobile?22:30),
  new THREE.MeshBasicMaterial({ color:0x2e9e78, wireframe:true, transparent:true, opacity:0.17 })
);
globe.add(wire);

/* ---- atmosphère ---- */
const atmo = new THREE.Sprite(new THREE.SpriteMaterial({ map:GLOW, color:0x2e9e78, transparent:true, opacity:0.35, blending:THREE.AdditiveBlending, depthWrite:false }));
atmo.scale.set(R*5.2, R*5.2, 1); root.add(atmo);

/* ---- étoiles ---- */
(function stars(){
  const n = mobile?500:1100, pos = new Float32Array(n*3);
  for(let i=0;i<n;i++){ const v=new THREE.Vector3().randomDirection().multiplyScalar(14+Math.random()*22); pos.set([v.x,v.y,v.z], i*3); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos,3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color:0x9fb0c0, size:0.03, transparent:true, opacity:0.7 })));
})();

let DATA=null, nodes=[], flux=[], selected=null, dragging=false, autoPaused=REDUCED;
const targetQuat = new THREE.Quaternion();
let focusing = false;
const labelsEl = document.getElementById("labels");

function hex(c){ return new THREE.Color(c); }

function buildNodes(){
  DATA.branches.forEach(b=>{
    const p = POS[b.id]; if(!p) return;
    const base = ll(p[0], p[1]);
    const active = b.status==="active";
    const size = 0.04 + (b.progress/100)*0.05 + (active?0.02:0);
    const col = hex(b.color);
    // cœur
    const core = new THREE.Mesh(new THREE.SphereGeometry(size, 18, 18),
      new THREE.MeshBasicMaterial({ color: b.status==="dormant"? col.clone().multiplyScalar(0.5) : col }));
    core.position.copy(base);
    core.userData = { id:b.id };
    globe.add(core);
    // halo
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map:GLOW, color:col, transparent:true,
      opacity: b.status==="dormant"?0.25:0.8, blending:THREE.AdditiveBlending, depthWrite:false }));
    const hs = size*(b.status==="dormant"?5:9); halo.scale.set(hs,hs,1); halo.position.copy(base); globe.add(halo);
    // tick/connector to surface
    nodes.push({ b, core, halo, base, size, active });
    // label DOM
    const el = document.createElement("div"); el.className="lbl";
    el.innerHTML = `<i style="background:${b.color};box-shadow:0 0 8px ${b.color}"></i>${b.name} <small>${b.progress}%</small>`;
    labelsEl.appendChild(el); nodes[nodes.length-1].el = el;
  });
}

function buildFlux(){
  LINKS.forEach(([a,c])=>{
    if(!POS[a]||!POS[c]) return;
    const va=ll(POS[a][0],POS[a][1]).normalize().multiplyScalar(R);
    const vc=ll(POS[c][0],POS[c][1]).normalize().multiplyScalar(R);
    const mid=va.clone().add(vc).normalize().multiplyScalar(R*1.34);
    const curve=new THREE.QuadraticBezierCurve3(va,mid,vc);
    const pts=curve.getPoints(60);
    const g=new THREE.BufferGeometry().setFromPoints(pts);
    const colA = DATA.branches.find(x=>x.id===a)?.color || "#c2a24e";
    const line=new THREE.Line(g, new THREE.LineBasicMaterial({ color:hex(colA), transparent:true, opacity:0.34, blending:THREE.AdditiveBlending, depthWrite:false }));
    globe.add(line);
    // particule de flux
    const spr=new THREE.Sprite(new THREE.SpriteMaterial({ map:GLOW, color:hex(colA), transparent:true, opacity:0.95, blending:THREE.AdditiveBlending, depthWrite:false }));
    spr.scale.set(0.12,0.12,1); globe.add(spr);
    flux.push({ curve, spr, t:Math.random(), speed:0.06+Math.random()*0.06 });
  });
}

/* ---- HUD ---- */
function fillHud(){
  document.getElementById("founder").textContent = "— "+DATA.founder.toUpperCase();
  document.getElementById("subtitle").textContent = DATA.holding.toUpperCase()+" · PHASE 0";
  const lt=new Date(DATA.launchTarget);
  function tick(){
    const t=lt.getTime()-Date.now(); const d=Math.max(0,Math.floor(t/864e5));
    document.getElementById("sys").innerHTML =
      `<span><span class="led"></span>${DATA.holding.toUpperCase()}</span>`+
      `<span>GO/NO-GO · <span class="v">${DATA.goNoGoScore}</span></span>`+
      `<span>CIBLE · <span class="v">${DATA.launchCity.toUpperCase()}</span></span>`+
      `<span>T- <span class="v">${d}J</span></span>`;
  }
  tick(); setInterval(tick,1000);
}

/* ---- sélection / panneau ---- */
function select(id){
  const n=nodes.find(x=>x.b.id===id); if(!n) return;
  selected=id; focusing=true; autoPaused=true;
  targetQuat.setFromUnitVectors(n.base.clone().normalize(), new THREE.Vector3(0,0,1));
  const b=n.b, panel=document.getElementById("panel"); panel.style.setProperty("--c",b.color);
  panel.innerHTML=`
    <button class="x" id="px" aria-label="Fermer">✕</button>
    <div class="p-tag">${b.phase}</div>
    <div class="p-name">${b.name}</div>
    <div class="p-agency">${b.agency||"—"}</div>
    ${b.slogan?`<div class="p-slogan">« ${b.slogan} »</div>`:""}
    <div class="p-rail"><i id="prail"></i></div>
    <div class="p-prog"><span>AVANCEMENT</span><b>${b.progress}%</b></div>
    <div class="p-kv">
      <div><span class="k">Statut</span><span class="val">${({active:"Actif",planning:"Planification",dormant:"Dormant"})[b.status]||b.status}</span></div>
      <div><span class="k">Responsable</span><span class="val">${b.lead}</span></div>
      <div><span class="k">Jalon clé</span><span class="val">${b.keyMilestone}</span></div>
    </div>
    <div class="p-notes">${b.notes}</div>`;
  panel.classList.add("open");
  requestAnimationFrame(()=>{ const r=document.getElementById("prail"); if(r) r.style.width=b.progress+"%"; });
  document.getElementById("px").addEventListener("click",deselect);
}
function deselect(){ selected=null; focusing=false; autoPaused=REDUCED; document.getElementById("panel").classList.remove("open"); }

/* ---- interaction ---- */
const ray=new THREE.Raycaster(), m=new THREE.Vector2();
let downXY=null, moved=false;
function ndc(e){ const r=canvas.getBoundingClientRect(); m.x=((e.clientX-r.left)/r.width)*2-1; m.y=-((e.clientY-r.top)/r.height)*2+1; }
canvas.addEventListener("pointerdown",e=>{ downXY=[e.clientX,e.clientY]; moved=false; dragging=true; });
canvas.addEventListener("pointermove",e=>{
  if(dragging && downXY){
    const dx=e.clientX-downXY[0], dy=e.clientY-downXY[1];
    if(Math.abs(dx)+Math.abs(dy)>4){ moved=true; focusing=false;
      globe.rotation.y+=dx*0.005; globe.rotation.x=Math.max(-1,Math.min(1,globe.rotation.x+dy*0.005)); downXY=[e.clientX,e.clientY]; }
  }
});
canvas.addEventListener("pointerup",e=>{
  dragging=false;
  if(!moved){ ndc(e); ray.setFromCamera(m,camera);
    const hit=ray.intersectObjects(nodes.map(n=>n.core))[0];
    if(hit) select(hit.object.userData.id); else deselect();
  }
});
document.getElementById("pause").addEventListener("click",function(){ autoPaused=!autoPaused; this.textContent=autoPaused?"▶":"⏸"; });
addEventListener("keydown",e=>{ if(e.key==="Escape") deselect(); });

/* ---- boucle ---- */
const tmp=new THREE.Vector3(); const camDir=new THREE.Vector3();
function resize(){ const w=innerWidth,h=innerHeight; renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix(); }
addEventListener("resize",resize); resize();

let last=performance.now();
function loop(now){
  const dt=(now-last)/1000; last=now;
  if(focusing){ globe.quaternion.slerp(targetQuat, 0.06); }
  else if(!autoPaused && !dragging){ globe.rotation.y += dt*0.12; }
  // pulse halos
  const pulse=1+Math.sin(now*0.004)*0.12;
  nodes.forEach(n=>{ if(n.active){ const s=n.size*9*pulse; n.halo.scale.set(s,s,1);} });
  // flux
  flux.forEach(f=>{ f.t=(f.t+dt*f.speed)%1; f.spr.position.copy(f.curve.getPointAt(f.t)); });
  // labels projection
  camera.getWorldDirection(camDir);
  nodes.forEach(n=>{
    n.core.getWorldPosition(tmp);
    const facing = tmp.clone().normalize().dot(camDir.clone().negate());
    const v=tmp.clone().project(camera);
    const x=(v.x*0.5+0.5)*innerWidth, y=(-v.y*0.5+0.5)*innerHeight;
    n.el.style.left=x+"px"; n.el.style.top=y+"px";
    n.el.style.opacity = (facing>0.1 && v.z<1)? (selected&&selected!==n.b.id?0.25:1) : 0;
  });
  atmo.material.opacity = 0.3+Math.sin(now*0.002)*0.06;
  renderer.render(scene,camera);
  requestAnimationFrame(loop);
}

/* ---- init ---- */
fetch("data.json",{cache:"no-store"}).then(r=>r.json()).then(d=>{
  DATA=d; fillHud(); buildNodes(); buildFlux();
  const s=POS.sport; globe.quaternion.setFromUnitVectors(ll(s[0],s[1]).normalize(), new THREE.Vector3(0,0,1));
  requestAnimationFrame(loop);
}).catch(()=>{ document.getElementById("subtitle").textContent="ERREUR — data.json introuvable (lance un serveur local)"; });

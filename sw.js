/* Maykenwil OS — service worker (hors-ligne) */
const CACHE="mkw-os-v3";
const ASSETS=["./","./index.html","./globe.js","./data.json","./vendor/three.module.js",
  "./icon-192.png","./icon-512.png","./apple-touch-icon.png","./manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>c.add(u).catch(()=>null)))).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c2=>c2.put(e.request,cp)).catch(()=>{});return r;}).catch(()=>c)));});

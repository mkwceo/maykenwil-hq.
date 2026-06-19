const C="mkw-os-app-v1";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.open(C).then(c=>c.match(e.request).then(h=>h||fetch(e.request).then(r=>{c.put(e.request,r.clone());return r;}).catch(()=>h))));});

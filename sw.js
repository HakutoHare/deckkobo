// デッキ工房 オフライン用。更新時は VERSION を上げる
const VERSION="1.3.3";
const CACHE="deckkobo-"+VERSION;
const FILES=["./","index.html","cardlist.json","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","lib/pdf.min.mjs","lib/pdf.worker.min.mjs","lib/cmaps/UniJIS-UCS2-H.bcmap","lib/cmaps/Adobe-Japan1-UCS2.bcmap"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("deckkobo-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("message",e=>{if(e.data==="skip")self.skipWaiting()});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).catch(()=>caches.match("index.html"))));
});

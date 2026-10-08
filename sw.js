// デッキ工房 オフライン用。更新時は VERSION を上げる
const VERSION="2.15.13";
const CACHE="deckkobo-"+VERSION;
const OCR="dkocr-5.1.1"; // 画像読み込みの部品を入れ替えたら名前を変える
const TEXT="dktext-20261005b"; // 効果文（cardtext.json）を作り直したら名前を変える
const FILES=["./","index.html","cardlist.json","limit.json","extsub.json","genre.json","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","lib/pdf.min.mjs","lib/pdf.worker.min.mjs","lib/cmaps/UniJIS-UCS2-H.bcmap","lib/cmaps/Adobe-Japan1-UCS2.bcmap"];
// 保存するときは、ブラウザや配信元に残っている古いファイルを使わず、必ず最新を取り直す
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:"reload"})))))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>(k.startsWith("deckkobo-")&&k!==CACHE||k.startsWith("dkocr-")&&k!==OCR||k.startsWith("dktext-")&&k!==TEXT)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("message",e=>{if(e.data==="skip")self.skipWaiting()});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  // 画像読み込み用の部品（lib/ocr/、約6MB）は使うときに初めて取得し、版の更新とは別の保存場所に残す
  const path=new URL(e.request.url).pathname;
  // 効果文も同じく、初めて見るときに取得して別の保存場所に残す
  if(path.endsWith("/cardtext.json")||path.endsWith("/cardattr.json")){
    e.respondWith(caches.open(TEXT).then(c=>c.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request,{cache:"reload"}).then(res=>{if(res.ok)c.put(e.request,res.clone());return res}))));return}
  if(path.includes("/lib/ocr/")){
    e.respondWith(caches.open(OCR).then(c=>c.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{if(res.ok)c.put(e.request,res.clone());return res}))));return}
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).catch(()=>caches.match("index.html"))));
});

const CACHE="mr-saizen-v40";
const ASSETS=["./?v=v40","./index.html?v=v40","./app.js?v=v40","./styles.css?v=v40","./manifest.webmanifest?v=v40","./icon.svg?v=v40"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>fetch(u,{cache:"reload"}).then(r=>{if(!r.ok)throw new Error("asset "+u);return c.put(u,r)})))).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  if(e.request.mode==="navigate" || url.pathname.endsWith("/index.html")){
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put("./index.html?v=v40",copy));return res;}).catch(()=>caches.match("./index.html?v=v40")));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return res;}).catch(()=>caches.match("./index.html?v=v40"))));
});

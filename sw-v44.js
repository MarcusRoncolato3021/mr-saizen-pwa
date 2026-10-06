const CACHE="mr-saizen-v44";
const VERSION="43";
const ASSETS=["./?v=44","./index.html?v=44","./app-v44.js?v=44","./styles.css?v=44","./manifest.webmanifest?v=44","./icon.svg?v=44"];
self.addEventListener("install",e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await Promise.all(ASSETS.map(async u=>{const r=await fetch(u,{cache:"no-store"});if(!r.ok)throw new Error("asset "+u);await c.put(u,r);}));await self.skipWaiting();})()));
self.addEventListener("activate",e=>e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;
 if(e.request.mode==="navigate"||u.pathname.endsWith("/index.html")){e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put("./index.html?v=44",c));return r;}).catch(()=>caches.match("./index.html?v=44")));return;}
 if(u.pathname.endsWith("app-v44.js")||u.pathname.endsWith("styles.css")||u.pathname.endsWith("manifest.webmanifest")||u.pathname.endsWith("icon.svg")){e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r;}).catch(()=>caches.match(e.request)));return;}
 e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});

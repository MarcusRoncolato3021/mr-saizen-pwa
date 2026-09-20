const CACHE="mr-saizen-v42";
const VERSION="41";
const ASSETS=["./?v=41","./index.html?v=41","./app-v42.js?v=41","./styles.css?v=41","./manifest.webmanifest?v=41","./icon.svg?v=41"];
self.addEventListener("install",e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await Promise.all(ASSETS.map(async u=>{const r=await fetch(u,{cache:"no-store"});if(!r.ok)throw new Error("asset "+u);await c.put(u,r);}));await self.skipWaiting();})()));
self.addEventListener("activate",e=>e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;
 if(e.request.mode==="navigate"||u.pathname.endsWith("/index.html")){e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put("./index.html?v=41",c));return r;}).catch(()=>caches.match("./index.html?v=41")));return;}
 if(u.pathname.endsWith("app-v42.js")||u.pathname.endsWith("styles.css")||u.pathname.endsWith("manifest.webmanifest")||u.pathname.endsWith("icon.svg")){e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r;}).catch(()=>caches.match(e.request)));return;}
 e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});

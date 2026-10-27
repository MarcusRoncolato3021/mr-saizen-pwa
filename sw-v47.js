// MR Saizen — service worker v47
// Arquivos do app: rede primeiro (sempre a versão mais nova), cache como reserva offline.
const VERSION="47";
const CACHE="mr-saizen-v"+VERSION;
const ASSETS=["./","./index.html","./app-v47.js?v=47","./styles.css?v=47","./manifest.webmanifest?v=47","./icon.svg?v=47"];

self.addEventListener("install",e=>e.waitUntil((async()=>{
  const c=await caches.open(CACHE);
  await Promise.all(ASSETS.map(async u=>{
    const r=await fetch(u,{cache:"no-store"});
    if(!r.ok)throw new Error("asset "+u);
    await c.put(u,r);
  }));
  await self.skipWaiting();
})()));

self.addEventListener("activate",e=>e.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})()));

const networkFirst=(req,cacheKey)=>fetch(req,{cache:"no-store"}).then(r=>{
  if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(cacheKey||req,copy));}
  return r;
}).catch(()=>caches.match(cacheKey||req,{ignoreSearch:!cacheKey}));

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  if(e.request.mode==="navigate"||u.pathname.endsWith("/index.html")){e.respondWith(networkFirst(e.request,"./index.html"));return;}
  e.respondWith(networkFirst(e.request));
});

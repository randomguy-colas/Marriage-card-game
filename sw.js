/* Marriage service worker — network-first so updates always show up; cache is only the offline fallback. */
const V='marriage-3.7.0';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(['./','manifest.json','icon-192.png'])).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin||u.search.indexOf('_=')>=0)return;
  e.respondWith(
    fetch(u.href,{cache:'no-store'}).then(res=>{
      if(res&&res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c)).catch(()=>{})}
      return res;
    }).catch(()=>caches.match(r).then(m=>m||caches.match('./')))
  );
});

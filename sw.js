const CACHE='le-sanctuaire-bio-v17';
const SHELL=['/index.html','/app.js','/enrichment-data.js','/ecology-enrichment.js','/plantzafrica-enrichment.js','/etymology-enrichment.js','/fallback-data.js','/firebase-config.js','/farm-notes.js','/manifest.webmanifest','/mont-bleu-mark.png','/apple-touch-icon.png','/icon-192.png','/icon-512.png'];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));
});

self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  // Observation JSON is cached in localStorage by app.js after a complete sync.
  if(request.url.includes('/api/inaturalist')) return;
  // Firebase configuration may be added after the first deployment. Always try
  // the network first so an installed PWA does not retain the placeholder file.
  if(new URL(request.url).pathname==='/firebase-config.js'){
    event.respondWith(fetch(request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(request,copy));
      return response;
    }).catch(()=>caches.match(request)));
    return;
  }
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put('/index.html',copy));
      return response;
    }).catch(()=>caches.match('/index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(request,copy));
    return response;
  })));
});

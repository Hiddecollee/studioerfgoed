const CACHE_NAME = "pwa-cache-v4"; // Verhoog het versienummer bij updates

// Installatie: Laadt de homepage in de cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/"]); // Cachet alleen de startpagina bij installatie
    })
  );
});

// Activeer en verwijder oude caches bij updates
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event: Cachet automatisch alles wat wordt opgevraagd
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return fetch(event.request)
        .then((response) => {
          // Sla alle interne verzoeken op in de cache (externe API's en video’s niet)
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => caches.match(event.request)); // Gebruik cache als netwerk offline is
    })
  );
});

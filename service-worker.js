const version = 1.2;
const cacheName = `Locator ${version}`;
const onsenUI = [
    'https://unpkg.com/onsenui@2.11.2/css/onsen-css-components.min.css',
    'https://unpkg.com/onsenui@2.11.2/css/onsenui-core.min.css',
    'https://unpkg.com/onsenui@2.11.2/css/onsenui.min.css',
    'https://unpkg.com/onsenui@2.11.2/js/onsenui.min.js',
    'https://unpkg.com/onsenui@2.11.2/css/material-design-iconic-font/css/material-design-iconic-font.min.css',
    'https://unpkg.com/onsenui@2.11.2/css/material-design-iconic-font/fonts/Material-Design-Iconic-Font.woff2'
];

const filesToCache = ["offline.html", "assets/images/icon.png", "assets/images/offline.svg", "src/app.js", "src/app.css", ...onsenUI];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(cacheName).then(async (cache) => {
    for (const file of filesToCache) {
      try {
        await cache.add(file);
      } catch(e) {
        console.error(file, e);
      }
    }
  }));
  console.log("Service Worker installed...");
});

self.addEventListener("fetch", (event) => {
  console.log(event.request.url, new Date());
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;

      // Fallback to network and if it fails, return the offline page.
      return fetch(event.request).catch((error) => {
        console.log('Network error...', error);
        console.log('Attempting Offline fallback.');
        return caches.open(cacheName).then((cache) => {
          return cache.match("offline.html");
        });
      });
    })
  );
});

self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activate");
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            console.log("Service Worker: Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Service Worker for Gregor Maric's Website
// Provides offline functionality and performance optimizations

const CACHE_NAME = 'gregor-maric-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/style_guide.html',
  '/styles.css',
  '/scripts.js',
  '/manifest.json',
  // Add more static assets as needed
];

// Assets to cache on first request
const CACHE_ON_REQUEST = [
  // Images
  /\.(jpg|jpeg|png|gif|webp|svg)$/,
  // Fonts
  /\.(woff|woff2|ttf|eot)$/,
  // Documents
  /\.(pdf|doc|docx)$/
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
  // API endpoints
  /\/api\//,
  // Analytics
  /\/analytics\//,
  // Third-party services
  /googleapis\.com/,
  /gstatic\.com/
];

// ==========================================================================
// Service Worker Installation
// ==========================================================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// ==========================================================================
// Service Worker Activation
// ==========================================================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activated');
        return self.clients.claim();
      })
  );
});

// ==========================================================================
// Fetch Event Handling
// ==========================================================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Determine caching strategy based on request
  if (shouldUseNetworkFirst(request)) {
    event.respondWith(networkFirst(request));
  } else if (shouldBeCached(request)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// ==========================================================================
// Caching Strategies
// ==========================================================================

// Network First Strategy - for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || createOfflineResponse();
    }
    
    throw error;
  }
}\n\n// Cache First Strategy - for static assets\nasync function cacheFirst(request) {\n  const cachedResponse = await caches.match(request);\n  \n  if (cachedResponse) {\n    return cachedResponse;\n  }\n  \n  try {\n    const networkResponse = await fetch(request);\n    \n    if (networkResponse.ok) {\n      const cache = await caches.open(STATIC_CACHE);\n      cache.put(request, networkResponse.clone());\n    }\n    \n    return networkResponse;\n  } catch (error) {\n    console.error('[SW] Cache first strategy failed:', error);\n    throw error;\n  }\n}\n\n// Stale While Revalidate Strategy - for regular content\nasync function staleWhileRevalidate(request) {\n  const cache = await caches.open(DYNAMIC_CACHE);\n  const cachedResponse = await cache.match(request);\n  \n  const fetchPromise = fetch(request)\n    .then((networkResponse) => {\n      if (networkResponse.ok) {\n        cache.put(request, networkResponse.clone());\n      }\n      return networkResponse;\n    })\n    .catch((error) => {\n      console.log('[SW] Network request failed:', error);\n      return cachedResponse;\n    });\n  \n  return cachedResponse || fetchPromise;\n}\n\n// ==========================================================================\n// Helper Functions\n// ==========================================================================\n\nfunction shouldUseNetworkFirst(request) {\n  return NETWORK_FIRST.some(pattern => {\n    if (pattern instanceof RegExp) {\n      return pattern.test(request.url);\n    }\n    return request.url.includes(pattern);\n  });\n}\n\nfunction shouldBeCached(request) {\n  // Check if it's a static asset\n  if (STATIC_ASSETS.includes(new URL(request.url).pathname)) {\n    return true;\n  }\n  \n  // Check cache-on-request patterns\n  return CACHE_ON_REQUEST.some(pattern => {\n    if (pattern instanceof RegExp) {\n      return pattern.test(request.url);\n    }\n    return request.url.includes(pattern);\n  });\n}\n\nfunction createOfflineResponse() {\n  return new Response(\n    `<!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n      <meta charset=\"UTF-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <title>Offline - Gregor Maric</title>\n      <style>\n        body {\n          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n          background: #0a0a0a;\n          color: #ffffff;\n          margin: 0;\n          padding: 2rem;\n          min-height: 100vh;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          text-align: center;\n        }\n        .offline-container {\n          max-width: 400px;\n        }\n        .offline-icon {\n          font-size: 4rem;\n          margin-bottom: 1rem;\n        }\n        .offline-title {\n          font-size: 2rem;\n          margin-bottom: 1rem;\n          background: linear-gradient(135deg, #4f46e5, #7c3aed);\n          -webkit-background-clip: text;\n          -webkit-text-fill-color: transparent;\n        }\n        .offline-message {\n          color: #a3a3a3;\n          line-height: 1.6;\n          margin-bottom: 2rem;\n        }\n        .retry-button {\n          background: linear-gradient(135deg, #f59e0b, #ef4444);\n          border: none;\n          color: white;\n          padding: 0.75rem 1.5rem;\n          border-radius: 0.5rem;\n          cursor: pointer;\n          font-weight: 600;\n          transition: transform 0.2s;\n        }\n        .retry-button:hover {\n          transform: translateY(-2px);\n        }\n      </style>\n    </head>\n    <body>\n      <div class=\"offline-container\">\n        <div class=\"offline-icon\">📡</div>\n        <h1 class=\"offline-title\">You're Offline</h1>\n        <p class=\"offline-message\">\n          It looks like you're not connected to the internet. \n          Please check your connection and try again.\n        </p>\n        <button class=\"retry-button\" onclick=\"window.location.reload()\">\n          Try Again\n        </button>\n      </div>\n    </body>\n    </html>`,\n    {\n      headers: {\n        'Content-Type': 'text/html',\n        'Cache-Control': 'no-cache'\n      }\n    }\n  );\n}\n\n// ==========================================================================\n// Background Sync\n// ==========================================================================\n\nself.addEventListener('sync', (event) => {\n  console.log('[SW] Background sync triggered:', event.tag);\n  \n  if (event.tag === 'contact-form') {\n    event.waitUntil(syncContactForm());\n  }\n});\n\nasync function syncContactForm() {\n  try {\n    // Get pending form data from IndexedDB\n    const pendingForms = await getPendingForms();\n    \n    for (const formData of pendingForms) {\n      try {\n        const response = await fetch('/api/contact', {\n          method: 'POST',\n          headers: {\n            'Content-Type': 'application/json'\n          },\n          body: JSON.stringify(formData.data)\n        });\n        \n        if (response.ok) {\n          await removePendingForm(formData.id);\n          console.log('[SW] Form synced successfully');\n        }\n      } catch (error) {\n        console.error('[SW] Form sync failed:', error);\n      }\n    }\n  } catch (error) {\n    console.error('[SW] Background sync failed:', error);\n  }\n}\n\n// IndexedDB helpers (simplified)\nasync function getPendingForms() {\n  // Implementation would use IndexedDB to store/retrieve pending forms\n  return [];\n}\n\nasync function removePendingForm(id) {\n  // Implementation would remove form from IndexedDB\n  console.log('[SW] Removing pending form:', id);\n}\n\n// ==========================================================================\n// Push Notifications\n// ==========================================================================\n\nself.addEventListener('push', (event) => {\n  console.log('[SW] Push notification received');\n  \n  let notificationData = {\n    title: 'Gregor Maric',\n    body: 'Thanks for visiting my website!',\n    icon: '/icons/icon-192x192.png',\n    badge: '/icons/badge-72x72.png',\n    tag: 'default',\n    requireInteraction: false,\n    actions: [\n      {\n        action: 'view',\n        title: 'View Website',\n        icon: '/icons/view-icon.png'\n      },\n      {\n        action: 'close',\n        title: 'Close',\n        icon: '/icons/close-icon.png'\n      }\n    ]\n  };\n  \n  if (event.data) {\n    try {\n      const payload = event.data.json();\n      notificationData = { ...notificationData, ...payload };\n    } catch (error) {\n      console.error('[SW] Failed to parse push payload:', error);\n    }\n  }\n  \n  event.waitUntil(\n    self.registration.showNotification(notificationData.title, notificationData)\n  );\n});\n\nself.addEventListener('notificationclick', (event) => {\n  console.log('[SW] Notification clicked:', event.action);\n  \n  event.notification.close();\n  \n  if (event.action === 'view' || !event.action) {\n    event.waitUntil(\n      clients.openWindow('/')\n    );\n  }\n});\n\n// ==========================================================================\n// Cache Management\n// ==========================================================================\n\nself.addEventListener('message', (event) => {\n  if (event.data && event.data.type) {\n    switch (event.data.type) {\n      case 'CACHE_URLS':\n        event.waitUntil(cacheUrls(event.data.urls));\n        break;\n      case 'CLEAR_CACHE':\n        event.waitUntil(clearCache());\n        break;\n      case 'GET_CACHE_SIZE':\n        event.waitUntil(getCacheSize().then(size => {\n          event.ports[0].postMessage({ type: 'CACHE_SIZE', size });\n        }));\n        break;\n    }\n  }\n});\n\nasync function cacheUrls(urls) {\n  const cache = await caches.open(DYNAMIC_CACHE);\n  return cache.addAll(urls);\n}\n\nasync function clearCache() {\n  const cacheNames = await caches.keys();\n  return Promise.all(\n    cacheNames.map(cacheName => {\n      if (cacheName !== STATIC_CACHE) {\n        return caches.delete(cacheName);\n      }\n    })\n  );\n}\n\nasync function getCacheSize() {\n  const cacheNames = await caches.keys();\n  let totalSize = 0;\n  \n  for (const cacheName of cacheNames) {\n    const cache = await caches.open(cacheName);\n    const requests = await cache.keys();\n    \n    for (const request of requests) {\n      const response = await cache.match(request);\n      if (response) {\n        const blob = await response.blob();\n        totalSize += blob.size;\n      }\n    }\n  }\n  \n  return totalSize;\n}\n\n// ==========================================================================\n// Periodic Background Tasks\n// ==========================================================================\n\nself.addEventListener('periodicsync', (event) => {\n  console.log('[SW] Periodic sync triggered:', event.tag);\n  \n  if (event.tag === 'cache-cleanup') {\n    event.waitUntil(performCacheCleanup());\n  }\n});\n\nasync function performCacheCleanup() {\n  try {\n    const cache = await caches.open(DYNAMIC_CACHE);\n    const requests = await cache.keys();\n    const now = Date.now();\n    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days\n    \n    for (const request of requests) {\n      const response = await cache.match(request);\n      if (response) {\n        const dateHeader = response.headers.get('date');\n        if (dateHeader) {\n          const responseDate = new Date(dateHeader).getTime();\n          if (now - responseDate > maxAge) {\n            await cache.delete(request);\n            console.log('[SW] Deleted old cache entry:', request.url);\n          }\n        }\n      }\n    }\n    \n    console.log('[SW] Cache cleanup completed');\n  } catch (error) {\n    console.error('[SW] Cache cleanup failed:', error);\n  }\n}\n\n// ==========================================================================\n// Error Handling\n// ==========================================================================\n\nself.addEventListener('error', (event) => {\n  console.error('[SW] Service Worker error:', event.error);\n});\n\nself.addEventListener('unhandledrejection', (event) => {\n  console.error('[SW] Unhandled promise rejection:', event.reason);\n});
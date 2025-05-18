
// Название кэша
const CACHE_NAME = 'goodfit-app-v1';

// Файлы для предварительного кэширования
const urlsToCache = [
  '/',
  '/app',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Установка Service Worker и предварительное кэширование
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Открытие кэша для предзагрузки');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Активация Service Worker и очистка старых кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Стратегия кэширования: сначала сеть, затем кэш (network-first)
self.addEventListener('fetch', (event) => {
  // Проверка, является ли запрос GET и не к API
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Клонируем ответ, потому что он может быть использован только один раз
        const responseClone = response.clone();
        
        // Открываем кэш и сохраняем ответ
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseClone);
          });
          
        return response;
      })
      .catch(() => {
        // Если сеть недоступна, показываем из кэша
        return caches.match(event.request)
          .then((response) => {
            // Если страница найдена в кэше, возвращаем её
            if (response) {
              return response;
            }
            
            // Если запрос на страницу, возвращаем offline.html
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
            
            // Для остальных ресурсов просто возвращаем пустоту
            return new Response('', {
              status: 408,
              statusText: 'Нет соединения с интернетом'
            });
          });
      })
  );
});

// Обработка push-уведомлений
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body || 'Новое уведомление от GoodFit',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/app'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'GoodFit', options)
  );
});

// Нажатие на уведомление
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/app')
  );
});

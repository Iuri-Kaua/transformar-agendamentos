const CACHE_NAME = 'transformar-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
  console.log('Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.log('Service Worker: Erro ao fazer cache:', error);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Ativando...');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', function(event) {
  // Estratégia: Cache First para recursos estáticos
  if (event.request.url.includes('/static/') || 
      event.request.url.includes('.css') || 
      event.request.url.includes('.js') ||
      event.request.url.includes('.png') ||
      event.request.url.includes('.jpg') ||
      event.request.url.includes('.ico')) {
    
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Retornar do cache se disponível
          if (response) {
            return response;
          }
          
          // Caso contrário, buscar da rede
          return fetch(event.request).then(function(response) {
            // Verificar se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonar a resposta
            const responseToCache = response.clone();
            
            // Adicionar ao cache
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
        })
    );
  }
  // Estratégia: Network First para APIs
  else if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          // Se a requisição foi bem-sucedida, retornar a resposta
          if (response.status === 200) {
            return response;
          }
          
          // Se falhou, tentar buscar no cache
          return caches.match(event.request);
        })
        .catch(function() {
          // Se não há conexão, retornar resposta offline
          if (event.request.url.includes('/appointments')) {
            return new Response(JSON.stringify({
              success: false,
              message: 'Você está offline. Tente novamente quando tiver conexão.'
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Para outras requisições, tentar buscar no cache
          return caches.match(event.request);
        })
    );
  }
  // Estratégia: Cache First para páginas HTML
  else {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          }
          
          return fetch(event.request).then(function(response) {
            // Verificar se a resposta é válida
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Clonar e cachear a resposta
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
        })
        .catch(function() {
          // Se offline, retornar página principal do cache
          return caches.match('/');
        })
    );
  }
});

// Sincronização em background
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Sincronização em background');
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implementar sincronização de dados quando voltar online
  return Promise.resolve();
}

// Notificações push
self.addEventListener('push', function(event) {
  console.log('Service Worker: Notificação push recebida');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do Transformar',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalhes',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Transformar', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', function(event) {
  console.log('Service Worker: Clique em notificação');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // Abrir a aplicação
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('Service Worker: Carregado com sucesso');


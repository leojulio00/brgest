// This is the "Offline copy of pages" service worker

const CACHE = "pwabuilder-offline";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

// Versão do Service Worker
const version = '1.0.0';

// Evento de instalação do Service Worker
self.addEventListener('install', event => {
  // Faz a instalação do Service Worker
  event.waitUntil(
    caches.open(version)
      .then(cache => cache.addAll([
        '/index.html',
        '/404.html',
        '/offline.html',
        '/dashboard/index.html',
        '/dashboard/dashboard.html',
        '/dashboard/dashboard.js',
        '/dashboard/sidebars.css',
        '/dashboard/sidebars.js',
        '/assets/js/colaboradores/adicionaruser.js',
        '/assets/js/colaboradores/alterarSenhaUser.js',
        '/assets/js/colaboradores/dadosUser.js',
        '/assets/js/colaboradores/verColab.js',
        '/assets/js/layout/preloader.js',
        '/assets/js/layout/sidebarActions.js',
        '/assets/js/logico/app.js',
        '/assets/js/logico/firebaseConfig.js',
        '/assets/js/logico/fun.js',
        '/assets/js/logico/horaReg.js',
        '/assets/js/logico/prazoPlano.js',
        '/assets/js/login/autenticacao.js',
        '/assets/js/login/login.js',
        '/assets/js/login/logout.js',
        '/assets/js/login/userLogado.js',
        '/assets/js/login/userLogadoLogin.js',
        '/assets/js/mesas/mesas.js',
        '/assets/js/produtos/adicionarpedido.js',
        '/assets/js/produtos/adicionarprod.js',
        '/assets/js/produtos/entradaEstoque.js',
        '/assets/js/produtos/verPedidos.js',
        '/assets/js/produtos/verProd.js',
        '/assets/js/saldo/saldo.js',
        '/assets/js/saldo/tipoMoeda.js',
        '/assets/js/singup/singup.js',
        '/assets/js/vendas/regVenda.js',
        '/assets/js/vendas/verVendas.js',
        '/assets/css/styles.css',
        '/assets/css/btnSidebar.css',
        '/assets/css/buttons.css',
        '/assets/css/cards.css',
        '/assets/css/cardRegistarvendas.css',
        '/assets/css/chartDesempenho.css',
        '/assets/css/form-elements.css',
        '/assets/css/signin.css',
        '/assets/img/404error.svg',
        '/assets/img/BR Gest favicon 01.png',
        '/assets/img/BR Gest favicon 02.png',
        '/assets/img/BR Gest logo 01.png',
        '/assets/img/BR Gest logo 02.png',
        '/assets/img/BR Gest logo 03.png',
        '/assets/img/preloader.png',
        // Adicione mais recursos aqui, se necessário
      ]))
      .then(() => self.skipWaiting())
  );
});

// Evento de ativação do Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    // Verifica e atualiza automaticamente quando ativado
    self.clients.matchAll({ type: 'window' })
      .then(clients => {
        return Promise.all(
          clients.map(client => {
            return client.navigate(client.url);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Evento de fetch do Service Worker
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna o recurso do cache, se disponível
        }
        return fetch(event.request); // Faz a requisição para o servidor
      })
  );
});

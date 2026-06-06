// ============================================================
//  SERVICE WORKER — Óptica Tendencia Urbana
//  Estrategia: Cache-First con actualización en background
// ============================================================

const CACHE_VERSION = 'optica-tu-v1';
const OFFLINE_PAGE  = './offline.html';

// Recursos que se pre-cachean en la instalación
const PRECACHE = [
  // Páginas
  './index.html',
  './catalogo.html',
  './catalogo-FEMENINO.html',
  './catalogo-MASCULINO.html',
  './catalogo-INFANTIL.html',
  './login.html',
  './registro.html',
  './buscar.html',
  './coontacto.html',
  './offline.html',
  './manifest.json',

  // Estilos
  './inicio.css/estilos.css',
  './inicio.css/header.css',
  './inicio.css/slider.css',
  './inicio.css/footer.css',
  './inicio.css/responcividad.css',
  './inicio.css/estilo-catalogo.css',
  './inicio.css/auth.css',
  './inicio.css/buscar.css',
  './inicio.css/contacto.css',

  // Scripts
  './inicio.js/inicio.js',
  './inicio.js/Catalogo.js',
  './inicio.js/buscar.js',
  './inicio.js/sesion.js',

  // Iconos de navegación
  './iconos/compra.png',
  './iconos/facebook.png',
  './iconos/favorito.png',
  './iconos/instagram.png',
  './iconos/login.png',
  './iconos/lupa.png',

  // Imágenes de presentación (slider)
  './img/presentacion/imagen1.jpg',
  './img/presentacion/imagen2.jpg',
  './img/presentacion/imagen3.jpg',

  // Gafas — mujeres
  './img/gafas-mujeres/118-ROSADA-NEGRA.webp',
  './img/gafas-mujeres/123-ROSADO.webp',
  './img/gafas-mujeres/90-ROJO.webp',
  './img/gafas-mujeres/90ROJO.webp',

  // Gafas — niños
  './img/gafas-ninos/0001.webp',
  './img/gafas-ninos/0002.webp',
  './img/gafas-ninos/0003.webp',
  './img/gafas-ninos/0004.webp',
  './img/gafas-ninos/0005.webp',

  // Gafas — varones
  './img/gafas-varones/61-azul-verde.webp',
  './img/gafas-varones/SATELLITE-PLATA-NEGRA.webp',
  './img/gafas-varones/WESTON-DORADA-CAFE.webp',
  './img/gafas-varones/negros.webp',

  // Gafas — unisex
  './img/gafas-unisex/001.webp',
  './img/gafas-unisex/002.webp',
  './img/gafas-unisex/003.webp',
  './img/gafas-unisex/004.webp',
  './img/gafas-unisex/005.webp',

  // Iconos PWA — Android
  './img/android/launchericon-48x48.png',
  './img/android/launchericon-72x72.png',
  './img/android/launchericon-96x96.png',
  './img/android/launchericon-144x144.png',
  './img/android/launchericon-192x192.png',
  './img/android/launchericon-512x512.png',

  // Iconos PWA — Windows
  './img/windows/Square44x44Logo.scale-100.png',
  './img/windows/Square44x44Logo.scale-200.png',
  './img/windows/SmallTile.scale-100.png',
  './img/windows/StoreLogo.scale-100.png',
  './img/windows/Square150x150Logo.scale-100.png',
  './img/windows/Wide310x150Logo.scale-100.png',
  './img/windows/LargeTile.scale-100.png',
  './img/windows/SplashScreen.scale-100.png'
];

// ── INSTALL ──────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache =>
      // addAll individual para que un recurso faltante no rompa todo
      Promise.allSettled(PRECACHE.map(url => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH — Cache-First con actualización en background ──────
self.addEventListener('fetch', event => {
  // Solo peticiones GET sobre http/https
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {

      // Lanzar petición a red en background (stale-while-revalidate)
      const networkFetch = fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          caches.open(CACHE_VERSION).then(c => c.put(event.request, response.clone()));
        }
        return response;
      }).catch(() => null);

      // Si está en caché → devolver inmediatamente
      if (cached) return cached;

      // Si no está en caché → esperar red, o página offline
      return networkFetch.then(response => response || (
        event.request.destination === 'document'
          ? caches.match(OFFLINE_PAGE)
          : new Response('', { status: 408 })
      ));
    })
  );
});

// ── PUSH NOTIFICATIONS (preparado para uso futuro) ───────────
self.addEventListener('push', event => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Óptica Tendencia Urbana', {
      body   : data.body  || 'Tenemos novedades para ti',
      icon   : './img/android/launchericon-192x192.png',
      badge  : './img/android/launchericon-72x72.png',
      data   : { url: data.url || './index.html' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});

const CACHE_NAME = "optica-v6";

const urlsToCache = [
    "./",
    "./index.html",
    "./buscar.html",
    "./login.html",
    "./registro.html",
    "./catalogo.html",
    "./catalogo-FEMENINO.html",
    "./catalogo-INFANTIL.html",
    "./catalogo-MASCULINO.html",
    "./manifest.json",
    "./inicio.css/auth.css",
    "./inicio.css/buscar.css",
    "./inicio.css/estilo-catalogo.css",
    "./inicio.css/estilos.css",
    "./inicio.css/footer.css",
    "./inicio.css/header.css",
    "./inicio.css/responcividad.css",
    "./inicio.css/slider.css",
    "./inicio.js/buscar.js",
    "./inicio.js/Catalogo.js",
    "./inicio.js/db.js",
    "./inicio.js/inicio.js",
    "./inicio.js/sesion.js",
    "./iconos/compra.png",
    "./iconos/facebook.png",
    "./iconos/favorito.png",
    "./iconos/instagram.png",
    "./iconos/login.png",
    "./iconos/lupa.png",
    "./img/icono/app.png",
    "./img/icono/appPequeño.png",
    "./img/presentacion/imagen1.jpg",
    "./img/presentacion/imagen2.jpg",
    "./img/presentacion/imagen3.jpg",
    "./img/gafas-mujeres/90-ROJO.webp",
    "./img/gafas-mujeres/90ROJO.webp",
    "./img/gafas-mujeres/118-ROSADA-NEGRA.webp",
    "./img/gafas-mujeres/123-ROSADO.webp",
    "./img/gafas-ninos/0001.webp",
    "./img/gafas-ninos/0002.webp",
    "./img/gafas-ninos/0003.webp",
    "./img/gafas-ninos/0004.webp",
    "./img/gafas-ninos/0005.webp",
    "./img/gafas-unisex/001.webp",
    "./img/gafas-unisex/002.webp",
    "./img/gafas-unisex/003.webp",
    "./img/gafas-unisex/004.webp",
    "./img/gafas-unisex/005.webp",
    "./img/gafas-varones/61-azul-verde.webp",
    "./img/gafas-varones/61-azul-verde (1).webp",
    "./img/gafas-varones/negros.webp",
    "./img/gafas-varones/SATELLITE-PLATA-NEGRA.webp",
    "./img/gafas-varones/WESTON-DORADA-CAFE.webp"
];

// Instalar y pre-cachear recursos críticos
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Service Worker: Pre-cacheando archivos...");
            // Mapeamos cada URL a una promesa de cache.add para que si una falla, las demás continúen
            return Promise.allSettled(
                urlsToCache.map(url => cache.add(url))
            ).then(results => {
                const failed = results.filter(r => r.status === 'rejected');
                if (failed.length > 0) {
                    console.warn(`Service Worker: ${failed.length} archivos no pudieron cachearse.`);
                }
            });
        })
    );
    self.skipWaiting();
});

// Activar y limpiar versiones antiguas
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("Service Worker: Limpiando cache antiguo:", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Estrategia de Fetch: Cache First -> Network Fallback
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Si el recurso está en cache, lo devolvemos inmediatamente
            if (cachedResponse) {
                return cachedResponse;
            }

            // Si no está en cache, intentamos la red y lo guardamos dinámicamente
            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Fallback para cuando no hay internet y el recurso no está en cache
                if (event.request.mode === 'navigate' || 
                    (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
                    return caches.match("./index.html") || caches.match("./");
                }
            });
        })
    );
});
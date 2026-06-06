window.onload = function () {

    const slides = document.querySelectorAll(".slide");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    const categoryButtons = document.querySelectorAll(".categorias a, .menu-categorias a");
    const topButtons = document.querySelectorAll(".menu-superior a, .menu-extra a");
    const header = document.querySelector("header");

    let index = 0;
    let autoPlayInterval;

    function mostrarSlide(i) {
        slides.forEach(s => s.classList.remove("active"));
        slides[i].classList.add("active");
        index = i;
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            index++;
            if (index >= slides.length) index = 0;
            mostrarSlide(index);
        }, 6000); // Rotación lenta (6 segundos)
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // 👉 BOTÓN SIGUIENTE
    nextBtn.onclick = function () {
        index++;
        if (index >= slides.length) index = 0;
        mostrarSlide(index);
        startAutoPlay(); // Reiniciar el contador al interactuar
    };

    // 👉 BOTÓN ANTERIOR
    prevBtn.onclick = function () {
        index--;
        if (index < 0) index = slides.length - 1;
        mostrarSlide(index);
        startAutoPlay(); // Reiniciar el contador al interactuar
    };

    // 👉 BOTONES DE NAVEGACIÓN (Scroll suave y cambio de slider opcional)
    const allInteractiveButtons = [...categoryButtons, ...topButtons];
    
    allInteractiveButtons.forEach((btn, i) => {
        btn.onclick = function (e) {
            const text = btn.innerText.toUpperCase().trim();
            let targetId = "";

            // Mapeo de texto a ID de sección para scroll suave
            if (text.includes("MUJERES") || text.includes("FEMENINO")) targetId = "seccion-mujeres";
            else if (text.includes("MASCULINO") || text.includes("VARONES")) targetId = "seccion-varones";
            else if (text.includes("NIÑAS")) targetId = "seccion-ninas";
            else if (text.includes("NIÑOS") || text.includes("INFANTIL")) targetId = "seccion-ninos";
            else if (text.includes("CATÁLOGO")) targetId = "seccion-catalogo";
            else if (text.includes("INICIO")) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }

            // Si hay un target de sección, hacemos scroll suave
            if (targetId) {
                e.preventDefault();
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, 
                        behavior: "smooth"
                    });
                }
                return;
            }
        };
    });

    // Iniciar rotación automática
    startAutoPlay();


    // 🔥 EFECTO HEADER AL HACER SCROLL
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Ejecutar al cargar por si ya hay scroll


    // 🔍 LÓGICA DEL BUSCADOR EXPANDIBLE
    const activarBusqueda = document.getElementById("activar-busqueda");
    const cerrarBusqueda = document.getElementById("cerrar-busqueda");
    const buscadorExpandido = document.getElementById("buscador-pantalla-completa");
    const entradaBusqueda = document.querySelector(".entrada-busqueda-completa");

    if (activarBusqueda && cerrarBusqueda && buscadorExpandido) {
        activarBusqueda.onclick = function() {
            buscadorExpandido.classList.add("activo");
            setTimeout(() => {
                entradaBusqueda.focus(); // Pone el cursor automáticamente al abrir
            }, 300);
        };

        cerrarBusqueda.onclick = function() {
            buscadorExpandido.classList.remove("activo");
            entradaBusqueda.value = ""; // Limpia la búsqueda al cerrar
        };

        // Cerrar con la tecla Escape
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                buscadorExpandido.classList.remove("activo");
            }
        });
    }

    // 📱 LÓGICA DEL MENÚ MÓVIL
    const menuToggle = document.getElementById("menu-toggle");
    const menuLinks = document.querySelectorAll(".menu-movil a");

    // Solo cerramos el menú cuando se hace clic en un enlace interno
    menuLinks.forEach(link => {
        link.onclick = function() {
            if (menuToggle) {
                menuToggle.checked = false;
            }
        };
    });

};

// ============================================================
//  PWA — Registro del Service Worker, instalación y estados
//  Añadido automáticamente — no modificar el bloque anterior
// ============================================================

// ── 1. Registro del Service Worker ───────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('[PWA] Service Worker registrado. Scope:', reg.scope);

        // Detectar nueva versión disponible
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing;
          sw.addEventListener('statechange', () => {
            if (sw.state === 'installed' && navigator.serviceWorker.controller) {
              _pwa_mostrarActualizacion();
            }
          });
        });
      })
      .catch(err => console.error('[PWA] Error al registrar SW:', err));
  });
}

// ── 2. Banner "Instalar app" (Add to Home Screen) ────────────
let _pwa_deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _pwa_deferredPrompt = e;
  _pwa_mostrarBanner();
});

window.addEventListener('appinstalled', () => {
  _pwa_ocultarBanner();
  _pwa_deferredPrompt = null;
  console.log('[PWA] App instalada correctamente.');
});

function _pwa_mostrarBanner() {
  if (document.getElementById('pwa-install-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.innerHTML = `
    <div style="
      position:fixed; bottom:20px; left:50%; transform:translateX(-50%);
      background:#1a1a1a; color:#fff;
      padding:14px 18px; border-radius:14px;
      box-shadow:0 6px 24px rgba(0,0,0,.35);
      display:flex; align-items:center; gap:14px;
      z-index:9999; font-family:inherit;
      max-width:360px; width:calc(100% - 32px);
      animation:_pwaUp .4s ease;">
      <span style="font-size:28px;flex-shrink:0;">👓</span>
      <div style="flex:1;line-height:1.4;">
        <strong style="font-size:.9rem;">Instala la app</strong><br>
        <span style="font-size:.78rem;opacity:.75;">Accede desde tu pantalla de inicio</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;">
        <button id="pwa-btn-instalar" style="background:#fff;color:#1a1a1a;border:none;
          padding:6px 14px;border-radius:7px;cursor:pointer;font-weight:700;font-size:.82rem;">
          Instalar</button>
        <button id="pwa-btn-cerrar" style="background:transparent;color:rgba(255,255,255,.6);
          border:1px solid rgba(255,255,255,.25);
          padding:4px 14px;border-radius:7px;cursor:pointer;font-size:.78rem;">
          Ahora no</button>
      </div>
    </div>
    <style>
      @keyframes _pwaUp {
        from { transform:translateX(-50%) translateY(60px);opacity:0; }
        to   { transform:translateX(-50%) translateY(0);opacity:1; }
      }
    </style>`;
  document.body.appendChild(banner);

  document.getElementById('pwa-btn-instalar').addEventListener('click', async () => {
    if (!_pwa_deferredPrompt) return;
    _pwa_deferredPrompt.prompt();
    await _pwa_deferredPrompt.userChoice;
    _pwa_deferredPrompt = null;
    _pwa_ocultarBanner();
  });
  document.getElementById('pwa-btn-cerrar').addEventListener('click', _pwa_ocultarBanner);
}

function _pwa_ocultarBanner() {
  const b = document.getElementById('pwa-install-banner');
  if (b) b.remove();
}

// ── 3. Banner "Nueva versión disponible" ─────────────────────
function _pwa_mostrarActualizacion() {
  const n = document.createElement('div');
  n.innerHTML = `
    <div style="position:fixed;top:14px;right:14px;background:#16a34a;color:#fff;
      padding:11px 16px;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.25);
      z-index:9999;font-family:inherit;font-size:.88rem;
      display:flex;align-items:center;gap:12px;">
      🔄 Nueva versión disponible
      <button onclick="location.reload()" style="background:#fff;color:#16a34a;border:none;
        padding:5px 12px;border-radius:6px;cursor:pointer;font-weight:700;font-size:.82rem;">
        Actualizar</button>
    </div>`;
  document.body.appendChild(n);
}

// ── 4. Indicador visual de estado de conexión ────────────────
function _pwa_indicadorConexion(online) {
  let el = document.getElementById('pwa-status-bar');
  if (!el) {
    el = document.createElement('div');
    el.id = 'pwa-status-bar';
    el.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9998;'
      + 'padding:7px;text-align:center;font-family:inherit;'
      + 'font-size:.84rem;font-weight:600;transition:opacity .3s;';
    document.body.prepend(el);
  }
  if (online) {
    el.textContent = '✅  Conexión restaurada';
    el.style.cssText += 'background:#16a34a;color:#fff;';
    setTimeout(() => el.remove(), 3000);
  } else {
    el.textContent = '⚠️  Sin conexión — modo offline activo';
    el.style.cssText += 'background:#dc2626;color:#fff;';
  }
}

window.addEventListener('online',  () => _pwa_indicadorConexion(true));
window.addEventListener('offline', () => _pwa_indicadorConexion(false));

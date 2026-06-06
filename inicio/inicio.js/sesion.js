/**
 * sesion.js — Menú de usuario en el header
 * Incluir justo antes de </body>, DESPUÉS de db.js
 */

(function () {

    const SESION_KEY = 'optica_sesion';

    function sesionActual() {
        try { return JSON.parse(sessionStorage.getItem(SESION_KEY)); } catch(e) { return null; }
    }

    function cerrarSesion() {
        sessionStorage.removeItem(SESION_KEY);
        window.location.href = 'index.html';
    }

    function inyectarEstilos() {
        if (document.getElementById('sesion-styles')) return;
        const s = document.createElement('style');
        s.id = 'sesion-styles';
        s.textContent = `
            .sesion-wrap {
                position: relative;
                display: inline-flex;
                align-items: center;
            }
            .sesion-btn {
                background: none;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 4px 2px;
                font-family: 'DM Sans', sans-serif;
                font-size: 0.82rem;
                font-weight: 600;
                color: #111;
                white-space: nowrap;
                transition: color .2s;
                user-select: none;
            }
            .sesion-btn:hover { color: #e63946; }
            .sesion-btn img {
                width: 22px;
                height: 22px;
                object-fit: contain;
                pointer-events: none;
            }
            .sesion-nombre {
                max-width: 90px;
                overflow: hidden;
                text-overflow: ellipsis;
                pointer-events: none;
            }
            .sesion-flecha {
                font-size: 0.55rem;
                transition: transform .25s;
                color: #e63946;
                pointer-events: none;
            }
            .sesion-flecha.girado { transform: rotate(180deg); }

            .sesion-menu {
                position: absolute;
                top: calc(100% + 12px);
                right: 0;
                background: #fff;
                border-top: 3px solid #e63946;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                min-width: 200px;
                z-index: 99999;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-6px);
                transition: opacity .2s, transform .2s, visibility .2s;
            }
            .sesion-menu.abierto {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            .sesion-menu-saludo {
                padding: 14px 16px 10px;
                font-family: 'Bebas Neue', sans-serif;
                font-size: 1rem;
                letter-spacing: 1.5px;
                color: #111;
                border-bottom: 1px solid #eee;
            }
            .sesion-menu-saludo small {
                display: block;
                font-family: 'DM Sans', sans-serif;
                font-size: 0.73rem;
                font-weight: 400;
                letter-spacing: 0;
                color: #999;
                margin-top: 2px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .sesion-menu-item {
                display: block;
                width: 100%;
                text-align: left;
                padding: 11px 16px;
                font-family: 'DM Sans', sans-serif;
                font-size: 0.85rem;
                color: #111;
                text-decoration: none;
                background: none;
                border: none;
                cursor: pointer;
                transition: background .15s, color .15s;
                box-sizing: border-box;
            }
            .sesion-menu-item:hover { background: #f5f5f5; color: #e63946; }
            .sesion-menu-item--cerrar {
                border-top: 1px solid #eee;
                color: #e63946;
                font-weight: 600;
            }
        `;
        document.head.appendChild(s);
    }

    function construirWidget(sesion, srcIcono) {
        const primerNombre = sesion.nombre.split(' ')[0];

        const wrap = document.createElement('div');
        wrap.className = 'sesion-wrap';

        const btn = document.createElement('button');
        btn.className = 'sesion-btn';
        btn.type = 'button';

        btn.innerHTML = `
            <img src="${srcIcono}" alt="Mi cuenta">
            <span class="sesion-nombre">Hola, ${primerNombre}</span>
            <span class="sesion-flecha">▼</span>
        `;

        const menu = document.createElement('div');
        menu.className = 'sesion-menu';
        menu.setAttribute('role', 'menu');
        menu.innerHTML = `
            <div class="sesion-menu-saludo">
                MI CUENTA
                <small>${sesion.correo}</small>
            </div>
            <a href="#" class="sesion-menu-item" role="menuitem">👤 Mi perfil</a>
            <button type="button" class="sesion-menu-item sesion-menu-item--cerrar" id="btnCerrarSesion" role="menuitem">
                ↩ Cerrar sesión
            </button>
        `;

        wrap.appendChild(btn);
        wrap.appendChild(menu);

        const flecha = btn.querySelector('.sesion-flecha');

        /* Toggle al hacer click en el botón */
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const abierto = menu.classList.toggle('abierto');
            flecha.classList.toggle('girado', abierto);
            btn.setAttribute('aria-expanded', abierto);
        });

        /* Clicks dentro del menú no lo cierran */
        menu.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        /* Click fuera → cerrar */
        document.addEventListener('click', function () {
            menu.classList.remove('abierto');
            flecha.classList.remove('girado');
            btn.setAttribute('aria-expanded', 'false');
        });

        /* Escape → cerrar */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                menu.classList.remove('abierto');
                flecha.classList.remove('girado');
            }
        });

        /* Cerrar sesión */
        menu.querySelector('#btnCerrarSesion').addEventListener('click', function (e) {
            e.stopPropagation();
            cerrarSesion();
        });

        return wrap;
    }

    function init() {
        const sesion = sesionActual();

        /* Buscar div.iconos dentro de .barra-principal */
        const contenedor = document.querySelector('.barra-principal .iconos');
        if (!contenedor) return;

        /* Buscar la imagen de login */
        const imgLogin = contenedor.querySelector('img[src*="login"]');
        if (!imgLogin) return;

        const srcIcono = imgLogin.src;

        /*
         * El elemento a reemplazar puede ser:
         *   - la <img> directamente  (sin sesión, sin enlace)
         *   - un <a> que envuelve la <img>  (como en index.html actual)
         * En ambos casos reemplazamos el nodo más externo.
         */
        const padre = imgLogin.parentNode;
        // Si el padre es un <a> dentro del contenedor de iconos, reemplazamos el <a>
        const nodoARemplazar = (padre.tagName === 'A' && padre.parentNode === contenedor)
            ? padre
            : imgLogin;

        if (!sesion) {
            /* Sin sesión: asegurarse de que haya un enlace a login.html */
            if (nodoARemplazar.tagName !== 'A') {
                const a = document.createElement('a');
                a.href = 'login.html';
                a.setAttribute('aria-label', 'Iniciar sesión');
                nodoARemplazar.parentNode.insertBefore(a, nodoARemplazar);
                a.appendChild(nodoARemplazar);
            } else {
                nodoARemplazar.href = 'login.html';
            }
            return;
        }

        /* Con sesión: reemplazar el nodo completo por el widget */
        inyectarEstilos();
        const widget = construirWidget(sesion, srcIcono);
        contenedor.replaceChild(widget, nodoARemplazar);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

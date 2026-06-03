// ============================================
//  BUSCAR.JS — Óptica Tendencia Urbana
//  Arquitectura: clase BuscarApp
// ============================================

const PRODUCTOS = [
    // --- MUJER ---
    { nombre: "MOD. 90ROJO",    descripcion: "Acetato Redonda Carey Oliva",            precio: 250, categoria: "mujer",  imagen: "img/gafas-mujeres/90rojo.webp"            },
    { nombre: "MOD. 90-ROJO",   descripcion: "Acetato Circular Fucsia Translúcido",     precio: 280, categoria: "mujer",  imagen: "img/gafas-mujeres/90-ROJO.webp"           },
    { nombre: "MOD. 118",       descripcion: "Metálica Ovalada Bicolor Rosa-Negro",     precio: 300, categoria: "mujer",  imagen: "img/gafas-mujeres/118-ROSADA-NEGRA.webp"  },
    { nombre: "MOD. 123",       descripcion: "Acetato Cat-Eye Floral Rosado",           precio: 320, categoria: "mujer",  imagen: "img/gafas-mujeres/123-ROSADO.webp"        },
    // --- NIÑOS ---
    { nombre: "MOD. 0001",      descripcion: "Acetato Rectangular Azul Cristal",        precio: 150, categoria: "niños",  imagen: "img/gafas-ninos/0001.webp"                },
    { nombre: "MOD. 0002",      descripcion: "Acetato Rectangular Negro-Fucsia",        precio: 150, categoria: "niños",  imagen: "img/gafas-ninos/0002.webp"                },
    { nombre: "MOD. 0003",      descripcion: "Acetato Oval Azul Celeste",               precio: 140, categoria: "niños",  imagen: "img/gafas-ninos/0003.webp"                },
    { nombre: "MOD. 0004",      descripcion: "Acetato Rectangular Violeta",             precio: 150, categoria: "niños",  imagen: "img/gafas-ninos/0004.webp"                },
    { nombre: "MOD. 0005",      descripcion: "Acetato Rectangular Negro",               precio: 130, categoria: "niños",  imagen: "img/gafas-ninos/0005.webp"                },
    // --- UNISEX ---
    { nombre: "MOD. 001",       descripcion: "Acetato Rectangular Gris Mármol",         precio: 300, categoria: "unisex", imagen: "img/gafas-unisex/001.webp"                },
    { nombre: "MOD. 002",       descripcion: "Acetato Circular Gris Azulado",           precio: 310, categoria: "unisex", imagen: "img/gafas-unisex/002.webp"                },
    { nombre: "MOD. 003",       descripcion: "Acetato Rectangular Gris Cristal",        precio: 290, categoria: "unisex", imagen: "img/gafas-unisex/003.webp"                },
    { nombre: "MOD. 004",       descripcion: "Acetato Cuadrada Negro Clásico",          precio: 280, categoria: "unisex", imagen: "img/gafas-unisex/004.webp"                },
    { nombre: "MOD. 005",       descripcion: "Acetato Cat-Eye Negro",                   precio: 300, categoria: "unisex", imagen: "img/gafas-unisex/005.webp"                },
    // --- VARÓN ---
    { nombre: "MOD. 61-AV",     descripcion: "Metal Rectangular Ultrafina Azul Pizarra",precio: 360, categoria: "varón",  imagen: "img/gafas-varones/61-azul-verde.webp"     },
    { nombre: "MOD. NEGROS",    descripcion: "Acetato Cuadrada Solar Negro",             precio: 400, categoria: "varón",  imagen: "img/gafas-varones/negros.webp"            },
    { nombre: "MOD. SATELLITE", descripcion: "Metal Semirrimless Plata-Negro",           precio: 350, categoria: "varón",  imagen: "img/gafas-varones/SATELLITE-PLATA-NEGRA.webp" },
    { nombre: "MOD. WESTON",    descripcion: "Metal Full-Rim Dorado Carey Café",         precio: 420, categoria: "varón",  imagen: "img/gafas-varones/WESTON-DORADA-CAFE.webp"},
];

// ============================================
class BuscarApp {

    constructor() {
        this.carrito       = [];
        this.debounceTimer = null;
        this.menuAbierto   = false;

        this._bindDOM();
        this._bindEventos();
        this._cargarCarrito();
        this.filtrar();
    }

    // ── DOM ──────────────────────────────────
    _bindDOM() {
        this.contenedor    = document.getElementById("productos");
        this.contador      = document.getElementById("contador");
        this.input         = document.getElementById("inputBusqueda");
        this.orden         = document.getElementById("orden");
        this.btnBuscar     = document.getElementById("btnBuscar");
        this.btnLimpiar    = document.getElementById("btnLimpiar");
        this.formSub       = document.getElementById("formSuscripcion");
        this.badgeCarrito  = document.getElementById("carrito-contador");
        this.checkboxes    = document.querySelectorAll("#grupo-genero input[type='checkbox']");
        // Carrito
        this.carritoBtn    = document.getElementById("carritoBtn");
        this.carritoPanel  = document.getElementById("carritoPanel");
        this.carritoCerrar = document.getElementById("carritoCerrar");
        this.carritoLista  = document.getElementById("carritoLista");
        this.carritoFooter = document.getElementById("carritoFooter");
        // Overlay carrito
        this.overlay = document.createElement("div");
        this.overlay.className = "carrito-overlay";
        document.body.appendChild(this.overlay);
        // Menú móvil
        this.menuBtn     = document.getElementById("menuBtn");
        this.menuCerrar  = document.getElementById("menuCerrar");
        this.menuOverlay = document.getElementById("menuOverlay");
    }

    // ── EVENTOS ──────────────────────────────
    _bindEventos() {
        // Buscador
        this.input?.addEventListener("input", () => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => this.filtrar(), 250);
        });
        this.btnBuscar?.addEventListener("click", () => this.filtrar());
        this.orden?.addEventListener("change",    () => this.filtrar());
        this.checkboxes.forEach(cb => cb.addEventListener("change", () => this.filtrar()));
        this.btnLimpiar?.addEventListener("click", () => this._limpiar());

        // Menú móvil
        this.menuBtn?.addEventListener("click",   () => this._toggleMenu());
        this.menuBtn?.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this._toggleMenu(); }
        });
        this.menuCerrar?.addEventListener("click",  () => this._cerrarMenu());
        // Click en el overlay (fuera del panel lateral) cierra el menú
        this.menuOverlay?.addEventListener("click", e => {
            if (!e.target.closest(".menu-lateral")) this._cerrarMenu();
        });

        // Carrito
        this.carritoBtn?.addEventListener("click",   () => this._togglePanel());
        this.carritoBtn?.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this._togglePanel(); }
        });
        this.carritoCerrar?.addEventListener("click", () => this._cerrarPanel());
        this.overlay?.addEventListener("click",       () => this._cerrarPanel());

        // Controles del panel carrito (delegation)
        this.carritoLista?.addEventListener("click", e => {
            const btn = e.target.closest("button[data-accion]");
            if (!btn) return;
            const { accion, nombre } = btn.dataset;
            if (accion === "sumar")    this._cambiarCantidad(nombre,  1);
            if (accion === "restar")   this._cambiarCantidad(nombre, -1);
            if (accion === "eliminar") this._eliminarItem(nombre);
        });

        // Botones "+ Carrito" en el grid (delegation)
        this.contenedor?.addEventListener("click", e => {
            const btn = e.target.closest(".btn-agregar");
            if (btn) this._agregarAlCarrito(btn.dataset.nombre);
        });

        // Suscripción
        this.formSub?.addEventListener("submit", e => {
            e.preventDefault();
            this._procesarSuscripcion();
        });

        // Cerrar panel carrito con Escape
        document.addEventListener("keydown", e => {
            if (e.key === "Escape") {
                this._cerrarPanel();
                this._cerrarMenu();
            }
        });
    }

    // ── FILTRAR ──────────────────────────────
    filtrar() {
        const texto = this.input.value.toLowerCase().trim();
        const generos = [...this.checkboxes]
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        let lista = PRODUCTOS.filter(p => {
            const coincideTexto =
                !texto ||
                p.nombre.toLowerCase().includes(texto)      ||
                p.descripcion.toLowerCase().includes(texto) ||
                p.categoria.toLowerCase().includes(texto);
            const coincideGenero =
                generos.length === 0 || generos.includes(p.categoria);
            return coincideTexto && coincideGenero;
        });

        switch (this.orden.value) {
            case "asc":  lista.sort((a, b) => a.precio - b.precio); break;
            case "desc": lista.sort((a, b) => b.precio - a.precio); break;
        }

        this._renderizar(lista);
    }

    // ── RENDERIZAR CARDS ─────────────────────
    _renderizar(lista) {
        this.contenedor.innerHTML = "";
        const total = lista.length;
        this.contador.innerHTML =
            `Productos (<b>${total}</b>) &nbsp;·&nbsp; Se muestran <b>${total}</b> resultados`;

        if (total === 0) {
            this.contenedor.innerHTML = `
                <div class="vacio">
                    <div class="vacio-icono">🔍</div>
                    <p>No se encontraron resultados para tu búsqueda</p>
                </div>`;
            return;
        }

        const fragment = document.createDocumentFragment();
        lista.forEach((p, i) => {
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("role", "listitem");
            card.style.animationDelay = `${i * 28}ms`;
            card.innerHTML = `
                <div class="card-img">
                    <img src="${p.imagen}" alt="${p.nombre} — ${p.descripcion}" loading="lazy">
                    <span class="card-badge">${p.categoria}</span>
                </div>
                <div class="card-nombre">${p.nombre}</div>
                <div class="card-precio">Bs. ${p.precio.toFixed(2)}</div>
                <div class="card-desc">${p.descripcion}</div>
                <button class="btn-agregar" type="button"
                        data-nombre="${p.nombre}"
                        aria-label="Agregar ${p.nombre} al carrito">
                    + Carrito
                </button>`;
            fragment.appendChild(card);
        });
        this.contenedor.appendChild(fragment);
    }

    // ── MENÚ MÓVIL ───────────────────────────
    _toggleMenu() {
        this.menuAbierto ? this._cerrarMenu() : this._abrirMenu();
    }
    _abrirMenu() {
        this.menuAbierto = true;
        this.menuBtn?.classList.add("active");
        this.menuBtn?.setAttribute("aria-expanded", "true");
        this.menuOverlay?.classList.add("active");
        document.body.style.overflow = "hidden";
    }
    _cerrarMenu() {
        this.menuAbierto = false;
        this.menuBtn?.classList.remove("active");
        this.menuBtn?.setAttribute("aria-expanded", "false");
        this.menuOverlay?.classList.remove("active");
        document.body.style.overflow = "";
    }

    // ── PANEL CARRITO ────────────────────────
    _togglePanel() {
        this.carritoPanel.hidden ? this._abrirPanel() : this._cerrarPanel();
    }
    _abrirPanel() {
        this.carritoPanel.hidden = false;
        this.overlay.classList.add("activo");
        this._renderizarPanel();
    }
    _cerrarPanel() {
        this.carritoPanel.hidden = true;
        this.overlay.classList.remove("activo");
    }
    _renderizarPanel() {
        this.carritoLista.innerHTML  = "";
        this.carritoFooter.innerHTML = "";

        if (this.carrito.length === 0) {
            this.carritoLista.innerHTML = `
                <div class="carrito-vacio">
                    <span>🛒</span>
                    <p>Tu carrito está vacío</p>
                </div>`;
            return;
        }

        const fragment = document.createDocumentFragment();
        let total = 0;
        this.carrito.forEach(item => {
            total += item.precio * item.cantidad;
            const div = document.createElement("div");
            div.className = "carrito-item";
            div.innerHTML = `
                <div class="carrito-item-info">
                    <div class="carrito-item-nombre">${item.nombre}</div>
                    <div class="carrito-item-precio">Bs. ${(item.precio * item.cantidad).toFixed(2)}</div>
                </div>
                <div class="carrito-item-controles">
                    <button data-accion="restar"   data-nombre="${item.nombre}" type="button" aria-label="Reducir cantidad">−</button>
                    <span class="carrito-item-cantidad">${item.cantidad}</span>
                    <button data-accion="sumar"    data-nombre="${item.nombre}" type="button" aria-label="Aumentar cantidad">+</button>
                </div>
                <button class="carrito-item-eliminar" data-accion="eliminar"
                        data-nombre="${item.nombre}" type="button" aria-label="Eliminar">✕</button>`;
            fragment.appendChild(div);
        });
        this.carritoLista.appendChild(fragment);
        this.carritoFooter.innerHTML = `
            <div class="carrito-total">
                <span>Total</span>
                <span>Bs. ${total.toFixed(2)}</span>
            </div>
            <button class="carrito-checkout" type="button">Proceder al pago</button>`;
    }

    // ── CARRITO LÓGICA ───────────────────────
    _agregarAlCarrito(nombre) {
        const item = this.carrito.find(p => p.nombre === nombre);
        if (item) {
            item.cantidad++;
        } else {
            const prod = PRODUCTOS.find(p => p.nombre === nombre);
            if (!prod) return;
            this.carrito.push({ nombre, cantidad: 1, precio: prod.precio });
        }
        this._actualizarBadge();
        this._guardarCarrito();
        if (!this.carritoPanel.hidden) this._renderizarPanel();
    }
    _cambiarCantidad(nombre, delta) {
        const item = this.carrito.find(p => p.nombre === nombre);
        if (!item) return;
        item.cantidad += delta;
        if (item.cantidad <= 0) this._eliminarItem(nombre);
        else { this._actualizarBadge(); this._guardarCarrito(); this._renderizarPanel(); }
    }
    _eliminarItem(nombre) {
        this.carrito = this.carrito.filter(p => p.nombre !== nombre);
        this._actualizarBadge(); this._guardarCarrito(); this._renderizarPanel();
    }
    _actualizarBadge() {
        if (!this.badgeCarrito) return;
        const total = this.carrito.reduce((acc, p) => acc + p.cantidad, 0);
        this.badgeCarrito.textContent = total;
        this.badgeCarrito.style.display = total > 0 ? "flex" : "none";
    }
    _guardarCarrito() {
        try { localStorage.setItem("carrito_optica", JSON.stringify(this.carrito)); } catch {}
    }
    _cargarCarrito() {
        try {
            const data = JSON.parse(localStorage.getItem("carrito_optica"));
            if (Array.isArray(data)) { this.carrito = data; this._actualizarBadge(); }
        } catch { this.carrito = []; }
    }

    // ── LIMPIAR ──────────────────────────────
    _limpiar() {
        this.input.value = "";
        this.orden.value = "default";
        this.checkboxes.forEach(cb => cb.checked = false);
        this.filtrar();
    }

    // ── SUSCRIPCIÓN ──────────────────────────
    _procesarSuscripcion() {
        const emailInput = this.formSub.querySelector("input[type='email']");
        const email = emailInput?.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!email || !emailRegex.test(email)) { emailInput?.focus(); return; }
        console.log("Suscripción:", email);
        alert(`✅ ¡Suscrito correctamente con ${email}!`);
        this.formSub.reset();
    }
}

// ── INIT ─────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => { new BuscarApp(); });
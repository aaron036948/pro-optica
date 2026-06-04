document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-lupa');
    const imgZoom = document.getElementById('imagen-zoom');
    const btnCerrar = document.querySelector('.cerrar-lupa');
    // Selecciona todas tus tarjetas de catálogo
    document.querySelectorAll('.car-catalogo').forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.querySelector('img').src; // Captura la imagen de la card
            imgZoom.src = imgSrc; // La pone en el modal
            modal.style.display = 'flex'; // Muestra el modal
        });
    });

    // Cerrar al tocar la X o fuera de la imagen
    btnCerrar.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };
    // Seleccionamos todas las cards que usan tu nueva clase unificada
    const tarjetas = document.querySelectorAll('.class-catalogo');

    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', (e) => {
            // Evitamos que el clic en un enlace (como en Nuestras Colecciones) 
            // interfiera con la apertura del modal si así lo deseas
            // e.preventDefault(); 

            const imagenOriginal = tarjeta.querySelector('img');
            if (imagenOriginal) {
                imgZoom.src = imagenOriginal.src; // Captura la ruta de la imagen
                modal.style.display = 'flex'; // Muestra el modal
                document.body.style.overflow = 'hidden'; // Bloquea el scroll de la página
            }
        });
    });

    // Función para cerrar el modal
    const cerrarModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Devuelve el scroll a la página
    };

    btnCerrar.addEventListener('click', cerrarModal);

    // Cerrar si se hace clic fuera de la imagen (en el fondo oscuro)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModal();
        }
    });
});








// 1. Guardamos todo tu HTML original idéntico en una variable de texto
const menuHTML = `
<input type="checkbox" id="menu-toggle"><!-- ACTIVAR MENU-MOVIl -->
    <div class="capa-oscura"></div>

    <div class="menu-movil" id="menu-desplegable">
        <label for="menu-toggle" class="cerrar" id="boton-cerrar-menu">✕</label>

            <!-- contenido de menu-movil -->
            <nav class="menu-categorias">
                <a href="./index.html">TODOS</a>
                <a href="./catalogo-FEMENINO.html">FEMENINO</a>
                <a href="./catalogo-MASCULINO.html">MASCULINO</a>
                <a href="./catalogo-INFANTIL.html">NIÑOS</a>
                <a href="#">CONÓCENOS</a>
            </nav>
            <nav class="menu-extra">
                <a href="index.html">Inicio</a>
                <a href="catalogo.html">Catálogo</a>
                <a href="#">Contacto</a>
                <a href="buscar.html">Buscar</a>
            </nav>

            <nav class="redes-sociales-movil">
                <a href="#"><img src="iconos/instagram.png" alt="Instagram"></a>
                <a href="#"><img src="iconos/facebook.png" alt="Facebook"></a>
            </nav>
    </div>

    <div class="barra-superior">
        <nav class="menu-superior">
            <a href="index.html">Inicio</a>
            <a href="catalogo.html">Catálogo</a>
            <a href="#">Contacto</a>
            <a href="buscar.html">Buscar</a>
        </nav>

        <nav class="redes-sociales">
            <img src="iconos/instagram.png">
            <img src="iconos/facebook.png">
        </nav>
    </div>

    <div class="barra-principal">

        <label for="menu-toggle" class="boton-menu">☰</label>

        <div class="contenedor-buscador">
            <div class="buscador" id="activar-busqueda">
                <img src="iconos/lupa.png" class="icono">
            </div>

            <!-- Capa del buscador que cubre el header -->
            <div class="buscador-expandido" id="buscador-pantalla-completa">
                <button class="boton-atras" id="cerrar-busqueda">←</button>
                <input type="text" placeholder="Buscar productos..." class="entrada-busqueda-completa">
                <img src="iconos/lupa.png" class="icono-busqueda">
            </div>
        </div>

        <div class="centro">
            <h2 class="logo">ÓPTICA TENDENCIA URBANA</h2>

            <nav class="categorias">
                <a href="./catalogo.html">TODOS</a>
                <a href="./catalogo-FEMENINO.html">FEMENINO</a>
                <a href="./catalogo-MASCULINO.html">MASCULINO</a>
                <a href="./catalogo-INFANTIL.html">NIÑOS</a>
                <a href="#">CONÓCENOS</a>
            </nav>
        </div>

        <div class="iconos">
            <img src="iconos/favorito.png">
            <img src="iconos/login.png">
            <img src="iconos/compra.png">
        </div>

    </div>
`;

// 2. Buscamos el lugar en el HTML usando su ID único
const lugarDondeInsertar = document.getElementById("header-sitio");

// 3. Insertamos el menú directamente en ese lugar
lugarDondeInsertar.innerHTML = menuHTML;






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
        if (slides.length > 0) { // Protección para evitar errores si no hay slides
            slides.forEach(s => s.classList.remove("active"));
            slides[i].classList.add("active");
            index = i;
        }
    }

    function startAutoPlay() {
        if (slides.length > 0) {
            stopAutoPlay();
            autoPlayInterval = setInterval(() => {
                index++;
                if (index >= slides.length) index = 0;
                mostrarSlide(index);
            }, 6000); 
        }
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // 🔒 PROTECCIÓN DEL SLIDER (Solo se ejecuta si existen los botones en la página)
    if (nextBtn && prevBtn && slides.length > 0) {
        // 👉 BOTÓN SIGUIENTE
        nextBtn.onclick = function () {
            index++;
            if (index >= slides.length) index = 0;
            mostrarSlide(index);
            startAutoPlay(); 
        };

        // 👉 BOTÓN ANTERIOR
        prevBtn.onclick = function () {
            index--;
            if (index < 0) index = slides.length - 1;
            mostrarSlide(index);
            startAutoPlay(); 
        };

        startAutoPlay(); // Iniciar autoplay si estamos en el Index
    }


    // 🔥 EFECTO HEADER AL HACER SCROLL (Solo si hay header)
    function handleScroll() {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 


    // 🔍 LÓGICA DEL BUSCADOR EXPANDIBLE
    const activarBusqueda = document.getElementById("activar-busqueda");
    const cerrarBusqueda = document.getElementById("cerrar-busqueda");
    const buscadorExpandido = document.getElementById("buscador-pantalla-completa");
    const entradaBusqueda = document.querySelector(".entrada-busqueda-completa");

    if (activarBusqueda && cerrarBusqueda && buscadorExpandido) {
        activarBusqueda.onclick = function() {
            buscadorExpandido.classList.add("activo");
            setTimeout(() => {
                entradaBusqueda.focus(); 
            }, 300);
        };

        cerrarBusqueda.onclick = function() {
            buscadorExpandido.classList.remove("activo");
            entradaBusqueda.value = ""; 
        };

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                buscadorExpandido.classList.remove("activo");
            }
        });
    }

    // 📱 LÓGICA DEL MENÚ MÓVIL (Sin preventDefault)
    const menuToggle = document.getElementById("menu-toggle");
    const menuLinks = document.querySelectorAll(".menu-movil a");

    menuLinks.forEach(link => {
        link.onclick = function() {
            if (menuToggle) {
                menuToggle.checked = false;
            }
        };
    });

};
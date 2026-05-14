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
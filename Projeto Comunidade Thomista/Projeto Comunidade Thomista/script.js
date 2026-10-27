// Botão hamburguer — abre/fecha o menu da navbar em telas móveis.
// Fecha automaticamente ao clicar em um link, ao clicar fora do menu,
// ao pressionar Esc, ou caso a tela volte a ficar larga (desktop).
(function () {
    var toggle = document.getElementById("navbarToggle");
    var menu = document.getElementById("navbarTitles");

    if (!toggle || !menu) {
        return;
    }

    function openMenu() {
        menu.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Fechar menu");
    }

    function closeMenu() {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
    }

    function isOpen() {
        return menu.classList.contains("is-open");
    }

    toggle.addEventListener("click", function () {
        if (isOpen()) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Fecha o menu ao escolher um item de navegação.
    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    // Fecha ao clicar fora do menu e do botão.
    document.addEventListener("click", function (event) {
        if (!isOpen()) {
            return;
        }
        if (!menu.contains(event.target) && !toggle.contains(event.target)) {
            closeMenu();
        }
    });

    // Fecha com a tecla Esc.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && isOpen()) {
            closeMenu();
            toggle.focus();
        }
    });

    // Fecha automaticamente se a janela voltar ao layout desktop.
    window.addEventListener("resize", function () {
        if (window.innerWidth > 768 && isOpen()) {
            closeMenu();
        }
    });
})();

// Revela as seções suavemente conforme entram na tela.
// Respeita usuários que preferem menos animação.

(function () {
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var sections = document.querySelectorAll(".reveal");

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        return;
    }

    sections.forEach(function (el) {
        el.style.animationPlayState = "paused";
        el.style.opacity = "0";
    });

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "";
                    entry.target.style.animationPlayState = "running";
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    sections.forEach(function (el) {
        observer.observe(el);
    });
})();

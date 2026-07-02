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

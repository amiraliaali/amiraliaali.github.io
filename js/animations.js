(function () {
    'use strict';

    /* ── Stagger: add progressive transition-delay to sibling items ── */
    function stagger(parentSel, childSel, ms) {
        document.querySelectorAll(parentSel).forEach(function (parent) {
            parent.querySelectorAll(':scope > ' + childSel).forEach(function (el, i) {
                el.style.transitionDelay = (i * ms) + 'ms';
            });
        });
    }
    stagger('.timeline-wrap', '.timeline-item', 110);
    stagger('.projects-wrap', '.project-card',  85);
    stagger('.certs-wrap',    '.cert-card',      85);
    stagger('.skills-wrap',   '.skills-card',    70);

    /* ── Scroll-reveal observer (handles .reveal and .fade-in) ─────── */
    var revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.classList.add('visible');
            revealIO.unobserve(e.target);
        });
    }, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' });

    document.querySelectorAll('.reveal, .fade-in').forEach(function (el) {
        revealIO.observe(el);
    });

    /* ── Skill bars: animate width 0 → data-width on scroll ────────── */
    var barIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('.bar-fill[data-width]').forEach(function (bar, i) {
                setTimeout(function () { bar.style.width = bar.dataset.width; }, i * 70 + 180);
            });
            barIO.unobserve(e.target);
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.skills-card').forEach(function (c) { barIO.observe(c); });

    /* ── Counter animation for stats strip ──────────────────────────── */
    function animCount(el) {
        var target = parseInt(el.dataset.count, 10);
        var suffix = el.dataset.suffix || '';
        var dur    = 1500;
        var t0     = performance.now();
        (function tick() {
            var p   = Math.min((performance.now() - t0) / dur, 1);
            var val = Math.round(target * (1 - Math.pow(1 - p, 3)));
            el.textContent = val + suffix;
            if (p < 1) requestAnimationFrame(tick);
        }());
    }

    var cntIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('[data-count]').forEach(animCount);
            cntIO.unobserve(e.target);
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.stats-strip').forEach(function (el) { cntIO.observe(el); });

    /* ── Header: subtle opacity fade + parallax as you scroll past ─── */
    var hdr = document.querySelector('header');
    if (hdr) {
        window.addEventListener('scroll', function () {
            var ratio = Math.min(window.scrollY / hdr.offsetHeight, 1);
            hdr.style.opacity    = String(1 - ratio * 0.18);
            hdr.style.transform  = 'translateY(' + (window.scrollY * 0.18) + 'px)';
        }, { passive: true });
    }
}());

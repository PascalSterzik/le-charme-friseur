/* ============================================================
   Friseursalon Le Charme - Premium JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── References ──────────────────────────────────────────────
  const hamburger      = document.getElementById('hamburger');
  const nav            = document.getElementById('nav');
  const header         = document.getElementById('header');
  const scrollProgress = document.querySelector('.scroll-progress');
  const backToTop      = document.getElementById('backToTop');
  const mobileBar      = document.querySelector('.mobile-sticky-bar');

  // ── 1. Mobile Navigation Toggle ────────────────────────────
  if (hamburger && nav) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close on nav link click
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  }

  // ── 2-4. Unified Scroll Handler (rAF) ─────────────────────
  let lastScrollY = 0;
  let ticking     = false;

  function onScroll() {
    const scrollY    = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct  = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    // Scroll progress bar
    if (scrollProgress) {
      scrollProgress.style.width = scrollPct + '%';
    }

    // Header .scrolled class
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide/show on scroll direction (only past 100px)
      if (scrollY > 100) {
        const delta = scrollY - lastScrollY;
        if (delta > 5) {
          // Scrolling down
          header.classList.add('nav-hidden');
          // Close mobile menu when header hides
          if (nav) nav.classList.remove('open');
          if (hamburger) hamburger.classList.remove('active');
        } else if (delta < -5) {
          // Scrolling up
          header.classList.remove('nav-hidden');
        }
      } else {
        header.classList.remove('nav-hidden');
      }
    }

    // Back to top button
    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Mobile sticky bar
    if (mobileBar) {
      if (scrollY < 200) {
        mobileBar.classList.remove('visible');
      } else {
        mobileBar.classList.add('visible');
      }
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // Run once on load
  onScroll();

  // ── 5. IntersectionObserver: Fade-in & Stagger ─────────────
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el));

  const staggerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        Array.from(entry.target.children).forEach((child, i) => {
          child.style.transitionDelay = (i * 0.12) + 's';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stagger-parent').forEach((el) => staggerObserver.observe(el));

  // ── 6. Smooth Scroll for Anchor Links ──────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── 7. FAQ Accordion ───────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach((question) => {
    question.addEventListener('click', () => {
      const parentItem = question.closest('.faq-item');

      // Close all other items first
      document.querySelectorAll('.faq-item').forEach((item) => {
        if (item !== parentItem) {
          item.classList.remove('open');
        }
      });

      // Toggle current
      parentItem.classList.toggle('open');
    });
  });

  // ── 8. Contact Form Handler ────────────────────────────────
  const contactForm = document.querySelector('form[action="#"]');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"], input[type="submit"]');
      if (!btn) return;

      const originalText = btn.textContent;
      const originalBg   = btn.style.background;
      btn.textContent = 'Wird gesendet...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'Nachricht gesendet \u2713';
        btn.style.background = 'var(--accent, #b08d57)';
        btn.disabled = false;

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = originalBg;
          contactForm.reset();
        }, 3000);
      }, 1200);
    });
  }

  // ── 9. Back to Top Button ──────────────────────────────────
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── 11. Opening Hours: Highlight Today ─────────────────────
  const hoursTable = document.querySelector('.hours-table');
  if (hoursTable) {
    const rows = hoursTable.querySelectorAll('tr');
    const jsDay = new Date().getDay(); // 0=Sun, 1=Mon ... 6=Sat
    // Table order: Mo(0) Di(1) Mi(2) Do(3) Fr(4) Sa(5) So(6)
    // Mapping: JS 1->0, 2->1, 3->2, 4->3, 5->4, 6->5, 0->6
    const rowIndex = jsDay === 0 ? 6 : jsDay - 1;
    if (rows[rowIndex]) {
      rows[rowIndex].classList.add('today');
    }
  }

});

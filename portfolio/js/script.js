document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar scroll shadow ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 20;
    navbar.classList.toggle('is-scrolled', scrolled);
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile hamburger menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  const closeMenu = () => {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Active section highlight (navbar + orbit nav) ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const orbitLinks = document.querySelectorAll('.orbit-link');

  const setActive = (id) => {
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
    orbitLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
  };

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => sectionObserver.observe(section));

    /* ---------- Scroll reveal animations ---------- */
    const revealTargets = document.querySelectorAll(
      '.about, .skill-card, .timeline, .project-card, .contact__info, .contact__form'
    );
    revealTargets.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Contact form (front-end only) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        status.textContent = 'Please fill in every field before sending.';
        status.className = 'form-status error';
        return;
      }
      if (!emailPattern.test(email)) {
        status.textContent = 'Please enter a valid email address.';
        status.className = 'form-status error';
        return;
      }

      status.textContent = `Thanks, ${name.split(' ')[0]} — your message has been noted. I'll get back to you soon.`;
      status.className = 'form-status success';
      form.reset();
    });
  }
});



(function () {
  'use strict';

  /* ── Cached elements ── */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const progressBar = document.getElementById('progressBar');
  const backToTop   = document.getElementById('backToTop');
  const footerTopBtn= document.getElementById('footerTopBtn');
  const footerYear  = document.getElementById('footerYear');
  const navLinks    = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const sections    = document.querySelectorAll('section[id]');

  /* ── Footer year ── */
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  /* ══════════════════════════════════════
     1. SCROLL: progress + navbar + active + back-to-top
  ══════════════════════════════════════ */
  function onScroll() {
    const scrollY   = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    /* Progress bar */
    progressBar.style.width = (docHeight > 0 ? (scrollY / docHeight) * 100 : 0) + '%';

    /* Navbar blur intensity */
    navbar.classList.toggle('scrolled', scrollY > 12);

    /* Active nav link */
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + current);
    });

    /* Back to top */
    backToTop.classList.toggle('visible', scrollY > 420);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ══════════════════════════════════════
     2. HAMBURGER / MOBILE MENU
  ══════════════════════════════════════ */
  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const opening = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', opening);
    hamburger.classList.toggle('open', opening);
    hamburger.setAttribute('aria-expanded', opening ? 'true' : 'false');
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) closeMenu();
  });

  /* ══════════════════════════════════════
     3. SMOOTH SCROLL (navbar offset)
  ══════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMenu();
      const offset = (navbar?.offsetHeight || 72) + 10;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* ══════════════════════════════════════
     4. BACK TO TOP
  ══════════════════════════════════════ */
  function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  backToTop.addEventListener('click', scrollToTop);
  if (footerTopBtn) footerTopBtn.addEventListener('click', scrollToTop);

  /* ══════════════════════════════════════
     5. SCROLL REVEAL (IntersectionObserver)
  ══════════════════════════════════════ */
  const STAGGER_DELAY = 110; // ms between children

  function revealChildren(parent) {
    parent.querySelectorAll('.reveal-child').forEach((child, i) => {
      setTimeout(() => child.classList.add('visible'), i * STAGGER_DELAY);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealChildren(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ══════════════════════════════════════
     6. TYPING EFFECT — hero name
  ══════════════════════════════════════ */
  const typedEl = document.querySelector('.typed-name');
  if (typedEl) {
    const full  = 'Abhishek Kumar';
    let i       = 0;
    typedEl.textContent = '';

    function type() {
      typedEl.textContent = full.slice(0, i);
      if (i < full.length) {
        i++;
        setTimeout(type, 68);
      }
    }

    setTimeout(type, 380);
  }

  /* ══════════════════════════════════════
     7. 3D TILT — project image wrappers
  ══════════════════════════════════════ */
  document.querySelectorAll('.project-img-wrap').forEach(wrap => {
    wrap.addEventListener('mousemove', (e) => {
      const r  = wrap.getBoundingClientRect();
      const x  = (e.clientX - r.left)  / r.width  - 0.5;
      const y  = (e.clientY - r.top)   / r.height - 0.5;
      wrap.style.transition = 'transform 0.08s ease';
      wrap.style.transform  = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 5}deg) scale(1.01)`;
    });

    function resetTilt() {
      wrap.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
      wrap.style.transform  = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)';
    }

    wrap.addEventListener('mouseleave', resetTilt);
    wrap.addEventListener('touchend',   resetTilt);
  });

  /* ══════════════════════════════════════
     8. COPY TO CLIPBOARD — contact cards
  ══════════════════════════════════════ */
  function showToast(msg) {
    let toast = document.getElementById('copyToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'copyToast';
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%) translateY(12px)',
        background: '#111',
        color: '#f5ede2',
        fontFamily: "'Space Mono', monospace",
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '0.5px',
        padding: '10px 20px',
        borderRadius: '4px',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.25s, transform 0.25s',
        pointerEvents: 'none',
      });
      document.body.appendChild(toast);
    }

    toast.textContent = msg;
    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    clearTimeout(toast._hide);
    toast._hide = setTimeout(() => {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(-50%) translateY(12px)';
    }, 2000);
  }

  document.querySelectorAll('.contact-card').forEach(card => {
    card.setAttribute('title', 'Click to copy');
    card.setAttribute('tabindex', '0');

    const copy = () => {
      const val = card.querySelector('.contact-value')?.textContent?.trim();
      if (!val) return;
      navigator.clipboard.writeText(val).then(() => {
        const lbl = card.querySelector('.contact-label');
        const orig = lbl.textContent;
        lbl.textContent = '✓ Copied!';
        card.style.background = '#c9e7c7';
        showToast('Copied: ' + val);
        setTimeout(() => {
          lbl.textContent     = orig;
          card.style.background = '';
        }, 1800);
      }).catch(() => showToast('Copy failed — use Ctrl+C'));
    };

    card.addEventListener('click', copy);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy(); } });
  });

  /* ══════════════════════════════════════
     9. SOFT SKILLS — icon wobble
  ══════════════════════════════════════ */
  document.querySelectorAll('.ss-item').forEach(item => {
    const icon = item.querySelector('.ss-icon');
    if (!icon) return;
    item.addEventListener('mouseenter', () => {
      icon.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';
      icon.style.transform  = 'scale(1.22) rotate(-7deg)';
    });
    item.addEventListener('mouseleave', () => {
      icon.style.transform = 'scale(1) rotate(0deg)';
    });
  });

  /* ══════════════════════════════════════
     10. RIPPLE EFFECT — tags & proj-tags
  ══════════════════════════════════════ */
  function addRipple(e) {
    const el   = e.currentTarget;
    const prev = el.querySelector('.ripple');
    if (prev) prev.remove();

    const r    = el.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 1.4;
    const x    = e.clientX - r.left - size / 2;
    const y    = e.clientY - r.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    Object.assign(ripple.style, {
      position: 'absolute',
      width: size + 'px',
      height: size + 'px',
      top: y + 'px',
      left: x + 'px',
      borderRadius: '50%',
      background: 'rgba(26,26,26,0.12)',
      transform: 'scale(0)',
      animation: 'rippleAnim 0.55s ease-out forwards',
      pointerEvents: 'none',
    });

    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  /* Inject ripple keyframes once */
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id    = 'rippleStyle';
    style.textContent = '@keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }';
    document.head.appendChild(style);
  }

  document.querySelectorAll('.tag, .proj-tag').forEach(tag => {
    tag.addEventListener('click', addRipple);
  });

  /* ══════════════════════════════════════
     11. SUMMARY CARDS — keyboard focus rings
  ══════════════════════════════════════ */
  document.querySelectorAll('.summary-card, .stack-card, .tree-box, .personal-cell').forEach(el => {
    el.setAttribute('tabindex', '0');
  });

  /* ══════════════════════════════════════
     12. EDUCATION CARD — counter animation
        (counts up the graduation year on hover)
  ══════════════════════════════════════ */
  const eduGradStrong = document.querySelector('.edu-grad strong');
  if (eduGradStrong) {
    const target = parseInt(eduGradStrong.textContent, 10);
    let  running = false;

    document.querySelector('.edu-card')?.addEventListener('mouseenter', () => {
      if (running) return;
      running = true;
      const start = target - 4;
      let   cur   = start;
      const step  = () => {
        eduGradStrong.textContent = cur;
        if (cur < target) { cur++; setTimeout(step, 80); }
        else running = false;
      };
      step();
    });
  }

  /* ══════════════════════════════════════
     13. TIMELINE ITEMS — stagger reveal on
         internship section scroll-in
  ══════════════════════════════════════ */
  const tlItems = document.querySelectorAll('.tl-item');
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      tlItems.forEach((item, i) => {
        setTimeout(() => {
          item.style.opacity   = '1';
          item.style.transform = 'translateX(0)';
        }, 120 * i);
      });
      tlObserver.disconnect();
    });
  }, { threshold: 0.2 });

  tlItems.forEach(item => {
    item.style.opacity   = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)';
  });

  const tlSection = document.querySelector('.internship-section');
  if (tlSection) tlObserver.observe(tlSection);

  /* ══════════════════════════════════════
     14. SUMMARY CARDS — expand on click
         (mobile-friendly interaction)
  ══════════════════════════════════════ */
  document.querySelectorAll('.summary-card').forEach(card => {
    card.addEventListener('click', () => {
      const isOpen = card.classList.toggle('expanded');
      card.style.background = isOpen ? '#ecdfd0' : '';
    });
  });

})();

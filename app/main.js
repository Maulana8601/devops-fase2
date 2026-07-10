/* =====================================================
   main.js — Portfolio DevOps Engineering
   Interactive Effects & Animations
   ===================================================== */

'use strict';

/* ===== PARTICLE CANVAS ===== */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle() {
    const colors = ['#00e5ff', '#b56bff', '#39ff88', '#ff4ecd'];
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: randomRange(-0.3, 0.3),
      vy: randomRange(-0.5, -0.1),
      radius: randomRange(1, 2.5),
      alpha: randomRange(0.1, 0.5),
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      decay: randomRange(0.001, 0.003)
    };
  }

  function init() {
    particles = Array.from({ length: 80 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0 || p.y < -10 || p.x < -10 || p.x > W + 10) {
        particles[idx] = createParticle();
        particles[idx].y = H + 10;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * p.life;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });

  resize();
  init();
  draw();
})();

/* ===== NAV SCROLL ===== */
(function initNav() {
  const header = document.getElementById('nav-header');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    highlightActiveNav();
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    hamburger.classList.toggle('open', isOpen);
  });

  navLinks?.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
      navLinks.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      hamburger?.classList.remove('open');
    }
  });

  function highlightActiveNav() {
    let current = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100) current = section.id;
    });
    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
})();

/* ===== TYPEWRITER ===== */
(function initTypewriter() {
  const el = document.getElementById('typewriter-output');
  if (!el) return;

  const phrases = [
    'DevOps Engineer',
    'SRE Specialist',
    'Cloud Architect',
    'Automation Wizard',
    'Kubernetes Expert',
    'CI/CD Pipeline Builder',
  ];

  let phraseIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const phrase = phrases[phraseIdx];
    if (isDeleting) {
      el.textContent = phrase.substring(0, charIdx--);
      if (charIdx < 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 50);
    } else {
      el.textContent = phrase.substring(0, charIdx++);
      if (charIdx > phrase.length) {
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 80);
    }
  }

  setTimeout(type, 800);
})();

/* ===== COUNTER ANIMATION ===== */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
})();

/* ===== SKILL BAR ANIMATION ===== */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar__fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.style.getPropertyValue('--skill-level');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ===== SCROLL REVEAL ===== */
(function initReveal() {
  const els = document.querySelectorAll(
    '.section-header, .about-text, .about-terminal, .skill-category, ' +
    '.timeline-card, .project-card, .cert-card, .contact-item, .contact-form, ' +
    '.tech-badges, .hero-stats'
  );

  els.forEach((el, i) => {
    const isLeft  = el.classList.contains('about-text') || el.classList.contains('contact-info');
    const isRight = el.classList.contains('about-terminal') || el.classList.contains('contact-form');

    if (isLeft)       el.classList.add('reveal-left');
    else if (isRight) el.classList.add('reveal-right');
    else              el.classList.add('reveal');

    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => observer.observe(el));
})();

/* ===== CONTACT FORM ===== */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const btn  = document.getElementById('contact-submit-btn');
  if (!form || !btn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !subject || !message) {
      showNotification('Mohon isi semua field!', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotification('Format email tidak valid!', 'error');
      return;
    }

    // Simulate sending
    btn.disabled = true;
    btn.innerHTML = '<span>Mengirim...</span><span style="animation: spin 1s linear infinite; display:inline-block;">⟳</span>';

    await new Promise(r => setTimeout(r, 1500));

    showNotification('✅ Pesan berhasil dikirim! Terima kasih.', 'success');
    form.reset();
    btn.disabled = false;
    btn.innerHTML = '<span>Kirim Pesan</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>';
  });
})();

/* ===== NOTIFICATION ===== */
function showNotification(message, type = 'info') {
  const existing = document.getElementById('notification-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'notification-toast';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    z-index: 9999;
    max-width: 360px;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: slideInToast 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    ${type === 'success'
      ? 'background: rgba(57,255,136,0.1); border: 1px solid rgba(57,255,136,0.3); color: #39ff88;'
      : 'background: rgba(255,112,67,0.1); border: 1px solid rgba(255,112,67,0.3); color: #ff7043;'}
  `;
  toast.textContent = message;

  if (!document.getElementById('toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = `
      @keyframes slideInToast {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ===== SMOOTH CURSOR GLOW (desktop) ===== */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function animateCursor() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
})();

/* ===== PROJECT CARD TILT ===== */
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.project-card, .cert-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();

/* ===== BACK TO TOP ===== */
(function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  btn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00e5ff, #b56bff);
    border: none;
    color: #080c14;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.3s, transform 0.3s;
    z-index: 999;
    box-shadow: 0 4px 16px rgba(0,229,255,0.3);
  `;

  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btn.style.opacity = show ? '1' : '0';
    btn.style.transform = show ? 'scale(1)' : 'scale(0.8)';
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===== ACTIVE SECTION HIGHLIGHT ===== */
(function initSectionHighlight() {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });
    observer.observe(section);
  });
})();

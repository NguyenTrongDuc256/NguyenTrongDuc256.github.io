/* =============================================
   main.js — Portfolio Interactivity
   Starfield, Animations, Typed Text, Counters
   ============================================= */

// ─── STARFIELD CANVAS ───────────────────────
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [], nebulae = [];

  const STAR_COUNT   = 220;
  const NEBULA_COUNT = 6;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x:       Math.random() * W,
        y:       Math.random() * H,
        r:       randomBetween(0.2, 1.8),
        alpha:   randomBetween(0.3, 1),
        speed:   randomBetween(0.0005, 0.002),
        phase:   Math.random() * Math.PI * 2,
        // parallax layer 0-2
        layer:   Math.floor(Math.random() * 3),
        vx:      randomBetween(-0.08, 0.08),
        vy:      randomBetween(-0.02, 0.02),
        hue:     Math.random() < 0.15 ? randomBetween(180, 260) : 0,
      });
    }
  }

  function createNebulae() {
    nebulae = [];
    const colors = [
      [56,189,248],
      [129,140,248],
      [192,132,252],
      [45,212,191],
      [56,189,248],
      [129,140,248],
    ];
    for (let i = 0; i < NEBULA_COUNT; i++) {
      const c = colors[i % colors.length];
      nebulae.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        rx:    randomBetween(120, 280),
        ry:    randomBetween(80, 200),
        alpha: randomBetween(0.015, 0.05),
        color: c,
        phase: Math.random() * Math.PI * 2,
        speed: randomBetween(0.0003, 0.001),
      });
    }
  }

  let t = 0;
  let mouseX = W / 2, mouseY = H / 2;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Nebulae
    nebulae.forEach(n => {
      const a = n.alpha + Math.sin(t * n.speed + n.phase) * 0.01;
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, Math.max(n.rx, n.ry));
      const [r, g2, b] = n.color;
      g.addColorStop(0,   `rgba(${r},${g2},${b},${a})`);
      g.addColorStop(1,   `rgba(${r},${g2},${b},0)`);
      ctx.save();
      ctx.scale(1, n.ry / n.rx);
      ctx.beginPath();
      ctx.arc(n.x, n.y * (n.rx / n.ry), n.rx, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    });

    // Stars
    stars.forEach(s => {
      // Subtle parallax on mouse
      const parallaxStrength = (s.layer + 1) * 0.003;
      const px = s.x + (mouseX - W / 2) * parallaxStrength;
      const py = s.y + (mouseY - H / 2) * parallaxStrength;
      const a  = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));

      if (s.hue) {
        ctx.fillStyle = `hsla(${s.hue},90%,80%,${a})`;
      } else {
        ctx.fillStyle = `rgba(220,235,255,${a})`;
      }
      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fill();

      // Shooting star twinkle for large bright stars
      if (s.r > 1.4 && a > 0.85) {
        ctx.strokeStyle = `rgba(255,255,255,${a * 0.4})`;
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.moveTo(px - 5, py);
        ctx.lineTo(px + 5, py);
        ctx.moveTo(px, py - 5);
        ctx.lineTo(px, py + 5);
        ctx.stroke();
      }

      // Drift slowly
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < -10) s.x = W + 10;
      if (s.x > W + 10) s.x = -10;
      if (s.y < -10) s.y = H + 10;
      if (s.y > H + 10) s.y = -10;
    });

    t++;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    createStars();
    createNebulae();
  });

  resize();
  createStars();
  createNebulae();
  draw();
})();

// ─── TYPED TEXT EFFECT ────────────────────────
(function initTyped() {
  const el    = document.getElementById('typed-role');
  const roles = [
    'Frontend Engineer — Middle',
    'Angular & TypeScript Specialist',
    'Performance Optimization Expert',
    'Core Web Vitals Optimizer',
    'UI/UX Technical Feasibility Expert',
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 60);
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 30);
    }
  }
  setTimeout(type, 800);
})();

// ─── NAVBAR SCROLL ────────────────────────────
(function initNav() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled style
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) {
        current = sec.id;
      }
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();

// ─── SCROLL REVEAL ────────────────────────────
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = parseFloat(getComputedStyle(entry.target).getPropertyValue('--delay') || '0') * 1000;
        setTimeout(() => {
          entry.target.classList.add('in-view');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

// ─── SKILL BARS ───────────────────────────────
(function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill');
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width  = target.getAttribute('data-width');
        setTimeout(() => {
          target.style.width = width + '%';
        }, 300);
        barObserver.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => barObserver.observe(bar));
})();

// ─── COUNTER ANIMATION ────────────────────────
(function initCounters() {
  const counters  = document.querySelectorAll('.stat-num');
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current  = 0;
        const step   = Math.ceil(target / 40);
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = current;
          }
        }, 40);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObserver.observe(c));
})();

// ─── SMOOTH HOVER GLOW ON CARDS ───────────────
(function initCardGlow() {
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(56,189,248,0.06) 0%, rgba(10,22,50,0.6) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();

// ─── HERO BADGE APPEAR ────────────────────────
(function initHeroReveal() {
  const items = document.querySelectorAll('#hero .reveal-up, #hero .reveal-right');
  items.forEach((el, i) => {
    el.style.animationDelay = `${i * 0.12}s`;
    el.style.animation = `fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s both`;
  });
})();

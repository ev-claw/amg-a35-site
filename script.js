/* 2026 Mercedes-AMG A35 — UK Guide — Interactive JS */

'use strict';

// ─── Badge wave: split "John's Jalopy Guide" into per-char spans ─────────────
(function initBadgeWave() {
  const el = document.querySelector('.badge-wave-text');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  text.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = ch === ' ' ? '' : 'wc';
    span.textContent = ch === ' ' ? '\u00a0' : ch; // non-breaking space for gaps
    if (ch !== ' ') span.style.animationDelay = (i * 0.07) + 's';
    el.appendChild(span);
  });
})();

// ─── Intersection Observer: Reveal animations ────────────────────────────────
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();

// ─── Nav: scroll behaviour + active section tracking ────────────────────────
(function initNav() {
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinksEl = document.getElementById('nav-links');

  // Scroll: add .scrolled class
  let lastScroll = 0;
  const onScroll = () => {
    const scroll = window.scrollY;
    nav.classList.toggle('scrolled', scroll > 40);
    lastScroll = scroll;
    highlightActiveNav();
    toggleBackToTop();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active nav highlighting
  function highlightActiveNav() {
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  // Hamburger
  hamburger.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav on link click
  navLinksEl.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  // Smooth scroll offset for fixed nav
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ─── Back to top button ──────────────────────────────────────────────────────
function toggleBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
}
window.addEventListener('scroll', toggleBackToTop, { passive: true });

// ─── Hero stat counter animation ─────────────────────────────────────────────
(function initCounters() {
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  if (!statValues.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const isDecimal = el.dataset.decimal === '1';
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = target * eased;
          if (isDecimal) {
            el.textContent = (val / 10).toFixed(1);
          } else {
            el.textContent = Math.round(val);
          }
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = isDecimal ? (target / 10).toFixed(1) : target;
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  statValues.forEach((el) => observer.observe(el));
})();

// ─── Performance bars animation ──────────────────────────────────────────────
(function initPerfBars() {
  const fills = document.querySelectorAll('.perf-bar-fill[data-width]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // Delay slightly for visual polish
        setTimeout(() => {
          el.style.width = el.dataset.width + '%';
        }, 200);
        observer.unobserve(el);
      });
    },
    { threshold: 0.3 }
  );
  fills.forEach((el) => observer.observe(el));
})();

// ─── Tech tabs ───────────────────────────────────────────────────────────────
(function initTechTabs() {
  const container = document.getElementById('tech-tabs');
  if (!container) return;

  const buttons = container.querySelectorAll('.tab-btn');
  const panels = container.querySelectorAll('.tab-panel');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      buttons.forEach((b) => b.classList.toggle('active', b === btn));
      panels.forEach((p) => p.classList.toggle('active', p.dataset.panel === tab));
    });
  });
})();

// ─── Spec tabs ───────────────────────────────────────────────────────────────
(function initSpecTabs() {
  const tabs = document.querySelectorAll('.spec-tab');
  const panels = document.querySelectorAll('.spec-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const spec = tab.dataset.spec;
      tabs.forEach((t) => t.classList.toggle('active', t === tab));
      panels.forEach((p) => p.classList.toggle('active', p.dataset.spanel === spec));
    });
  });
})();

// ─── FAQ accordion ───────────────────────────────────────────────────────────
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      items.forEach((other) => {
        if (other !== item) {
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-a').classList.remove('open');
        }
      });

      btn.setAttribute('aria-expanded', !isOpen);
      answer.classList.toggle('open', !isOpen);
    });
  });
})();

// ─── Checklist interactivity ──────────────────────────────────────────────────
(function initChecklist() {
  document.querySelectorAll('.check-box').forEach((box) => {
    box.addEventListener('click', () => {
      const isChecked = box.textContent === '☑';
      box.textContent = isChecked ? '☐' : '☑';
      box.style.color = isChecked ? '' : '#22c55e';
    });
  });
})();

// ─── Colour swatch tooltip ────────────────────────────────────────────────────
(function initColourSwatches() {
  document.querySelectorAll('.colour-swatch').forEach((swatch) => {
    swatch.style.cursor = 'pointer';
    swatch.addEventListener('click', () => {
      const name = swatch.querySelector('.colour-name')?.textContent;
      const type = swatch.querySelector('.colour-type')?.textContent;
      if (name) {
        // Brief flash effect
        const el = swatch.querySelector('.swatch');
        el.style.transform = 'scale(1.25)';
        el.style.boxShadow = '0 8px 32px rgba(204,0,0,0.5)';
        setTimeout(() => {
          el.style.transform = '';
          el.style.boxShadow = '';
        }, 400);
      }
    });
  });
})();

// ─── Intersection Observer: compare table rows stagger ───────────────────────
(function initCompareRows() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  // Stagger resets per table so wildcard rows don't inherit a long delay offset
  document.querySelectorAll('.compare-table').forEach((table) => {
    table.querySelectorAll('.compare-row:not(.compare-header)').forEach((row, i) => {
      row.style.opacity = '0';
      row.style.transform = 'translateX(-10px)';
      row.style.transition = `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`;
      observer.observe(row);
    });
  });
})();


// ─── Cow drive-by animation ───────────────────────────────────────────────────
(function initCarCruiser() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const car = document.getElementById('car-cruiser');
  if (!car) return;

  const carImg = car.querySelector('img');
  let animating = false;

  // Synthesise a cow moo via Web Audio
  function playMoo() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const t = ctx.currentTime;
      const dur = 2.0;

      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 1000;
      lpf.Q.value = 0.9;

      const master = ctx.createGain();
      lpf.connect(master);
      master.connect(ctx.destination);

      // Gain envelope: gentle attack, hold, fade out
      master.gain.setValueAtTime(0, t);
      master.gain.linearRampToValueAtTime(0.38, t + 0.18);
      master.gain.setValueAtTime(0.38, t + dur - 0.55);
      master.gain.exponentialRampToValueAtTime(0.001, t + dur);

      // Sawtooth oscillators: fundamental + harmonics, frequency rises then falls (moo shape)
      [[95, 165, 92], [190, 330, 184], [285, 495, 276]].forEach(([s, peak, e], i) => {
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(s, t);
        o.frequency.linearRampToValueAtTime(peak, t + 0.6);
        o.frequency.exponentialRampToValueAtTime(e, t + dur - 0.1);
        const g = ctx.createGain();
        g.gain.value = [1.0, 0.42, 0.18][i];
        o.connect(g);
        g.connect(lpf);
        o.start(t);
        o.stop(t + dur);
      });

      setTimeout(() => ctx.close().catch(() => {}), (dur + 0.6) * 1000);
    } catch (_) {}
  }

  function runCar() {
    if (animating || document.hidden) return;
    animating = true;

    const goRight = Math.random() > 0.5;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Random size: 100–200px
    const w = 100 + Math.random() * 100;
    car.style.width = w + 'px';

    // Random vertical position: bottom 0–35% of viewport height
    car.style.bottom = (Math.random() * vh * 0.35) + 'px';

    const carW = w;

    // GIF faces left by default — flip when going right
    carImg.style.transform = goRight ? 'scaleX(-1)' : '';

    car.style.display = 'block';

    const startX  = goRight ? -(carW + 10) : vw + 10;
    const endX    = goRight ? vw + 10 : -(carW + 10);
    const totalMs = 9000 + Math.random() * 4000; // 9–13 s full crossing

    // Stop near the middle (40–60% of the way across) to moo
    const stopFrac  = 0.4 + Math.random() * 0.2;
    const stopX     = startX + (endX - startX) * stopFrac;
    const msToStop  = totalMs * stopFrac;
    const msFromStop = totalMs * (1 - stopFrac);

    // Total pause: short breath + moo (~2s) + brief linger
    const pauseMs = 300 + 2000 + 500;

    let phase = 'to-stop';
    let t0 = performance.now();
    let pauseStart = null;

    function step(now) {
      if (phase === 'to-stop') {
        const p = Math.min((now - t0) / msToStop, 1);
        car.style.transform = `translateX(${startX + (stopX - startX) * p}px)`;
        if (p < 1) { requestAnimationFrame(step); return; }
        // Arrived — pause and moo
        phase = 'paused';
        pauseStart = now;
        setTimeout(playMoo, 300); // small breath before moo
        requestAnimationFrame(step);

      } else if (phase === 'paused') {
        if (now - pauseStart < pauseMs) { requestAnimationFrame(step); return; }
        phase = 'from-stop';
        t0 = now;
        requestAnimationFrame(step);

      } else {
        const p = Math.min((now - t0) / msFromStop, 1);
        car.style.transform = `translateX(${stopX + (endX - stopX) * p}px)`;
        if (p < 1) { requestAnimationFrame(step); return; }
        car.style.display = 'none';
        car.style.transform = '';
        animating = false;
        schedule();
      }
    }

    requestAnimationFrame(step);
  }

  function schedule(first) {
    const lo = first ? 5000 : 30000;
    const hi = first ? 10000 : 90000;
    setTimeout(runCar, lo + Math.random() * (hi - lo));
  }

  schedule(true);
})();

// ─── Keyboard accessibility: escape closes mobile menu ───────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const navLinks = document.getElementById('nav-links');
    if (navLinks?.classList.contains('open')) {
      navLinks.classList.remove('open');
      document.getElementById('nav-hamburger')?.setAttribute('aria-expanded', 'false');
    }
    // Also close open FAQ
    document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach((btn) => {
      btn.setAttribute('aria-expanded', 'false');
      btn.closest('.faq-item')?.querySelector('.faq-a')?.classList.remove('open');
    });
  }
});

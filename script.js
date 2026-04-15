/* 2026 Mercedes-AMG A35 — UK Guide — Interactive JS */

'use strict';

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

// ─── Vroom vroom sound ───────────────────────────────────────────────────────
(function initVroom() {
  const btn = document.getElementById('sound-toggle');
  if (!btn) return;

  let audioCtx = null;
  let muted = false;
  let hasPlayedOnce = false;

  function getCtx() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (_) { return null; }
    }
    return audioCtx;
  }

  // Soft-knee waveshaper — amount 60–600 range
  function makeDistortionCurve(amount) {
    const n = 512;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  // White-noise buffer source
  function makeNoise(ctx, duration) {
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, Math.ceil(sr * duration), sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    return src;
  }

  function playVroom() {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    hasPlayedOnce = true;
    btn.classList.remove('invite');

    try {
      const t   = ctx.currentTime;
      const dur = 3.4;

      // ── Master output ───────────────────────────────────────────────────
      const master = ctx.createGain();
      master.connect(ctx.destination);

      // ── Distortion stage — heavier for AMG exhaust bark ────────────────
      const dist = ctx.createWaveShaper();
      dist.curve = makeDistortionCurve(160);
      dist.oversample = '4x';

      // ── Low-pass filter — tracks RPM, opens on revs ────────────────────
      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.Q.value = 1.6;

      // ── Mid-peak boost — exhaust character ~800 Hz ─────────────────────
      const peak = ctx.createBiquadFilter();
      peak.type = 'peaking';
      peak.frequency.value = 820;
      peak.Q.value = 0.85;
      peak.gain.value = 10;

      // ── Connect engine chain: dist → peak → lpf → master ───────────────
      dist.connect(peak);
      peak.connect(lpf);
      lpf.connect(master);

      // ── Frequency schedule ──────────────────────────────────────────────
      // 4-cyl firing frequency = RPM / 30.
      // We drive the fundamental; harmonics multiply this.
      // Idle ~900 RPM → 30 Hz; rev ~5500 RPM → 183 Hz.
      const rampFreq = (param, k) => {
        param.setValueAtTime(        30 * k, t);           // idle  ~900 RPM
        param.exponentialRampToValueAtTime(190 * k, t + 0.28); // rev 1 ~5700 RPM
        param.exponentialRampToValueAtTime( 52 * k, t + 0.54); // lift-off
        param.exponentialRampToValueAtTime(183 * k, t + 0.76); // rev 2 ~5500 RPM
        param.exponentialRampToValueAtTime( 47 * k, t + 1.02); // lift-off
        param.exponentialRampToValueAtTime(158 * k, t + 1.16); // pop
        param.exponentialRampToValueAtTime( 40 * k, t + 1.46); // settle
        param.exponentialRampToValueAtTime( 28 * k, t + dur);  // idle
      };

      // ── Oscillator layers ───────────────────────────────────────────────
      const addOsc = (type, k, gain) => {
        const o = ctx.createOscillator();
        o.type = type;
        rampFreq(o.frequency, k);
        const g = ctx.createGain();
        g.gain.value = gain;
        o.connect(g);
        g.connect(dist);
        o.start(t);
        o.stop(t + dur);
      };
      addOsc('sawtooth', 1,   1.00); // fundamental
      addOsc('sawtooth', 2,   0.58); // 2nd harmonic
      addOsc('square',   3,   0.26); // 3rd — adds 4-cyl roughness
      addOsc('sawtooth', 4,   0.16); // 4th harmonic
      addOsc('sawtooth', 0.5, 0.22); // sub-octave — body/thump

      // ── LP filter envelope ──────────────────────────────────────────────
      lpf.frequency.setValueAtTime( 190, t);
      lpf.frequency.exponentialRampToValueAtTime(4200, t + 0.28);
      lpf.frequency.exponentialRampToValueAtTime( 360, t + 0.54);
      lpf.frequency.exponentialRampToValueAtTime(3800, t + 0.76);
      lpf.frequency.exponentialRampToValueAtTime( 320, t + 1.02);
      lpf.frequency.exponentialRampToValueAtTime(3200, t + 1.16);
      lpf.frequency.exponentialRampToValueAtTime( 280, t + 1.46);
      lpf.frequency.exponentialRampToValueAtTime( 180, t + dur);

      // ── Master gain envelope — blip shaping ────────────────────────────
      master.gain.setValueAtTime(0,    t);
      master.gain.linearRampToValueAtTime(0.22, t + 0.05); // fast attack
      master.gain.setValueAtTime(      0.22, t + 0.36);
      master.gain.linearRampToValueAtTime(0.05, t + 0.56); // dip (lift-off)
      master.gain.linearRampToValueAtTime(0.24, t + 0.78); // rev 2
      master.gain.setValueAtTime(      0.24, t + 0.98);
      master.gain.linearRampToValueAtTime(0.06, t + 1.04); // dip
      master.gain.linearRampToValueAtTime(0.17, t + 1.18); // pop
      master.gain.setValueAtTime(      0.17, t + 1.40);
      master.gain.exponentialRampToValueAtTime(0.001, t + dur);

      // ── Turbo / induction noise — rises with RPM ────────────────────────
      const turbNoise = makeNoise(ctx, dur);
      const turbBpf   = ctx.createBiquadFilter();
      turbBpf.type = 'bandpass';
      turbBpf.Q.value = 1.1;
      // Induction noise frequency tracks revs
      turbBpf.frequency.setValueAtTime( 550, t);
      turbBpf.frequency.exponentialRampToValueAtTime(2400, t + 0.28);
      turbBpf.frequency.exponentialRampToValueAtTime( 650, t + 0.54);
      turbBpf.frequency.exponentialRampToValueAtTime(2200, t + 0.76);
      turbBpf.frequency.exponentialRampToValueAtTime( 600, t + 1.02);
      turbBpf.frequency.exponentialRampToValueAtTime(1900, t + 1.16);
      turbBpf.frequency.exponentialRampToValueAtTime( 500, t + dur);
      const turbGain = ctx.createGain();
      turbGain.gain.setValueAtTime(0,    t);
      turbGain.gain.linearRampToValueAtTime(0.08, t + 0.26);
      turbGain.gain.setValueAtTime(      0.08, t + 1.22);
      turbGain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      turbNoise.connect(turbBpf);
      turbBpf.connect(turbGain);
      turbGain.connect(master);
      turbNoise.start(t);
      turbNoise.stop(t + dur);

      // ── Exhaust crackle at each lift-off point ──────────────────────────
      [t + 0.54, t + 1.02, t + 1.43].forEach((ct) => {
        const cd = 0.055;
        const cn = makeNoise(ctx, cd + 0.01);
        const cdist = ctx.createWaveShaper();
        cdist.curve = makeDistortionCurve(520);
        cdist.oversample = '2x';
        const chpf = ctx.createBiquadFilter();
        chpf.type = 'highpass';
        chpf.frequency.value = 1400;
        const cg = ctx.createGain();
        cg.gain.setValueAtTime(0,    t);
        cg.gain.setValueAtTime(0.11, ct);
        cg.gain.exponentialRampToValueAtTime(0.001, ct + cd);
        cn.connect(cdist);
        cdist.connect(chpf);
        chpf.connect(cg);
        cg.connect(master);
        cn.start(ct);
        cn.stop(ct + cd + 0.01);
      });

    } catch (_) {
      // Fail silently — browser may block audio
    }
  }

  function updateBtn() {
    const waves = document.getElementById('sound-waves');
    const muteX = document.getElementById('sound-mute');
    if (waves) waves.style.display = muted ? 'none' : '';
    if (muteX) muteX.style.display = muted ? '' : 'none';
    btn.classList.toggle('muted', muted);
    btn.setAttribute('aria-label', muted ? 'Sound muted — click to re-enable' : 'Vroom! — click to replay or mute');
    btn.title = muted ? 'Sound muted' : 'Vroom vroom! 🏎';
  }

  // ── Button click handler ────────────────────────────────────────────────────
  // First click on the active button: context was likely suspended (autoplay blocked).
  // Resuming inside a user-gesture handler is allowed by all browsers.
  // We play without toggling mute so the user doesn't have to click twice.
  btn.addEventListener('click', () => {
    const ctx = getCtx();
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});

    if (!hasPlayedOnce && !muted) {
      // First-ever interaction: play without toggling to muted
      playVroom();
    } else {
      muted = !muted;
      updateBtn();
      if (!muted) playVroom();
    }
  });

  updateBtn();

  // Pulse hint so the user notices the sound button and knows to click it
  btn.classList.add('invite');

  // ── First-interaction autoplay ──────────────────────────────────────────────
  // Any click on the page counts as a user gesture; resume & play once if
  // sound hasn't played yet.  The button's own click handler also covers this,
  // but this catches clicks on other elements (e.g. comparison picker).
  function onFirstInteract() {
    if (hasPlayedOnce || muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    ctx.resume().then(() => {
      if (ctx.state === 'running' && !hasPlayedOnce && !muted) playVroom();
    }).catch(() => {});
  }
  document.addEventListener('click',    onFirstInteract, { once: true, passive: true });
  document.addEventListener('keydown',  onFirstInteract, { once: true, passive: true });
  document.addEventListener('touchend', onFirstInteract, { once: true, passive: true });

  // ── Pure autoplay attempt (succeeds in permissive / PWA contexts) ───────────
  setTimeout(() => {
    if (hasPlayedOnce) return;
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'running') playVroom();
    // If suspended here there is no user gesture — don't call resume()
    // as it would be blocked and would create an uncancellable pending promise
  }, 600);
})();

// ─── Random A35 drive-by animation ───────────────────────────────────────────
(function initCarCruiser() {
  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const car = document.getElementById('car-cruiser');
  if (!car) return;

  const carSvg = car.querySelector('svg');
  let animating = false;

  function runCar() {
    if (animating || document.hidden) return;
    animating = true;

    const goRight = Math.random() > 0.5;
    const vw = window.innerWidth;
    const carW = car.offsetWidth || 170;

    // Flip SVG so front always faces direction of travel
    carSvg.style.transform = goRight ? '' : 'scaleX(-1)';

    car.style.display = 'block';

    const startX = goRight ? -(carW + 10) : vw + 10;
    const endX = goRight ? vw + 10 : -(carW + 10);
    const duration = 5500 + Math.random() * 2500; // 5.5–8 s across viewport
    const t0 = performance.now();

    function step(now) {
      const progress = Math.min((now - t0) / duration, 1);
      car.style.transform = `translateX(${startX + (endX - startX) * progress}px)`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        car.style.display = 'none';
        car.style.transform = '';
        animating = false;
        schedule();
      }
    }

    requestAnimationFrame(step);
  }

  function schedule(first) {
    // First appearance: 35–65 s; subsequent: 100–300 s
    const lo = first ? 35000 : 100000;
    const hi = first ? 65000 : 300000;
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

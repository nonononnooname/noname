/* ============================================================
   SCREEN 1 — Spark Particle Field  (WFG-style glowing dashes)
   Short luminous line segments floating across the hero canvas.
   ============================================================ */
(function () {
  'use strict';

  const canvas = document.getElementById('s1Sparks');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0;
  const TOTAL = 65;
  const sparks = [];

  function mkSpark(init) {
    const len    = 5 + Math.random() * 22;
    const angle  = (Math.PI / 6) + Math.random() * (Math.PI * 2 / 3); // 30°–150° diagonal
    const bright = 0.4 + Math.random() * 0.6;
    const maxL   = 90 + Math.random() * 200;
    return {
      x:      Math.random() * W,
      y:      init ? Math.random() * H : H + len,
      vx:     (Math.random() - 0.5) * 0.18,
      vy:     -(0.15 + Math.random() * 0.45),
      len, angle, bright,
      life: init ? Math.floor(Math.random() * maxL) : 0,
      maxL,
      dx: Math.cos(angle) * len,
      dy: Math.sin(angle) * len,
    };
  }

  function resetSpark(s) {
    const n = mkSpark(false);
    Object.assign(s, n);
    s.x = Math.random() * W;
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    for (let i = 0; i < TOTAL; i++) sparks.push(mkSpark(true));
  }

  function drawSpark(s) {
    const fade = 25;
    let o = s.bright;
    if (s.life < fade)            o *= s.life / fade;
    else if (s.life > s.maxL - fade) o *= (s.maxL - s.life) / fade;
    if (o <= 0.01) return;

    const x2 = s.x + s.dx, y2 = s.y + s.dy;

    /* Glow — three concentric strokes */
    ctx.lineCap = 'round';

    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgba(52,245,160,${o * 0.10})`;
    ctx.lineWidth = 7; ctx.stroke();

    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgba(52,245,160,${o * 0.32})`;
    ctx.lineWidth = 2.5; ctx.stroke();

    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgba(200,255,240,${o * 0.85})`;
    ctx.lineWidth = 0.9; ctx.stroke();
  }

  let raf = null;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (const s of sparks) {
      s.x += s.vx; s.y += s.vy; s.life++;
      if (s.life > s.maxL || s.y < -40) resetSpark(s);
      drawSpark(s);
    }
    raf = requestAnimationFrame(loop);
  }

  /* Only run while s1 is visible — stop when scrolled past */
  const s1 = document.getElementById('s1');
  if (!s1) return;
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !raf) { if (!sparks.length) init(); loop(); }
    else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0.05 });
  obs.observe(s1);
  window.addEventListener('resize', () => { if (raf) resize(); });
  init(); loop(); /* also start immediately in case already visible */
})();

/* ============================================================
   SCREEN 7 — Consciousness Field Animation
   Associative visual: dim nodes (sleeping people) that wake,
   glow green, pulse, and form connections — followers awakening.
   ============================================================ */
(function () {
  'use strict';

  const canvas = document.getElementById('wakeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ── Config ─────────────────────────────────────────────── */
  const N       = 68;    // total nodes (people)
  const MESH_D  = 72;    // sleeping mesh draw distance (px)
  const CONN_D  = 118;   // awake connection distance (px)
  const WAVE_D  = 145;   // cascade wake radius (px)

  let W = 0, H = 0;
  let nodes = [];
  let rafId = null;
  let tick  = 0;
  let nextWave = 110;

  /* ── Node ────────────────────────────────────────────────── */
  class Dot {
    constructor() {
      this.x   = 0.05 + Math.random() * 0.90;
      this.y   = 0.05 + Math.random() * 0.90;
      this.vx  = (Math.random() - 0.5) * 0.00022;
      this.vy  = (Math.random() - 0.5) * 0.00022;
      this.r   = 1.7 + Math.random() * 1.7;
      this.lit    = 0;   // current 0→1
      this.target = 0;   // desired 0→1
      this.rings  = [];  // [{r, o}] expanding pulse rings
    }

    wake(delay = 0) {
      setTimeout(() => {
        if (this.target < 0.5) this.rings.push({ r: 0, o: 0.75 });
        this.target = 1;
      }, delay);
    }

    sleep(delay = 0) {
      setTimeout(() => { this.target = 0; }, delay);
    }

    update() {
      // Drift
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0.02) { this.x = 0.02; this.vx *= -1; }
      if (this.x > 0.98) { this.x = 0.98; this.vx *= -1; }
      if (this.y < 0.02) { this.y = 0.02; this.vy *= -1; }
      if (this.y > 0.98) { this.y = 0.98; this.vy *= -1; }

      // Smooth lerp toward target luminance
      this.lit += (this.target - this.lit) * 0.042;

      // Decay rings
      this.rings = this.rings.filter(rg => {
        rg.r += 0.85;
        rg.o *= 0.935;
        return rg.o > 0.01;
      });
    }

    draw() {
      const px = this.x * W, py = this.y * H;
      const g  = this.lit;

      // Outer glow halo (two layers for soft falloff)
      if (g > 0.04) {
        ctx.beginPath();
        ctx.arc(px, py, this.r * 4.5 + 12 * g, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${0.048 * g})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, this.r * 2.2 + 5 * g, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${0.11 * g})`;
        ctx.fill();
      }

      // Pulse rings
      for (const rg of this.rings) {
        ctx.beginPath();
        ctx.arc(px, py, this.r + rg.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16,185,129,${rg.o})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      // Core dot — RGB lerp: sleep (85,115,155) → awake (16,185,129)
      const ri = Math.round(85  + (16  - 85)  * g);
      const gi = Math.round(115 + (185 - 115) * g);
      const bi = Math.round(155 + (129 - 155) * g);
      const ai = 0.18 + 0.82 * g;
      ctx.beginPath();
      ctx.arc(px, py, this.r + g * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ri},${gi},${bi},${ai})`;
      ctx.fill();
    }
  }

  /* ── Connection drawing ──────────────────────────────────── */
  function drawConnections() {
    const MESH_D2 = MESH_D * MESH_D;
    const CONN_D2 = CONN_D * CONN_D;

    // Sleeping mesh — very faint grey lattice between ALL nearby nodes
    ctx.lineWidth = 0.5;
    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = (a.x - b.x) * W;
        const dy = (a.y - b.y) * H;
        const d2 = dx * dx + dy * dy;
        if (d2 < MESH_D2) {
          const alpha = (1 - d2 / MESH_D2) * 0.055;
          ctx.beginPath();
          ctx.moveTo(a.x * W, a.y * H);
          ctx.lineTo(b.x * W, b.y * H);
          ctx.strokeStyle = `rgba(75,105,140,${alpha})`;
          ctx.stroke();
        }
      }
    }

    // Awake connections — bright green lines between lit nodes
    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i];
      if (a.lit < 0.25) continue;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        if (b.lit < 0.25) continue;
        const dx = (a.x - b.x) * W;
        const dy = (a.y - b.y) * H;
        const d2 = dx * dx + dy * dy;
        if (d2 < CONN_D2) {
          const d = Math.sqrt(d2);
          const s = (1 - d / CONN_D) * Math.min(a.lit, b.lit);
          ctx.beginPath();
          ctx.moveTo(a.x * W, a.y * H);
          ctx.lineTo(b.x * W, b.y * H);
          ctx.strokeStyle = `rgba(16,185,129,${s * 0.44})`;
          ctx.lineWidth = s * 1.9;
          ctx.stroke();
        }
      }
    }
  }

  /* ── Wave / awakening logic ──────────────────────────────── */
  function triggerWave() {
    const sleeping = nodes.filter(n => n.target < 0.5);
    const awake    = nodes.filter(n => n.target >= 0.5);

    // If most are awake → rest a portion
    if (sleeping.length < N * 0.20) {
      awake.sort(() => Math.random() - 0.5)
           .slice(0, Math.ceil(N * 0.30))
           .forEach((n, i) => n.sleep(i * 170));
      nextWave = 170;
      return;
    }

    // Pick random sleeping seed
    const seed = sleeping[Math.floor(Math.random() * sleeping.length)];
    seed.wake(0);

    // Cascade to nearby sleeping nodes with distance-based delay
    nodes.forEach(n => {
      if (n.target < 0.5) {
        const dx = (n.x - seed.x) * W;
        const dy = (n.y - seed.y) * H;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < WAVE_D) {
          n.wake(d * 5.5 + Math.random() * 280);
        }
      }
    });

    nextWave = 75 + Math.random() * 55;
  }

  /* ── HUD overlay ─────────────────────────────────────────── */
  function drawHUD() {
    const lit = nodes.filter(n => n.lit > 0.5).length;
    const pct = Math.round(lit / N * 100);

    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(16,185,129,0.38)';
    ctx.fillText(`AWAKENED  ${String(lit).padStart(2, ' ')} / ${N}  [${pct}%]`, 12, H - 12);

    // Small corner dot indicator
    const dotColor = lit > N * 0.5 ? 'rgba(16,185,129,0.7)' : 'rgba(85,110,140,0.5)';
    ctx.beginPath();
    ctx.arc(W - 14, H - 14, 3, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();
  }

  /* ── Resize ──────────────────────────────────────────────── */
  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = canvas.width  = Math.round(rect.width);
    H = canvas.height = Math.round(rect.height);
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    resize();
    nodes = Array.from({ length: N }, () => new Dot());
    tick  = 0;
    nextWave = 110;
    // Seed ~16% initially awake
    [...nodes].sort(() => Math.random() - 0.5)
      .slice(0, Math.ceil(N * 0.16))
      .forEach((n, i) => n.wake(i * 260));
  }

  /* ── Main loop ───────────────────────────────────────────── */
  function loop() {
    ctx.clearRect(0, 0, W, H);

    if (++tick >= nextWave) {
      tick = 0;
      triggerWave();
    }

    drawConnections();
    nodes.forEach(n => { n.update(); n.draw(); });
    drawHUD();

    rafId = requestAnimationFrame(loop);
  }

  /* ── Intersection observer — start/stop with screen ─────── */
  const section = document.getElementById('s7');
  if (!section) return;

  let running = false;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !running) {
      running = true;
      init();
      loop();
    } else if (!entries[0].isIntersecting && running) {
      running = false;
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }, { threshold: 0.15 });

  obs.observe(section);
  window.addEventListener('resize', () => { if (running) resize(); });
})();

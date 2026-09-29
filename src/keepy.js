// Keepy-uppy: tap the ball to keep it in the air. Where you tap decides
// which way it flies. Best score is saved in the visitor's browser.

const W = 480;
const H = 520;

export function initKeepy(canvas, { onScore = () => {} } = {}) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  let best = 0;
  try {
    best = Number(localStorage.getItem('keepy-best')) || 0;
  } catch {
    /* storage unavailable, fine */
  }

  const ball = { x: W / 2, y: 150, vx: 0, vy: 0, r: 34, rot: 0, spin: 0 };
  let state = 'idle'; // idle | play | over
  let score = 0;
  let particles = [];
  let running = false;
  let last = performance.now();

  const css = () => getComputedStyle(document.documentElement);
  const color = (name, fallback) => css().getPropertyValue(name).trim() || fallback;

  function reset() {
    ball.x = W / 2;
    ball.y = 150;
    ball.vx = 0;
    ball.vy = 0;
    ball.spin = 0;
    score = 0;
    particles = [];
    onScore(score, best);
  }

  function burst(x, y) {
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 2 + Math.random() * 4;
      particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1 });
    }
  }

  function kick(px, py) {
    const dx = ball.x - px;
    ball.vy = -(11 + Math.random() * 1.5);
    ball.vx = (dx / ball.r) * 4.5;
    ball.spin = (dx / ball.r) * 0.2;
    score += 1;
    if (score > best) {
      best = score;
      try {
        localStorage.setItem('keepy-best', String(best));
      } catch {
        /* ignore */
      }
    }
    burst(px, py);
    onScore(score, best);
  }

  function pointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * W, y: ((e.clientY - rect.top) / rect.height) * H };
  }

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const p = pointerPos(e);
    if (state !== 'play') {
      reset();
      state = 'play';
      return;
    }
    if (Math.hypot(p.x - ball.x, p.y - ball.y) < ball.r * 1.7) kick(p.x, p.y);
  });

  // Keyboard support: space or enter starts and kicks from below the ball.
  canvas.tabIndex = 0;
  canvas.addEventListener('keydown', (e) => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    e.preventDefault();
    if (state !== 'play') {
      reset();
      state = 'play';
    } else {
      kick(ball.x + (Math.random() - 0.5) * ball.r, ball.y + ball.r);
    }
  });

  function update(dt) {
    if (state === 'play') {
      ball.vy += 0.38 * dt;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      ball.rot += ball.spin * dt;
      if (ball.x < ball.r) {
        ball.x = ball.r;
        ball.vx = Math.abs(ball.vx) * 0.9;
      }
      if (ball.x > W - ball.r) {
        ball.x = W - ball.r;
        ball.vx = -Math.abs(ball.vx) * 0.9;
      }
      if (ball.y < ball.r) {
        ball.y = ball.r;
        ball.vy = Math.abs(ball.vy) * 0.5;
      }
      if (ball.y > H - ball.r) {
        ball.y = H - ball.r;
        state = 'over';
      }
    } else {
      ball.rot += 0.01 * dt;
      ball.y = state === 'idle' ? 150 + Math.sin(performance.now() / 400) * 8 : ball.y;
    }
    particles = particles.filter((p) => (p.life -= 0.04 * dt) > 0);
    for (const p of particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }

  function draw() {
    const sky = color('--b', '#19e3ff');
    const accent = color('--a', '#ff3d9a');
    const yellow = color('--c', '#ffd93b');
    const ink = color('--ink', '#0d0821');

    // pitch
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? '#2f8f4e' : '#38a35a';
      ctx.fillRect(0, (H / 8) * i, W, H / 8 + 1);
    }
    ctx.strokeStyle = 'rgba(255,255,255,.75)';
    ctx.lineWidth = 3;
    ctx.strokeRect(14, 14, W - 28, H - 28);
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 60, 0, Math.PI * 2);
    ctx.stroke();

    // shadow
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.beginPath();
    ctx.ellipse(ball.x, H - 22, ball.r * (0.9 - Math.min(ball.y / H, 0.6) * 0.4), 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // ball
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.rot);
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = sky;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * 13, Math.sin(a) * 13);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 13, Math.sin(a) * 13);
      ctx.lineTo(Math.cos(a) * ball.r, Math.sin(a) * ball.r);
      ctx.stroke();
    }
    ctx.restore();

    // particles
    for (const p of particles) {
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = Math.random() > 0.5 ? yellow : accent;
      ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
    }
    ctx.globalAlpha = 1;

    // text
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.font = "64px Bangers, 'Arial Black', sans-serif";
    ctx.lineWidth = 8;
    ctx.strokeStyle = ink;
    ctx.fillStyle = '#fff';
    if (state === 'play') {
      ctx.strokeText(String(score), W / 2, 80);
      ctx.fillText(String(score), W / 2, 80);
    } else {
      ctx.font = "44px Bangers, 'Arial Black', sans-serif";
      const title = state === 'idle' ? 'TAP TO START' : `DROPPED AT ${score}`;
      const sub = state === 'idle' ? 'Tap the ball to keep it up' : 'Tap to go again';
      ctx.strokeText(title, W / 2, H / 2 + 120);
      ctx.fillText(title, W / 2, H / 2 + 120);
      ctx.font = "24px Bangers, 'Arial Black', sans-serif";
      ctx.lineWidth = 5;
      ctx.strokeText(sub, W / 2, H / 2 + 156);
      ctx.fillText(sub, W / 2, H / 2 + 156);
    }
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 16.667, 2);
    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  // Only run while the canvas is on screen.
  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        requestAnimationFrame(loop);
      } else if (!entry.isIntersecting) {
        running = false;
      }
    },
    { threshold: 0.1 }
  ).observe(canvas);

  onScore(0, best);
  draw();
}

export function triggerConfetti() {
  if (typeof window === 'undefined') return;
  try {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      canvas.remove();
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f59e0b', '#fbbf24', '#38bdf8', '#ef4444', '#10b981', '#a855f7'];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotSpeed: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width * (0.4 + Math.random() * 0.2),
        y: canvas.height * 0.6,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 16 - 6,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        alpha: 1
      });
    }

    let frame = 0;
    function loop() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // Gravity
        p.rotation += p.rotSpeed;
        p.alpha -= 0.012;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      }

      frame++;
      if (alive && frame < 160) {
        requestAnimationFrame(loop);
      } else {
        canvas.remove();
      }
    }

    requestAnimationFrame(loop);
  } catch {
    // Graceful fallback
  }
}

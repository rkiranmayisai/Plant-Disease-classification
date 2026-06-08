// ================================================
// PlantAI - Particle Animation System
// ================================================

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.leafParticles = [];
    this.animFrame = null;
    this.resize();
    this.init();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + 20,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 0.8 + 0.3),
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      color: Math.random() > 0.5 ? '#52b788' : '#2d6a4f',
      pulse: Math.random() * Math.PI * 2
    };
  }

  createLeafParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: -20,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      speedY: Math.random() * 0.5 + 0.2,
      speedX: Math.sin(Date.now() * 0.001 + Math.random() * 6) * 0.5,
      size: Math.random() * 10 + 5,
      opacity: Math.random() * 0.15 + 0.05,
      emoji: ['🌿', '🍃', '🌱'][Math.floor(Math.random() * 3)]
    };
  }

  init() {
    for (let i = 0; i < 80; i++) {
      const p = this.createParticle();
      p.y = Math.random() * this.canvas.height;
      this.particles.push(p);
    }
    for (let i = 0; i < 12; i++) {
      const lp = this.createLeafParticle();
      lp.y = Math.random() * this.canvas.height;
      this.leafParticles.push(lp);
    }
    this.animate();
  }

  drawLeaf(ctx, x, y, size, rotation, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size * 0.8, -size * 0.5, size * 0.8, size * 0.5, 0, size);
    ctx.bezierCurveTo(-size * 0.8, size * 0.5, -size * 0.8, -size * 0.5, 0, -size);
    ctx.fillStyle = '#52b788';
    ctx.fill();
    ctx.restore();
  }

  animate() {
    if (!this.canvas) return;
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    this.particles.forEach((p, i) => {
      p.pulse += 0.02;
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.pulse) * 0.3;
      p.opacity = Math.max(0, Math.min(0.7, p.opacity + Math.sin(p.pulse) * 0.01));

      if (p.y < -10) {
        this.particles[i] = this.createParticle();
        return;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Connect nearby particles
    this.particles.forEach((p1, i) => {
      this.particles.slice(i + 1, i + 5).forEach(p2 => {
        const dx = p2.x - p1.x, dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = '#52b788';
          ctx.globalAlpha = (1 - dist / 100) * 0.15;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    });

    // Draw leaf particles
    this.leafParticles.forEach((lp, i) => {
      lp.y += lp.speedY;
      lp.x += Math.sin(Date.now() * 0.001 + i) * 0.3;
      lp.rotation += lp.rotationSpeed;

      if (lp.y > this.canvas.height + 20) {
        this.leafParticles[i] = this.createLeafParticle();
        return;
      }

      this.drawLeaf(ctx, lp.x, lp.y, lp.size, lp.rotation, lp.opacity);
    });

    this.animFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem('particleCanvas');
});

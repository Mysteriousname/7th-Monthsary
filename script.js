window.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro-video-container'); // UPDATED here
  const profileSelect = document.getElementById('profile-select');

  if (intro && profileSelect) {
    profileSelect.style.opacity = 0;
    profileSelect.style.display = 'none';

    setTimeout(() => {
      let introOpacity = 1;
      const fadeOutIntro = setInterval(() => {
        if (introOpacity <= 0) {
          clearInterval(fadeOutIntro);
          intro.style.display = 'none';

          profileSelect.classList.remove('hidden');
          profileSelect.style.display = 'block';

          let profileOpacity = 0;
          const fadeInProfile = setInterval(() => {
            if (profileOpacity >= 1) {
              clearInterval(fadeInProfile);
            } else {
              profileOpacity += 0.05;
              profileSelect.style.opacity = profileOpacity;
            }
          }, 30);
        } else {
          introOpacity -= 0.05;
          intro.style.opacity = introOpacity;
        }
      }, 30);
    }, 3000);
  }
});

// Function to show content sections on profile pages (unchanged)
function showContent(id) {
  const content = document.getElementById(id);
  if (content) {
    content.classList.remove('hidden');
    content.scrollIntoView({ behavior: 'smooth' });
  }
}

// Heart-shaped fireworks effect on canvas

(() => {
  const canvas = document.getElementById('fireworks');
  const ctx = canvas.getContext('2d');

  let width, height;
  let fireworks = [];
  let particles = [];
  const gravity = 0.02;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  // Heart shape function for particle positioning (parametric)
  function heartShape(t) {
    // t from 0 to 2*PI
    return {
      x: 16 * Math.pow(Math.sin(t), 3),
      y:
        -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        ), // Negative for canvas coords
    };
  }

  class Firework {
    constructor() {
      this.x = Math.random() * width;
      this.y = height;
      this.targetY = Math.random() * height / 2 + height / 4;
      this.speed = 4 + Math.random() * 3;
      this.exploded = false;
      this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    }

    update() {
      if (!this.exploded) {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
          this.explode();
          this.exploded = true;
        }
      }
    }

    explode() {
      const numParticles = 30;
      for (let i = 0; i < numParticles; i++) {
        const t = (i / numParticles) * 2 * Math.PI;
        const pos = heartShape(t);
        particles.push(
          new Particle(
            this.x,
            this.y,
            pos.x * 8,
            pos.y * 8,
            this.color
          )
        );
      }
    }

    draw() {
      if (!this.exploded) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
  }

  class Particle {
    constructor(x, y, vx, vy, color) {
      this.x = x;
      this.y = y;
      this.vx = vx * (0.3 + Math.random() * 0.7);
      this.vy = vy * (0.3 + Math.random() * 0.7);
      this.alpha = 1;
      this.color = color;
      this.size = 3;
    }

    update() {
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.vy += gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.02;
      this.size *= 0.96;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.fillStyle = this.color;
      // Draw small hearts for fun!
      drawSmallHeart(ctx, this.x, this.y, this.size);
      ctx.restore();
    }
  }

  // Draw small heart shape for each particle
  function drawSmallHeart(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(
      x,
      y,
      x - size / 2,
      y,
      x - size / 2,
      y + topCurveHeight
    );
    ctx.bezierCurveTo(
      x - size / 2,
      y + (size + topCurveHeight) / 2,
      x,
      y + (size + topCurveHeight) / 1.5,
      x,
      y + size
    );
    ctx.bezierCurveTo(
      x,
      y + (size + topCurveHeight) / 1.5,
      x + size / 2,
      y + (size + topCurveHeight) / 2,
      x + size / 2,
      y + topCurveHeight
    );
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    if (Math.random() < 0.05) {
      fireworks.push(new Firework());
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].draw();
      if (fireworks[i].exploded) {
        fireworks.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      if (particles[i].alpha <= 0 || particles[i].size <= 0.1) {
        particles.splice(i, 1);
      } else {
        particles[i].draw();
      }
    }

    requestAnimationFrame(loop);
  }

  loop();
})();



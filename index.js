const canvas = document.getElementById("index-background");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);

/* =========================
   MOUSE
========================= */
const mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

/* =========================
   ARRAYS
========================= */
const stars = [];
const beams = [];
const streaks = [];
const particles = [];
const ribbons = [];

/* =========================
   STAR
========================= */
class Star {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 5;
    this.opacity = Math.random();
    this.speed = 0.01 + Math.random() * 0.03;
  }

  update() {
    this.opacity += this.speed;

    if (this.opacity > 1 || this.opacity < 0.2) {
      this.speed *= -1;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
    ctx.fill();
  }
}

/* =========================
   STREAK
========================= */
class Streak {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.length = 120 + Math.random() * 250;
    this.speed = 1 + Math.random() * 1;
    this.width = 1 + Math.random() * 3;
    this.angle = Math.random() * Math.PI * 2;
    this.wave = Math.random() * 6;
    this.alpha = 0.15 + Math.random() * 0.35;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    this.angle += Math.sin(Date.now() * 0.00025 + this.wave) * 0.002;

    if (
      this.x < -200 ||
      this.x > canvas.width + 200 ||
      this.y < -200 ||
      this.y > canvas.height + 200
    ) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);

    ctx.quadraticCurveTo(
      this.x + Math.cos(this.angle) * 80,
      this.y + Math.sin(this.angle) * 80,
      this.x + Math.cos(this.angle) * this.length,
      this.y + Math.sin(this.angle) * this.length
    );

    ctx.strokeStyle = `rgba(37,99,235,${this.alpha})`;
    ctx.lineWidth = this.width;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#2563eb";
    ctx.stroke();
  }
}

/* =========================
   PARTICLE
========================= */
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speed = Math.random() * 0.8+ 0.4;
  }

  update() {
    this.y -= this.speed;

    if (this.y < 0) {
      this.y = canvas.height;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(120,180,255,.8)";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#2563eb";
    ctx.fill();
  }
}



/* =========================
   LIGHT BEAM
========================= */
class LightBeam {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -300;
    this.width = 200 + Math.random() * 400;
    this.height = canvas.height * 2;
    this.speed = 0.15 + Math.random() * 0.35;
    this.angle = -25 + Math.random() * 12;
    this.opacity = 0.025 + Math.random() * 0.03;
  }

  update() {
    this.y += this.speed;

    if (this.y > canvas.height + 400) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.angle * Math.PI) / 180);

    const gradient = ctx.createLinearGradient(0, 0, this.width, 0);

    gradient.addColorStop(0, "rgba(37,99,235,0)");
    gradient.addColorStop(0.5, `rgba(37,99,235,${this.opacity})`);
    gradient.addColorStop(1, "rgba(37,99,235,0)");

    ctx.fillStyle = gradient;
    

    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.restore();
  }
}

/* =========================
   RIBBON
========================= */
class Ribbon {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = -300;
    this.y = Math.random() * canvas.height;
    this.speed = 0.5 + Math.random() * 1.2;
    this.width = 180 + Math.random() * 220;
    this.opacity = 0.05 + Math.random() * 0.08;
    this.curve = (Math.random() - 0.5) * 300;
  }

  update() {
    this.x += this.speed;
    if (this.x > canvas.width + 300) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);

    ctx.bezierCurveTo(
      this.x + this.width * 0.3,
      this.y - this.curve,
      this.x + this.width * 0.7,
      this.y + this.curve,
      this.x + this.width,
      this.y
    );

    ctx.strokeStyle = `rgba(37,99,235,${this.opacity})`;
    ctx.lineWidth = 6;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#2563eb";
    ctx.stroke();
  }
}

/* =========================
   INIT
========================= */
function init() {
  stars.length = 0;
  beams.length = 0;
  streaks.length = 0;
  particles.length = 0;
  ribbons.length = 0;

for (let i = 0; i < 100; i++) stars.push(new Star());
for (let i = 0; i < 2; i++) beams.push(new LightBeam());
for (let i = 0; i < 30; i++) streaks.push(new Streak());
for (let i = 0; i < 80; i++) particles.push(new Particle());
for (let i = 0; i < 4; i++) ribbons.push(new Ribbon());
}

init();

/* =========================
   ANIMATION LOOP
========================= */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw everything
  stars.forEach((o) => {
    o.update();
    o.draw();
  });

  beams.forEach((o) => {
    o.update();
    o.draw();
  });

  streaks.forEach((o) => {
    o.update();
    o.draw();
  });

  particles.forEach((o) => {
    o.update();
    o.draw();
  });

  ribbons.forEach((o) => {
    o.update();
    o.draw();
  });

  requestAnimationFrame(animate);
}

animate();

 const hero = document.getElementById("heroContent");

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const fadeEnd = window.innerHeight * 0.8;
    // Fade
    let opacity = 1 - scrollY / fadeEnd;
    opacity = Math.max(0, Math.min(1, opacity));
    // Move upward as it fades
    const translateY = Math.min(scrollY * 0.35, 120);
    hero.style.opacity = opacity;
    hero.style.transform = `translateY(-${translateY}px)`;
});
    // Section fade
    const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", () => {
    const triggerPoint = window.innerHeight * 0.8;
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < triggerPoint && rect.bottom > 0) {
            const progress = Math.min(
                (triggerPoint - rect.top) / triggerPoint,
                1
            );
            section.style.opacity = progress;
            section.style.transform = `translateY(${30 - progress * 30}px)`;
        } else {
            section.style.opacity = 0;
            section.style.transform = "translateY(30px)";
        }
    });
});
    // Services hidden section
  const cards = document.querySelectorAll(".as-feature-card");
  cards.forEach(card => {
      const arrow = card.querySelector(".as-arrow");
      arrow.addEventListener("click", () => {
          card.classList.toggle("active");
      });
});

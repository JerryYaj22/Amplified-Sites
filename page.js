const canvas = document.getElementById("background");
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
    this.size = Math.random() * 3;
    this.opacity = Math.random();
    this.speed = 0.01 + Math.random() * 0.01;
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
    this.speed = 3 + Math.random() * 15;
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
  particles.length = 0;
  ribbons.length = 0;

for (let i = 0; i < 120; i++) stars.push(new Star());
for (let i = 0; i < 2; i++) beams.push(new LightBeam());
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

// Privacy Policy / Terms Accordion
const termHeaders = document.querySelectorAll(".term-header");
termHeaders.forEach(header => {
    header.addEventListener("click", () => {
        const item = header.parentElement;
        // Close all others
        document.querySelectorAll(".term-item").forEach(el => {
            if (el !== item) {
                el.classList.remove("active");
            }
        });
        // Toggle clicked one
        item.classList.toggle("active");
    });
});
// Initialize EmailJS
emailjs.init({
    publicKey: "QaV193SqiHUiRX3cj"
});

// Start Your Journey Form
const journeyForm = document.getElementById("journeyForm");
if (journeyForm) {
    journeyForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const templateParams = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            business: document.getElementById("business").value,
            message: document.getElementById("message").value
        };
        emailjs.send(
            "service_lqvhehg",
            "template_lhadv91",
            templateParams
        )
        .then(function() {
            console.log("Email sent successfully!");
            window.location.href = "thankyoupage.html";
        })
        .catch(function(error) {
            console.error("EmailJS Error:", error);
            alert(
                "There was a problem submitting your project. Please try again."
            );
        });
    });
}

const phoneInput = document.getElementById("phone");

if (phoneInput) {
    phoneInput.addEventListener("input", function () {

        // Remove everything except numbers
        let numbers = this.value.replace(/\D/g, "");

        // Limit to 10 digits
        numbers = numbers.substring(0, 10);

        // Add dashes automatically
        if (numbers.length > 6) {
            this.value = numbers.replace(
                /(\d{3})(\d{3})(\d{1,4})/,
                "$1-$2-$3"
            );
        } else if (numbers.length > 3) {
            this.value = numbers.replace(
                /(\d{3})(\d+)/,
                "$1-$2"
            );
        } else {
            this.value = numbers;
        }

    });
}

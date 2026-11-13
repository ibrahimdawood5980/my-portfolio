const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "×" : "☰";
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
    });
  });
}

/* ===== INTERACTIVE NETWORK PARTICLES ===== */

const canvas = document.createElement("canvas");
canvas.id = "mouse-particles";
document.body.prepend(canvas);

const ctx = canvas.getContext("2d");

let particles = [];
let width = 0;
let height = 0;
let mouse = { x: null, y: null };

const maxDistance = 145;
const mouseDistance = 190;

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(
        110,
        Math.max(45, Math.floor((width * height) / 14000))
    );

    particles = [];

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.65,
            vy: (Math.random() - 0.5) * 0.65,
            radius: Math.random() * 1.7 + 0.8
        });
    }
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget) {
        mouse.x = null;
        mouse.y = null;
    }
});

function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    // Move particles
    particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseDistance && distance > 0) {
                const force = (mouseDistance - distance) / mouseDistance;
                p.x -= (dx / distance) * force * 0.45;
                p.y -= (dy / distance) * force * 0.45;
            }
        }
    });

    // Connect particles with each other
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const opacity = 1 - distance / maxDistance;

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(100, 180, 255, ${opacity * 0.38})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
            }
        }
    }

    // Connect mouse to nearby particles
    if (mouse.x !== null && mouse.y !== null) {
        particles.forEach((p) => {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseDistance) {
                const opacity = 1 - distance / mouseDistance;

                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = `rgba(70, 170, 255, ${opacity * 0.65})`;
                ctx.lineWidth = 0.9;
                ctx.stroke();
            }
        });
    }

    // Draw glowing particles
    particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(170, 215, 255, 0.9)";
        ctx.shadowBlur = 9;
        ctx.shadowColor = "#168cff";
        ctx.fill();
    });

    ctx.shadowBlur = 0;

    requestAnimationFrame(animateParticles);
}

resizeCanvas();
animateParticles();

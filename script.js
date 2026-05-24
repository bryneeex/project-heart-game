function createBgHeart() {
  const heart = document.createElement("div");
  heart.classList.add("bg-heart");
  heart.innerHTML = "💖";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = Math.random() * 3 + 3 + "s";
  heart.style.fontSize = Math.random() * 20 + 15 + "px";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 6000);
}
setInterval(createBgHeart, 400);


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
const targetScore = 10;
let isGameRunning = false;
let hearts = [];
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();


class HeartTarget {
  constructor() {
    this.x = Math.random() * (canvas.width - 60) + 30;
    this.y = canvas.height + 50;
    this.size = Math.random() * 20 + 30;
    this.speed = Math.random() * 2 + 2;
    this.wobble = Math.random() * 2;
    this.wobbleSpeed = Math.random() * 0.05 + 0.02;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      -this.size / 2,
      -this.size / 2,
      -this.size,
      0,
      0,
      this.size,
    );
    ctx.bezierCurveTo(this.size, 0, this.size / 2, -this.size / 2, 0, 0);
    ctx.fillStyle = "#ff4d6d";
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.y -= this.speed;
    this.x += Math.sin(this.y * this.wobbleSpeed) * this.wobble;
  }
}


class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 2;
    this.speedX = Math.random() * 6 - 3;
    this.speedY = Math.random() * 6 - 3;
    this.color = `hsl(${Math.random() * 20 + 340}, 100%, 70%)`;
    this.alpha = 1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.02;
  }
}

function spawnHeart() {
  if (!isGameRunning) return;
  hearts.push(new HeartTarget());
  setTimeout(spawnHeart, Math.random() * 600 + 400);
}

function animate() {
  if (!isGameRunning && particles.length === 0) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].update();
    hearts[i].draw();
    if (hearts[i].y < -50) {
      hearts.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}


canvas.addEventListener("click", (e) => {
  if (!isGameRunning) return;
  const clickX = e.clientX;
  const clickY = e.clientY;

  for (let i = hearts.length - 1; i >= 0; i--) {
    const h = hearts[i];
    const dist = Math.hypot(clickX - h.x, clickY - (h.y + h.size / 2));
    if (dist < h.size + 15) {
      for (let p = 0; p < 15; p++) {
        particles.push(new Particle(h.x, h.y + h.size / 2));
      }
      hearts.splice(i, 1);
      score++;
      document.getElementById("score").innerText = score;

      if (score >= targetScore) {
        endGame();
      }
      break;
    }
  }
});

function startGame() {
  document.getElementById("welcome-screen").classList.add("hidden");
  canvas.style.display = "block";
  document.getElementById("game-ui").style.display = "block";

  isGameRunning = true;
  score = 0;
  document.getElementById("score").innerText = score;
  hearts = [];
  particles = [];

  spawnHeart();
  animate();
}

function endGame() {
  isGameRunning = false;
  canvas.style.display = "none";
  document.getElementById("game-ui").style.display = "none";
  document.getElementById("ending-screen").classList.remove("hidden");
}

function moveNoButton() {
  const btn = document.getElementById("btn-no");
  const x = Math.random() * (window.innerWidth - btn.offsetWidth - 40) + 20;
  const y = Math.random() * (window.innerHeight - btn.offsetHeight - 40) + 20;

  btn.style.position = "fixed";
  btn.style.left = x + "px";
  btn.style.top = y + "px";
}

function celebrate() {
  alert("Yay! Best day ever! ❤️ Hubungi aku sekarang ya! 🥰");
}

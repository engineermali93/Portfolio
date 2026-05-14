// ——— CIVIL ENGINEERING BACKGROUND ANIMATION ———
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ——— Blueprint Grid ———
function drawGrid() {
  const spacing = 60;
  ctx.strokeStyle = 'rgba(0, 200, 255, 0.03)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < canvas.width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// ——— Floating Structural Elements ———
class StructuralElement {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 30 + 15;
    this.type = Math.floor(Math.random() * 5); // 0=beam, 1=truss, 2=column, 3=arch, 4=ibeam
    this.opacity = Math.random() * 0.06 + 0.02;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.2;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.003;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotSpeed;

    if (this.x < -60 || this.x > canvas.width + 60 ||
        this.y < -60 || this.y > canvas.height + 60) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.strokeStyle = `rgba(0, 200, 255, ${this.opacity})`;
    ctx.lineWidth = 1;

    const s = this.size;

    switch (this.type) {
      case 0: // Beam with supports
        ctx.beginPath();
        ctx.moveTo(-s, 0);
        ctx.lineTo(s, 0);
        ctx.moveTo(-s, 0);
        ctx.lineTo(-s + 5, 8);
        ctx.moveTo(-s, 0);
        ctx.lineTo(-s - 5, 8);
        ctx.moveTo(s, 0);
        ctx.lineTo(s + 5, 8);
        ctx.moveTo(s, 0);
        ctx.lineTo(s - 5, 8);
        ctx.stroke();
        break;

      case 1: // Truss triangle
        ctx.beginPath();
        ctx.moveTo(-s, s * 0.5);
        ctx.lineTo(s, s * 0.5);
        ctx.lineTo(0, -s * 0.5);
        ctx.closePath();
        // Internal members
        ctx.moveTo(-s * 0.5, s * 0.5);
        ctx.lineTo(0, -s * 0.5);
        ctx.moveTo(s * 0.5, s * 0.5);
        ctx.lineTo(0, -s * 0.5);
        ctx.moveTo(0, s * 0.5);
        ctx.lineTo(0, -s * 0.5);
        ctx.stroke();
        break;

      case 2: // Column with base
        ctx.beginPath();
        ctx.rect(-s * 0.15, -s, s * 0.3, s * 2);
        ctx.moveTo(-s * 0.4, s);
        ctx.lineTo(s * 0.4, s);
        ctx.moveTo(-s * 0.35, -s);
        ctx.lineTo(s * 0.35, -s);
        ctx.stroke();
        break;

      case 3: // Arch
        ctx.beginPath();
        ctx.arc(0, s * 0.3, s, Math.PI, 0, false);
        ctx.moveTo(-s, s * 0.3);
        ctx.lineTo(-s, s * 0.3 + 10);
        ctx.moveTo(s, s * 0.3);
        ctx.lineTo(s, s * 0.3 + 10);
        ctx.stroke();
        break;

      case 4: // I-Beam cross section
        ctx.beginPath();
        // Top flange
        ctx.moveTo(-s * 0.6, -s * 0.5);
        ctx.lineTo(s * 0.6, -s * 0.5);
        // Bottom flange
        ctx.moveTo(-s * 0.6, s * 0.5);
        ctx.lineTo(s * 0.6, s * 0.5);
        // Web
        ctx.moveTo(0, -s * 0.5);
        ctx.lineTo(0, s * 0.5);
        // Flange thickness
        ctx.moveTo(-s * 0.6, -s * 0.5);
        ctx.lineTo(-s * 0.6, -s * 0.35);
        ctx.moveTo(s * 0.6, -s * 0.5);
        ctx.lineTo(s * 0.6, -s * 0.35);
        ctx.moveTo(-s * 0.6, s * 0.5);
        ctx.lineTo(-s * 0.6, s * 0.35);
        ctx.moveTo(s * 0.6, s * 0.5);
        ctx.lineTo(s * 0.6, s * 0.35);
        ctx.stroke();
        break;
    }

    ctx.restore();
  }
}

// ——— Floating Particles (construction dust) ———
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.opacity = Math.random() * 0.15 + 0.05;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = Math.random() * -0.3 - 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y < -10) {
      this.y = canvas.height + 10;
      this.x = Math.random() * canvas.width;
    }
    if (this.x < -10) this.x = canvas.width + 10;
    if (this.x > canvas.width + 10) this.x = -10;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 200, 255, ${this.opacity})`;
    ctx.fill();
  }
}

// Create elements
const elements = [];
const particles = [];
const elementCount = Math.min(12, Math.floor(window.innerWidth / 120));
const particleCount = Math.min(40, Math.floor(window.innerWidth / 30));

for (let i = 0; i < elementCount; i++) elements.push(new StructuralElement());
for (let i = 0; i < particleCount; i++) particles.push(new Particle());

// ——— Animation Loop ———
function animateBg() {
  requestAnimationFrame(animateBg);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  elements.forEach(el => {
    el.update();
    el.draw();
  });

  particles.forEach(p => {
    p.update();
    p.draw();
  });
}
animateBg();
// ——— CURSOR ———
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
document.addEventListener('mousemove', e=>{
  cur.style.left = e.clientX+'px';
  cur.style.top = e.clientY+'px';
  ring.style.left = e.clientX+'px';
  ring.style.top = e.clientY+'px';
});

// ——— SCROLL REVEAL ———
const reveals = document.querySelectorAll('.reveal, .tl-item, .proj-card, .skill-pill, .cert-card');
const obs = new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('visible'), i*60);
    }
  });
}, {threshold:.1});
reveals.forEach(r=>{
  if(!r.classList.contains('tl-item') && !r.classList.contains('proj-card') && !r.classList.contains('skill-pill') && !r.classList.contains('cert-card')){
    r.classList.add('reveal');
  }
  obs.observe(r);
});

// skill pills stagger
document.querySelectorAll('.skill-pill').forEach((p,i)=>{
  p.style.transitionDelay = (i*40)+'ms';
});

// cert cards stagger
document.querySelectorAll('.cert-card').forEach((p,i)=>{
  p.style.transitionDelay = (i*40)+'ms';
});

// ——— HAMBURGER MENU ———
const hamburger = document.getElementById('hamburger');
const closeBtn = document.getElementById('closeBtn');
const navLinks = document.getElementById('navLinks');
const navLinksAnchors = document.querySelectorAll('.nav-links a');

if (hamburger && closeBtn && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });

  navLinksAnchors.forEach(anchor => {
    anchor.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// ——— TYPEWRITER EFFECT ———
const typedTextSpan = document.querySelector('.typed-text');
const cursorSpan = document.querySelector('.cursor-blink');

const textArray = [
  "Final-Year Civil Engineering Student · UET Taxila",
  "Proficient in Primavera P6, AutoCAD & Revit",
  "Expertise in ETABS, SAP2000 & SAFE",
  "Experienced with Plan Swift & MATLAB"
];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else {
    cursorSpan.classList.remove("typing");
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } else {
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if(textArrayIndex >= textArray.length) textArrayIndex = 0;
    setTimeout(type, typingDelay + 1100);
  }
}

if(textArray.length) setTimeout(type, newTextDelay + 250);

// ——— BACK TO TOP ARROW ———
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.5) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

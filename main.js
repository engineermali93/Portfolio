// ——— MARINE HYDRAULICS WAVE & STREAMLINE ANIMATION ———
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Scientific Coordinate Grid
function drawGrid() {
  const spacing = 80;
  ctx.strokeStyle = 'rgba(100, 255, 218, 0.025)'; // Faint gold grid lines
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

// Hydrodynamic Wave Parameters (Representing Marine Wave Mechanics)
const waves = [
  {
    amplitude: 45,
    frequency: 0.003,
    speed: 0.02,
    phase: 0,
    yRatio: 0.65, // Positioned in lower third
    color: 'rgba(100, 255, 218, 0.06)' // Academic Gold
  },
  {
    amplitude: 25,
    frequency: 0.005,
    speed: -0.015,
    phase: Math.PI / 4,
    yRatio: 0.7,
    color: 'rgba(0, 191, 165, 0.05)' // Marine Blue
  },
  {
    amplitude: 15,
    frequency: 0.008,
    speed: 0.03,
    phase: Math.PI / 2,
    yRatio: 0.62,
    color: 'rgba(100, 255, 218, 0.03)'
  }
];

// Draw waves on the canvas
function drawWaves() {
  waves.forEach(w => {
    ctx.beginPath();
    ctx.strokeStyle = w.color;
    ctx.lineWidth = 1.5;
    
    w.phase += w.speed;
    const baseY = canvas.height * w.yRatio;
    
    for (let x = 0; x < canvas.width; x += 5) {
      const y = baseY + Math.sin(x * w.frequency + w.phase) * w.amplitude;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  });
}

// Flow Streamline / Water Particle class (representing current flows)
class FlowStreamline {
  constructor() {
    this.reset();
    this.x = Math.random() * canvas.width;
  }

  reset() {
    this.x = -50;
    this.yBase = canvas.height * (0.3 + Math.random() * 0.45); // Spread across center
    this.amplitude = Math.random() * 25 + 10;
    this.frequency = Math.random() * 0.004 + 0.002;
    this.phase = Math.random() * Math.PI * 2;
    this.speedX = Math.random() * 0.6 + 0.3; // Flows left to right
    this.speedPhase = Math.random() * 0.015 + 0.005;
    this.length = Math.random() * 60 + 20;
    this.opacity = Math.random() * 0.12 + 0.04; // Higher opacity for glowing particles
    this.colorType = Math.random() > 0.5 ? 'gold' : 'blue';
  }

  update() {
    this.x += this.speedX;
    this.phase += this.speedPhase;
    if (this.x > canvas.width + 50) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    const strokeColor = this.colorType === 'gold' 
      ? `rgba(100, 255, 218, ${this.opacity})`
      : `rgba(0, 191, 165, ${this.opacity})`;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = Math.random() * 1.5 + 0.5;
    
    // Draw horizontal path with flow deflection
    for (let dx = 0; dx < this.length; dx += 4) {
      const px = this.x - dx;
      const py = this.yBase + Math.sin(px * this.frequency + this.phase) * this.amplitude;
      if (dx === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
  }
}

// Instantiate streamlines
const streamlines = [];
const streamlineCount = Math.min(30, Math.floor(window.innerWidth / 40));
for (let i = 0; i < streamlineCount; i++) {
  streamlines.push(new FlowStreamline());
}

// Animation loop
function animateBg() {
  requestAnimationFrame(animateBg);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawGrid();
  drawWaves();
  
  streamlines.forEach(stream => {
    stream.update();
    stream.draw();
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
  "Civil & Hydraulics Engineer | CSC Scholar",
  "MSc Scholar — Tianjin University, China",
  "Research Focus: Durability of Port & Offshore Structures",
  "Seeking PhD Placements & Doctoral Opportunities",
  "Expertise in ANSYS Fluent, Abaqus FEA, Python & MATLAB"
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

// Circular Skills Progress Bars Animation
document.addEventListener("DOMContentLoaded", () => {
  const circles = document.querySelectorAll(".skill-circle-wrap");
  const animateCircles = () => {
    circles.forEach(circle => {
      const percent = circle.getAttribute("data-percent");
      const progressCircle = circle.querySelector(".progress");
      if (progressCircle) {
        const radius = 32;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;
        progressCircle.style.strokeDasharray = `${circumference}`;
        progressCircle.style.strokeDashoffset = `${offset}`;
      }
    });
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCircles();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const skillsSection = document.getElementById("about");
  if (skillsSection) {
    observer.observe(skillsSection);
  } else {
    animateCircles();
  }

  /* ── Contact Form Controller ── */
  const form = document.getElementById("contactForm");
  const toast = document.getElementById("toast");

  function showToast(msg, type) {
    if (toast) {
      toast.textContent = msg;
      toast.className = "toast " + type + " show";
      setTimeout(() => toast.classList.remove("show"), 4000);
    }
  }

  function validateField(input) {
    const err = input.parentElement.querySelector(".form-error");
    if (!input.value.trim()) {
      input.classList.add("error");
      if (err) err.classList.add("show");
      return false;
    }
    input.classList.remove("error");
    if (err) err.classList.remove("show");
    return true;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach((f) => {
        if (!validateField(f)) valid = false;
      });
      if (!valid) return;

      const btn = form.querySelector(".form-submit");
      btn.disabled = true;
      btn.innerHTML = '<span class="btn-spinner"></span> Sending…';

      // Simulate sending delay
      setTimeout(() => {
        showToast("Message sent successfully! ✓", "success");
        // Hide standard inputs and display success message
        form.querySelector(".contact-divider").style.display = "none";
        form.querySelectorAll(".form-row").forEach(el => el.style.display = "none");
        form.querySelector(".form-msg-wrap").style.display = "none";
        form.querySelector(".form-submit-wrap").style.display = "none";
        document.getElementById("formSuccess").style.display = "block";
        btn.disabled = false;
        btn.textContent = "Send Message";
      }, 1500);
    });

    form.querySelectorAll("[required]").forEach((f) => {
      f.addEventListener("blur", () => validateField(f));
      f.addEventListener("input", () => {
        if (f.classList.contains("error")) validateField(f);
      });
    });
  }

  /* ── Hamburger Mobile Navigation Toggler ── */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const closeBtn = document.getElementById("closeBtn");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.add("active");
    });
  }
  if (closeBtn && navLinks) {
    closeBtn.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  }
  if (navLinks) {
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }
});

// Phone Picker IIFE Dropdown script
(function () {
  "use strict";
  var C = [
    ["Afghanistan", "93", "af"],
    ["Albania", "355", "al"],
    ["Algeria", "213", "dz"],
    ["Andorra", "376", "ad"],
    ["Angola", "244", "ao"],
    ["Argentina", "54", "ar"],
    ["Armenia", "374", "am"],
    ["Australia", "61", "au"],
    ["Austria", "43", "at"],
    ["Azerbaijan", "994", "az"],
    ["Bahrain", "973", "bh"],
    ["Bangladesh", "880", "bd"],
    ["Belarus", "375", "by"],
    ["Belgium", "32", "be"],
    ["Belize", "501", "bz"],
    ["Benin", "229", "bj"],
    ["Bhutan", "975", "bt"],
    ["Bolivia", "591", "bo"],
    ["Bosnia", "387", "ba"],
    ["Brazil", "55", "br"],
    ["Brunei", "673", "bn"],
    ["Bulgaria", "359", "bg"],
    ["Burkina Faso", "226", "bf"],
    ["Cambodia", "855", "kh"],
    ["Cameroon", "237", "cm"],
    ["Canada", "1", "ca"],
    ["Chile", "56", "cl"],
    ["China", "86", "cn"],
    ["Colombia", "57", "co"],
    ["Congo", "243", "cd"],
    ["Costa Rica", "506", "cr"],
    ["Croatia", "385", "hr"],
    ["Cuba", "53", "cu"],
    ["Cyprus", "357", "cy"],
    ["Czech Republic", "420", "cz"],
    ["Denmark", "45", "dk"],
    ["Ecuador", "593", "ec"],
    ["Egypt", "20", "eg"],
    ["El Salvador", "503", "sv"],
    ["Estonia", "372", "ee"],
    ["Ethiopia", "251", "et"],
    ["Finland", "358", "fi"],
    ["France", "33", "fr"],
    ["Georgia", "995", "ge"],
    ["Germany", "49", "de"],
    ["Ghana", "233", "gh"],
    ["Greece", "30", "gr"],
    ["Guatemala", "502", "gt"],
    ["Honduras", "504", "hn"],
    ["Hong Kong", "852", "hk"],
    ["Hungary", "36", "hu"],
    ["Iceland", "354", "is"],
    ["India", "91", "in"],
    ["Indonesia", "62", "id"],
    ["Iran", "98", "ir"],
    ["Iraq", "964", "iq"],
    ["Ireland", "353", "ie"],
    ["Italy", "39", "it"],
    ["Jamaica", "1876", "jm"],
    ["Japan", "81", "jp"],
    ["Jordan", "962", "jo"],
    ["Kazakhstan", "7", "kz"],
    ["Kenya", "254", "ke"],
    ["Kuwait", "965", "kw"],
    ["Kyrgyzstan", "996", "kg"],
    ["Latvia", "371", "lv"],
    ["Lebanon", "961", "lb"],
    ["Libya", "218", "ly"],
    ["Lithuania", "370", "lt"],
    ["Luxembourg", "352", "lu"],
    ["Malaysia", "60", "my"],
    ["Maldives", "960", "mv"],
    ["Mali", "223", "ml"],
    ["Malta", "356", "mt"],
    ["Mexico", "52", "mx"],
    ["Moldova", "373", "md"],
    ["Mongolia", "976", "mn"],
    ["Morocco", "212", "ma"],
    ["Mozambique", "258", "mz"],
    ["Myanmar", "95", "mm"],
    ["Nepal", "977", "np"],
    ["Netherlands", "31", "nl"],
    ["New Zealand", "64", "nz"],
    ["Nicaragua", "505", "ni"],
    ["Nigeria", "234", "ng"],
    ["North Korea", "850", "kp"],
    ["Norway", "47", "no"],
    ["Oman", "968", "om"],
    ["Pakistan", "92", "pk"],
    ["Palestine", "970", "ps"],
    ["Panama", "507", "pa"],
    ["Paraguay", "595", "py"],
    ["Peru", "51", "pe"],
    ["Philippines", "63", "ph"],
    ["Poland", "48", "pl"],
    ["Portugal", "351", "pt"],
    ["Qatar", "974", "qa"],
    ["Romania", "40", "ro"],
    ["Russia", "7", "ru"],
    ["Rwanda", "250", "rw"],
    ["Saudi Arabia", "966", "sa"],
    ["Senegal", "221", "sn"],
    ["Serbia", "381", "rs"],
    ["Singapore", "65", "sg"],
    ["Slovakia", "421", "sk"],
    ["Slovenia", "386", "si"],
    ["Somalia", "252", "so"],
    ["South Africa", "27", "za"],
    ["South Korea", "82", "kr"],
    ["Spain", "34", "es"],
    ["Sri Lanka", "94", "lk"],
    ["Sudan", "249", "sd"],
    ["Sweden", "46", "se"],
    ["Switzerland", "41", "ch"],
    ["Syria", "963", "sy"],
    ["Taiwan", "886", "tw"],
    ["Tajikistan", "992", "tj"],
    ["Tanzania", "255", "tz"],
    ["Thailand", "66", "th"],
    ["Tunisia", "216", "tn"],
    ["Turkey", "90", "tr"],
    ["Turkmenistan", "993", "tm"],
    ["Uganda", "256", "ug"],
    ["Ukraine", "380", "ua"],
    ["UAE", "971", "ae"],
    ["United Kingdom", "44", "gb"],
    ["United States", "1", "us"],
    ["Uruguay", "598", "uy"],
    ["Uzbekistan", "998", "uz"],
    ["Venezuela", "58", "ve"],
    ["Vietnam", "84", "vn"],
    ["Yemen", "967", "ye"],
    ["Zambia", "260", "zm"],
    ["Zimbabwe", "263", "zw"],
  ];
  var flagBtn = document.getElementById("phoneFlagBtn"),
    flagImgEl = document.getElementById("selectedFlagImg"),
    codeEl = document.getElementById("selectedCode"),
    phoneEl = document.getElementById("phone");
  if (!flagBtn) return;
  var selected = null,
    popup = null,
    isOpen = false;
  for (var i = 0; i < C.length; i++) {
    if (C[i][2] === "pk") {
      selected = C[i];
      break;
    }
  }
  function flagSrc(iso) {
    return "https://flagcdn.com/w40/" + iso + ".png";
  }
  function createPopup() {
    popup = document.createElement("div");
    popup.className = "phone-popup";
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-label", "Select country code");
    var sw = document.createElement("div");
    sw.className = "phone-popup-search";
    var si = document.createElement("input");
    si.type = "text";
    si.className = "phone-popup-search-input";
    si.placeholder = "Search country or code...";
    sw.appendChild(si);
    popup.appendChild(sw);
    var le = document.createElement("div");
    le.className = "phone-popup-list";
    le.setAttribute("role", "listbox");
    popup.appendChild(le);
    document.body.appendChild(popup);
    var db;
    si.addEventListener("input", function () {
      clearTimeout(db);
      db = setTimeout(function () {
        renderList(le, si.value);
      }, 100);
    });
    si.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        doClose();
        flagBtn.focus();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        var f = le.querySelector(".phone-popup-item");
        if (f) f.focus();
      }
    });
    le.addEventListener("click", function (e) {
      var item = e.target.closest(".phone-popup-item");
      if (item) doSelect(item.getAttribute("data-iso"));
    });
    le.addEventListener("keydown", function (e) {
      var items = le.querySelectorAll(".phone-popup-item");
      var arr = Array.prototype.slice.call(items);
      var idx = arr.indexOf(document.activeElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (idx < arr.length - 1) arr[idx + 1].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (idx > 0) arr[idx - 1].focus();
        else si.focus();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (idx >= 0) doSelect(arr[idx].getAttribute("data-iso"));
      } else if (e.key === "Escape") {
        doClose();
        flagBtn.focus();
      }
    });
  }
  function renderList(le, q) {
    q = (q || "").toLowerCase().replace(/^\+/, "").trim();
    var filtered = q
      ? C.filter(function (c) {
        return (
          c[0].toLowerCase().indexOf(q) !== -1 || c[1].indexOf(q) === 0
        );
      })
      : C;
    if (!filtered.length) {
      le.innerHTML =
        '<div class="phone-popup-empty">No country found</div>';
      return;
    }
    var html = "";
    for (var i = 0; i < filtered.length; i++) {
      var c = filtered[i],
        sc = selected && c[2] === selected[2] ? " selected" : "";
      html +=
        '<div class="phone-popup-item' +
        sc +
        '" role="option" aria-selected="' +
        (sc ? "true" : "false") +
        '" data-iso="' +
        c[2] +
        '" tabindex="0"><img class="flag-img" src="' +
        flagSrc(c[2]) +
        '" alt="" /><span class="pp-name">' +
        c[0] +
        '</span><span class="pp-code">+' +
        c[1] +
        "</span></div>";
    }
    le.innerHTML = html;
  }
  function positionPopup() {
    popup.style.left = "50%";
    popup.style.top = "50%";
    popup.style.transform = "translate(-50%, -50%)";
  }
  function doSelect(iso) {
    for (var i = 0; i < C.length; i++) {
      if (C[i][2] === iso) {
        selected = C[i];
        flagImgEl.src = flagSrc(iso);
        flagImgEl.alt = C[i][0];
        codeEl.textContent = "+" + C[i][1];
        doClose();
        setTimeout(function () {
          phoneEl.focus();
        }, 50);
        return;
      }
    }
  }
  function doOpen() {
    if (isOpen) return;
    if (!popup) createPopup();
    isOpen = true;
    popup.querySelector(".phone-popup-search-input").value = "";
    renderList(popup.querySelector(".phone-popup-list"), "");
    positionPopup();
    popup.classList.add("open");
    flagBtn.classList.add("open");
    flagBtn.setAttribute("aria-expanded", "true");
    setTimeout(function () {
      popup.querySelector(".phone-popup-search-input").focus();
    }, 100);
  }
  function doClose() {
    if (!isOpen) return;
    isOpen = false;
    popup.classList.remove("open");
    flagBtn.classList.remove("open");
    flagBtn.setAttribute("aria-expanded", "false");
  }
  flagBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    isOpen ? doClose() : doOpen();
  });
  document.addEventListener("click", function (e) {
    if (isOpen && !popup.contains(e.target) && e.target !== flagBtn)
      doClose();
  });
  window.addEventListener("resize", function () {
    if (isOpen) positionPopup();
  });
})();

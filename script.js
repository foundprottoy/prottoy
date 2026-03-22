// ===================================
// PROTTOY PORTFOLIO — script.js
// ===================================
// === Password Protection ===
const password = "prottoy2026"; // your password
const userInput = prompt("🔒 Please enter the password to access this website:");
if (userInput !== password) {
  alert("❌ Access denied!");
  document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:50px;'>Access Denied</h1>";
  throw new Error("Access denied"); // Stop the rest of the script from running
}
// ... rest of your existing script.js code continues here
// === Preloader ===
window.addEventListener('load', () => {
  document.body.classList.add('loading');
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('done');
    document.body.classList.remove('loading');
    startTypingAnimation();
    animateOnScroll();
  }, 1200);
});

// === Custom Cursor ===
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .project-card, .link-card, .service-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});

// === Navbar ===
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
  showBackToTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}

// === Smooth scrolling ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// === Dark / Light Mode ===
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
let currentTheme = localStorage.getItem('theme') || 'dark';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', theme);
  currentTheme = theme;
}

applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// === Typing Animation ===
const texts = ['Frontend Developer', 'Problem Solver', 'Creative Thinker', 'UI/UX Enthusiast'];
let textIdx = 0, charIdx = 0, isDeleting = false;

function startTypingAnimation() {
  const typedEl = document.getElementById('typedText');
  if (!typedEl) return;

  function type() {
    const current = texts[textIdx];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIdx--);
    } else {
      typedEl.textContent = current.substring(0, charIdx++);
    }
    let delay = isDeleting ? 60 : 110;
    if (!isDeleting && charIdx > current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx < 0) {
      isDeleting = false;
      textIdx = (textIdx + 1) % texts.length;
      charIdx = 0;
      delay = 300;
    }
    setTimeout(type, delay);
  }
  type();
}

// === Particle Canvas ===
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const N = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(random = false) {
      this.x = Math.random() * canvas.width;
      this.y = random ? Math.random() * canvas.height : canvas.height + 10;
      this.size = Math.random() * 1.8 + 0.4;
      this.speed = Math.random() * 0.4 + 0.15;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.dx = (Math.random() - 0.5) * 0.3;
    }
    update() {
      this.y -= this.speed;
      this.x += this.dx;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.fillStyle = isDark
        ? `rgba(100, 255, 218, ${this.opacity})`
        : `rgba(8, 145, 178, ${this.opacity * 0.5})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < N; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
          ctx.strokeStyle = isDark
            ? `rgba(100, 255, 218, ${0.06 * (1 - dist / 100)})`
            : `rgba(8, 145, 178, ${0.04 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// === Scroll Reveal ===
function animateOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// === Skill Bar Animation ===
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        const w = fill.getAttribute('data-width');
        setTimeout(() => { fill.style.width = w + '%'; }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

// === Project Filter ===
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeUpIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// === Contact Form Validation ===
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  const nameErr = document.getElementById('nameErr');
  const emailErr = document.getElementById('emailErr');
  const msgErr = document.getElementById('msgErr');

  // Reset
  [name, email, message].forEach(i => i.classList.remove('error'));
  [nameErr, emailErr, msgErr].forEach(e => e.classList.remove('show'));

  if (!name.value.trim()) {
    name.classList.add('error'); nameErr.classList.add('show'); valid = false;
  }
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.classList.add('error'); emailErr.classList.add('show'); valid = false;
  }
  if (!message.value.trim() || message.value.length < 10) {
    message.classList.add('error'); msgErr.classList.add('show'); valid = false;
  }

  if (valid) {
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      document.getElementById('formSuccess').classList.add('show');
      contactForm.reset();
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message`;
      btn.disabled = false;
    }, 1500);
  }
});

// === Back to Top ===
const backToTopBtn = document.getElementById('backToTop');

function showBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === Visitor Counter ===
(function updateVisitorCount() {
  let count = parseInt(localStorage.getItem('visitorCount') || '0');
  if (!sessionStorage.getItem('visited')) {
    count++;
    localStorage.setItem('visitorCount', count);
    sessionStorage.setItem('visited', '1');
  }
  // Animate counter
  const el = document.getElementById('visitCount');
  if (!el) return;
  let current = 0;
  const step = Math.ceil(count / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, count);
    el.textContent = current.toLocaleString();
    if (current >= count) clearInterval(timer);
  }, 30);
})();

// === Footer Year ===
document.getElementById('year').textContent = new Date().getFullYear();

// === Download CV notification ===
['downloadCV', 'downloadCV2'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Show a notification since we don't have a real PDF
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
        background: var(--bg-card); border: 1px solid var(--border-hover);
        color: var(--accent-cyan); padding: 12px 24px; border-radius: 8px;
        font-family: var(--font-mono); font-size: 0.8rem; z-index: 9999;
        animation: fadeUpIn 0.4s ease; box-shadow: 0 8px 30px rgba(0,0,0,0.4);
      `;
      toast.textContent = '📄 Add your CV.pdf to the /assets folder!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    });
  }
});

// === Staggered link card reveal ===
document.querySelectorAll('.link-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.05}s`;
});

// ========== Sticky Nav ==========
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
});

// ========== Mobile Menu ==========
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ========== Scroll Animations ==========
const animateElements = document.querySelectorAll(
  '.step, .feature, .testimonial, .scoring__card, .tier, .mri-ref__tier'
);

animateElements.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger animations for sibling elements
      const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
      const siblingIndex = Array.from(siblings).indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, siblingIndex * 80);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

animateElements.forEach(el => observer.observe(el));

// ========== Signup Modal ==========
const signupModal = document.getElementById('signupModal');
const signupForm = document.getElementById('signupForm');
const signupSuccess = document.getElementById('signupSuccess');

// All "Get early access" triggers
document.querySelectorAll('#openSignup, [data-open-signup]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

// Close modal
document.getElementById('closeSignup').addEventListener('click', closeModal);
signupModal.addEventListener('click', (e) => {
  if (e.target === signupModal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && signupModal.classList.contains('active')) closeModal();
});

function closeModal() {
  signupModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Handle form submission — stores to localStorage
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();

  // Get existing signups or start fresh
  const signups = JSON.parse(localStorage.getItem('sentinel_signups') || '[]');
  signups.push({
    firstName,
    lastName,
    email,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('sentinel_signups', JSON.stringify(signups));

  // Show success state
  signupForm.style.display = 'none';
  signupSuccess.style.display = 'block';

  // Reset form for next time
  signupForm.reset();

  // Auto-close after 3 seconds
  setTimeout(() => {
    closeModal();
    // Reset modal to form view after close animation
    setTimeout(() => {
      signupForm.style.display = '';
      signupSuccess.style.display = 'none';
    }, 300);
  }, 3000);
});

// ========== Smooth scroll for anchor links ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

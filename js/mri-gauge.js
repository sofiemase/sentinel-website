// ========== MRI Score Animation ==========
// Animates the phone score numbers on scroll into view

function animateValue(el, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Observe phone scores
const scoreObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const finalValue = parseInt(el.dataset.score || el.textContent);
      el.dataset.score = finalValue;
      el.textContent = '0';
      animateValue(el, 0, finalValue, 1200);
      scoreObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.phone__score').forEach(el => {
  el.dataset.score = el.textContent.trim();
  scoreObserver.observe(el);
});

// Animate score bars
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const targetWidth = fill.style.width;
      fill.style.width = '0%';
      fill.style.transition = 'width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fill.style.width = targetWidth;
        });
      });
      barObserver.unobserve(fill);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.phone__score-bar-fill').forEach(el => {
  barObserver.observe(el);
});

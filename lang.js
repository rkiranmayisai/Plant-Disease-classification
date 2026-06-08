// ================================================
// PlantAI - Language & Navbar System
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initLangModal();
  applyLanguage();
  initDiseaseTabs();
  initScrollAnimations();
  initCounterAnimations();
  initDemoModal();
  registerServiceWorker();
});

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('Service Worker registered successfully:', reg.scope))
        .catch(err => console.log('Service Worker registration failed:', err));
    });
  }
}

// ── Navbar ──
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const authBtn = document.getElementById('authNavBtn');

  if (!navbar) return;

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Hamburger
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks?.classList.toggle('open');
  });

  // Close menu on link click
  navLinks?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Auth state
  const user = getUser();
  if (authBtn) {
    if (user) {
      authBtn.textContent = user.name.split(' ')[0];
      authBtn.href = 'dashboard.html';
    } else {
      authBtn.textContent = t('navLogin');
      authBtn.href = 'auth.html';
    }
  }
}

// ── Language ──
function initLangModal() {
  const btn = document.getElementById('langToggle');
  const modal = document.getElementById('langModal');
  const closeBtn = document.getElementById('langModalClose');

  btn?.addEventListener('click', () => {
    modal?.classList.add('open');
  });
  closeBtn?.addEventListener('click', () => modal?.classList.remove('open'));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      currentLang = opt.dataset.lang;
      localStorage.setItem('plantai_lang', currentLang);
      document.querySelectorAll('.lang-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const labels = { en: '🇬🇧 EN', hi: '🇮🇳 HI', kn: '🇮🇳 KN', te: '🇮🇳 TE' };
      if (document.getElementById('langToggle')) document.getElementById('langToggle').textContent = labels[currentLang] || '🌐 EN';
      applyLanguage();
      modal?.classList.remove('open');
      showToast('Language changed!', 'success');
    });
  });
}

function applyLanguage() {
  const labels = { en: '🇬🇧 EN', hi: '🇮🇳 HI', kn: '🇮🇳 KN', te: '🇮🇳 TE' };
  const langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.textContent = labels[currentLang] || '🌐 EN';

  // Apply translations to nav links
  const navMap = {
    'navHome': 'a[href="index.html"]',
    'navDetect': 'a[href="detect.html"]',
    'navDashboard': 'a[href="dashboard.html"]',
    'navMap': 'a[href="map.html"]',
    'navChatbot': 'a[href="chatbot.html"]'
  };
  Object.entries(navMap).forEach(([key, sel]) => {
    document.querySelectorAll(sel).forEach(el => {
      if (el.classList.contains('nav-link')) el.textContent = t(key);
    });
  });

  // Mark active lang option
  document.querySelectorAll('.lang-option').forEach(o => {
    o.classList.toggle('active', o.dataset.lang === currentLang);
  });
}

// ── Disease Tabs ──
function initDiseaseTabs() {
  const tabs = document.querySelectorAll('.disease-tab');
  const container = document.getElementById('diseaseCards');
  if (!container) return;

  function renderDiseases(crop) {
    const filtered = crop === 'all' ? PLANT_DISEASES : PLANT_DISEASES.filter(d => d.crop === crop);
    container.innerHTML = filtered.map(d => `
      <div class="disease-card" onclick="window.location.href='detect.html?disease=${d.id}'">
        <div class="disease-card-icon">${d.cropEmoji}</div>
        <div class="disease-card-info">
          <div class="disease-card-name">${d.name}</div>
          <div class="disease-card-crop">${d.crop.charAt(0).toUpperCase() + d.crop.slice(1)}</div>
        </div>
        <div class="disease-card-acc">${d.accuracy}%</div>
      </div>
    `).join('');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderDiseases(tab.dataset.crop);
    });
  });

  renderDiseases('all');
}

// ── Scroll Animations ──
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .workflow-step').forEach(el => observer.observe(el));
}

// ── Counter Animations ──
function initCounterAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target || 0);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();
  
  function update(time) {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Demo Modal ──
function initDemoModal() {
  const demoBtn = document.getElementById('heroDemoBtn');
  const modal = document.getElementById('demoModal');
  const closeBtn = document.getElementById('demoModalClose');

  demoBtn?.addEventListener('click', () => {
    modal?.classList.add('open');
    runDemoAnimation();
  });
  closeBtn?.addEventListener('click', () => modal?.classList.remove('open'));
  modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}

function runDemoAnimation() {
  const steps = ['demoStep1', 'demoStep2', 'demoStep3'];
  steps.forEach(id => document.getElementById(id)?.classList.remove('active'));
  document.getElementById('demoStep1')?.classList.add('active');

  setTimeout(() => {
    document.getElementById('demoStep1')?.classList.remove('active');
    document.getElementById('demoStep2')?.classList.add('active');
  }, 1500);

  setTimeout(() => {
    document.getElementById('demoStep2')?.classList.remove('active');
    document.getElementById('demoStep3')?.classList.add('active');
  }, 3800);
}

// ── Auth Helpers ──
function getUser() {
  try { return JSON.parse(localStorage.getItem('plantai_user')); } catch { return null; }
}
function saveUser(user) { localStorage.setItem('plantai_user', JSON.stringify(user)); }
function logout() {
  localStorage.removeItem('plantai_user');
  window.location.href = 'index.html';
}

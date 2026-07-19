/**
 * Transfer Assistant — i18n Engine + Language Switcher
 * Loads translations from js/translations.js
 */
(function() {
  const LANGS = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
  ];

  // Detect language
  function detect() {
    const s = localStorage.getItem('ta_lang');
    if (s && LANGS.find(l => l.code === s)) return s;
    const b = (navigator.language || '').split('-')[0];
    return LANGS.find(l => l.code === b) ? b : 'en';
  }

  let cur = detect();

  // Apply translations
  function apply(code) {
    const d = T[code] || T.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (d[k] === undefined) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = d[k];
      } else {
        el.innerHTML = d[k];
      }
    });
    document.documentElement.lang = code;
  }

  // Build language switcher
  function buildSwitcher() {
    const nav = document.querySelector('.nav-inner');
    if (!nav) return;

    const wrap = document.createElement('div');
    wrap.className = 'lang-switcher';
    wrap.innerHTML = '<button class="lang-trigger"><span>' + cur.toUpperCase() + '</span><span class="lang-arrow">▾</span></button><div class="lang-dropdown"></div>';
    const dd = wrap.querySelector('.lang-dropdown');
    LANGS.forEach(l => {
      const o = document.createElement('button');
      o.className = 'lang-option' + (l.code === cur ? ' active' : '');
      o.dataset.lang = l.code;
      o.textContent = l.label;
      o.addEventListener('click', () => set(l.code));
      dd.appendChild(o);
    });

    // Toggle dropdown
    wrap.querySelector('.lang-trigger').addEventListener('click', e => {
      e.stopPropagation();
      wrap.classList.toggle('open');
    });
    document.addEventListener('click', () => wrap.classList.remove('open'));

    nav.appendChild(wrap);
  }

  function set(code) {
    cur = code;
    localStorage.setItem('ta_lang', code);
    apply(code);
    // Update trigger label
    const t = document.querySelector('.lang-trigger span:first-child');
    if (t) t.textContent = code.toUpperCase();
    document.querySelectorAll('.lang-option').forEach(o => o.classList.toggle('active', o.dataset.lang === code));
    document.querySelector('.lang-switcher').classList.remove('open');
  }

  // Init
  if (typeof T !== 'undefined') {
    apply(cur);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', buildSwitcher);
    } else {
      buildSwitcher();
    }
  } else {
    // translations.js not loaded yet — retry
    document.addEventListener('DOMContentLoaded', function() {
      if (typeof T !== 'undefined') {
        apply(cur);
        buildSwitcher();
      }
    });
  }
})();

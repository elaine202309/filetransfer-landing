/**
 * FileTransfer Landing Page — 交互脚本
 */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════ 导航栏滚动效果 ═══════════
  const nav = document.getElementById('nav');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }, { passive: true });

  // ═══════════ 移动端菜单 ═══════════
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuBtn.textContent = isOpen ? '✕' : '☰';
  });

  // 点击菜单项后关闭
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.textContent = '☰';
    });
  });

  // ═══════════ FAQ 手风琴 ═══════════
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      // 关闭其他
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });
      // 切换当前
      const isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // ═══════════ 滚动入场动画 ═══════════
  const animatedElements = document.querySelectorAll(
    '.step-card, .feature-card, .usecase-card, .compare-table-wrapper, .faq-item'
  );

  // 初始化：给需要动画的元素加类
  animatedElements.forEach(el => {
    el.classList.add('animate-in');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // 阶梯延迟：同一类型的元素依次出现
        const siblings = Array.from(entry.target.parentElement?.children || [])
          .filter(c => c.classList.contains('animate-in'));
        const index = siblings.indexOf(entry.target);
        if (index >= 0) {
          entry.target.style.transitionDelay = `${index * 0.08}s`;
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px',
  });

  animatedElements.forEach(el => observer.observe(el));

  // ═══════════ Hero 视差效果 ═══════════
  const heroDevices = document.querySelector('.hero-devices');
  const heroGlow = document.querySelector('.hero-bg-glow');

  if (heroDevices && window.innerWidth > 968) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroDevices.style.transform = `perspective(800px) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
      if (heroGlow) {
        heroGlow.style.transform = `translate(calc(-50% + ${x * 2}px), ${y * 2}px)`;
      }
    }, { passive: true });
  }

  // ═══════════ 平滑导航锚点 ═══════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ═══════════ 统计数字递增动画 ═══════════
  // （可后续添加真实数据展示）

  console.log('🚀 FileTransfer Landing Page Ready');
});

'use strict';
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');
const links = [...menu.querySelectorAll('a')];
const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function setMenu(open) {
  menu.classList.toggle('nav-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  document.body.classList.toggle('menu-open', open);
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
links.forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('nav-open')) { setMenu(false); toggle.focus(); }
});
window.addEventListener('resize', () => { if (innerWidth > 820) setMenu(false); requestUpdate(); });
// FAQ remains visible and usable, independently of scroll animation.
const faq = document.querySelector('.faq-items');
faq.classList.remove('reveal');
const reveals = [...document.querySelectorAll('.reveal')];
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, {threshold: 0, rootMargin: '0px 0px 35px 0px'});
  reveals.forEach(el => observer.observe(el));
  document.documentElement.classList.add('motion-ready');
  // Avoid hidden elements during anchor navigation or focus navigation.
  document.addEventListener('focusin', e => e.target.closest('.reveal')?.classList.add('is-visible'));
  reducedMotion.addEventListener?.('change', e => {
    if (e.matches) { observer.disconnect(); reveals.forEach(el => el.classList.add('is-visible')); document.documentElement.classList.remove('motion-ready'); }
  });
}
const sections = links.map(link => document.querySelector(link.getAttribute('href')));
let scheduled = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.max(0, Math.min(1, scrollY / max)) : 0})`;
  header.classList.toggle('scrolled', scrollY > 10);
  let active = -1;
  sections.forEach((section, index) => { if (section.getBoundingClientRect().top <= header.offsetHeight + 120) active = index; });
  links.forEach((link, index) => {
    link.classList.toggle('active', index === active);
    if (index === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
function requestUpdate() { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }
window.addEventListener('scroll', requestUpdate, {passive:true});
window.addEventListener('load', requestUpdate);
faq.addEventListener('toggle', requestUpdate, true);
requestUpdate();

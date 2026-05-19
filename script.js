// ═══ HERO PARALLAX — same as template ═══
// Content moves up and fades as the white section scrolls over the sticky hero
const heroInner = document.querySelector('.hero-inner');
const hero      = document.querySelector('.hero');

function heroParallax() {
  const scrolled     = window.scrollY;
  const heroHeight   = hero.offsetHeight;
  const progress     = Math.min(scrolled / heroHeight, 1);

  // move content up at 35% of scroll speed, fade out
  heroInner.style.transform = `translateY(${scrolled * 0.35}px)`;
  heroInner.style.opacity   = Math.max(1 - progress * 2, 0);
}

window.addEventListener('scroll', heroParallax, { passive: true });
heroParallax();

// ═══ WORK CARDS — slide in from sides ═══
// Left column flies from left, right column from right — same as template
const cardObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const card = e.target;
    const delay = card.dataset.dir === 'right' ? 120 : 0;
    setTimeout(() => card.classList.add('in-view'), delay);
    cardObs.unobserve(card);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.card[data-dir]').forEach(c => cardObs.observe(c));

// ═══ SERVICES — scroll-driven scale + compress animation ═══
// Replicates the template's card "push back" effect as the next card slides over
const SVC_TOP = 90;

function animateSvc() {
  const cards  = [...document.querySelectorAll('.svc-card')];
  const tops   = cards.map(c => c.getBoundingClientRect().top);
  const heights = cards.map(c => c.offsetHeight);

  cards.forEach((card, i) => {
    const top   = tops[i];
    const below = top - SVC_TOP;

    let scale = 1, ty = 0, sy = 1;

    if (below > 0) {
      // approaching from below — scale down
      const t = Math.min(below / (window.innerHeight * 0.5), 1);
      scale = 1 - t * 0.12;
      ty    = t * 24;
    } else {
      // at sticky — compress if next card is covering it
      const nextTop = tops[i + 1];
      if (nextTop !== undefined) {
        const covered = (SVC_TOP + heights[i]) - nextTop;
        if (covered > 0) {
          const t = Math.min(covered / heights[i], 1);
          scale = 1 - t * 0.08;
          sy    = 1 - t * 0.06;
          ty    = -t * 10;
        }
      }
    }
    card.style.transform = `translateY(${ty}px) scale(${scale}) scaleY(${sy})`;
  });
}

let rafPending = false;
window.addEventListener('scroll', () => {
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(() => { animateSvc(); rafPending = false; });
  }
}, { passive: true });
window.addEventListener('resize', animateSvc);
animateSvc();

// ═══ SCROLL REVEAL for process cards etc ═══
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ═══ PROJECT DATA ═══
const projects = {
  beribu:           { name: 'Beribu',                          year: '2023', cat: 'Brand Identity',     images: ['images/beribu/cover.png','images/beribu/1.png','images/beribu/2.png','images/beribu/3.png','images/beribu/4.png','images/beribu/5.png','images/beribu/6.png','images/beribu/7.png','images/beribu/8.png'], desc: '' },
  kelioniu:         { name: 'Kelioniu akademija',              year: '2025', cat: 'Visual Identity',    images: ['images/kelioniu/cover.png','images/kelioniu/1.png','images/kelioniu/2.png','images/kelioniu/3.png','images/kelioniu/4.png','images/kelioniu/5.png','images/kelioniu/6.png'], desc: '' },
  bite:             { name: 'Romainiu odontologijos klinika',  year: '2024', cat: 'Brand Identity',     images: ['images/bite/cover.jpg','images/bite/1.png','images/bite/2.jpg','images/bite/3.jpg','images/bite/4.jpg','images/bite/5.jpg','images/bite/6.jpg','images/bite/7.jpg','images/bite/8.jpg','images/bite/9.png'], desc: '' },
  zoo:              { name: 'Lithuanian Zoo',                  year: '2023', cat: 'Illustration',       images: ['images/zoo/cover.png','images/zoo/1.png','images/zoo/2.png','images/zoo/3.png','images/zoo/4.png','images/zoo/5.jpg','images/zoo/6.jpg'], desc: '' },
  doa:              { name: 'Disputes over Access',            year: '2023', cat: 'Book Cover',         images: ['images/disputes/cover.png','images/disputes/1.png','images/disputes/2.png','images/disputes/3.png','images/disputes/4.png','images/disputes/5.png'], desc: 'Book cover for a journalist practice study.' },
  'visual-identity':{ name: 'Kotryna Creates',                year: '2025', cat: 'Visual Identity',    images: ['images/visual-identity/cover.png','images/visual-identity/1.png','images/visual-identity/2.png','images/visual-identity/3.png','images/visual-identity/4.png','images/visual-identity/5.png','images/visual-identity/6.png','images/visual-identity/7.png','images/visual-identity/8.png','images/visual-identity/9.png'], desc: 'Personal logo and visual identity system.' },
  jaunimo:          { name: 'Jaunimo linija',                  year: '2022', cat: 'Book Design',        images: ['images/jaunimo/cover.png','images/jaunimo/1.png','images/jaunimo/2.png','images/jaunimo/3.png','images/jaunimo/4.png','images/jaunimo/5.png','images/jaunimo/6.png','images/jaunimo/7.png'], desc: 'Exercise book design.' },
  livoliukai:       { name: 'Livoliukai',                      year: '2022', cat: 'Brand Identity',     images: ['images/livoliukai/cover.jpg','images/livoliukai/1.png','images/livoliukai/2.png','images/livoliukai/3.png','images/livoliukai/4.png','images/livoliukai/5.png','images/livoliukai/6.png','images/livoliukai/7.png','images/livoliukai/8.png'], desc: '' },
  typeface:         { name: 'Handmade Typeface',               year: '2019', cat: 'Typography',         images: ['images/typeface/cover.jpg','images/typeface/1.jpg','images/typeface/2.jpg','images/typeface/3.jpg','images/typeface/4.jpg','images/typeface/5.jpg'], desc: '' },
  muziejus:         { name: 'Lietuvos etnografijos muziejus',  year: '2024', cat: 'Visual Identity',    images: ['images/muziejus/cover.jpeg','images/muziejus/1.jpeg','images/muziejus/2.jpeg','images/muziejus/3.jpeg','images/muziejus/4.jpeg','images/muziejus/5.png'], desc: '' },
  ekosanus:         { name: 'EKOsanus',                        year: '2021', cat: 'Logo & Packaging',   images: ['images/ekosanus/cover.png','images/ekosanus/1.jpg','images/ekosanus/1.png','images/ekosanus/2.png','images/ekosanus/3.png','images/ekosanus/4.png','images/ekosanus/5.png','images/ekosanus/6.png','images/ekosanus/7.png'], desc: "Logo and packaging for brewer's yeast." },
  orkla:            { name: 'Orkla care',                      year: '2024', cat: 'Design',             images: ['images/orkla/cover.png','images/orkla/1.png','images/orkla/2.png','images/orkla/3.png','images/orkla/5.jpg','images/orkla/6.png','images/orkla/7.png','images/orkla/8.png','images/orkla/9.jpg','images/orkla/10.png'], desc: '' },
  vom:              { name: 'VOM Baltics',                     year: '2022', cat: 'Design',             images: ['images/vom/cover.jpg','images/vom/1.jpg','images/vom/3.jpg','images/vom/4.jpg','images/vom/5.jpg','images/vom/6.jpg','images/vom/7.jpg','images/vom/8.jpg','images/vom/9.jpg','images/vom/10.jpg','images/vom/11.jpg','images/vom/12.jpg'], desc: '' },
  tshirts:          { name: 'T-shirt designs',                 year: '2023', cat: 'Illustration',       images: ['images/tshirts/cover.png','images/tshirts/1.png','images/tshirts/2.png','images/tshirts/3.png','images/tshirts/4.png','images/tshirts/5.png'], desc: '' },
};

// ═══ MODAL ═══
const modal    = document.getElementById('modal');
const mContent = document.getElementById('modal-content');
const mClose   = document.getElementById('modal-close');
const mBack    = document.getElementById('modal-backdrop');

function openModal(key) {
  const p = projects[key]; if (!p) return;
  mContent.innerHTML = `
    <div class="modal-meta"><span class="modal-cat">${p.cat}</span><span class="modal-year">${p.year}</span></div>
    <h2 class="modal-title">${p.name}</h2>
    ${p.desc ? `<p class="modal-desc">${p.desc}</p>` : ''}
    ${p.images.length ? `<div class="modal-images">${p.images.map(s=>`<img src="${s}" alt="${p.name}">`).join('')}</div>` : ''}
  `;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.card').forEach(c => c.addEventListener('click', e => { e.preventDefault(); if (c.dataset.project) openModal(c.dataset.project); }));
mClose.addEventListener('click', closeModal);
mBack.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ═══ LOGO — scroll to very top ═══
document.getElementById('nav-home').addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ═══ SMOOTH SCROLL ═══
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

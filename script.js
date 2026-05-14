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
  beribu:           { name: 'Beribu',                          year: '2023', cat: 'Brand Identity',     images: [], desc: '' },
  kelioniu:         { name: 'Kelioniu akademija',              year: '2025', cat: 'Visual Identity',    images: [], desc: '' },
  bite:             { name: 'Romainiu odontologijos klinika',  year: '2024', cat: 'Brand Identity',     images: [], desc: '' },
  zoo:              { name: 'Lithuanian Zoo',                  year: '2023', cat: 'Illustration',       images: [], desc: '' },
  doa:              { name: 'Disputes over Access',            year: '2023', cat: 'Book Cover',         images: [], desc: 'Book cover for a journalist practice study.' },
  'visual-identity':{ name: 'Kotryna Creates',                year: '2025', cat: 'Visual Identity',    images: [], desc: 'Personal logo and visual identity system.' },
  jaunimo:          { name: 'Jaunimo linija',                  year: '2022', cat: 'Book Design',        images: [], desc: 'Exercise book design.' },
  livoliukai:       { name: 'Livoliukai',                      year: '2022', cat: 'Brand Identity',     images: [], desc: '' },
  typeface:         { name: 'Handmade Typeface',               year: '2019', cat: 'Typography',         images: [], desc: '' },
  muziejus:         { name: 'Lietuvos etnografijos muziejus',  year: '2024', cat: 'Visual Identity',    images: [], desc: 'Images coming soon.' },
  ekosanus:         { name: 'EKOsanus',                        year: '2021', cat: 'Logo & Packaging',   images: [], desc: "Logo and packaging for brewer's yeast. Images coming soon." },
  orkla:            { name: 'Orkla care',                      year: '2024', cat: 'Design',             images: [], desc: 'Images coming soon.' },
  vom:              { name: 'VOM Baltics',                     year: '2022', cat: 'Design',             images: [], desc: 'Images coming soon.' },
  tshirts:          { name: 'T-shirt designs',                 year: '2023', cat: 'Illustration',       images: [], desc: 'Images coming soon.' },
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

// ═══ SCROLL EFFECTS — hero parallax + sticky card stacking ═══
// All scroll work runs through ONE rAF-throttled handler, and layout values
// (hero height, card heights) are cached and only refreshed on resize / load.
// This avoids reading layout on every scroll event (the cause of scroll jank).
const heroInner = document.querySelector('.hero-inner');
const hero      = document.querySelector('.hero');
const SVC_TOP   = 90;
const WORK_TOP  = 90;

let heroHeight  = 1;
let svcCards = [], svcHeights = [];
let workCards = [], workHeights = [];

function refreshCache() {
  heroHeight  = hero ? hero.offsetHeight : 1;
  svcCards    = [...document.querySelectorAll('.svc-card')];
  svcHeights  = svcCards.map(c => c.offsetHeight);
  workCards   = [...document.querySelectorAll('.work-card')];
  workHeights = workCards.map(c => c.offsetHeight);
}

function heroParallax(scrolled) {
  if (!heroInner) return;
  const progress = Math.min(scrolled / heroHeight, 1);
  heroInner.style.transform = `translateY(${scrolled * 0.35}px)`;
  heroInner.style.opacity   = Math.max(1 - progress * 2, 0);
}

// scale + compress each card as the next one slides over it
function animateStack(cards, heights, TOP) {
  const tops = cards.map(c => c.getBoundingClientRect().top); // read all first
  cards.forEach((card, i) => {                                // then write all
    const below = tops[i] - TOP;
    let scale = 1, ty = 0, sy = 1;
    if (below > 0) {
      const t = Math.min(below / (window.innerHeight * 0.5), 1);
      scale = 1 - t * 0.12;
      ty    = t * 24;
    } else {
      const nextTop = tops[i + 1];
      if (nextTop !== undefined) {
        const covered = (TOP + heights[i]) - nextTop;
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

function onScroll() {
  heroParallax(window.scrollY);
  if (svcCards.length)  animateStack(svcCards, svcHeights, SVC_TOP);
  if (workCards.length) animateStack(workCards, workHeights, WORK_TOP);
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); }
}, { passive: true });
window.addEventListener('resize', () => { refreshCache(); onScroll(); });
window.addEventListener('load',   () => { refreshCache(); onScroll(); });

refreshCache();
onScroll();

// ═══ WORK CARDS — slide-in (template leftover; no-op if none present) ═══
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

// ═══ SCROLL REVEAL for process cards etc ═══
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ═══ PROJECT DATA ═══
const projects = {
  beribu:           { name: 'Beribu',                          year: '2023', cat: 'Brand Identity',     images: ['images/beribu/cover.png','images/beribu/1.png','images/beribu/2.png','images/beribu/3.png','images/beribu/4.png','images/beribu/5.png','images/beribu/6.png','images/beribu/7.png','images/beribu/8.png'], desc: '' },
  kelioniu:         { name: 'Kelionių akademija',              year: '2025', cat: 'Illustration',    images: ['images/kelioniu/cover.png','images/kelioniu/1.png','images/kelioniu/2.png','images/kelioniu/3.png','images/kelioniu/4.png','images/kelioniu/5.png','images/kelioniu/6.png'], desc: '' },
  bite:             { name: 'Romainių odontologijos klinika',  year: '2024', cat: 'Advertising & Digital',     images: ['images/bite/cover.jpg','images/bite/1.png','images/bite/2.jpg','images/bite/3.jpg','images/bite/4.jpg','images/bite/5.jpg','images/bite/6.jpg','images/bite/7.jpg','images/bite/8.jpg','images/bite/9.png'], desc: '' },
  zoo:              { name: 'Lithuanian Zoo',                  year: '2023', cat: 'Illustration',       images: ['images/zoo/cover.png','images/zoo/1.png','images/zoo/2.png','images/zoo/3.png','images/zoo/4.png','images/zoo/5.jpg','images/zoo/6.jpg'], desc: '' },
  doa:              { name: 'Disputes over Access',            year: '2023', cat: 'Book Design',        images: ['images/disputes/cover.png','images/disputes/1.png','images/disputes/2.png','images/disputes/3.png','images/disputes/4.png','images/disputes/5.png'], desc: 'Book cover for a journalist practice study.' },
  'visual-identity':{ name: 'Gabija Balčiūnaitė',             year: '2025', cat: 'Brand Identity',   images: ['images/visual-identity/cover.png','images/visual-identity/1.png','images/visual-identity/2.png','images/visual-identity/3.png','images/visual-identity/4.png','images/visual-identity/5.png','images/visual-identity/6.png','images/visual-identity/7.png','images/visual-identity/8.png','images/visual-identity/9.png'], desc: 'Personal logo and visual identity system.' },
  jaunimo:          { name: 'Jaunimo linija',                  year: '2022', cat: 'Book Design',        images: ['images/jaunimo/cover.png','images/jaunimo/1.png','images/jaunimo/2.png','images/jaunimo/3.png','images/jaunimo/4.png','images/jaunimo/5.png','images/jaunimo/6.png','images/jaunimo/7.png'], desc: 'Exercise book design.' },
  livoliukai:       { name: 'Livoliukai',                      year: '2022', cat: 'Illustration',     images: ['images/livoliukai/cover.jpg','images/livoliukai/1.png','images/livoliukai/2.png','images/livoliukai/3.png','images/livoliukai/4.png','images/livoliukai/5.png','images/livoliukai/6.png','images/livoliukai/7.png','images/livoliukai/8.png'], desc: '' },
  typeface:         { name: 'Handmade Typeface',               year: '2019', cat: 'Illustration',       images: ['images/typeface/cover.jpg','images/typeface/1.jpg','images/typeface/2.jpg','images/typeface/3.jpg','images/typeface/4.jpg','images/typeface/5.jpg'], desc: '' },
  muziejus:         { name: 'Lietuvos etnografijos muziejus',  year: '2024', cat: 'Illustration',      images: ['images/muziejus/cover.jpeg','images/muziejus/1.jpeg','images/muziejus/2.jpeg','images/muziejus/3.jpeg','images/muziejus/4.jpeg','images/muziejus/5.png'], desc: '' },
  ekosanus:         { name: 'EKOsanus',                        year: '2021', cat: 'Packaging Design',     images: ['images/ekosanus/cover.png','images/ekosanus/1.jpg','images/ekosanus/1.png','images/ekosanus/2.png','images/ekosanus/3.png','images/ekosanus/4.png','images/ekosanus/5.png','images/ekosanus/6.png','images/ekosanus/7.png'], desc: "Logo and packaging for brewer's yeast." },
  orkla:            { name: 'Orkla Care',                      year: '2024', cat: 'Advertising & Digital', images: ['images/orkla/cover.png','images/orkla/1.png','images/orkla/2.png','images/orkla/3.png','images/orkla/5.jpg','images/orkla/6.png','images/orkla/7.png','images/orkla/8.png','images/orkla/9.jpg','images/orkla/10.png'], desc: '' },
  vom:              { name: 'VOM Baltics',                     year: '2022', cat: 'Advertising & Digital', images: ['images/vom/cover.jpg','images/vom/1.jpg','images/vom/3.jpg','images/vom/4.jpg','images/vom/5.jpg','images/vom/6.jpg','images/vom/7.jpg','images/vom/8.jpg','images/vom/9.jpg','images/vom/10.jpg','images/vom/11.jpg','images/vom/12.jpg'], desc: '' },
  tshirts:          { name: 'T-shirt designs',                 year: '2023', cat: 'Illustration',       images: ['images/tshirts/cover.png','images/tshirts/1.png','images/tshirts/2.png','images/tshirts/3.png','images/tshirts/4.png','images/tshirts/5.png'], desc: '' },
};

// ═══ WORK CATEGORIES ═══
const workCategories = [
  { name: 'Book Design',             projects: ['doa', 'livoliukai', 'jaunimo'],                                    img: 'images/covers/Book Design.png', color: 'green' },
  { name: 'Brand Identity',          projects: ['beribu', 'visual-identity', 'ekosanus'],                          img: 'images/covers/Brand Identity.png', color: 'white' },
  { name: 'Illustration',            projects: ['kelioniu', 'zoo', 'livoliukai', 'muziejus', 'typeface', 'tshirts'], img: 'images/covers/Illustration.png', color: 'orange' },
  { name: 'Packaging Design',        projects: ['beribu', 'ekosanus'],                                             img: 'images/covers/Packaging Design.png', color: 'yellow' },
  { name: 'Advertising & Digital', projects: ['bite', 'orkla', 'vom'],                                            img: 'images/covers/Advertising & digital.png', color: 'purple' },
];

// ═══ RENDER WORK CATEGORIES ═══
const workStack = document.getElementById('work-stack');
if (workStack) {
  workStack.innerHTML = workCategories.map((cat, idx) => {
    const catProjects = cat.projects.map(k => ({ key: k, ...projects[k] }));
    return `
    <div class="work-card">
      <div class="work-header">
        <div class="work-category">${cat.name}</div>
        <ul class="work-projects work-projects--${cat.color}">
          ${catProjects.map((p, i) => `<li onclick="window.location='project.html?p=${p.key}'"><span class="work-icon">${i+1}</span> ${p.name}</li>`).join('')}
        </ul>
      </div>
      <div class="work-image">
        <img src="${cat.img}" alt="${cat.name}" loading="lazy">
      </div>
    </div>`;
  }).join('');
  // work cards exist now — cache them and apply initial transforms
  refreshCache();
  onScroll();
}

// ═══ LOGO — scroll to very top ═══
document.getElementById('nav-home').addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ═══ SMOOTH SCROLL ═══
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;       // skip bare "#" (invalid selector)
    const t = document.querySelector(href);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ═══ TICKERS — match the brands strip speed to the skills strip ═══
// Both strips duplicate their content, so one loop = half the track width.
// We measure the skills strip's pixels-per-second (its CSS duration is 28s)
// and give the brands strip a duration that produces the SAME speed. Re-run
// after images load / on resize, since the brand logos change the width.
(function () {
  const skills = document.querySelector('.ticker-track');
  const brands = document.querySelector('.brands-track');
  const SKILLS_DURATION = 28; // seconds, matches the CSS

  function syncTickerSpeed() {
    if (!skills || !brands) return;
    const skillsHalf = skills.scrollWidth / 2;
    const brandsHalf = brands.scrollWidth / 2;
    if (skillsHalf <= 0 || brandsHalf <= 0) return;
    const pxPerSec = skillsHalf / SKILLS_DURATION;
    brands.style.animationDuration = (brandsHalf / pxPerSec) + 's';
  }

  syncTickerSpeed();
  window.addEventListener('load', syncTickerSpeed);
  window.addEventListener('resize', syncTickerSpeed);
})();

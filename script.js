// ===== WORK CARDS: fly in from left/right toward center =====
// Left column (data-dir="left") slides from the left.
// Right column (data-dir="right") slides from the right.
// Cards in the same row are staggered slightly so they don't arrive simultaneously.
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const card = entry.target;

    // Stagger: right-column card waits 120ms so left arrives first
    const delay = card.dataset.dir === 'right' ? 120 : 0;
    setTimeout(() => card.classList.add('in-view'), delay);

    cardObserver.unobserve(card);
  });
}, {
  threshold: 0.08,   // trigger as soon as 8% of the card is visible
  rootMargin: '0px 0px -40px 0px'  // fire a bit before card fully enters viewport
});

document.querySelectorAll('.card[data-dir]').forEach(card => {
  cardObserver.observe(card);
});

// ===== SERVICE CARDS: smooth scroll-driven scale animation =====
// Uses only scale + translateY — both fully GPU-composited, zero repaint.
// All getBoundingClientRect() calls are batched BEFORE any writes
// to avoid layout thrashing on every scroll tick.

const SVC_TOP = 90; // must match sticky top in CSS

function animateServiceCards() {
  const cards = [...document.querySelectorAll('.svc-card')];
  const vh    = window.innerHeight;

  // 1. READ — batch all layout reads first
  const tops    = cards.map(c => c.getBoundingClientRect().top);
  const heights = cards.map(c => c.offsetHeight);

  // 2. WRITE — then update transforms
  cards.forEach((card, i) => {
    const top    = tops[i];
    const height = heights[i];
    const below  = top - SVC_TOP; // positive = card is below sticky line

    let scale = 1;
    let ty    = 0;
    let sy    = 1; // scaleY to simulate depth foreshortening (the "lean")

    if (below > 0) {
      // ── Arriving from below ──
      // Card scales up and rises as it approaches the sticky position
      const t = Math.min(below / (vh * 0.5), 1);
      scale   = 1 - t * 0.12;
      ty      = t * 28;

    } else {
      // ── Sitting at sticky position ──
      // If the next card is covering this one, push it "further away"
      const nextTop = tops[i + 1];
      if (nextTop !== undefined) {
        const covered = (SVC_TOP + height) - nextTop; // px the next card overlaps this one
        if (covered > 0) {
          const t = Math.min(covered / height, 1);
          scale   = 1 - t * 0.08;          // shrink as pushed back
          sy      = 1 - t * 0.06;          // compress vertically — the "lean" illusion
          ty      = -t * 10;               // float up slightly as it recedes
        }
      }
    }

    card.style.transform = `translateY(${ty}px) scale(${scale}) scaleY(${sy})`;
  });
}

let rafPending = false;
function onScroll() {
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(() => {
      animateServiceCards();
      rafPending = false;
    });
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', animateServiceCards);
animateServiceCards();

// ===== SECTION HEADING REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.section-head, .about-photo, .about-text, .contact-title, .contact-sub, .contact-cta, .footer-card'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 0.05}s`;
  revealObserver.observe(el);
});

// ===== PROJECT DATA =====
const projects = {
  beribu: {
    name: 'Beribu', year: '2023', cat: 'Brand Identity',
    images: ['images/beribu-cover.png','images/beribu-2.png','images/beribu-3.png'],
    desc: ''
  },
  kelioniu: {
    name: 'Kelioniu akademija', year: '2025', cat: 'Visual Identity',
    images: ['images/kelioniu-cover.png','images/kelioniu-2.png','images/kelioniu-3.png'],
    desc: ''
  },
  bite: {
    name: 'Romainiu odontologijos klinika', year: '2024', cat: 'Brand Identity',
    images: ['images/bite-cover.jpg','images/bite-2.jpg','images/bite-3.jpg'],
    desc: ''
  },
  zoo: {
    name: 'Lithuanian Zoo', year: '2023', cat: 'Illustration',
    images: ['images/zoo-cover.jpg','images/zoo-2.jpg','images/zoo-3.jpg'],
    desc: ''
  },
  doa: {
    name: 'Disputes over Access', year: '2023', cat: 'Book Cover',
    images: ['images/doa-cover.png','images/doa-2.png','images/doa-3.png'],
    desc: 'Book cover design for a journalist practice study.'
  },
  'visual-identity': {
    name: 'Kotryna Creates', year: '2025', cat: 'Visual Identity',
    images: ['images/visual-identity-cover.jpg','images/visual-identity-2.png','images/visual-identity-3.png'],
    desc: 'Personal logo and visual identity system.'
  },
  jaunimo: {
    name: 'Jaunimo linija', year: '2022', cat: 'Book Design',
    images: ['images/jaunimo-linija-cover.jpg','images/jaunimo-linija-2.jpg','images/jaunimo-linija-3.jpg'],
    desc: 'Exercise book design.'
  },
  livoliukai: {
    name: 'Livoliukai', year: '2022', cat: 'Brand Identity',
    images: ['images/livoliukai-cover.jpg'],
    desc: ''
  },
  typeface: {
    name: 'Handmade Typeface', year: '2019', cat: 'Typography',
    images: ['images/typeface-cover.jpg','images/typeface-2.jpg','images/typeface-3.jpg'],
    desc: ''
  },
  muziejus:  { name: 'Lietuvos etnografijos muziejus', year: '2024', cat: 'Visual Identity', images: [], desc: 'Images coming soon.' },
  ekosanus:  { name: 'EKOsanus', year: '2021', cat: 'Logo & Packaging', images: [], desc: "Logo and packaging for brewer's yeast. Images coming soon." },
  orkla:     { name: 'Orkla care', year: '2024', cat: 'Design', images: [], desc: 'Images coming soon.' },
  vom:       { name: 'VOM Baltics', year: '2022', cat: 'Design', images: [], desc: 'Images coming soon.' },
  tshirts:   { name: 'T-shirt designs', year: '2023', cat: 'Illustration', images: [], desc: 'Images coming soon.' }
};

// ===== MODAL =====
const modal   = document.getElementById('modal');
const content = document.getElementById('modal-content');
const closeBtn = document.getElementById('modal-close');
const backdrop = document.getElementById('modal-backdrop');

function openModal(key) {
  const p = projects[key];
  if (!p) return;
  content.innerHTML = `
    <div class="modal-meta">
      <span class="modal-cat">${p.cat}</span>
      <span class="modal-year">${p.year}</span>
    </div>
    <h2 class="modal-title">${p.name}</h2>
    ${p.desc ? `<p class="modal-desc">${p.desc}</p>` : ''}
    ${p.images.length ? `<div class="modal-images">${p.images.map(s => `<img src="${s}" alt="${p.name}">`).join('')}</div>` : ''}
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

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();
    if (card.dataset.project) openModal(card.dataset.project);
  });
});

closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

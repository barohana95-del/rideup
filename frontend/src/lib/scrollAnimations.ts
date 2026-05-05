// =====================================================================
// Site-wide scroll animations (GSAP + ScrollTrigger).
// Inspired by pisgathaaluf.com vibe: smooth reveals, parallax, masks.
// Initialized once from MarketingApp.
// =====================================================================
import { gsap, ScrollTrigger } from './gsap';

let initialized = false;

export function initScrollAnimations() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  // Wait for layout
  requestAnimationFrame(() => {
    setupHeadlineReveals();
    setupSectionReveals();
    setupParallaxImages();
    setupCardStagger();
    setupNumberCounters();
    setupCTAMagnetics();
    setupScrollSnapHints();
    ScrollTrigger.refresh();
  });
}

/**
 * Reveal headings on scroll. Simple fade-up that preserves inner HTML
 * (so colored spans, italics, etc. survive).
 */
function setupHeadlineReveals() {
  const headings = document.querySelectorAll<HTMLElement>('.reveal-heading');
  headings.forEach((h) => {
    gsap.fromTo(
      h,
      { y: 60, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
      {
        y: 0,
        opacity: 1,
        clipPath: 'inset(0 0 0% 0)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: h,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });
}

/** Section-level fade-up with overshoot. */
function setupSectionReveals() {
  const els = document.querySelectorAll<HTMLElement>('.reveal-up');
  els.forEach((el) => {
    gsap.fromTo(
      el,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
      }
    );
  });
}

/** Subtle parallax on images marked `.parallax-img`. */
function setupParallaxImages() {
  const imgs = document.querySelectorAll<HTMLElement>('.parallax-img');
  imgs.forEach((img) => {
    gsap.to(img, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  });
}

/** Cards in a `.stagger-cards` parent reveal one-by-one. */
function setupCardStagger() {
  const groups = document.querySelectorAll<HTMLElement>('.stagger-cards');
  groups.forEach((group) => {
    const cards = group.children;
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 80%', toggleActions: 'play none none reverse' },
      }
    );
  });
}

/** Animate `.count-to` elements from 0 → data-target. */
function setupNumberCounters() {
  const els = document.querySelectorAll<HTMLElement>('.count-to');
  els.forEach((el) => {
    const target = parseFloat(el.dataset.target ?? '0');
    const decimals = parseInt(el.dataset.decimals ?? '0');
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      onUpdate: () => {
        el.textContent = decimals
          ? obj.val.toFixed(decimals)
          : Math.floor(obj.val).toLocaleString('en-US');
      },
    });
  });
}

/** Magnetic effect on `.magnetic` CTAs (mouse follows + glow). */
function setupCTAMagnetics() {
  const magnets = document.querySelectorAll<HTMLElement>('.magnetic');
  magnets.forEach((m) => {
    m.addEventListener('mousemove', (e) => {
      const r = m.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.25;
      gsap.to(m, { x, y, duration: 0.3, ease: 'power2.out' });
    });
    m.addEventListener('mouseleave', () => {
      gsap.to(m, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/** Pin sections briefly for cinematic effect on `.pin-section`. */
function setupScrollSnapHints() {
  // Optional — placeholder for future pin-based effects
}

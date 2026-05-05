// =====================================================================
// GSAP setup — registers ScrollTrigger and exports helpers.
// =====================================================================
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * Reveal elements on scroll with optional stagger.
 * Apply class `.fade-up` to the element first.
 */
export function revealOnScroll(
  el: Element | NodeListOf<Element> | string,
  options: { delay?: number; stagger?: number; y?: number } = {}
) {
  const { delay = 0, stagger = 0.1, y = 30 } = options;
  return gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    delay,
    stagger,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el as Element,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });
}

/** Parallax — moves element on scroll relative to a trigger. */
export function parallax(
  el: Element | string,
  options: { y?: number; trigger?: Element | string; speed?: number } = {}
) {
  const { y = 200, trigger, speed = 1 } = options;
  return gsap.to(el, {
    y: y * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger ?? (el as Element),
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });
}

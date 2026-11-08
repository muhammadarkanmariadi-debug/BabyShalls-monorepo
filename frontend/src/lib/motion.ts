'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Checks if the user has requested reduced motion in their OS / browser settings.
 */
export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Checks if running on a mobile screen (< 768px).
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

/**
 * Animate a headline with line-by-line reveal.
 */
export const animateHeadlineReveal = (
  targets: gsap.DOMTarget,
  options?: {
    delay?: number;
    duration?: number;
    stagger?: number;
    trigger?: Element | string;
  }
) => {
  if (isReducedMotion()) return null;

  return gsap.fromTo(
    targets,
    {
      yPercent: 105,
      opacity: 0,
    },
    {
      yPercent: 0,
      opacity: 1,
      duration: options?.duration ?? 0.75,
      delay: options?.delay ?? 0.1,
      stagger: options?.stagger ?? 0.12,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: options?.trigger
        ? {
            trigger: options.trigger,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        : undefined,
    }
  );
};

/**
 * Staggered card reveals when entering viewport.
 * Automatically clears inline transforms after completion so native CSS hover effects work 100% cleanly.
 */
export const animateStaggerCards = (
  container: Element | string,
  cardSelector: string,
  options?: {
    yOffset?: number;
    stagger?: number;
    duration?: number;
    start?: string;
  }
) => {
  if (isReducedMotion()) return null;

  const cards = typeof container === 'string'
    ? document.querySelectorAll(`${container} ${cardSelector}`)
    : container.querySelectorAll(cardSelector);

  if (!cards.length) return null;

  return gsap.fromTo(
    cards,
    {
      y: options?.yOffset ?? 24,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: options?.duration ?? 0.6,
      stagger: options?.stagger ?? (isMobileDevice() ? 0.07 : 0.09),
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: container,
        start: options?.start ?? 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
};

/**
 * Smooth, bug-free image parallax scrub during scroll.
 * On mobile, disabled or lowered to eliminate any jitter.
 */
export const animateParallax = (
  target: gsap.DOMTarget,
  container: Element | string,
  options?: {
    yPercent?: number;
    start?: string;
    end?: string;
  }
) => {
  if (isReducedMotion() || isMobileDevice()) return null;

  const yAmount = options?.yPercent ?? 12;

  return gsap.fromTo(
    target,
    {
      yPercent: 0,
    },
    {
      yPercent: yAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: options?.start ?? 'top top',
        end: options?.end ?? 'bottom top',
        scrub: true,
      },
    }
  );
};

/**
 * Counter up animation (e.g. 0.0 to 5.0 score).
 */
export const animateCountUp = (
  target: HTMLElement,
  endValue: number,
  options?: {
    decimals?: number;
    duration?: number;
    trigger?: Element | string;
    prefix?: string;
    suffix?: string;
  }
) => {
  if (isReducedMotion()) {
    target.innerText = `${options?.prefix ?? ''}${endValue.toFixed(options?.decimals ?? 1)}${options?.suffix ?? ''}`;
    return null;
  }

  const obj = { val: 0 };
  const decimals = options?.decimals ?? 1;

  return gsap.to(obj, {
    val: endValue,
    duration: options?.duration ?? 1.4,
    ease: 'power2.out',
    scrollTrigger: options?.trigger
      ? {
          trigger: options.trigger,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      : undefined,
    onUpdate: () => {
      target.innerText = `${options?.prefix ?? ''}${obj.val.toFixed(decimals)}${options?.suffix ?? ''}`;
    },
  });
};

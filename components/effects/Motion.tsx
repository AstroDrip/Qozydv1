'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function markSessionEntered() {
  try {
    const seen = sessionStorage.getItem('qozyd-entered') === '1';
    sessionStorage.setItem('qozyd-entered', '1');
    return seen;
  } catch {
    return false;
  }
}

export default function Motion() {
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const seen = markSessionEntered();
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const intro = gsap.timeline();
        if (!seen) {
          gsap.set(loader.current, { display: 'flex' });
          intro
            .fromTo(
              '.loader-word span',
              { yPercent: 110 },
              { yPercent: 0, stagger: 0.08, duration: 0.55, ease: 'power3.out' },
            )
            .to('.loader-line', { scaleX: 1, duration: 0.55 }, '<')
            .to(loader.current, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '+=0.15');
        }

        intro.fromTo(
          '.hero h1 .headline-line',
          { yPercent: 110 },
          { yPercent: 0, stagger: 0.15, duration: 1.1, ease: 'power4.out' },
          seen ? 0 : '-=0.2',
        );

        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
          gsap.fromTo(
            element,
            { y: 45, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: { trigger: element, start: 'top 91%', once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('.service-card').forEach(card => {
          gsap.fromTo(
            card.querySelectorAll('.reveal-line>span'),
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.8,
              stagger: 0.09,
              ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 80%', once: true },
            },
          );
        });

        gsap.to('.hero-moon', {
          y: 100,
          rotation: 14,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
        });
        gsap.to('.scroll-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
        });
      });
    });

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="loader" ref={loader} aria-hidden="true">
        <div className="loader-meta">INDEPENDENT THINKING. EXTRAORDINARY POSSIBILITIES.</div>
        <div className="loader-word">
          {'QOZYD'.split('').map((letter, index) => <span key={index}>{letter}</span>)}
        </div>
        <div className="loader-line" />
        <div className="loader-bottom"><span>YOUR NEXT PHASE STARTS HERE</span><span>↗</span></div>
      </div>
    </>
  );
}

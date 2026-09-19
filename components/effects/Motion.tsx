'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { waitForOpeningAssets } from '@/lib/loading-readiness';

export default function Motion() {
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const intro = gsap.timeline();
        const controller = new AbortController();
        const root=document.documentElement;
        const previousOverflow=root.style.overflow;
        const previousBusy=document.querySelector('main')?.getAttribute('aria-busy');
        const release = () => {
          root.style.overflow=previousOverflow;
          if (previousBusy===null || previousBusy===undefined) document.querySelector('main')?.removeAttribute('aria-busy');
          else document.querySelector('main')?.setAttribute('aria-busy',previousBusy);
        };
        root.style.overflow='hidden';
        document.querySelector('main')?.setAttribute('aria-busy','true');
        const safety=setTimeout(release,6000);
        gsap.set(loader.current, { display: 'flex', visibility:'visible' });
          intro
            .fromTo(
              '.loader-word span',
              { yPercent: 110 },
              { yPercent: 0, stagger: 0.12, duration: 1, ease: 'power3.out' },
            )
            // A single linear sweep outlasts the four-second asset deadline.
            // No early plateau, pause marker, or accelerated completion phase.
            .to('.loader-line', { scaleX: 1, duration: 4.125, ease:'none' }, 0)
            .to(loader.current, { yPercent: -100, duration: 0.425, ease: 'none', onStart:()=>ScrollTrigger.refresh(), onComplete:()=>{release();clearTimeout(safety);} });
        void waitForOpeningAssets(controller.signal).then(() => {
          if (controller.signal.aborted) return;
          ScrollTrigger.refresh();
        });

        intro.fromTo(
          '.hero h1 .headline-line',
          { yPercent: 110 },
          { yPercent: 0, stagger: 0.15, duration: 1.1, ease: 'power4.out' },
          '-=0.2',
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

        gsap.to('.scroll-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
        });
        // Progress-linked motion lets the composition reverse naturally with scrolling.
        const compact = window.matchMedia('(max-width: 700px)').matches;
        gsap.to('.hero h1', {
          xPercent: -5, yPercent: -12, opacity: 0.35, ease: 'none',
          scrollTrigger: {trigger:'.hero',start:'top top',end:'bottom top',scrub:0.25},
        });
        gsap.fromTo('.showcase', {y:60,scale:0.94,rotationX:5,transformPerspective:1400}, {
          y:0,scale:1,rotationX:0,ease:'none',
          scrollTrigger:{trigger:'.work-section',start:'top 80%',end:'top 15%',scrub:0.3},
        });
        gsap.fromTo('.pendant-wrap', {y:compact ? 20 : 80,scale:0.88}, {
          y:0,scale:1,ease:'none',
          scrollTrigger:{trigger:'.pendant-wrap',start:'top 95%',end:'top 25%',scrub:0.3},
        });
        gsap.utils.toArray<HTMLElement>('.process-list article').forEach(article => {
          gsap.fromTo(article.querySelector('p'),{opacity:0.3},{
            opacity:1,ease:'none',scrollTrigger:{trigger:article,start:'top 85%',end:'top 55%',scrub:0.4},
          });
        });
        return () => {
          controller.abort(); clearTimeout(safety); release();
        };
      });
      media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const cleanups: Array<() => void> = [];
        gsap.utils.toArray<HTMLElement>('.round-link, .instagram-link').forEach(element => {
          const x = gsap.quickTo(element,'x',{duration:0.45,ease:'power3.out'});
          const y = gsap.quickTo(element,'y',{duration:0.45,ease:'power3.out'});
          const move = (event:PointerEvent) => {
            const rect = element.getBoundingClientRect();
            x((event.clientX-rect.left-rect.width/2)*0.13);
            y((event.clientY-rect.top-rect.height/2)*0.18);
          };
          const leave = () => {x(0);y(0);};
          element.addEventListener('pointermove',move);
          element.addEventListener('pointerleave',leave);
          cleanups.push(() => {
            element.removeEventListener('pointermove',move);
            element.removeEventListener('pointerleave',leave);
            x.tween.kill();y.tween.kill();
          });
        });
        return () => cleanups.forEach(cleanup => cleanup());
      });
    });

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <>
      <noscript><style>{'.loader{display:none!important}'}</style></noscript>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="loader" ref={loader} aria-hidden="true">
        <div className="loader-meta">INDEPENDENT THINKING. EXTRAORDINARY POSSIBILITIES.</div>
        <div className="loader-word">
          {'QOZYD'.split('').map((letter, index) => <span key={index}>{letter}</span>)}
        </div>
        <div className="loader-line" />
        <div className="loader-bottom"><span>QOZYD</span><span>↗</span></div>
      </div>
    </>
  );
}

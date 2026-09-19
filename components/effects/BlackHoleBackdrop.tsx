'use client';

import { useEffect, useRef } from 'react';
import PixelMoon from './PixelMoon';
import { ThreadField } from './Effects';

/** One square coordinate system and one transform for both visual layers. */
export default function BlackHoleBackdrop() {
  const orbitRef=useRef<HTMLDivElement>(null);
  useEffect(() => {
    const orbit=orbitRef.current;
    const viewport=orbit?.parentElement;
    const universe=viewport?.parentElement;
    const services=universe?.querySelector<HTMLElement>('.cube-services');
    if (!orbit || !viewport || !universe || !services) return;
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    const native=CSS.supports('animation-timeline','scroll(root block)') && CSS.supports('animation-range','0px 100px');
    let frame=0;
    let start=0, distance=1, targetX=0, targetY=0, targetScale=1;
    const renderOrbit=() => {
      frame=0;
      if (native || preference.matches) return;
      const progress=Math.max(0,Math.min(1,(window.scrollY-start)/distance));
      orbit.style.transform=`translateX(-50%) translate3d(${targetX*progress}px,${targetY*progress}px,0) scale(${1+(targetScale-1)*progress})`;
    };
    const measure=() => {
      start=universe.getBoundingClientRect().top+window.scrollY;
      distance=Math.max(1,services.getBoundingClientRect().top+window.scrollY-start);
      // Read the actual shared center rather than separate device offsets.
      targetX=viewport.clientWidth*0.5-orbit.offsetLeft;
      targetY=viewport.clientHeight*0.5-orbit.offsetTop-orbit.offsetHeight*0.5;
      targetScale=0.85*Math.min(viewport.clientWidth,viewport.clientHeight*1.15)/Math.max(1,orbit.offsetWidth);
      orbit.style.setProperty('--orbit-start',`${start}px`);
      orbit.style.setProperty('--orbit-end',`${start+distance}px`);
      orbit.style.setProperty('--orbit-x',`${targetX}px`);
      orbit.style.setProperty('--orbit-y',`${targetY}px`);
      orbit.style.setProperty('--orbit-scale',String(targetScale));
      orbit.dataset.scrollMode=preference.matches ? 'static' : native ? 'native' : 'fallback';
      if (native || preference.matches) orbit.style.removeProperty('transform');
      renderOrbit();
    };
    const onScroll=() => {if (!frame) frame=requestAnimationFrame(renderOrbit);};
    // Supporting browsers keep scroll motion on the compositor. No JS scroll
    // handler competes with the WebGL renderers in this path.
    if (!native) window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',measure);
    preference.addEventListener('change',measure);
    const observer=new ResizeObserver(measure);
    observer.observe(universe);
    observer.observe(viewport);
    observer.observe(orbit);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll',onScroll);
      window.removeEventListener('resize',measure);
      preference.removeEventListener('change',measure);
      cancelAnimationFrame(frame);
      delete orbit.dataset.scrollMode;
      orbit.style.removeProperty('transform');
    };
  },[]);
  return <div className="universe-viewport" aria-hidden="true">
    <div ref={orbitRef} className="hero-moon black-hole-backdrop">
      <ThreadField className="hero-threads"/>
      <PixelMoon/>
    </div>
  </div>;
}

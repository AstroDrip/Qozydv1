'use client';
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

const Scene = lazy(() => import('./BlackHoleScene'));

export function BlackHoleFallback() {
  return <svg viewBox="0 0 256 256" aria-hidden="true" className="black-hole-fallback">
    <defs>
      <radialGradient id="bh-hot" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff1c8"/>
        <stop offset="42%" stopColor="#ffa34d"/>
        <stop offset="78%" stopColor="#ff2440"/>
        <stop offset="100%" stopColor="#960a29"/>
      </radialGradient>
    </defs>
    <ellipse cx="128" cy="135" rx="91" ry="38" fill="none" stroke="url(#bh-hot)" strokeWidth="31" transform="rotate(-5 128 135)"/>
    <path d="M52 133 Q128 34 204 133" fill="none" stroke="url(#bh-hot)" strokeWidth="25" strokeLinecap="square"/>
    <circle cx="128" cy="124" r="43" fill="#030001"/>
    <ellipse cx="128" cy="140" rx="72" ry="17" fill="none" stroke="#ffe0aa" strokeWidth="10" opacity=".8"/>
  </svg>;
}
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state = {failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  render() { return this.state.failed ? <BlackHoleFallback/> : this.props.children; }
}

// Preserve the existing hero and artwork slots with a shared live 3D model.
export default function PixelMoon({className=''}:{className?:string}) {
  const ref = useRef<HTMLElement>(null);
  const [active,setActive] = useState(false);
  const [initialized,setInitialized] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => {
      const running = visible && !media.matches && !document.hidden;
      setActive(running);
      if (running) setInitialized(true);
    };
    const observer = new IntersectionObserver(([entry]) => { visible=entry.isIntersecting; update(); });
    if (ref.current) observer.observe(ref.current);
    media.addEventListener('change',update);
    document.addEventListener('visibilitychange',update);
    return () => { observer.disconnect(); media.removeEventListener('change',update); document.removeEventListener('visibilitychange',update); };
  },[]);
  return <figure ref={ref} className={`pixel-moon voxel-black-hole ${className}`} aria-label="Spinning voxel black hole">
    {initialized ? <SceneBoundary><Suspense fallback={<BlackHoleFallback/>}><Scene active={active}/></Suspense></SceneBoundary> : <BlackHoleFallback/>}
  </figure>;
}

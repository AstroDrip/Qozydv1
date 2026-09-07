'use client';
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import PixelMoon from './PixelMoon';

const WebThreads = lazy(() => import('./WebThreads'));
const MoonLanyard = lazy(() => import('./MoonLanyard'));

class EffectBoundary extends Component<{children: ReactNode; fallback?: ReactNode}, {failed: boolean}> {
  state = {failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  render() { return this.state.failed ? this.props.fallback ?? null : this.props.children; }
}

export function useMotionPreference() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') { setReduced(false); return; }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

export function ThreadField({ className = '' }: {className?: string}) {
  const reduced = useMotionPreference();
  return <div className={`thread-field ${className}`} aria-hidden="true">{!reduced && <EffectBoundary><Suspense fallback={null}><WebThreads color1="#65091d" color2="#ea173d" color3="#ff686e" speed={0.12} threadCount={7} grain={false} spread={0.2} brightness={0.45} glow={0.035} mouseInteraction={false}/></Suspense></EffectBoundary>}</div>;
}

export function Pendant() {
  const reduced = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reset, setReset] = useState(0);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {rootMargin:'150px'});
    if(ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const fallback = <div className="pendant-fallback"><span className="fallback-cord"/><PixelMoon/></div>;
  return <div className="pendant-wrap" ref={ref}>
    <div className="pendant-canvas" role="img" aria-label="Draggable blood moon pendant. Drag and release to swing it; use Reset moon to return it to rest.">
      {visible && !reduced ? <EffectBoundary fallback={fallback}><Suspense fallback={fallback}><MoonLanyard key={reset}/></Suspense></EffectBoundary> : fallback}
    </div>
    <div className="pendant-controls"><span>{reduced ? '256 × 256 / BLOOD MOON' : 'GRAB THE MOON. CHANGE ITS ORBIT.'}</span>{!reduced && <button onClick={() => setReset(v => v + 1)}>Reset moon ↺</button>}</div>
  </div>;
}

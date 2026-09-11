'use client';
import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { BlackHoleFallback } from './PixelMoon';

const WebThreads = lazy(() => import('./WebThreads'));
const MoonLanyard = lazy(() => import('./MoonLanyard'));

class EffectBoundary extends Component<{children: ReactNode; fallback?: ReactNode}, {failed: boolean}> {
  state = {failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  render() { return this.state.failed ? this.props.fallback ?? null : this.props.children; }
}

const MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const subscribeMotionPreference = (notify: () => void) => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  const media = window.matchMedia(MOTION_QUERY);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
const getMotionPreference = () =>
  typeof window === 'undefined' || typeof window.matchMedia !== 'function'
    ? true
    : window.matchMedia(MOTION_QUERY).matches;
const getServerMotionPreference = () => true;

export function useMotionPreference() {
  return useSyncExternalStore(
    subscribeMotionPreference,
    getMotionPreference,
    getServerMotionPreference,
  );
}

export function ThreadField({ className = '' }: {className?: string}) {
  const reduced = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);
  const [nearby,setNearby] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect(); }
    },{rootMargin:'150px'});
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  },[]);
  return <div ref={ref} className={`thread-field ${className}`} aria-hidden="true">{nearby && !reduced && <EffectBoundary><Suspense fallback={null}><WebThreads color1="#65091d" color2="#ea173d" color3="#ff686e" speed={0.12} threadCount={7} grain={false} spread={0.2} brightness={0.45} glow={0.035} mouseInteraction={false}/></Suspense></EffectBoundary>}</div>;
}

export function Pendant() {
  const reduced = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [reset, setReset] = useState(0);
  const [particleSize, setParticleSize] = useState(1);
  const [particleAmount, setParticleAmount] = useState(1);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    let inView = false;
    const update = () => {
      const running = inView && !document.hidden;
      setVisible(running);
      if (running) setInitialized(true);
    };
    const observer = new IntersectionObserver(
      ([entry]) => { inView=entry.isIntersecting; update(); },
      {rootMargin:'150px'},
    );
    if(ref.current) observer.observe(ref.current);
    document.addEventListener('visibilitychange',update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange',update); };
  }, []);
  const fallback = <div className="pendant-fallback"><span className="fallback-cord"/><BlackHoleFallback/></div>;
  return <div className="pendant-wrap" ref={ref}>
    <figure className="pendant-canvas" aria-label="Draggable voxel black hole pendant. Drag and release to swing it; use Reset to return it to rest.">
      {initialized && !reduced ? <EffectBoundary fallback={fallback}><Suspense fallback={fallback}><MoonLanyard key={reset} active={visible} particleSize={particleSize} particleAmount={particleAmount}/></Suspense></EffectBoundary> : fallback}
    </figure>
    {!reduced && <div className="pendant-controls">
      <label>Particle size <output>{Math.round(particleSize*100)}%</output><input aria-label="Pendant particle size" type="range" min="0.7" max="1.5" step="0.05" value={particleSize} onChange={event=>setParticleSize(Number(event.target.value))}/></label>
      <label>Particle amount <output>{Math.round(particleAmount*100)}%</output><input aria-label="Pendant particle amount" type="range" min="0.5" max="1.5" step="0.1" value={particleAmount} onChange={event=>setParticleAmount(Number(event.target.value))}/></label>
      <button onClick={() => {setParticleSize(1);setParticleAmount(1);setReset(v => v + 1);}}>Reset ↺</button>
    </div>}
  </div>;
}

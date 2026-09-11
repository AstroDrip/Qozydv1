let resolveBlackHole: () => void;
const blackHoleReady = new Promise<void>(resolve => { resolveBlackHole=resolve; });

export function markBlackHoleReady() { resolveBlackHole(); }

export async function waitForOpeningAssets(signal: AbortSignal) {
  const timers: ReturnType<typeof setTimeout>[] = [];
  const delay = (ms:number) => new Promise<void>(resolve => { timers.push(setTimeout(resolve,ms)); });
  let abort: () => void = () => {};
  const cancelled = new Promise<void>(resolve => { abort=resolve; });
  signal.addEventListener('abort',abort,{once:true});
  if (signal.aborted) abort();
  try {
    const images=Array.from(document.querySelectorAll<HTMLImageElement>('.service-cube-scene img'));
    const imageLoads=images.map(image => {
      image.loading='eager';
      return image.decode().catch(() => {});
    });
    const hero=document.querySelector('.hero-moon')?.getBoundingClientRect();
    const heroVisible=hero && hero.bottom>0 && hero.top<window.innerHeight;
    const assets=Promise.allSettled([
      document.fonts.ready, ...imageLoads,
      ...(heroVisible ? [blackHoleReady] : []),
    ]);
    await Promise.race([
      Promise.all([delay(1750),Promise.race([assets,delay(4000)])]),
      cancelled,
    ]);
  } finally {
    timers.forEach(clearTimeout);
    signal.removeEventListener('abort',abort);
  }
}

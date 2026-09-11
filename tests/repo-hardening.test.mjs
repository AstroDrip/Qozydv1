import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = relative => readFile(path.join(root, relative), 'utf8');

test('page stays server-rendered and hero and services share one bounded background', async () => {
  const page = await read('app/page.tsx');
  assert.doesNotMatch(page, /^['"]use client['"];?/m);
  assert.match(page, /universe-viewport/);
  assert.equal((page.match(/<ThreadField\b/g) ?? []).length, 1);
  assert.doesNotMatch(page, /service-black-hole|service-thread-viewport/);
  const journey = page.slice(page.indexOf('className="universe-journey"'), page.indexOf('<section id="work"'));
  assert.match(journey, /className="hero"/);
  assert.match(journey, /className="services cube-services"/);
});

test('black hole uses shared geometry with lazy rendering and a reduced-motion fallback', async () => {
  const pixelMoon = await read('components/effects/PixelMoon.tsx');
  const lanyard = await read('components/effects/MoonLanyard.jsx');
  assert.doesNotMatch(pixelMoon, /getImageData|putImageData|moonCanvas/);
  assert.doesNotMatch(lanyard, /moonCanvas/);
  assert.doesNotMatch(pixelMoon + lanyard, /blood-moon-256\.png/);
  assert.match(pixelMoon, /prefers-reduced-motion/);
  assert.match(pixelMoon, /IntersectionObserver/);
  assert.match(pixelMoon, /BlackHoleFallback/);
  const scene = await read('components/effects/BlackHoleScene.jsx');
  assert.match(scene, /<BlackHoleModel\//);
  assert.match(lanyard, /<BlackHoleModel\b[^>]*\/>/);
});

test('WebThreads caps render cost and only binds mouse listeners when interaction is enabled', async () => {
  const threads = await read('components/effects/WebThreads.jsx');
  assert.match(threads, /Math\.min\(window\.devicePixelRatio \|\| 1, 1\)/);
  assert.match(threads, /FRAME_INTERVAL/);
  assert.match(threads, /if \(mouseInteraction\)/);
});

test('repository ignores generated TypeScript state, handoff archives, and worktrees', async () => {
  const gitignore = await read('.gitignore');
  assert.match(gitignore, /\*\.tsbuildinfo/);
  assert.match(gitignore, /QOZYD-source-handoff\.zip/);
  assert.match(gitignore, /\.worktrees\//);
});

test('unused scaffold UI and its dependency surface are removed', async () => {
  const { existsSync } = await import('node:fs');
  for (const relative of ['components/ui', 'hooks/use-mobile.ts', 'lib/utils.ts', 'components.json', '.scaffold']) {
    assert.equal(existsSync(path.join(root, relative)), false, `${relative} should be removed`);
  }

  const pkg = JSON.parse(await read('package.json'));
  const unused = [
    '@base-ui/react', '@shadcn/react', 'class-variance-authority', 'clsx', 'cmdk', 'date-fns',
    'embla-carousel-react', 'input-otp', 'react-day-picker', 'react-resizable-panels', 'recharts',
    'shadcn', 'tailwind-merge', 'tw-animate-css', 'tailwindcss', '@tailwindcss/postcss',
  ];
  for (const name of unused) {
    assert.equal(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name], undefined, `${name} should be removed`);
  }

  const next = await read('next.config.ts');
  assert.doesNotMatch(next, /tailwindcss|postcss|cloudflare|vinext/);
});

test('hover motion is pointer-aware, interruptible, and reduced-motion safe', async () => {
  const css = await read('app/globals.css');
  const gallery = await read('components/effects/AccordionGallery.tsx');
  const galleryCss = await read('components/effects/AccordionGallery.css');

  assert.match(css, /@media\s*\(hover:hover\)\s*and\s*\(pointer:fine\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /\.discipline-strip>div\s*\{animation:none\}/);
  assert.match(gallery, /overwrite:\s*['"]auto['"]/);
  assert.match(galleryCss, /contain:\s*layout paint/);
});

test('gallery hover does not recreate its resize observer or double-start layout animation', async () => {
  const gallery = await read('components/effects/AccordionGallery.tsx');
  assert.match(gallery, /const activeRef = useRef\(safeDefault\)/);
  assert.match(gallery, /activeRef\.current = active/);
  assert.match(gallery, /applyLayout\(false\)/);
  assert.match(gallery, /\},\s*\[\s*count,\s*duration,/);
});

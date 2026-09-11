import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('lint ignores retained research sources but not application code', async () => {
  const config = JSON.parse(await read('.oxlintrc.json'));
  assert.ok(config.ignorePatterns.includes('.research/**'));
});

test('active image surfaces use Next Image rather than raw img tags', async () => {
  for (const path of ['app/page.tsx', 'components/effects/AccordionGallery.tsx']) {
    const source = await read(path);
    assert.match(source, /from ['"]next\/image['"]/);
    assert.doesNotMatch(source, /<img\b/);
  }
});

test('motion preference and pendant visibility avoid synchronous effect state writes', async () => {
  const source = await read('components/effects/Effects.tsx');
  assert.match(source, /useSyncExternalStore/);
  assert.doesNotMatch(source, /setReduced\(/);
  assert.doesNotMatch(source, /IntersectionObserver === ['"]undefined['"]\) \{ setVisible/);
});

test('moon frame loop keeps mutable vectors in refs', async () => {
  const source = await read('components/effects/MoonLanyard.jsx');
  assert.match(source, /vecRef=useRef\(new THREE\.Vector3\(\)\)/);
  assert.match(source, /dirRef=useRef\(new THREE\.Vector3\(\)\)/);
  assert.doesNotMatch(source, /const vec=useMemo/);
});

test('thread lifecycle uses statements rather than side-effect ternaries', async () => {
  const source = await read('components/effects/WebThreads.jsx');
  assert.doesNotMatch(source, /isVisible \? tryStart\(\) : tryStop\(\)/);
  assert.doesNotMatch(source, /isPageVisible \? tryStart\(\) : tryStop\(\)/);
});


test('gallery derives a safe active index without effect-driven state correction', async () => {
  const source = await read('components/effects/AccordionGallery.tsx');
  assert.doesNotMatch(source, /setActive\(current => Math\.min/);
  assert.match(source, /const activeIndex =/);
  assert.match(source, /<section/);
  assert.doesNotMatch(source, /role="group"/);
});

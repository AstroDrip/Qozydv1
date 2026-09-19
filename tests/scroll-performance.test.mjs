import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = file => readFile(new URL(`../components/effects/${file}`, import.meta.url), 'utf8');

test('shared canvas scroll movement never animates layout dimensions', async () => {
  const source = await read('BlackHoleBackdrop.tsx');
  const movement = source.slice(source.indexOf('const renderOrbit='), source.indexOf('const measure='));
  assert.doesNotMatch(movement, /style\.(?:width|height|left|top)\s*=/);
  assert.match(movement, /translate3d\(/);
  assert.match(movement, /scale\(/);
  assert.doesNotMatch(movement, /gsap\.(?:to|fromTo|timeline)/);
});

test('offscreen black hole and pendant keep their renderers but stop frame and physics work', async () => {
  const preview = await read('PixelMoon.tsx');
  const scene = await read('BlackHoleScene.jsx');
  const pendant = await read('MoonLanyard.jsx');
  assert.match(preview, /initialized \? <SceneBoundary>/);
  assert.match(preview, /<Scene active=\{active\}/);
  for (const source of [scene, pendant]) {
    assert.match(source, /frameloop=\{active \? 'always' : 'never'\}/);
  }
  assert.match(pendant, /paused=\{!active\}/);
});

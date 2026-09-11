import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { BLACK_HOLE_LAYER_SPECS } from '../components/effects/blackHoleGeometry.js';

const modelPath = new URL('../components/effects/BlackHoleModel.jsx', import.meta.url);
const scenePath = new URL('../components/effects/BlackHoleScene.jsx', import.meta.url);

test('uses one continuous disk population instead of separate crest or lensing rings', () => {
  const names = BLACK_HOLE_LAYER_SPECS.map((layer) => layer.name);
  assert.deepEqual(names, ['inner', 'mid', 'outer', 'debris']);
  assert.equal(BLACK_HOLE_LAYER_SPECS.filter((layer) => layer.kind === 0).length, 3);
  assert.equal(BLACK_HOLE_LAYER_SPECS.filter((layer) => layer.kind === 2).length, 1);
});

test('camera remains unchanged so unrelated layout behavior is preserved', async () => {
  const source = await readFile(scenePath, 'utf8');
  assert.match(source, /position:\[0,0\.04,7\.25\]/);
  assert.match(source, /fov:46/);
});

test('same clockwise disk particles are remapped more sharply into a shorter far-side top semicircle', async () => {
  const source = await readFile(modelPath, 'utf8');
  assert.match(source, /float speed = mix\(0\.38, 0\.14, aHeat\)/);
  assert.match(source, /float angle = aAngle \+ uTime \* speed;/);
  assert.match(source, /float farSide = max\(-sin\(angle\), 0\.0\);/);
  assert.match(source, /float lensBlend = smoothstep\(0\.10, 0\.16, farSide\);/);
  assert.match(source, /vec3 frontOrbit = tiltDisk\(diskPoint\);/);
  assert.match(source, /float topRise = pow\(farSide, 1\.85\);/);
  assert.match(source, /float lensHeight = topRise \* radius \* 0\.48;/);
  assert.match(source, /vec3 lensedOrbit = vec3\(/);
  assert.match(source, /orbit = mix\(frontOrbit, lensedOrbit, lensBlend\);/);
  assert.doesNotMatch(source, /float phase = fract\(/);
  assert.doesNotMatch(source, /float arch = mix\(/);
});

test('public component contract is unchanged while the motion is made much slower', async () => {
  const source = await readFile(modelPath, 'utf8');
  const outer = BLACK_HOLE_LAYER_SPECS.find((layer) => layer.name === 'outer');
  const debris = BLACK_HOLE_LAYER_SPECS.find((layer) => layer.name === 'debris');

  assert.ok(outer.maxRadius <= 1.82);
  assert.ok(debris.maxRadius <= 2.14);
  assert.match(source, /export default function BlackHoleModel\(\{ particleSize = 1, particleAmount = 1 \}\)/);
  assert.match(source, /scale=\{0\.86\}/);
  assert.match(source, /float angle = aAngle \+ uTime \* \(0\.12 \+ \(1\.0 - aHeat\) \* 0\.05\);/);
});

test('voxels remain true cubes and no image/torus shortcut is reintroduced', async () => {
  const source = await readFile(modelPath, 'utf8');
  assert.match(source, /vec3 rotateVoxel\(/);
  assert.match(source, /vec3 rotatedLocal = rotateVoxel\(/);
  assert.doesNotMatch(source, /TextureLoader|useLoader|black-hole-reference|<planeGeometry|<torusGeometry/);
});

test('particle amount controls visible voxel density instead of only size or brightness', async () => {
  const source = await readFile(modelPath, 'utf8');
  assert.match(source, /float density = clamp\(uParticleAmount \/ 1\.5, 0\.0, 1\.0\);/);
  assert.match(source, /if \(vSeed > density\) discard;/);
  assert.doesNotMatch(source, /float amountScale =/);
  assert.doesNotMatch(source, /color \*= 0\.94 \+ clamp\(uParticleAmount/);
});

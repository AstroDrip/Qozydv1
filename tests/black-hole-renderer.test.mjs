import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const modelPath = new URL('../components/effects/BlackHoleModel.jsx', import.meta.url);
const scenePath = new URL('../components/effects/BlackHoleScene.jsx', import.meta.url);

test('renderer is true 3D and does not use the reference image as a texture or a torus halo mesh', async () => {
  const source = await readFile(modelPath, 'utf8');
  assert.match(source, /blackHoleGeometry\.js/);
  assert.match(source, /<instancedMesh/);
  assert.match(source, /<sphereGeometry/);
  assert.doesNotMatch(source, /TextureLoader|useLoader|black-hole-reference|<planeGeometry|\bmap=|<torusGeometry/);
});

test('preview has no starfield and keeps an alpha WebGL canvas', async () => {
  const source = await readFile(scenePath, 'utf8');
  assert.doesNotMatch(source, /Starfield|pointsMaterial|useMemo/);
  assert.match(source, /alpha:true/);
});

test('vertex shader does not use GLSL reserved interpolation qualifiers as local identifiers', async () => {
  const source = await readFile(modelPath, 'utf8');
  assert.doesNotMatch(source, /\b(?:float|int|bool|vec[234]|mat[234])\s+(?:flat|smooth|noperspective|centroid|invariant)\b/);
});

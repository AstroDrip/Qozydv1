import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BLACK_HOLE_LAYER_SPECS,
  createBlackHoleLayerData,
} from '../components/effects/blackHoleGeometry.js';

test('defines only the continuous accretion disk bands plus detached debris', () => {
  const names = BLACK_HOLE_LAYER_SPECS.map((layer) => layer.name);
  assert.deepEqual(names, ['inner', 'mid', 'outer', 'debris']);
  assert.ok(BLACK_HOLE_LAYER_SPECS.find((layer) => layer.name === 'inner').count >= 1000);
  assert.ok(BLACK_HOLE_LAYER_SPECS.find((layer) => layer.name === 'mid').count >= 1000);
  assert.ok(BLACK_HOLE_LAYER_SPECS.find((layer) => layer.name === 'outer').count >= 1000);
  assert.ok(BLACK_HOLE_LAYER_SPECS.find((layer) => layer.name === 'debris').count >= 200);
});

test('generates deterministic instanced voxel attributes for every layer', () => {
  for (const spec of BLACK_HOLE_LAYER_SPECS) {
    const first = createBlackHoleLayerData(spec);
    const second = createBlackHoleLayerData(spec);

    assert.equal(first.radius.length, spec.count);
    assert.equal(first.angle.length, spec.count);
    assert.equal(first.height.length, spec.count);
    assert.equal(first.seed.length, spec.count);
    assert.equal(first.heat.length, spec.count);
    assert.equal(first.size.length, spec.count);
    assert.equal(first.kind.length, spec.count);
    assert.equal(first.radius[0], second.radius[0]);
    assert.equal(first.angle[Math.min(10, spec.count - 1)], second.angle[Math.min(10, spec.count - 1)]);
  }
});

test('keeps inner, outer, and debris radii within the reduced footprint', () => {
  const innerSpec = BLACK_HOLE_LAYER_SPECS.find((layer) => layer.name === 'inner');
  const outerSpec = BLACK_HOLE_LAYER_SPECS.find((layer) => layer.name === 'outer');
  const debrisSpec = BLACK_HOLE_LAYER_SPECS.find((layer) => layer.name === 'debris');

  const inner = createBlackHoleLayerData(innerSpec);
  const outer = createBlackHoleLayerData(outerSpec);
  const debris = createBlackHoleLayerData(debrisSpec);

  assert.ok(Math.max(...inner.radius) < 1.02);
  assert.ok(Math.max(...outer.radius) < 1.86);
  assert.ok(Math.max(...debris.radius) < 2.22);
  assert.ok(Math.min(...debris.radius) > 1.55);
});

test('all accretion bands share kind 0 so the shader can use one continuous orbit', () => {
  for (const name of ['inner', 'mid', 'outer']) {
    const spec = BLACK_HOLE_LAYER_SPECS.find((layer) => layer.name === name);
    const data = createBlackHoleLayerData(spec);
    assert.ok(Array.from(data.kind).every((value) => value === 0));
  }
});

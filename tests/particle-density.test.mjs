import test from 'node:test';
import assert from 'node:assert/strict';
import { BLACK_HOLE_LAYER_SPECS, createBlackHoleLayerData, sortLayerBySeed, visibleParticleCount } from '../components/effects/blackHoleGeometry.js';

test('density optimization preserves every visible particle and its attributes', () => {
  for (const spec of BLACK_HOLE_LAYER_SPECS) {
    const original=createBlackHoleLayerData(spec);
    const sorted=sortLayerBySeed(original);
    const keys=Object.keys(original);
    const signature=(data,index)=>keys.map(key=>data[key][index]).join(',');
    for (const amount of [0.5,1,1.5]) {
      const expected=Array.from(original.seed,(_,i)=>i)
        .filter(i=>original.seed[i]<=amount/1.5)
        .map(i=>signature(original,i)).sort();
      const count=visibleParticleCount(sorted.seed,amount);
      const actual=Array.from({length:count},(_,i)=>signature(sorted,i)).sort();
      assert.deepEqual(actual,expected);
    }
    assert.equal(visibleParticleCount(sorted.seed,10),spec.count);
    assert.equal(visibleParticleCount(sorted.seed,-1),0);
  }
});

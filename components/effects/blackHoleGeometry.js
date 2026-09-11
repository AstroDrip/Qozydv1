const GOLDEN_ANGLE = 2.399963229728653;

// Keep exactly the same particles, ordered so the density slider can reduce
// the GPU draw count instead of shading and discarding invisible instances.
export function sortLayerBySeed(data) {
  const order = Array.from(data.seed, (_, index) => index).sort((a,b) => data.seed[a]-data.seed[b]);
  return Object.fromEntries(Object.entries(data).map(([name, values]) =>
    [name, Float32Array.from(order, index => values[index])],
  ));
}

export function visibleParticleCount(seeds, amount) {
  const threshold = Math.min(1,Math.max(0,amount/1.5));
  let low=0, high=seeds.length;
  while (low<high) {
    const middle=(low+high)>>>1;
    if (seeds[middle]<=threshold) low=middle+1;
    else high=middle;
  }
  return low;
}

export const BLACK_HOLE_LAYER_SPECS = [
  { name: 'inner', count: 2250, kind: 0, minRadius: 0.70, maxRadius: 0.98, minSize: 0.044, maxSize: 0.066, thickness: 0.075, heatStart: 0.02, heatEnd: 0.24, terraceSteps: 24 },
  { name: 'mid', count: 2850, kind: 0, minRadius: 0.94, maxRadius: 1.36, minSize: 0.060, maxSize: 0.090, thickness: 0.13, heatStart: 0.22, heatEnd: 0.56, terraceSteps: 28 },
  { name: 'outer', count: 2700, kind: 0, minRadius: 1.18, maxRadius: 1.80, minSize: 0.080, maxSize: 0.122, thickness: 0.21, heatStart: 0.52, heatEnd: 0.94, terraceSteps: 30 },
  { name: 'debris', count: 630, kind: 2, minRadius: 1.62, maxRadius: 2.12, minSize: 0.080, maxSize: 0.152, thickness: 0.36, heatStart: 0.70, heatEnd: 1.0, terraceSteps: 12 },
];

function hash(index, salt = 0) {
  const value = Math.sin(index * 91.731 + salt * 17.173) * 43758.5453123;
  return value - Math.floor(value);
}

function stepped(value, steps) {
  return Math.floor(value * steps) / Math.max(1, steps - 1);
}

export function createBlackHoleLayerData(spec) {
  if (!spec) throw new Error('Layer spec is required');

  const radius = new Float32Array(spec.count);
  const angle = new Float32Array(spec.count);
  const height = new Float32Array(spec.count);
  const seed = new Float32Array(spec.count);
  const heat = new Float32Array(spec.count);
  const size = new Float32Array(spec.count);
  const kind = new Float32Array(spec.count);

  for (let i = 0; i < spec.count; i += 1) {
    const progress = (i + 0.5) / spec.count;
    const r0 = hash(i, spec.kind + 1);
    const r1 = hash(i, spec.kind + 11);
    const r2 = hash(i, spec.kind + 23);
    const r3 = hash(i, spec.kind + 37);
    const terrace = stepped(progress, spec.terraceSteps);

    if (spec.kind === 2) {
      radius[i] = spec.minRadius + (spec.maxRadius - spec.minRadius) * terrace + (r0 - 0.5) * 0.14;
      angle[i] = i * GOLDEN_ANGLE + (r1 - 0.5) * 0.54;
      height[i] = (r2 - 0.5) * spec.thickness;
    } else {
      radius[i] = spec.minRadius + (spec.maxRadius - spec.minRadius) * terrace + (r0 - 0.5) * 0.024;
      angle[i] = i * GOLDEN_ANGLE + (r1 - 0.5) * 0.16;
      height[i] = (r2 - 0.5) * spec.thickness;
    }

    seed[i] = r3;
    heat[i] = spec.heatStart + (spec.heatEnd - spec.heatStart) * progress;

    const clump = 0.84 + 0.28 * Math.max(0, Math.sin(angle[i] * 5.0 + terrace * 9.0));
    size[i] = (spec.minSize + (spec.maxSize - spec.minSize) * (0.35 + 0.65 * r1)) * clump;
    kind[i] = spec.kind;
  }

  return { radius, angle, height, seed, heat, size, kind };
}

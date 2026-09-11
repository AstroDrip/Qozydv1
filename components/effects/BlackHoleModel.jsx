'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  BLACK_HOLE_LAYER_SPECS,
  createBlackHoleLayerData,
  sortLayerBySeed,
  visibleParticleCount,
} from './blackHoleGeometry.js';

const DISK_TILT = THREE.MathUtils.degToRad(33);

const vertexShader = `
  attribute float aRadius;
  attribute float aAngle;
  attribute float aHeight;
  attribute float aSeed;
  attribute float aHeat;
  attribute float aVoxelSize;
  attribute float aKind;

  uniform float uTime;
  uniform float uParticleSize;
  uniform float uParticleAmount;

  varying float vHeat;
  varying float vSeed;
  varying float vKind;
  varying float vSide;
  varying vec3 vNormal;

  vec3 tiltDisk(vec3 p) {
    float c = cos(${DISK_TILT.toFixed(8)});
    float s = sin(${DISK_TILT.toFixed(8)});
    return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
  }

  vec3 rotateAroundX(vec3 point, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return vec3(point.x, point.y * c - point.z * s, point.y * s + point.z * c);
  }

  vec3 rotateAroundY(vec3 point, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return vec3(point.x * c + point.z * s, point.y, -point.x * s + point.z * c);
  }

  vec3 rotateVoxel(vec3 point, float angle, float seed, float kind) {
    float yaw = angle * 0.62 + seed * 6.2831853;
    float pitch = (seed - 0.5) * 0.68 + kind * 0.08;
    vec3 rotated = rotateAroundY(point, yaw);
    rotated = rotateAroundX(rotated, pitch);
    return rotated;
  }

  void main() {
    vec3 orbit = vec3(0.0);
    float side = 0.0;
    float motionAngle = 0.0;

    if (aKind < 1.0) {
      // One physical accretion orbit. The near half is the tilted disk. The far
      // half is the same particles, gravitationally remapped above the horizon.
      float speed = mix(0.38, 0.14, aHeat);
      float angle = aAngle + uTime * speed;
      motionAngle = angle;

      float spatialWarp = 1.0
        + sin(angle * 3.0 + aSeed * 8.0) * 0.016
        + sin(angle * 7.0 - aSeed * 5.0) * 0.007;
      float radius = aRadius * spatialWarp;
      float breathing = sin(uTime * 0.10 + aSeed * 19.0) * 0.005;
      float sinAngle = sin(angle);
      float cosAngle = cos(angle);

      vec3 diskPoint = vec3(cosAngle * radius, aHeight + breathing, sinAngle * radius);
      vec3 frontOrbit = tiltDisk(diskPoint);

      float farSide = max(-sin(angle), 0.0);
      float lensBlend = smoothstep(0.10, 0.16, farSide);
      float topRise = pow(farSide, 1.85);
      float lensHeight = topRise * radius * 0.48;
      vec3 lensedOrbit = vec3(
        cosAngle * radius * 1.015,
        lensHeight + 0.06 + aHeight * 0.34,
        -0.34 - topRise * 0.045 + (aSeed - 0.5) * 0.022
      );

      orbit = mix(frontOrbit, lensedOrbit, lensBlend);
      side = sinAngle;
    } else {
      float angle = aAngle + uTime * (0.12 + (1.0 - aHeat) * 0.05);
      motionAngle = angle;
      float drift = sin(uTime * 0.10 + aSeed * 24.0) * 0.028;
      float radius = aRadius + drift;
      vec3 diskPoint = vec3(cos(angle) * radius, aHeight, sin(angle) * radius);
      orbit = tiltDisk(diskPoint);
      orbit.y += sin(aSeed * 31.0 + uTime * 0.06) * 0.02;
      side = sin(angle);
    }

    float size = aVoxelSize * uParticleSize;
    if (aKind > 1.0) size *= 1.06;

    vec3 rotatedLocal = rotateVoxel(position * size, motionAngle, aSeed, aKind);
    vec3 rotatedNormal = normalize(rotateVoxel(normal, motionAngle, aSeed, aKind));
    vec3 worldPosition = orbit + rotatedLocal;

    vHeat = aHeat;
    vSeed = aSeed;
    vKind = aKind;
    vSide = side;
    vNormal = normalize(mat3(modelViewMatrix) * rotatedNormal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPosition, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uParticleAmount;
  varying float vHeat;
  varying float vSeed;
  varying float vKind;
  varying float vSide;
  varying vec3 vNormal;

  void main() {
    float density = clamp(uParticleAmount / 1.5, 0.0, 1.0);
    if (vSeed > density) discard;

    vec3 cream = vec3(1.00, 0.97, 0.86);
    vec3 peach = vec3(1.00, 0.78, 0.50);
    vec3 coral = vec3(1.00, 0.38, 0.20);
    vec3 ember = vec3(1.00, 0.13, 0.16);
    vec3 crimson = vec3(0.88, 0.045, 0.18);
    vec3 wine = vec3(0.52, 0.012, 0.10);

    vec3 color = mix(cream, peach, smoothstep(0.04, 0.26, vHeat));
    color = mix(color, coral, smoothstep(0.22, 0.50, vHeat));
    color = mix(color, ember, smoothstep(0.46, 0.70, vHeat));
    color = mix(color, crimson, smoothstep(0.66, 0.86, vHeat));
    color = mix(color, wine, smoothstep(0.84, 1.0, vHeat));

    float hotCore = 1.0 - smoothstep(0.02, 0.22, vHeat);
    color += vec3(0.58, 0.34, 0.13) * hotCore;

    float blockVariation = 0.88 + fract(sin(vSeed * 95.13) * 43758.54) * 0.24;
    float faceLight = 0.80 + max(dot(normalize(vNormal), normalize(vec3(-0.30, 0.84, 0.48))), 0.0) * 0.50;
    float directional = 0.94 + max(-vSide, 0.0) * 0.08 - max(vSide, 0.0) * 0.03;

    if (vKind > 1.0) {
      color = mix(color, wine, 0.18);
      blockVariation *= 0.82 + fract(vSeed * 11.7) * 0.28;
    }

    color *= faceLight * directional * blockVariation;

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

function createVoxelGeometry(spec) {
  const data = sortLayerBySeed(createBlackHoleLayerData(spec));
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  geometry.setAttribute('aRadius', new THREE.InstancedBufferAttribute(data.radius, 1));
  geometry.setAttribute('aAngle', new THREE.InstancedBufferAttribute(data.angle, 1));
  geometry.setAttribute('aHeight', new THREE.InstancedBufferAttribute(data.height, 1));
  geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(data.seed, 1));
  geometry.setAttribute('aHeat', new THREE.InstancedBufferAttribute(data.heat, 1));
  geometry.setAttribute('aVoxelSize', new THREE.InstancedBufferAttribute(data.size, 1));
  geometry.setAttribute('aKind', new THREE.InstancedBufferAttribute(data.kind, 1));
  return geometry;
}

function VoxelLayer({ spec, particleSize, particleAmount }) {
  const material = useRef();
  const mesh = useRef();
  const geometry = useMemo(() => createVoxelGeometry(spec), [spec]);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uParticleSize: { value: 1 },
    uParticleAmount: { value: 1 },
  }), []);

  useFrame((_, delta) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value += Math.min(delta, 0.05);
    material.current.uniforms.uParticleSize.value = particleSize;
    material.current.uniforms.uParticleAmount.value = particleAmount;
    if (mesh.current) mesh.current.count = visibleParticleCount(geometry.attributes.aSeed.array, particleAmount);
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, undefined, spec.count]}
      frustumCulled={false}
      renderOrder={0}
    >
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function EventHorizon() {
  return (
    <group>
      <mesh renderOrder={2}>
        <sphereGeometry args={[0.70, 48, 32]} />
        <meshBasicMaterial color="#040102" />
      </mesh>
      <mesh scale={1.06} renderOrder={1}>
        <sphereGeometry args={[0.70, 36, 24]} />
        <meshBasicMaterial
          color="#ff6b3b"
          transparent
          opacity={0.045}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function BlackHoleModel({ particleSize = 1, particleAmount = 1 }) {
  return (
    <group rotation={[0, 0, -0.07]} scale={0.86}>
      {BLACK_HOLE_LAYER_SPECS.map((spec) => (
        <VoxelLayer
          key={spec.name}
          spec={spec}
          particleSize={particleSize}
          particleAmount={particleAmount}
        />
      ))}
      <EventHorizon />
    </group>
  );
}

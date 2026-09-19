'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { markBlackHoleReady } from '../../lib/loading-readiness';
import BlackHoleModel from './BlackHoleModel';

function ReadySignal() {
  const frames=useRef(0);
  useFrame(() => {
    frames.current+=1;
    // The previous frame has already drawn the model and compiled its shader.
    if (frames.current===2) markBlackHoleReady();
  });
  return null;
}

export default function BlackHoleScene({active = true}) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      // CSS scales the shared backdrop. Measure layout size, not its transformed
      // screen rectangle, and never resize the drawing surface after scrolling.
      resize={{scroll:false,offsetSize:true,debounce:0}}
      camera={{position:[0,0.04,7.25],fov:46}}
      dpr={1}
      gl={{alpha:true,antialias:false,powerPreference:'high-performance'}}
    >
      <BlackHoleModel/>
      <ReadySignal/>
    </Canvas>
  );
}

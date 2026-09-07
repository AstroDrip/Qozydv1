'use client';
// Adapted from React Bits Lanyard (DavidHDev): rope joints, drag projection,
// and a Catmull-Rom strap. The card is replaced by QOZYD's pixel moon pendant.
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { BallCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

const MOON_TEXTURE = '/art/blood-moon-256.png';

function Band() {
  const fixed=useRef(), j1=useRef(), j2=useRef(), j3=useRef(), moon=useRef(), band=useRef();
  const [dragged,setDragged]=useState(null);
  const source=useTexture(MOON_TEXTURE);
  const texture=useMemo(() => {
    const value=source.clone();
    value.colorSpace=THREE.SRGBColorSpace;
    value.magFilter=THREE.NearestFilter;
    value.minFilter=THREE.NearestFilter;
    value.generateMipmaps=false;
    value.needsUpdate=true;
    return value;
  },[source]);
  const [curve]=useState(() => new THREE.CatmullRomCurve3(Array.from({length:4},()=>new THREE.Vector3())));
  const vecRef=useRef(new THREE.Vector3());
  const dirRef=useRef(new THREE.Vector3());
  useRopeJoint(fixed,j1,[[0,0,0],[0,0,0],0.8]);
  useRopeJoint(j1,j2,[[0,0,0],[0,0,0],0.8]);
  useRopeJoint(j2,j3,[[0,0,0],[0,0,0],0.8]);
  useSphericalJoint(j3,moon,[[0,0,0],[0,1.12,0]]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  useEffect(()=>{
    const release=()=>setDragged(null);
    window.addEventListener('pointerup',release);
    window.addEventListener('pointercancel',release);
    window.addEventListener('blur',release);
    return ()=>{
      window.removeEventListener('pointerup',release);
      window.removeEventListener('pointercancel',release);
      window.removeEventListener('blur',release);
    };
  },[]);
  useFrame((state)=>{
    if(!moon.current||!j3.current||!band.current) return;
    if(dragged){
      const vec=vecRef.current;
      const dir=dirRef.current;
      vec.set(state.pointer.x,state.pointer.y,0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      const distance=-state.camera.position.z/dir.z;
      vec.copy(state.camera.position).addScaledVector(dir,distance).sub(dragged);
      vec.set(
        THREE.MathUtils.clamp(vec.x,-3.8,3.8),
        THREE.MathUtils.clamp(vec.y,-3.5,3.2),
        0
      );
      [moon,j1,j2,j3].forEach(ref=>ref.current?.wakeUp());
      moon.current.setNextKinematicTranslation(vec);
    }
    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(j2.current.translation());
    curve.points[2].copy(j1.current.translation());
    curve.points[3].copy(fixed.current.translation());
    band.current.geometry.setPoints(curve.getPoints(24));
  });
  const segment={colliders:false,linearDamping:4,angularDamping:5};
  const releasePointer=e=>{
    if(e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setDragged(null);
  };
  return <>
    <RigidBody ref={fixed} position={[0,3.7,0]} type="fixed" colliders={false}/>
    <RigidBody ref={j1} position={[0.3,2.9,0]} {...segment}><BallCollider args={[0.08]}/></RigidBody>
    <RigidBody ref={j2} position={[0.5,2.1,0]} {...segment}><BallCollider args={[0.08]}/></RigidBody>
    <RigidBody ref={j3} position={[0.6,1.3,0]} {...segment}><BallCollider args={[0.08]}/></RigidBody>
    <RigidBody ref={moon} position={[0.6,0.18,0]} {...segment} enabledRotations={[false,false,true]} type={dragged?'kinematicPosition':'dynamic'}>
      <BallCollider args={[1.02]} mass={1.5}/>
      <mesh position={[0,1.1,0]}><torusGeometry args={[0.1,0.035,8,16]}/><meshStandardMaterial color="#b87b82" metalness={0.85} roughness={0.25}/></mesh>
      <mesh
        position={[0,0,0.04]}
        onPointerDown={e=>{
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragged(new THREE.Vector3().copy(e.point).sub(moon.current.translation()));
        }}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        onLostPointerCapture={()=>setDragged(null)}
      >
        <planeGeometry args={[3.2,3.2]}/><meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide}/>
      </mesh>
      <mesh>
        <planeGeometry args={[2.2,2.2]}/><meshBasicMaterial map={texture} transparent alphaTest={0.4} side={THREE.DoubleSide} toneMapped={false}/>
      </mesh>
    </RigidBody>
    <mesh ref={band}><meshLineGeometry/><meshLineMaterial color="#b92642" lineWidth={0.095} resolution={[1000,1000]} depthTest={false}/></mesh>
  </>;
}
export default function MoonLanyard(){
  return <Canvas camera={{position:[0,0.6,10],fov:43}} dpr={[1,1.5]} gl={{alpha:true,antialias:true}} style={{touchAction:'pan-y'}}>
    <ambientLight intensity={2}/><pointLight position={[4,4,6]} intensity={20}/>
    <Suspense fallback={null}><Physics gravity={[0,-18,0]} timeStep={1/60}><Band/></Physics></Suspense>
  </Canvas>;
}

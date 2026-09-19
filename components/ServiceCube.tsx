'use client';
import { Children, useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionPreference } from './effects/Effects';

const faces = [
  {name:'Marketing',image:'/art/after-hours.webp'},
  {name:'Automation',image:'/art/glass-loop.webp'},
  {name:'Web experiences',image:'/art/project-journey.svg'},
  {name:'Trademarks',image:'/art/trademark-project-v2.webp'},
];

export default function ServiceCube({children}:{children:ReactNode}) {
  const rig = useRef<HTMLDivElement>(null);
  const cube = useRef<HTMLDivElement>(null);
  const faceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useMotionPreference();
  const [enhanced,setEnhanced] = useState(false);
  const [active,setActive] = useState(0);
  const activeRef = useRef(0);
  const fastScroll = useRef(false);
  const animated = enhanced && !reduced;
  useEffect(() => {
    if (reduced || !CSS.supports('transform-style','preserve-3d')) return;
    gsap.registerPlugin(ScrollTrigger);
    const panels=panelRefs.current;
    const context = gsap.context(() => {
      const progress = {value:0};
      gsap.to(progress, {
        value:1,ease:'none',scrollTrigger:{
          trigger:rig.current,start:'top top',end:'bottom bottom',scrub:0.2,
          onUpdate:self => { fastScroll.current=Math.abs(self.getVelocity())>1800; },
          onRefresh:() => setEnhanced(true),
        },
        onUpdate:() => {
          const value=progress.value;
          const cubeY=-270*value;
          if (cube.current) cube.current.style.transform=`rotateX(${Math.sin(value*Math.PI)*-8}deg) rotateY(${cubeY}deg)`;
          // Optical illusion: each face's blur/darken tracks how far it has
          // folded away from facing the viewer, not just which face is "active".
          faceRefs.current.forEach((face,index) => {
            if (!face) return;
            const total=((index*90+cubeY)%360+360)%360;
            const signed=total>180 ? total-360 : total; // -180..180, 0 = facing viewer
            const facing=Math.max(0,Math.cos(signed*Math.PI/180)); // 1 = facing viewer, 0 = edge-on or turned away
            const folded=1-facing;
            face.style.filter=`blur(${(folded*6).toFixed(2)}px) brightness(${(1-folded*0.65).toFixed(2)})`;
          });
          const next=Math.min(3,Math.round(value*3));
          panels.forEach((panel,index) => {
            if (!panel) return;
            const entry=index===0 ? 1 : Math.max(0,Math.min(1,(value*3-index+0.7)/0.4));
            const eased=entry*entry*(3-2*entry);
            const depth=Math.max(0,Math.min(3,value*3-index));
            panel.style.transform=`translateY(calc(${(1-eased)*110}% - ${depth*10}px)) scale(${1-depth*0.035})`;
            panel.style.opacity=String(entry===0 ? 0 : 1);
            panel.dataset.covered=String(index<3 && value*3>index+0.3);
          });
          if (activeRef.current!==next) {activeRef.current=next;setActive(next);}
        },
      });
    },rig);
    return () => {
      context.revert();
      panels.forEach(panel => {
        if (!panel) return;
        panel.style.removeProperty('transform');
        panel.style.removeProperty('opacity');
        delete panel.dataset.covered;
      });
    };
  },[reduced]);
  useEffect(() => {
    if (animated) ScrollTrigger.refresh();
  },[animated]);
  useEffect(() => {
    if (!animated) return;
    const panel=panelRefs.current[active];
    if (!panel) return;
    // On fast swipes leave the newly selected copy readable immediately.
    // The previous effect's cleanup restores any unfinished entrance first.
    if (fastScroll.current) return;
    const context=gsap.context(() => {
      const timeline=gsap.timeline();
      timeline.fromTo(panel.querySelectorAll('.reveal-line > span'),
        {yPercent:105,rotation:3},
        {yPercent:0,rotation:0,duration:0.65,stagger:0.08,ease:'power3.out'});
      timeline.fromTo(panel.querySelectorAll('.service-word'),
        {opacity:0.2,y:8},
        {opacity:1,y:0,duration:0.4,stagger:0.012,ease:'power2.out'},0.12);
    },rig);
    return () => context.revert();
  },[active,animated]);
  return <div ref={rig} className="service-cube-rig" data-animated={animated}>
    <div className="service-cube-stage">
      <div className="service-cube-scene" aria-hidden="true">
        <div className="service-cube-object" ref={cube}>
          {faces.map((face,index) => <div className={`service-cube-face cube-face-${index}`} key={face.name} ref={el => {faceRefs.current[index]=el;}} style={index===0 ? undefined : {filter:'blur(6px) brightness(0.35)'}}>
            <Image src={face.image} alt="" fill sizes="(max-width:700px) 72vw, 40vw"/>
            <span className="cube-face-name">{face.name}</span>
          </div>)}
          <div className="service-cube-cap cube-cap-top"/><div className="service-cube-cap cube-cap-bottom"/>
        </div>
      </div>
      <div className="service-cube-details">
        <div className="service-text-stack">
          {Children.toArray(children).map((child,index) => <div className="service-text-panel" key={index} ref={el => {panelRefs.current[index]=el;}} aria-hidden={animated && index!==active ? true : undefined} inert={animated && index!==active} style={animated ? {zIndex:index+1} : undefined}>{child}</div>)}
        </div>
      </div>
    </div>
  </div>;
}

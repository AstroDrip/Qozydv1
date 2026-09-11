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
  const reduced = useMotionPreference();
  const [enhanced,setEnhanced] = useState(false);
  const [active,setActive] = useState(0);
  const activeRef = useRef(0);
  const fastScroll = useRef(false);
  const animated = enhanced && !reduced;
  useEffect(() => {
    if (reduced || !CSS.supports('transform-style','preserve-3d')) return;
    gsap.registerPlugin(ScrollTrigger);
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
          if (cube.current) cube.current.style.transform=`rotateX(${Math.sin(value*Math.PI)*-8}deg) rotateY(${-270*value}deg)`;
          const next=Math.min(3,Math.round(value*3));
          if (activeRef.current!==next) {activeRef.current=next;setActive(next);}
        },
      });
    },rig);
    return () => context.revert();
  },[reduced]);
  useEffect(() => {
    if (animated) ScrollTrigger.refresh();
  },[animated]);
  useEffect(() => {
    if (!animated) return;
    const panel=rig.current?.querySelector('.service-cube-details > div:not([hidden])');
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
      timeline.fromTo(panel.querySelectorAll('.tags li'),
        {opacity:0,y:8},
        {opacity:1,y:0,duration:0.35,stagger:0.05,ease:'power2.out'},0.28);
    },rig);
    return () => context.revert();
  },[active,animated]);
  const select = (index:number) => {
    if (!rig.current) return;
    const top=rig.current.getBoundingClientRect().top+window.scrollY;
    const distance=rig.current.offsetHeight-window.innerHeight;
    window.scrollTo({top:top+distance*index/3,behavior:'smooth'});
  };
  return <div ref={rig} className="service-cube-rig" data-animated={animated}>
    <div className="service-cube-stage">
      <div className="service-cube-scene" aria-hidden="true">
        <div className="service-cube-object" ref={cube}>
          {faces.map((face,index) => <div className={`service-cube-face cube-face-${index}`} key={face.name}>
            <Image src={face.image} alt="" fill sizes="(max-width:700px) 72vw, 40vw"/>
            <span className="cube-face-number">0{index+1}</span><span className="cube-face-name">{face.name}</span>
          </div>)}
          <div className="service-cube-cap cube-cap-top"/><div className="service-cube-cap cube-cap-bottom"/>
        </div>
      </div>
      <div className="service-cube-details">
        {Children.toArray(children).map((child,index) => <div key={index} hidden={animated && index!==active}>{child}</div>)}
        {animated && <nav className="service-cube-navigation" aria-label="Select service">
          {faces.map((face,index)=><button key={face.name} onClick={()=>select(index)} aria-label={face.name} aria-current={index===active ? 'true' : undefined}>0{index+1}</button>)}
        </nav>}
      </div>
    </div>
  </div>;
}

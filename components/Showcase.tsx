'use client';
import { useState } from 'react';
import AccordionGallery, { type AccordionGalleryItem } from './effects/AccordionGallery';

const projects = [
  { image:'/art/project-semis-kitchen.svg',label:"SEMI'S KITCHEN",alt:"Semi's Kitchen project preview",link:'https://semiskitchen.in/',type:'E-COMMERCE',description:'A simple, mobile-first way to order Malabar favourites.' },
  { image:'/art/project-qleaves.svg',label:'QLEAVES',alt:'QLeaves project preview',link:'https://q-leaftrial-api.vercel.app/',type:'E-COMMERCE',description:'A considered storefront for discovering indoor plants.' },
  { image:'/art/project-journey.svg',label:'START THE JOURNEY',alt:'QOZYD cinematic scrollytelling project preview',link:'https://scrollytellingtest.vercel.app/',type:'INTERACTIVE EXPERIENCE',description:'A brand story brought to life through scroll and motion.' },
] satisfies Array<AccordionGalleryItem & { type: string; description: string }>;
export default function Showcase(){
  const [active,setActive]=useState(0);
  return <div className="showcase">
    <AccordionGallery items={projects} defaultIndex={0} height={500} gap={16} radius={6} expandRatio={0.65} accentColor="#ef233c" overlayColor="#17090f" grayscale={false} tilt={0} onActiveChange={setActive}/>
    <div className="project-description" aria-live="polite"><div><span className="eyebrow">{projects[active].type}</span><h3>{projects[active].label} <span>↗</span></h3></div><p>{projects[active].description}</p></div>
  </div>;
}

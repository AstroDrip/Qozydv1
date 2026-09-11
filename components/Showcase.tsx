'use client';
import { useState } from 'react';
import AccordionGallery, { type AccordionGalleryItem } from './effects/AccordionGallery';

const projects = [
  { image:'/art/project-semis-kitchen.svg',label:"SEMI'S KITCHEN",alt:"Semi's Kitchen project preview",link:'https://semiskitchen.in/',type:'E-COMMERCE / SEMI’S KITCHEN',description:'A warm, mobile-first food ordering experience for Malabar snacks, biriyanis, and curries — built to make browsing and ordering feel effortless.' },
  { image:'/art/project-qleaves.svg',label:'QLEAVES',alt:'QLeaves project preview',link:'https://q-leaftrial-api.vercel.app/',type:'E-COMMERCE / QLEAVES',description:'A considered indoor-plant storefront for QLeaves, bringing product discovery, brand storytelling, and a calm shopping flow into one experience.' },
  { image:'/art/project-journey.svg',label:'START THE JOURNEY',alt:'QOZYD cinematic scrollytelling project preview',link:'https://scrollytellingtest.vercel.app/',type:'INTERACTIVE EXPERIENCE / QOZYD',description:'A cinematic scroll-driven experience that turns a brand reveal into a journey — moving from moonlight to a full visual identity.' },
] satisfies Array<AccordionGalleryItem & { type: string; description: string }>;
export default function Showcase(){
  const [active,setActive]=useState(0);
  return <div className="showcase">
    <AccordionGallery items={projects} defaultIndex={0} height={500} gap={16} radius={6} expandRatio={0.65} accentColor="#ef233c" overlayColor="#17090f" grayscale={false} tilt={0} onActiveChange={setActive}/>
    <div className="project-description" aria-live="polite"><div><span className="eyebrow">{projects[active].type}</span><h3>{projects[active].label} <span>↗</span></h3></div><p>{projects[active].description}</p></div>
    <div className="gallery-note"><span>Selected work by QOZYD.</span></div>
  </div>;
}

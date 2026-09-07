'use client';
import { useState } from 'react';
import AccordionGallery, { type AccordionGalleryItem } from './effects/AccordionGallery';

const concepts = [
  { image:'/art/after-hours.png',label:'AFTER HOURS',alt:'Original concept campaign: red After Hours can under dramatic studio lighting',type:'BRAND CAMPAIGN / CONCEPT 01',description:'A bold visual world for a fictional energy brand. Built around one unmistakable color, a sharp identity, and a campaign made to stop the scroll.' },
  { image:'/art/glass-loop.png',label:'IN THE LOOP',alt:'Original automation campaign concept: sculptural red glass infinity loop',type:'AUTOMATION IDENTITY / CONCEPT 02',description:'Making invisible systems feel tangible. An original visual exploration of connected workflows, continuous movement, and a business that works as one.' },
] satisfies Array<AccordionGalleryItem & { type: string; description: string }>;
export default function Showcase(){
  const [active,setActive]=useState(0);
  return <div className="showcase">
    <AccordionGallery items={concepts} defaultIndex={0} height={500} gap={16} radius={6} expandRatio={0.65} accentColor="#ef233c" overlayColor="#17090f" grayscale={false} tilt={0} onActiveChange={setActive}/>
    <div className="project-description" aria-live="polite"><div><span className="eyebrow">{concepts[active].type}</span><h3>{concepts[active].label} <span>↗</span></h3></div><p>{concepts[active].description}</p></div>
    <div className="gallery-note"><span>Original studio explorations. Concept work, not client commissions.</span><span>HOVER / TAP TO EXPLORE ↔</span></div>
  </div>;
}

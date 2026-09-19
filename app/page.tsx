import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { getSiteConfig } from '@/lib/site-config';
import PixelMoon from '@/components/effects/PixelMoon';
import { Pendant } from '@/components/effects/Effects';
import BlackHoleBackdrop from '@/components/effects/BlackHoleBackdrop';
import Motion from '@/components/effects/Motion';
import Showcase from '@/components/Showcase';
import ServiceCube from '@/components/ServiceCube';

export const metadata: Metadata = { alternates: { canonical: '/' }, openGraph: { url: '/' } };

const services = [
  { number:'01',name:'Marketing',title:['MAKE SOME','NOISE.'],description:'The right message. In the right places. We help your brand earn attention and turn it into meaningful action.',tags:['Brand strategy','Social & content','Performance campaigns'],className:'marketing' },
  { number:'02',name:'Automation',title:['LESS BUSY.','MORE BUSINESS.'],description:'Connect your tools, simplify your workflows, and give your team the time to do what only they can do.',tags:['Workflow design','CRM & integrations','AI-powered systems'],className:'automation' },
  { number:'03',name:'Web experiences',title:['BUILT TO','BE FELT.'],description:'Your website should work as hard as you do. We build fast, expressive digital experiences that make your next customer lean in.',tags:['React development','E-commerce','UI / UX design'],className:'web' },
  { number:'04',name:'Trademarks',title:['MAKE IT','YOURS.'],description:'Build a brand with a stronger foundation. From initial trademark searches to application support, we help you navigate the next steps.',tags:['Trademark search','Application support','Brand protection'],className:'trademarks' },
];

function Roll({children}:{children:string}){return <span className="roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>;}

export default function Home() {
  const site = getSiteConfig();
  const business = { '@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: site.url, description: site.description, ...(site.instagram ? { sameAs: [site.instagram] } : {}) };
  return <main id="top">
    {site.indexable && <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(business).replace(/</g, '\\u003c')}}/>}
    <Motion/>
    <header className="site-header"><a className="wordmark" href="#top" aria-label="QOZYD home">QOZYD<span>™</span></a><nav aria-label="Main navigation"><a href="#services"><Roll>Our universe</Roll><ArrowUpRight size={16} aria-hidden="true"/></a><a href="#work"><Roll>Selected visions</Roll><ArrowUpRight size={16} aria-hidden="true"/></a><a href="#about"><Roll>The collective</Roll><ArrowUpRight size={16} aria-hidden="true"/></a></nav></header>
    <div className="universe-journey">
      <BlackHoleBackdrop/>
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-top"><span className="eyebrow"><i /> FOR THE ONES BUILDING WHAT’S NEXT</span></div>
      <h1 id="hero-title"><span className="headline-mask"><span className="headline-line">GOOD IS</span></span><span className="headline-mask"><span className="headline-line">NOT <em>ENOUGH.</em></span></span></h1>
      <div className="hero-bottom"><p>We turn ambitious businesses into<br/>brands you can’t scroll past.</p><a className="round-link" href="#services"><span>Enter our universe</span><b><ArrowDown size={20}/></b></a><span className="coordinate">YOUR NEXT PHASE<br/>STARTS HERE ↙</span></div>
    </section>
    <div className="discipline-strip" aria-hidden="true"><div>{Array.from({length:3},(_,i)=><span key={i}>THINK BIG <b>✳</b> BUILD BOLD <b>✳</b> MOVE DIFFERENT <b>✳</b></span>)}</div></div>
    <section className="intro" id="services"><span className="eyebrow">01 / SERVICES</span><h2 data-reveal>One studio.<br/><em>Every next move.</em></h2><p data-reveal>Strategy, systems, sites, and protection for businesses building what’s next.</p><ArrowUpRight className="intro-arrow" /></section>
    <section className="services cube-services" aria-label="QOZYD services">
      <ServiceCube>{services.map((service,index)=><article id={`service-${service.className}`} className={`service-card ${service.className}`} key={service.number} style={{'--card-index':index} as CSSProperties}>
        <div className="service-card-top"><span className="eyebrow">{service.number} / {service.name.toUpperCase()}</span><span className="service-star" aria-hidden="true">✳</span></div>
        <div className="service-copy"><h3>{service.title.map(line=><span className="reveal-line" key={line}><span>{line}</span></span>)}</h3><p>{service.description.split(' ').map((word,index)=><span key={index}><span className="service-word">{word}</span>{' '}</span>)}</p><ul className="tags">{service.tags.map(tag=><li key={tag}>{tag}</li>)}</ul></div>
        <div className="service-art" aria-hidden="true">
          {index===0&&<><Image src="/art/after-hours.webp" alt="" width={1254} height={1254} sizes="(max-width: 700px) 100vw, 50vw" loading="lazy"/><span className="art-caption">ATTENTION IS EARNED.</span></>}
          {index===1&&<><Image src="/art/glass-loop.webp" alt="" width={1254} height={1254} sizes="(max-width: 700px) 100vw, 50vw" loading="lazy"/><span className="system-label"><i/> SYSTEMS IN SYNC</span></>}
          {index===2&&<div className="browser-art"><div className="browser-bar"><span>● ● ●</span><span>YOUR NEXT CHAPTER <ArrowUpRight size={13} aria-hidden="true"/></span></div><div className="browser-content"><span>YOUR BRAND. YOUR WORLD.</span><strong>THE NEXT<br/><em>BIG THING.</em></strong><div className="browser-moon"><PixelMoon/></div><span className="browser-bottom">A DIGITAL EXPERIENCE THAT’S ENTIRELY YOU. <ArrowUpRight size={13} aria-hidden="true"/></span></div></div>}
          {index===3&&<div className="trademark-art"><div className="trademark-halo" aria-hidden="true"/><Image src="/art/trademark-project-v2.webp" alt="QOZYD trademark project artwork" width={1536} height={1024} sizes="(max-width: 700px) 72vw, 36vw" loading="lazy"/><span>OWN YOUR NAME.<br/>BUILD YOUR LEGACY.</span></div>}
        </div>
      </article>)}</ServiceCube>
    </section>
    </div>
    <section id="work" className="work-section paper-edge"><div className="section-heading"><div><span className="eyebrow">02 / SELECTED VISIONS</span><h2 data-reveal>Built to<br/><em>be remembered.</em></h2></div></div><Showcase/></section>
    <section className="moon-section" id="about"><div className="moon-copy"><span className="eyebrow">03 / THE QOZYD GRAVITY</span><h2 data-reveal>A different<br/>kind of <em>pull.</em></h2><p className="moon-body" data-reveal>We’re here for restless founders, ambitious business owners, and people building something of their own. We bring different disciplines into the same orbit — yours.</p></div><Pendant/></section>
    <section className="process-section paper-edge"><div className="process-intro"><span className="eyebrow">04 / THE METHOD</span><h2 data-reveal>Big moves.<br/><em>Clear steps.</em></h2></div><div className="process-list">{[
      ['01','Find the signal.','We get to know your business, your audience, and what’s standing between you and your next chapter.'],
      ['02','Connect the dots.','Strategy, design, and technology come together in a focused plan built around what you actually need.'],
      ['03','Make the move.','We build, refine, and launch. Then we help you understand what’s working and where to go next.'],
    ].map(([number,title,description])=><article key={number} data-reveal><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><ArrowUpRight aria-hidden="true"/></article>)}</div></section>
    <footer className="site-footer"><div className="footer-top"><a href="#top"><Roll>Back to the top</Roll><ArrowUpRight size={18}/></a></div><a href="#top" className="footer-wordmark" aria-label="QOZYD, back to top">QOZYD<ArrowUpRight className="footer-arrow" aria-hidden="true"/></a><div className="footer-bottom"><span>© {new Date().getFullYear()} QOZYD</span><span>{site.contactEmail}</span>{site.instagram && <a className="instagram-link" href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Visit QOZYD on Instagram (opens in a new tab)"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a>}<a href="#services">Explore our universe <ArrowUpRight size={14} aria-hidden="true"/></a></div></footer>
  </main>;
}

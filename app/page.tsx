import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import PixelMoon from '@/components/effects/PixelMoon';
import { Pendant, ThreadField } from '@/components/effects/Effects';
import Motion from '@/components/effects/Motion';
import Showcase from '@/components/Showcase';

const services = [
  { number:'01',name:'Marketing',title:['MAKE SOME','NOISE.'],description:'The right message. In the right places. We help your brand earn attention and turn it into meaningful action.',tags:['Brand strategy','Social & content','Performance campaigns'],className:'marketing' },
  { number:'02',name:'Automation',title:['LESS BUSY.','MORE BUSINESS.'],description:'Connect your tools, simplify your workflows, and give your team the time to do what only they can do.',tags:['Workflow design','CRM & integrations','AI-powered systems'],className:'automation' },
  { number:'03',name:'Web experiences',title:['BUILT TO','BE FELT.'],description:'Your website should work as hard as you do. We build fast, expressive digital experiences that make your next customer lean in.',tags:['React development','E-commerce','UI / UX design'],className:'web' },
  { number:'04',name:'Trademarks',title:['MAKE IT','YOURS.'],description:'Build a brand with a stronger foundation. From initial trademark searches to application support, we help you navigate the next steps.',tags:['Trademark search','Application support','Brand protection'],className:'trademarks' },
];

function Roll({children}:{children:string}){return <span className="roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>;}

export default function Home() {
  return <main id="top">
    <Motion/>
    <header className="site-header"><a className="wordmark" href="#top" aria-label="QOZYD home">QOZYD<span>™</span></a><nav aria-label="Main navigation"><a href="#services"><Roll>Our universe</Roll><span>↗</span></a><a href="#work"><Roll>Selected visions</Roll><span>↗</span></a><a href="#about"><Roll>The collective</Roll><span>↗</span></a></nav><span className="header-note"><i /> Independent by nature.</span></header>
    <section className="hero" aria-labelledby="hero-title">
      <ThreadField className="hero-threads"/>
      <div className="hero-top"><span className="eyebrow"><i /> FOR THE ONES BUILDING WHAT’S NEXT</span><span className="edition">STRATEGY × CREATIVITY × TECHNOLOGY<br/>INDEPENDENT STUDIO / QOZYD</span></div>
      <div className="hero-moon" aria-hidden="true"><div className="moon-orbit"/><PixelMoon/><span>FIG. 01 — A DIFFERENT PULL</span></div>
      <h1 id="hero-title"><span className="headline-mask"><span className="headline-line">GOOD IS</span></span><span className="headline-mask"><span className="headline-line">NOT <em>ENOUGH.</em></span></span></h1>
      <div className="hero-bottom"><p>We turn ambitious businesses into<br/>brands you can’t scroll past.</p><a className="round-link" href="#services"><span>Enter our universe</span><b><ArrowDown size={20}/></b></a><span className="coordinate">YOUR NEXT PHASE<br/>STARTS HERE ↙</span></div>
      <div className="hero-footer"><span>MARKETING · AUTOMATION · WEB · TRADEMARKS</span><span>SCROLL TO DISCOVER <ArrowDown size={13}/></span></div>
    </section>
    <div className="discipline-strip" aria-hidden="true"><div>{Array.from({length:3},(_,i)=><span key={i}>THINK BIG <b>✳</b> BUILD BOLD <b>✳</b> MOVE DIFFERENT <b>✳</b></span>)}</div></div>
    <section className="intro" id="services"><span className="eyebrow">01 / OUR UNIVERSE</span><h2 data-reveal>Different disciplines.<br/><em>One unfair advantage.</em></h2><p data-reveal>From your first idea to your next big move. We connect the creative, the technical, and the practical to help your business move forward.</p><ArrowUpRight className="intro-arrow" /></section>
    <section className="services" aria-label="QOZYD services">
      <div className="service-thread-viewport" aria-hidden="true"><ThreadField className="service-threads"/></div>
      {services.map((service,index)=><article id={`service-${service.className}`} className={`service-card ${service.className}`} key={service.number} style={{'--card-index':index} as CSSProperties}>
        <div className="service-card-top"><span className="eyebrow">{service.number} / {service.name.toUpperCase()}</span><span className="service-star" aria-hidden="true">✳</span></div>
        <div className="service-copy"><h3>{service.title.map(line=><span className="reveal-line" key={line}><span>{line}</span></span>)}</h3><p>{service.description}</p><ul className="tags">{service.tags.map(tag=><li key={tag}>{tag}</li>)}</ul></div>
        <div className="service-art" aria-hidden="true">
          {index===0&&<><Image src="/art/after-hours.png" alt="" width={1254} height={1254} sizes="(max-width: 700px) 100vw, 50vw" loading="lazy"/><span className="art-caption">ATTENTION IS EARNED.</span></>}
          {index===1&&<><Image src="/art/glass-loop.png" alt="" width={1254} height={1254} sizes="(max-width: 700px) 100vw, 50vw" loading="lazy"/><span className="system-label"><i/> SYSTEMS IN SYNC</span></>}
          {index===2&&<div className="browser-art"><div className="browser-bar"><span>● ● ●</span><span>YOUR NEXT CHAPTER ↗</span></div><div className="browser-content"><span>YOUR BRAND. YOUR WORLD.</span><strong>THE NEXT<br/><em>BIG THING.</em></strong><div className="browser-moon"><PixelMoon/></div><span className="browser-bottom">A DIGITAL EXPERIENCE THAT’S ENTIRELY YOU. ↗</span></div></div>}
          {index===3&&<div className="trademark-art"><span className="trademark-circle">™</span><span>OWN YOUR NAME.<br/>BUILD YOUR LEGACY.</span></div>}
        </div>
        <span className="service-bottom-label">QOZYD / CONNECTED BY DESIGN</span>
      </article>)}
    </section>
    <section id="work" className="work-section"><div className="section-heading"><div><span className="eyebrow">02 / SELECTED VISIONS</span><h2 data-reveal>Ideas with<br/><em>an afterlife.</em></h2></div><p data-reveal>A glimpse of the worlds we can build.<br/>Independent ideas. Unmistakable presence.</p></div><Showcase/></section>
    <section className="moon-section" id="about"><div className="moon-copy"><span className="eyebrow">03 / THE QOZYD GRAVITY</span><h2 data-reveal>A different<br/>kind of <em>pull.</em></h2><p data-reveal>Some brands blend in.<br/>Others change the atmosphere.</p><p className="moon-body" data-reveal>We’re here for the restless founders, the ambitious business owners, and the people building something of their own. We bring different disciplines into the same orbit — yours.</p><div className="moon-spec"><span>INDEPENDENT MINDSET</span><span>CONNECTED THINKING</span><span>SHARED AMBITION</span></div></div><Pendant/></section>
    <section className="process-section"><div className="process-intro"><span className="eyebrow">04 / FROM WHAT IF TO WHAT’S NEXT</span><h2 data-reveal>Big moves.<br/><em>Clear steps.</em></h2></div><div className="process-list">{[
      ['01','Find the signal.','We get to know your business, your audience, and what’s standing between you and your next chapter.'],
      ['02','Connect the dots.','Strategy, design, and technology come together in a focused plan built around what you actually need.'],
      ['03','Make the move.','We build, refine, and launch. Then we help you understand what’s working and where to go next.'],
    ].map(([number,title,description])=><article key={number} data-reveal><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><ArrowUpRight aria-hidden="true"/></article>)}</div></section>
    <footer className="site-footer"><div className="footer-top"><span className="eyebrow"><i/> YOUR NEXT PHASE STARTS HERE.</span><a href="#top"><Roll>Back to the top</Roll><ArrowUpRight size={18}/></a></div><a href="#top" className="footer-wordmark" aria-label="QOZYD, back to top">QOZYD<span>↗</span></a><div className="footer-bottom"><span>© {new Date().getFullYear()} QOZYD</span><span>STRATEGY. CREATIVE. TECHNOLOGY. TOGETHER.</span><a href="#services">Explore our universe ↗</a></div></footer>
  </main>;
}

'use client';
import Script from 'next/script';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

type Turnstile = { render:(container:HTMLElement, options:Record<string,unknown>)=>string; reset:(id:string)=>void; remove:(id:string)=>void };
declare global { interface Window { turnstile?:Turnstile } }

export default function ContactForm({siteKey,email}:{siteKey:string;email:string}) {
  const widget=useRef<HTMLDivElement>(null), widgetId=useRef<string|null>(null);
  const [token,setToken]=useState('');
  const [pending,setPending]=useState(false);
  const [error,setError]=useState('');
  const [sent,setSent]=useState(false);
  useEffect(()=>()=>{if(widgetId.current!==null){window.turnstile?.remove(widgetId.current);widgetId.current=null;}},[]);
  function renderWidget(){
    if(widget.current && window.turnstile && widgetId.current===null){
      widgetId.current=window.turnstile.render(widget.current,{sitekey:siteKey,theme:'dark',action:'contact',callback:(value:string)=>setToken(value),'expired-callback':()=>setToken(''),'error-callback':()=>{setToken('');setError('Verification could not load. Please retry or email us directly.');}});
    }
  }
  const submit = async (event:{preventDefault:()=>void;currentTarget:HTMLFormElement}) => {
    event.preventDefault();if(pending)return;
    if(!token){setError('Please complete the verification before sending.');return;}
    const form=event.currentTarget, data=new FormData(form);
    setPending(true);setError('');setSent(false);
    try {
      const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.get('name'),email:data.get('email'),service:data.get('service'),message:data.get('message'),website:data.get('website'),consent:data.get('consent')==='on',token}),signal:AbortSignal.timeout(25000)});
      const result=await response.json() as {ok?:boolean;error?:string};
      if(!response.ok||!result.ok) throw new Error(result.error||'Your message could not be sent. Please try again.');
      setSent(true);form.reset();
    }catch(cause){setError(cause instanceof Error ? cause.message : 'Your message could not be sent. Please email us directly.');}
    finally{setPending(false);setToken('');if(widgetId.current!==null)window.turnstile?.reset(widgetId.current);}
  };
  return <form className="contact-form" onSubmit={submit}>
    <div className="contact-fields"><label>Your name<input name="name" autoComplete="name" minLength={2} maxLength={100} required disabled={pending}/></label><label>Email address<input name="email" type="email" autoComplete="email" maxLength={254} required disabled={pending}/></label></div>
    <label>What can we help with?<select name="service" required defaultValue="" disabled={pending}><option value="" disabled>Select a service</option>{['Marketing','Automation','Website development','Trademark support','Something else'].map(service=><option key={service}>{service}</option>)}</select></label>
    <label>Tell us about your project<textarea name="message" rows={5} minLength={20} maxLength={5000} required disabled={pending}/></label>
    <div className="contact-honeypot" aria-hidden="true"><label>Website<input name="website" autoComplete="off" tabIndex={-1}/></label></div>
    <label className="contact-consent"><input name="consent" type="checkbox" required disabled={pending}/><span>I have read the <Link href="/privacy">privacy notice</Link> and understand my details will be used to respond to this enquiry.</span></label>
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={renderWidget} onError={()=>setError('Verification could not load. Please email us directly.')}/>
    <div ref={widget}/>
    <output aria-live="polite">{sent && !error && <p className="contact-success">Your enquiry has been sent. We’ll reply by email.</p>}{error && <p className="contact-error">{error} <a href={`mailto:${email}`}>Email QOZYD</a></p>}</output>
    <button className="contact-submit" type="submit" disabled={pending||!token}>{pending?'Sending…':'Send your enquiry'}<ArrowUpRight size={20} aria-hidden="true"/></button>
  </form>;
}

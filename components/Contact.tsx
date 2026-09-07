import { contactConfigured } from '@/lib/contact';
import { contactEmail, getContactConfig } from '@/lib/contact-config';
import ContactForm from './ContactForm';

export default function Contact(){
  const siteKey=process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const available=Boolean(siteKey)&&contactConfigured(getContactConfig());
  return <section id="contact" className="contact-section"><div className="contact-intro"><span className="eyebrow">05 / LET’S MAKE YOUR NEXT MOVE</span><h2>Start something<br/><em>worth noticing.</em></h2><p>Tell us what you’re building and where you want to take it.</p><a className="contact-email" href={`mailto:${contactEmail}`}>{contactEmail} ↗</a><p className="contact-small">Please don’t include passwords, payment details, or sensitive documents in your enquiry.</p></div>{available && siteKey ? <ContactForm siteKey={siteKey} email={contactEmail}/> : <div className="contact-direct"><span className="eyebrow">LET’S START A CONVERSATION</span><h3>Your next chapter<br/>starts with a hello.</h3><p>Email us about your project, the services you’re interested in, and what you’d like to achieve.</p><a className="contact-submit" href={`mailto:${contactEmail}`}>Email QOZYD ↗</a></div>}</section>;
}

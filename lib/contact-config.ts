import { getSiteConfig } from './site-config';
import type { ContactConfig } from './contact';

export const contactEmail = 'qozyd.in@gmail.com';
export function getContactConfig(): ContactConfig {
  const origins=[getSiteConfig().url];
  if(process.env.VERCEL_URL) origins.push(`https://${process.env.VERCEL_URL}`);
  return {origins,recipient:contactEmail,apiKey:process.env.RESEND_API_KEY,sender:process.env.CONTACT_FROM_EMAIL,turnstileSecret:process.env.TURNSTILE_SECRET_KEY};
}

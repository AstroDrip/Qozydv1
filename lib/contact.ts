import { createHash } from 'node:crypto';

export const contactServices = ['Marketing', 'Automation', 'Website development', 'Trademark support', 'Something else'] as const;
export type ContactConfig = { origins:string[]; apiKey?:string; sender?:string; recipient?:string; turnstileSecret?:string };
const emailPattern = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const maxBody = 16_000;
const reply = (status:number, error?:string) => Response.json(error ? {error} : {ok:true}, {status,headers:{'Cache-Control':'no-store'}});

export function contactConfigured(config: ContactConfig) {
  const sender = config.sender?.match(/<([^<>]+)>$/)?.[1] || config.sender;
  return Boolean(config.apiKey && config.turnstileSecret && config.recipient && emailPattern.test(config.recipient) && sender && emailPattern.test(sender) && !/[\r\n]/.test(config.sender || ''));
}

export async function handleContact(request:Request, config:ContactConfig, transport:typeof fetch = fetch) {
  const origin=request.headers.get('origin');
  if(!origin || !config.origins.includes(origin)) return reply(403,'Please submit the form from the QOZYD website.');
  if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply(415,'Unsupported form format.');
  if(!contactConfigured(config)) return reply(503,'The form is temporarily unavailable. Please email us directly.');
  if(Number(request.headers.get('content-length'))>maxBody) return reply(413,'Your message is too long.');
  let input:Record<string,unknown>;
  try {
    const reader=request.body?.getReader();
    if(!reader) return reply(400,'Please complete the form.');
    const chunks:Uint8Array[]=[];let size=0;
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBody){await reader.cancel();return reply(413,'Your message is too long.');}chunks.push(value);}
    const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
    const parsed:unknown=JSON.parse(new TextDecoder().decode(bytes));
    if(!parsed || typeof parsed!=='object' || Array.isArray(parsed)) return reply(400,'Please complete the form.');
    input=parsed as Record<string,unknown>;
  } catch { return reply(400,'The form could not be read. Please try again.'); }
  const field=(key:string)=>typeof input[key]==='string' ? (input[key] as string).trim() : '';
  const name=field('name'), email=field('email'), service=field('service'), message=field('message'), token=field('token');
  const hasControlCharacter = Array.from(name).some(value => value.charCodeAt(0) <= 0x1f);
  if(field('website') || name.length<2 || name.length>100 || hasControlCharacter || email.length>254 || !emailPattern.test(email) || !contactServices.some(value=>value===service) || message.length<20 || message.length>5000 || token.length<1 || token.length>2048 || input.consent!==true) return reply(400,'Check your name, email, service, message, and privacy acknowledgement, then try again.');
  try {
    const verification=await transport('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:config.turnstileSecret,response:token}),signal:AbortSignal.timeout(8000)});
    if(!verification.ok) return reply(502,'Verification is unavailable. Please try again or email us.');
    const challenge=await verification.json() as {success?:boolean;hostname?:string;action?:string};
    if(!challenge.success || challenge.hostname!==new URL(origin).hostname || challenge.action!=='contact') return reply(400,'Please complete the verification again.');
    const delivery=await transport('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${config.apiKey}`,'Content-Type':'application/json','Idempotency-Key':`contact-${createHash('sha256').update(token).digest('hex')}`},body:JSON.stringify({from:config.sender,to:[config.recipient],reply_to:email,subject:`QOZYD enquiry: ${service}`,text:`Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}\n\nSubmitted through the QOZYD contact form. Privacy acknowledgement received.`}),signal:AbortSignal.timeout(10000)});
    if(!delivery.ok) return reply(502,'Your message could not be sent. Please try again or email us directly.');
    const result=await delivery.json() as {id?:string};
    if(!result.id) return reply(502,'Delivery could not be confirmed. Please email us directly.');
    return reply(200);
  } catch { return reply(502,'The connection timed out. Please try again or email us directly.'); }
}

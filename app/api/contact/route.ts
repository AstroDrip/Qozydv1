import { handleContact } from '@/lib/contact';
import { getContactConfig } from '@/lib/contact-config';
export const runtime = 'nodejs';
export const maxDuration = 30;
export async function POST(request:Request) { return handleContact(request,getContactConfig()); }

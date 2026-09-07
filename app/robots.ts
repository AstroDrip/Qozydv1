import type { MetadataRoute } from 'next';
import { getSiteConfig } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  const site = getSiteConfig();
  return site.indexable
    ? { rules: { userAgent: '*', allow: '/', disallow: ['/api/'] }, sitemap: `${site.url}/sitemap.xml`, host: site.url }
    : { rules: { userAgent: '*', disallow: '/' } };
}

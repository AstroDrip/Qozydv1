import type { MetadataRoute } from 'next';
import { getSiteConfig } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig();
  // Page anchors are not separate pages. Add actual routes here as they are created.
  return site.indexable ? [{ url: site.url, changeFrequency: 'monthly', priority: 1 }, {url:`${site.url}/privacy`,changeFrequency:'yearly',priority:0.2}] : [];
}

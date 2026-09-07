type Environment = Record<string, string | undefined>;

export function resolveSiteConfig(env: Environment) {
  const configured = env.SITE_URL?.trim() || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
  const parsed = new URL(configured || 'http://localhost:3000');
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
  if ((parsed.protocol !== 'https:' && !(local && parsed.protocol === 'http:')) || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('SITE_URL must be an HTTPS origin, without credentials, a path, query, or fragment.');
  }
  let instagram: string | undefined;
  if (env.INSTAGRAM_URL?.trim()) {
    const profile = new URL(env.INSTAGRAM_URL.trim());
    if (profile.protocol !== 'https:' || !['instagram.com', 'www.instagram.com'].includes(profile.hostname) || profile.username || profile.password || !/^\/[a-zA-Z0-9._]{1,30}\/?$/.test(profile.pathname)) {
      throw new Error('INSTAGRAM_URL must be an HTTPS Instagram profile URL.');
    }
    instagram = `https://www.instagram.com/${profile.pathname.replaceAll('/', '')}/`;
  }
  return {
    name: 'QOZYD',
    url: parsed.origin,
    instagram,
    indexable: Boolean(configured) && !local && (!env.VERCEL_ENV || env.VERCEL_ENV === 'production'),
    title: 'QOZYD | Marketing, Automation & Website Development',
    description: 'QOZYD helps business owners, startups, and entrepreneurs grow through marketing, workflow automation, React websites, and trademark application support.',
  };
}

export function getSiteConfig() { return resolveSiteConfig(process.env); }

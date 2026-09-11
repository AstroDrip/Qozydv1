type Environment = Record<string, string | undefined>;

export function resolveSiteConfig(env: Environment) {
  const configured = env.SITE_URL?.trim();
  const parsed = new URL(configured || 'http://localhost:3000');
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
  if ((parsed.protocol !== 'https:' && !(local && parsed.protocol === 'http:')) || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('SITE_URL must be an HTTPS origin, without credentials, a path, query, or fragment.');
  }
  const instagramInput = env.INSTAGRAM_URL?.trim() || 'https://www.instagram.com/qozyd.co/';
  let instagram: string | undefined;
  if (instagramInput) {
    const profile = new URL(instagramInput);
    if (profile.protocol !== 'https:' || !['instagram.com', 'www.instagram.com'].includes(profile.hostname) || profile.username || profile.password || !/^\/[a-zA-Z0-9._]{1,30}\/?$/.test(profile.pathname)) {
      throw new Error('INSTAGRAM_URL must be an HTTPS Instagram profile URL.');
    }
    instagram = `https://www.instagram.com/${profile.pathname.replaceAll('/', '')}/`;
  }
  return {
    name: 'QOZYD',
    contactEmail: 'qozyd.in@gmail.com',
    url: parsed.origin,
    instagram,
    indexable: Boolean(configured) && !local && (!env.VERCEL_ENV || env.VERCEL_ENV === 'production'),
    title: 'QOZYD | Marketing, Automation & Website Development',
    description: 'QOZYD helps business owners, startups, and entrepreneurs grow through marketing, workflow automation, React websites, and trademark application support.',
  };
}

export function getSiteConfig() { return resolveSiteConfig(process.env); }

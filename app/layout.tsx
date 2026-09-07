import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/site-config';
import './globals.css';
const site = getSiteConfig();
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: '%s | QOZYD' },
  description: site.description,
  applicationName: site.name,
  robots: { index: site.indexable, follow: site.indexable },
  openGraph: { type: 'website', locale: 'en_US', siteName: site.name, title: site.title, description: site.description },
  twitter: { card: 'summary', title: site.title, description: site.description },
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body><a href="#services" className="skip-link">Skip to services</a>{children}</body></html>;
}

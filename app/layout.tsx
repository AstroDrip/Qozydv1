import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'QOZYD — Good is not enough.',
  description: 'Marketing, automation, websites, and trademark support for ambitious businesses. Your next phase starts with QOZYD.',
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body><a href="#services" className="skip-link">Skip to services</a>{children}</body></html>;
}

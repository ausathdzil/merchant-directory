import type { Metadata } from 'next';
import './globals.css';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
    languages: {
      en: '/en',
      id: '/id',
    },
  },
  openGraph: {
    siteName: 'Veteran Market',
    url: new URL(baseUrl),
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return children;
}

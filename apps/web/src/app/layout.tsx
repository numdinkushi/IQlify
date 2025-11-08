import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';

import { Providers } from "@/providers";
import { Navbar } from '@/components/navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: 'IQlify',
  description: 'IQlify is a mobile-first educational quiz game that teaches  through gamified learning while rewarding users with instant cUSD payments via MiniPay integration and CELO tokens.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${orbitron.variable}`}>
        {/* Navbar is included on all pages */}
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pb-20">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { WalletProvider } from "@/components/wallet-provider";
import { AppProvider } from "@/hooks/use-app-state";

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
        {/* Navbar is included on all pages */}
        <WalletProvider>
          <AppProvider>
            <div className="relative flex min-h-screen flex-col">
              <main className="flex-1 pb-20">
                {children}
              </main>
            </div>
          </AppProvider>
        </WalletProvider>
      </body>
    </html>
  );
}

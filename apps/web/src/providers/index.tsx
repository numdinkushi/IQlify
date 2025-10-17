'use client';

import { ReactNode } from 'react';
import { ConvexProviderWrapper } from './convex-provider';
import { WalletProvider } from './wallet-provider';
import { AppProvider } from '@/hooks/use-app-state';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ConvexProviderWrapper>
            <WalletProvider>
                <AppProvider>
                    {children}
                </AppProvider>
            </WalletProvider>
        </ConvexProviderWrapper>
    );
}

'use client';

import { ReactNode } from 'react';
import { ConvexProviderWrapper } from './convex-provider';
import { WalletProvider } from './wallet-provider';
import { SplashProvider } from './splash-provider';
import { ProfileProvider } from './profile-provider';
import { AppProvider } from '@/hooks/use-app-state';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SplashProvider>
            <ConvexProviderWrapper>
                <WalletProvider>
                    <ProfileProvider>
                        <AppProvider>
                            {children}
                        </AppProvider>
                    </ProfileProvider>
                </WalletProvider>
            </ConvexProviderWrapper>
        </SplashProvider>
    );
}

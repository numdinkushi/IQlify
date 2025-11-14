'use client';

import { ReactNode } from 'react';
import { ConvexProviderWrapper } from './convex-provider';
import { WalletProvider } from './wallet-provider';
import { SplashProvider } from './splash-provider';
import { ProfileProvider } from './profile-provider';
import { ToastProvider } from './toast-provider';
import { ThemeProvider } from './theme-provider';
import { AppProvider } from '@/hooks/use-app-state';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider>
            <SplashProvider>
                <ConvexProviderWrapper>
                    <WalletProvider>
                        <ToastProvider>
                            <ProfileProvider>
                                <AppProvider>
                                    {children}
                                </AppProvider>
                            </ProfileProvider>
                        </ToastProvider>
                    </WalletProvider>
                </ConvexProviderWrapper>
            </SplashProvider>
        </ThemeProvider>
    );
}

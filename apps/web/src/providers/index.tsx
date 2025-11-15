'use client';

import { ReactNode } from 'react';
import { ConvexProviderWrapper } from './convex-provider';
import { WalletProvider } from './wallet-provider';
import { SplashProvider } from './splash-provider';
import { ProfileProvider } from './profile-provider';
import { ToastProvider } from './toast-provider';
import { ThemeProvider } from './theme-provider';
import { LanguageProvider } from './language-provider';
import { IntlProvider } from './intl-provider';
import { AppProvider } from '@/hooks/use-app-state';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <IntlProvider>
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
                </IntlProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}

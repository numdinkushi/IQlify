'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '@/hooks/use-app-state';
import { WalletTabs, WalletTabType } from './wallet/wallet-tabs';
import { OverviewTab } from './wallet/overview-tab';
import { TransactionsTab } from './wallet/transactions-tab';
import { Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function WalletTab() {
    const { address, isConnected } = useAppState();
    const [activeTab, setActiveTab] = useState<WalletTabType>(WalletTabType.OVERVIEW);
    const t = useTranslations();



    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut' as const
            }
        }
    };

    // Show loading state during hydration (only on server-side)
    if (typeof window === 'undefined') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen p-4 iqlify-grid-bg flex items-center justify-center"
            >
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">{t('wallet.loading')}</p>
                </div>
            </motion.div>
        );
    }

    // Show connect wallet screen if not connected
    if (!isConnected || !address) {
        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="min-h-screen p-4 iqlify-grid-bg flex items-center justify-center"
            >
                <div className="text-center space-y-4">
                    <Wallet className="h-16 w-16 text-gold-400 mx-auto opacity-50" />
                    <h1 className="text-2xl font-bold iqlify-gold-text">{t('wallet.connectWallet')}</h1>
                    <p className="text-muted-foreground">{t('wallet.connectWalletDesc')}</p>
                </div>
            </motion.div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case WalletTabType.OVERVIEW:
                return <OverviewTab />;
            case WalletTabType.TRANSACTIONS:
                return <TransactionsTab />;
            default:
                return <OverviewTab />;
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen p-4 iqlify-grid-bg"
        >
            <div className="max-w-md mx-auto space-y-6">
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center space-y-2 mb-8">
                    <h1 className="text-2xl font-bold iqlify-gold-text">{t('wallet.title')}</h1>
                    <p className="text-muted-foreground">{t('wallet.subtitle')}</p>
                </motion.div>

                {/* Wallet Tabs */}
                <motion.div variants={itemVariants} className="mb-6">
                    <WalletTabs activeTab={activeTab} onTabChange={setActiveTab} />
                </motion.div>

                {/* Tab Content */}
                <motion.div
                    variants={itemVariants}
                    key={activeTab} // Force re-render when tab changes
                    className="min-h-[400px]" // Ensure content has minimum height
                >
                    {renderTabContent()}
                </motion.div>
            </div>
        </motion.div>
    );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, History, Settings } from 'lucide-react';

export enum WalletTabType {
    OVERVIEW = 'overview',
    TRANSACTIONS = 'transactions',
    SETTINGS = 'settings',
}

const walletTabConfigs = [
    {
        id: WalletTabType.OVERVIEW,
        label: 'Overview',
        icon: Wallet,
    },
    {
        id: WalletTabType.TRANSACTIONS,
        label: 'Transactions',
        icon: History,
    },
    {
        id: WalletTabType.SETTINGS,
        label: 'Settings',
        icon: Settings,
    },
];

interface WalletTabsProps {
    activeTab: WalletTabType;
    onTabChange: (tab: WalletTabType) => void;
}

export function WalletTabs({ activeTab, onTabChange }: WalletTabsProps) {
    return (
        <div className="flex bg-secondary/30 rounded-lg p-1 border border-gold-400/20 gap-1">
            {walletTabConfigs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all duration-200 font-medium ${isActive
                            ? 'bg-gold-400 text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-gold-400/20'
                            }`}
                    >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

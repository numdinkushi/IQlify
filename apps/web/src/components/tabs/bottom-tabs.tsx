'use client';

import { motion } from 'framer-motion';
import {
    Home,
    Mic,
    Wallet,
    Trophy,
    Settings
} from 'lucide-react';
import { TabType } from '@/lib/types';
import { TAB_CONFIGS } from '@/lib/constants';
import { useAppState } from '@/hooks/use-app-state';

const iconMap = {
    Home,
    Mic,
    Wallet,
    Trophy,
    Settings
};

export function BottomTabs() {
    const { currentTab, setCurrentTab } = useAppState();

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-gold-400/30"
        >
            <div className="flex items-center justify-around py-3 px-2">
                {TAB_CONFIGS.map((tab) => {
                    const Icon = iconMap[tab.icon as keyof typeof iconMap];
                    const isActive = currentTab === tab.id;

                    return (
                        <motion.div
                            key={tab.id}
                            onClick={() => setCurrentTab(tab.id)}
                            className="flex flex-col items-center justify-center gap-1 transition-all duration-200 relative bg-transparent border-none cursor-pointer"
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Icon */}
                            <Icon
                                size={28}
                                className={isActive ? 'text-gold-400' : 'text-foreground dark:text-white'}
                            />
                            {/* Label */}
                            <span className={`text-xs ${isActive ? 'text-gold-400' : 'text-foreground dark:text-white'}`}>
                                {tab.label}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

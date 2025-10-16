'use client';

import { motion } from 'framer-motion';
import {
    Home,
    Target,
    Mic,
    Wallet,
    Trophy
} from 'lucide-react';
import { TabType } from '@/lib/types';
import { TAB_CONFIGS } from '@/lib/constants';
import { useAppState } from '@/hooks/use-app-state';

const iconMap = {
    Home,
    Target,
    Mic,
    Wallet,
    Trophy
};

export function BottomTabs() {
    const { currentTab, setCurrentTab } = useAppState();

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-gold-400/20"
        >
            <div className="flex items-center justify-around px-2 py-2">
                {TAB_CONFIGS.map((tab) => {
                    const Icon = iconMap[tab.icon as keyof typeof iconMap];
                    const isActive = currentTab === tab.id;

                    return (
                        <motion.button
                            key={tab.id}
                            onClick={() => setCurrentTab(tab.id)}
                            className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 relative"
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Active background */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gold-400/20 rounded-xl border border-gold-400/30"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Icon */}
                            <motion.div
                                animate={{
                                    color: isActive ? '#D4AF37' : '#999999',
                                    scale: isActive ? 1.1 : 1
                                }}
                                transition={{ duration: 0.2 }}
                                className="relative z-10 mb-1"
                            >
                                <Icon size={20} />
                            </motion.div>

                            {/* Label */}
                            <motion.span
                                animate={{
                                    color: isActive ? '#D4AF37' : '#999999',
                                    fontWeight: isActive ? 600 : 400
                                }}
                                transition={{ duration: 0.2 }}
                                className="text-xs relative z-10"
                            >
                                {tab.label}
                            </motion.span>

                            {/* Badge */}
                            {tab.badge && tab.badge > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-success text-success-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold z-20"
                                >
                                    {tab.badge > 99 ? '99+' : tab.badge}
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}

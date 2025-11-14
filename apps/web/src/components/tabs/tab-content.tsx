'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TabType } from '@/lib/types';
import { useAppState } from '@/hooks/use-app-state';
import { HomeTab } from './home-tab';
import { ChallengesTab } from './challenges-tab';
import { InterviewTab } from './interview';
import { WalletTab } from './wallet-tab';
import { LeaderboardTab } from './leaderboard-tab';
import { SettingsTab } from './settings-tab';

const tabComponents = {
    [TabType.HOME]: HomeTab,
    [TabType.CHALLENGES]: ChallengesTab,
    [TabType.INTERVIEW]: InterviewTab,
    [TabType.WALLET]: WalletTab,
    [TabType.LEADERBOARD]: LeaderboardTab,
    [TabType.SETTINGS]: SettingsTab
};

export function TabContent() {
    const { currentTab } = useAppState();
    const CurrentComponent = tabComponents[currentTab];

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                    duration: 0.5,
                    ease: 'easeOut',
                    delay: 0.1 // Small delay to ensure smooth transition from splash
                }}
                className="w-full"
            >
                <CurrentComponent />
            </motion.div>
        </AnimatePresence>
    );
}

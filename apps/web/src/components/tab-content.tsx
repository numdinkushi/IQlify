'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TabType } from '@/lib/types';
import { useAppState } from '@/hooks/use-app-state';
import { HomeTab } from './tabs/home-tab';
import { ChallengesTab } from './tabs/challenges-tab';
import { InterviewTab } from './tabs/interview-tab';
import { WalletTab } from './tabs/wallet-tab';
import { LeaderboardTab } from './tabs/leaderboard-tab';

const tabComponents = {
    [TabType.HOME]: HomeTab,
    [TabType.CHALLENGES]: ChallengesTab,
    [TabType.INTERVIEW]: InterviewTab,
    [TabType.WALLET]: WalletTab,
    [TabType.LEADERBOARD]: LeaderboardTab
};

export function TabContent() {
    const { currentTab } = useAppState();
    const CurrentComponent = tabComponents[currentTab];

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <CurrentComponent />
            </motion.div>
        </AnimatePresence>
    );
}

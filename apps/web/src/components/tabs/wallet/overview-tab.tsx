'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserBalance } from '@/components/user-balance';
import { useAppState } from '@/hooks/use-app-state';
import { Wallet, TrendingUp, Download, Send, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function OverviewTab() {
    const { address } = useAppState();
    const [copied, setCopied] = useState(false);


    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* User Balance */}
            <motion.div variants={itemVariants}>
                <UserBalance />
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-lg font-semibold text-gold-400">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                    <Button className="iqlify-button-primary h-16 rounded-xl">
                        <Download className="h-5 w-5 mr-2" />
                        Withdraw
                    </Button>
                    <Button variant="outline" className="border-gold-400/30 text-gold-400 hover:bg-gold-400/10 h-16 rounded-xl">
                        <Send className="h-5 w-5 mr-2" />
                        Send
                    </Button>
                </div>
            </motion.div>

            {/* Earnings Summary */}
            <motion.div variants={itemVariants}>
                <Card className="iqlify-card">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-gold-400" />
                            <CardTitle className="text-gold-400">Earnings Summary</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                <p className="text-sm text-muted-foreground">Today</p>
                                <p className="text-xl font-bold text-gold-400">0 CELO</p>
                            </div>
                            <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                <p className="text-sm text-muted-foreground">This Week</p>
                                <p className="text-xl font-bold text-gold-400">0 CELO</p>
                            </div>
                            <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                <p className="text-sm text-muted-foreground">This Month</p>
                                <p className="text-xl font-bold text-gold-400">0 CELO</p>
                            </div>
                            <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-xl font-bold text-gold-400">0 CELO</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

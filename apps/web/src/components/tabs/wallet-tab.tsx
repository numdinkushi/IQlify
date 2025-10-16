'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserBalance } from '@/components/user-balance';
import { Wallet, TrendingUp, Download, Send, History } from 'lucide-react';

export function WalletTab() {
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
                ease: 'easeOut'
            }
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
                <motion.div variants={itemVariants} className="text-center space-y-2">
                    <h1 className="text-2xl font-bold iqlify-gold-text">Wallet</h1>
                    <p className="text-muted-foreground">Manage your earnings and rewards</p>
                </motion.div>

                {/* Wallet Info */}
                <motion.div variants={itemVariants}>
                    <Card className="iqlify-card border-gold-400/30">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-gold-400" />
                                <CardTitle className="text-gold-400">Wallet Overview</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                Manage your earnings and track your progress
                            </p>
                        </CardContent>
                    </Card>
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

                {/* Recent Transactions */}
                <motion.div variants={itemVariants}>
                    <Card className="iqlify-card">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <History className="h-5 w-5 text-gold-400" />
                                <CardTitle className="text-gold-400">Recent Transactions</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No transactions yet</p>
                                <p className="text-sm">Start earning to see your transaction history</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Achievements */}
                <motion.div variants={itemVariants}>
                    <Card className="iqlify-card">
                        <CardHeader>
                            <CardTitle className="text-gold-400">Achievements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <div className="w-16 h-16 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🏆</span>
                                </div>
                                <p>No achievements yet</p>
                                <p className="text-sm">Complete challenges to unlock achievements</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}

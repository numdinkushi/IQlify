'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

export function TransactionsTab() {
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

    // Mock transaction data - replace with real data from Convex
    const transactions = [
        {
            id: '1',
            type: 'earning',
            amount: '2.5',
            token: 'CELO',
            description: 'Interview Challenge Reward',
            timestamp: '2 hours ago',
            status: 'completed'
        },
        {
            id: '2',
            type: 'earning',
            amount: '1.2',
            token: 'CELO',
            description: 'Daily Streak Bonus',
            timestamp: '1 day ago',
            status: 'completed'
        },
        {
            id: '3',
            type: 'earning',
            amount: '0.8',
            token: 'CELO',
            description: 'Skill Assessment Reward',
            timestamp: '3 days ago',
            status: 'completed'
        }
    ];

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'earning':
                return <ArrowDownLeft className="h-4 w-4 text-success" />;
            case 'withdrawal':
                return <ArrowUpRight className="h-4 w-4 text-destructive" />;
            default:
                return <Clock className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'earning':
                return 'text-success';
            case 'withdrawal':
                return 'text-destructive';
            default:
                return 'text-muted-foreground';
        }
    };

    return (
        <div className="space-y-6">
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
                        {transactions.length > 0 ? (
                            <div className="space-y-3">
                                {transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-gold-400/10"
                                    >
                                        <div className="flex items-center gap-3">
                                            {getTransactionIcon(transaction.type)}
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {transaction.description}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {transaction.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-semibold ${getTransactionColor(transaction.type)}`}>
                                                +{transaction.amount} {transaction.token}
                                            </p>
                                            <p className="text-xs text-muted-foreground capitalize">
                                                {transaction.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No transactions yet</p>
                                <p className="text-sm">Start earning to see your transaction history</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Transaction Stats */}
            <motion.div variants={itemVariants}>
                <Card className="iqlify-card">
                    <CardHeader>
                        <CardTitle className="text-gold-400">Transaction Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                <p className="text-sm text-muted-foreground">Total Earned</p>
                                <p className="text-xl font-bold text-success">4.5 CELO</p>
                            </div>
                            <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                <p className="text-sm text-muted-foreground">This Month</p>
                                <p className="text-xl font-bold text-gold-400">3.2 CELO</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

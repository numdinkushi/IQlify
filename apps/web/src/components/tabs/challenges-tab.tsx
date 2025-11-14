'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Clock, Users, Trophy, Zap } from 'lucide-react';

export function ChallengesTab() {
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
                    <h1 className="text-2xl font-bold iqlify-gold-text">Challenges</h1>
                    <p className="text-muted-foreground">Compete and earn rewards</p>
                </motion.div>

                {/* Daily Challenge */}
                <motion.div variants={itemVariants}>
                    <Card className="iqlify-card border-gold-400/30">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-gold-400" />
                                <CardTitle className="text-gold-400">Daily Challenge</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Entry Fee</span>
                                <span className="font-semibold text-gold-400">3 CELO</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Prize Pool</span>
                                <span className="font-semibold text-success">240 CELO</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Participants</span>
                                <span className="font-semibold">127</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Time Left</span>
                                <span className="font-semibold text-warning">14h 23m</span>
                            </div>
                            <Button className="iqlify-button-primary w-full">
                                Join Challenge
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Weekly Challenge */}
                <motion.div variants={itemVariants}>
                    <Card className="iqlify-card">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-purple-400" />
                                <CardTitle className="text-purple-400">Weekly Challenge</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Entry Fee</span>
                                <span className="font-semibold text-purple-400">5 CELO</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Prize Pool</span>
                                <span className="font-semibold text-success">1,200 CELO</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Participants</span>
                                <span className="font-semibold">89</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Time Left</span>
                                <span className="font-semibold text-warning">3d 14h</span>
                            </div>
                            <Button variant="outline" className="border-purple-400/30 text-purple-400 hover:bg-purple-400/10 w-full">
                                Join Challenge
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Skill Challenges */}
                <motion.div variants={itemVariants}>
                    <h2 className="text-lg font-semibold text-gold-400">Skill Challenges</h2>
                    <div className="space-y-3">
                        <Card className="iqlify-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-400 font-bold">R</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">React Fundamentals</h3>
                                            <p className="text-sm text-muted-foreground">Beginner • 2 CELO</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="border-gold-400/30 text-gold-400">
                                        Join
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="iqlify-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                                            <span className="text-green-400 font-bold">N</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Node.js APIs</h3>
                                            <p className="text-sm text-muted-foreground">Intermediate • 5 CELO</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="border-gold-400/30 text-gold-400">
                                        Join
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="iqlify-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                                            <span className="text-yellow-400 font-bold">JS</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">JavaScript Mastery</h3>
                                            <p className="text-sm text-muted-foreground">Advanced • 10 CELO</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="border-gold-400/30 text-gold-400">
                                        Join
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

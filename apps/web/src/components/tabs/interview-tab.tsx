'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Play, Clock, Target, Award } from 'lucide-react';

export function InterviewTab() {
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
                    <h1 className="text-2xl font-bold iqlify-gold-text">Interview</h1>
                    <p className="text-muted-foreground">Practice and improve your skills</p>
                </motion.div>

                {/* Quick Start */}
                <motion.div variants={itemVariants}>
                    <Card className="iqlify-card border-gold-400/30">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Mic className="h-5 w-5 text-gold-400" />
                                <CardTitle className="text-gold-400">Quick Practice</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground text-sm">
                                Start a quick mock interview to practice your skills and earn rewards
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                    <Clock className="h-6 w-6 text-gold-400 mx-auto mb-1" />
                                    <p className="text-xs text-muted-foreground">Duration</p>
                                    <p className="font-semibold">15-30 min</p>
                                </div>
                                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                    <Target className="h-6 w-6 text-gold-400 mx-auto mb-1" />
                                    <p className="text-xs text-muted-foreground">Difficulty</p>
                                    <p className="font-semibold">Adaptive</p>
                                </div>
                            </div>
                            <Button className="iqlify-button-primary w-full">
                                <Play className="h-4 w-4 mr-2" />
                                Start Practice Interview
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Interview Types */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h2 className="text-lg font-semibold text-gold-400">Interview Types</h2>

                    <div className="space-y-3">
                        <Card className="iqlify-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
                                            <Mic className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Mock Interview</h3>
                                            <p className="text-sm text-muted-foreground">AI-powered practice session</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="border-gold-400/30 text-gold-400">
                                        Start
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="iqlify-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                                            <Target className="h-5 w-5 text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Skill Assessment</h3>
                                            <p className="text-sm text-muted-foreground">Test your technical skills</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="border-gold-400/30 text-gold-400">
                                        Start
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="iqlify-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-400/20 rounded-lg flex items-center justify-center">
                                            <Award className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Live Challenge</h3>
                                            <p className="text-sm text-muted-foreground">Compete with other users</p>
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

                {/* Recent Interviews */}
                <motion.div variants={itemVariants}>
                    <Card className="iqlify-card">
                        <CardHeader>
                            <CardTitle className="text-gold-400">Recent Interviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No recent interviews</p>
                                <p className="text-sm">Start your first interview to see history here</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}

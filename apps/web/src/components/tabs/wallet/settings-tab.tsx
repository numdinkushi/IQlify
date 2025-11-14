'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Bell, Shield, Palette, Info } from 'lucide-react';

export function SettingsTab() {
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
        <div className="space-y-6">
            {/* Notifications */}
            <motion.div variants={itemVariants}>
                <Card className="iqlify-card">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-gold-400" />
                            <CardTitle className="text-gold-400">Notifications</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground">Earnings Notifications</p>
                                <p className="text-xs text-muted-foreground">Get notified when you earn rewards</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-gold-400/30 text-gold-400">
                                Enable
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground">Challenge Reminders</p>
                                <p className="text-xs text-muted-foreground">Daily reminders for challenges</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-gold-400/30 text-gold-400">
                                Enable
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Security */}
            <motion.div variants={itemVariants}>
                <Card className="iqlify-card">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-gold-400" />
                            <CardTitle className="text-gold-400">Security</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                                <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-gold-400/30 text-gold-400">
                                Setup
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground">Session Management</p>
                                <p className="text-xs text-muted-foreground">Manage active sessions</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-gold-400/30 text-gold-400">
                                Manage
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Appearance */}
            <motion.div variants={itemVariants}>
                <Card className="iqlify-card">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-gold-400" />
                            <CardTitle className="text-gold-400">Appearance</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground">Theme</p>
                                <p className="text-xs text-muted-foreground">Dark (Default)</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-gold-400/30 text-gold-400">
                                Change
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground">Language</p>
                                <p className="text-xs text-muted-foreground">English</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-gold-400/30 text-gold-400">
                                Change
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* About */}
            <motion.div variants={itemVariants}>
                <Card className="iqlify-card">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-gold-400" />
                            <CardTitle className="text-gold-400">About</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gold-400">IQlify</h3>
                            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Master interviews while earning real money
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full border-gold-400/30 text-gold-400">
                                Privacy Policy
                            </Button>
                            <Button variant="outline" className="w-full border-gold-400/30 text-gold-400">
                                Terms of Service
                            </Button>
                            <Button variant="outline" className="w-full border-gold-400/30 text-gold-400">
                                Support
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

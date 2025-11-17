'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Settings, Bell, Shield, Palette, Info } from 'lucide-react';
import { PrivacyPolicyContent } from '@/components/settings/privacy-policy-content';
import { TermsOfServiceContent } from '@/components/settings/terms-content';
import { SupportContent } from '@/components/settings/support-content';
import { ThemeSelector } from '@/components/settings/theme-selector';
import { LanguageSelector } from '@/components/settings/language-selector';
import { useTheme } from '@/providers/theme-provider';
import { useLanguage } from '@/providers/language-provider';
import { useTranslations } from 'next-intl';
import { SUPPORTED_LANGUAGES } from '@/lib/language-constants';

export function SettingsTab() {
    const [privacyOpen, setPrivacyOpen] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);
    const [themeOpen, setThemeOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const { theme } = useTheme();
    const { language } = useLanguage();
    const t = useTranslations();
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
                <motion.div variants={itemVariants} className="text-center space-y-2 mb-8">
                    <h1 className="text-2xl font-bold iqlify-gold-text">{t('settings.title')}</h1>
                    <p className="text-muted-foreground">{t('settings.subtitle')}</p>
                </motion.div>

                {/* Notifications */}
                <motion.div variants={itemVariants}>
                    <Card className="iqlify-card">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-gold-400" />
                                <CardTitle className="text-gold-400">{t('settings.notifications.title')}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{t('settings.notifications.earnings')}</p>
                                    <p className="text-xs text-muted-foreground">{t('settings.notifications.earningsDesc')}</p>
                                </div>
                                <Button variant="outline" size="sm" className="border-gold-400/30 text-gold-400">
                                    {t('settings.notifications.enable')}
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{t('settings.notifications.challenges')}</p>
                                    <p className="text-xs text-muted-foreground">{t('settings.notifications.challengesDesc')}</p>
                                </div>
                                <Button variant="outline" size="sm" className="border-gold-400/30 text-gold-400">
                                    {t('settings.notifications.enable')}
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
                                <CardTitle className="text-gold-400">{t('settings.security.title')}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{t('settings.security.twoFactor')}</p>
                                    <p className="text-xs text-muted-foreground">{t('settings.security.twoFactorDesc')}</p>
                                </div>
                                <Button variant="outline" size="sm" className="border-gold-400/30 text-gold-400">
                                    {t('settings.security.setup')}
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{t('settings.security.sessions')}</p>
                                    <p className="text-xs text-muted-foreground">{t('settings.security.sessionsDesc')}</p>
                                </div>
                                <Button variant="outline" size="sm" className="border-gold-400/30 text-gold-400">
                                    {t('settings.security.manage')}
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
                                <CardTitle className="text-gold-400">{t('settings.appearance.title')}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{t('settings.appearance.theme')}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {theme === 'dark' ? 'Dark (Default)' : 'Light'}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gold-400/30 text-gold-400"
                                    onClick={() => setThemeOpen(true)}
                                >
                                    {t('settings.appearance.change')}
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{t('settings.appearance.language')}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {SUPPORTED_LANGUAGES[language].nativeName}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gold-400/30 text-gold-400"
                                    onClick={() => setLanguageOpen(true)}
                                >
                                    {t('settings.appearance.change')}
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
                                <CardTitle className="text-gold-400">{t('settings.about.title')}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gold-400">IQlify</h3>
                                <p className="text-sm text-muted-foreground">{t('settings.about.version')}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {t('settings.about.tagline')}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full border-gold-400/30 text-gold-400"
                                    onClick={() => setPrivacyOpen(true)}
                                >
                                    {t('settings.privacy')}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-gold-400/30 text-gold-400"
                                    onClick={() => setTermsOpen(true)}
                                >
                                    {t('settings.terms')}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-gold-400/30 text-gold-400"
                                    onClick={() => setSupportOpen(true)}
                                >
                                    {t('settings.support')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Bottom Sheets */}
            <BottomSheet isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} title={t('settings.privacy')}>
                <PrivacyPolicyContent />
            </BottomSheet>

            <BottomSheet isOpen={termsOpen} onClose={() => setTermsOpen(false)} title={t('settings.terms')}>
                <TermsOfServiceContent />
            </BottomSheet>

            <BottomSheet isOpen={supportOpen} onClose={() => setSupportOpen(false)} title={t('settings.support')}>
                <SupportContent />
            </BottomSheet>

            <BottomSheet isOpen={themeOpen} onClose={() => setThemeOpen(false)} title={t('language.theme.selectTitle')}>
                <ThemeSelector />
            </BottomSheet>

            <BottomSheet isOpen={languageOpen} onClose={() => setLanguageOpen(false)} title={t('language.selectTitle')}>
                <LanguageSelector />
            </BottomSheet>
        </motion.div>
    );
}


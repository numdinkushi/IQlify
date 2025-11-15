'use client';

import { Moon, Sun, Check } from 'lucide-react';
import { useTheme } from '@/providers/theme-provider';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export function ThemeSelector() {
    const { theme, setTheme } = useTheme();
    const t = useTranslations();

    const themes = [
        {
            id: 'dark' as const,
            name: 'Dark',
            description: 'Default theme',
            icon: Moon,
        },
        {
            id: 'light' as const,
            name: 'Light',
            description: 'Light mode',
            icon: Sun,
        },
    ];

    return (
        <div className="space-y-3 pb-8">
            <p className="text-sm text-muted-foreground mb-4">
                {t('language.theme.selectDescription')}
            </p>
            {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isSelected = theme === themeOption.id;

                return (
                    <motion.button
                        key={themeOption.id}
                        onClick={() => setTheme(themeOption.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                            isSelected
                                ? 'border-gold-400 bg-gold-400/10'
                                : 'border-border hover:border-gold-400/50 bg-card'
                        }`}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`p-2 rounded-lg ${
                                    isSelected
                                        ? 'bg-gold-400/20 text-gold-400'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <p
                                    className={`font-medium ${
                                        isSelected ? 'text-gold-400' : 'text-foreground'
                                    }`}
                                >
                                    {themeOption.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {themeOption.description}
                                </p>
                            </div>
                        </div>
                        {isSelected && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-gold-400"
                            >
                                <Check className="h-5 w-5" />
                            </motion.div>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}


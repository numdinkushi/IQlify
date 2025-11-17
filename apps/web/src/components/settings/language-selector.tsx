'use client';

import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { useTranslations } from 'next-intl';
import { SUPPORTED_LANGUAGES, LANGUAGE_CODES } from '@/lib/language-constants';
import { motion } from 'framer-motion';

export function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const t = useTranslations();

    return (
        <div className="space-y-3 pb-8 language-selector-wrapper">
            <p className="text-sm text-muted-foreground mb-4">
                {t('language.selectDescription')}
            </p>
            {LANGUAGE_CODES.map((langCode) => {
                const lang = SUPPORTED_LANGUAGES[langCode];
                const isSelected = language === langCode;

                return (
                    <motion.button
                        key={langCode}
                        onClick={() => setLanguage(langCode)}
                        style={isSelected
                            ? {
                                backgroundColor: '#D4AF37',
                                borderColor: '#D4AF37',
                                color: '#FFFFFF'
                            }
                            : {
                                backgroundColor: '#FFFFFF',
                                borderColor: '#4A4A4A',
                                color: '#000000'
                            }
                        }
                        className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${isSelected
                            ? ''
                            : 'hover:border-gold-400/50'
                            }`}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                style={isSelected
                                    ? { backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF' }
                                    : { backgroundColor: '#F5F5F5', color: '#000000' }
                                }
                                className="p-2 rounded-lg"
                            >
                                <Globe className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <p
                                    style={{
                                        color: isSelected ? '#FFFFFF' : '#000000',
                                        fontWeight: 500
                                    }}
                                    className="font-medium"
                                >
                                    {lang.nativeName}
                                </p>
                                <p
                                    style={{
                                        color: isSelected ? '#FFFFFF' : '#000000',
                                        fontSize: '0.75rem'
                                    }}
                                    className="text-xs"
                                >
                                    {lang.name}
                                </p>
                            </div>
                        </div>
                        {isSelected && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{ color: '#FFFFFF' }}
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


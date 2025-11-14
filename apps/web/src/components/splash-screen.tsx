'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface SplashScreenProps {
    isVisible: boolean;
    onComplete?: () => void;
}

export function SplashScreen({ isVisible, onComplete }: SplashScreenProps) {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (isVisible) {
            // Show content after a brief delay
            const timer = setTimeout(() => setShowContent(true), 300);
            return () => clearTimeout(timer);
        } else {
            setShowContent(false);
        }
    }, [isVisible]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.3,
                when: "afterChildren"
            }
        }
    };

    const logoVariants = {
        hidden: {
            scale: 0.5,
            opacity: 0,
            rotateY: -180
        },
        visible: {
            scale: 1,
            opacity: 1,
            rotateY: 0,
            transition: {
                type: "spring" as const,
                stiffness: 200,
                damping: 15,
                duration: 0.8
            }
        }
    };

    const textVariants = {
        hidden: {
            y: 30,
            opacity: 0
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 12
            }
        }
    };

    const pulseVariants = {
        pulse: {
            scale: [1, 1.1, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    const dotsVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                repeat: Infinity,
                repeatType: "reverse" as const
            }
        }
    };

    const dotVariants = {
        hidden: { opacity: 0.3, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeInOut" as const
            }
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background iqlify-grid-bg"
                >
                    {/* Logo Container */}
                    <motion.div
                        variants={logoVariants}
                        className="relative mb-8"
                    >
                        <motion.div
                            variants={pulseVariants}
                            animate="pulse"
                            className="relative"
                        >
                            <Image
                                src="/assets/logo/logo.png"
                                alt="IQlify Logo"
                                width={120}
                                height={120}
                                className="w-30 h-30"
                                priority
                            />

                            {/* Glow effect */}
                            <motion.div
                                className="absolute inset-0 rounded-full bg-gold-400/20 blur-xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>
                    </motion.div>

                    {/* App Name */}
                    <motion.div
                        variants={textVariants}
                        className="text-center mb-4"
                    >
                        <motion.h1
                            className="text-4xl font-bold iqlify-gold-text mb-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            IQlify
                        </motion.h1>

                        <motion.p
                            className="text-muted-foreground text-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                        >
                            Master interviews while earning real money
                        </motion.p>
                    </motion.div>

                    {/* Loading Dots */}
                    <motion.div
                        variants={dotsVariants}
                        className="flex space-x-2"
                    >
                        {[0, 1, 2].map((index) => (
                            <motion.div
                                key={index}
                                variants={dotVariants}
                                className="w-2 h-2 bg-gold-400 rounded-full"
                            />
                        ))}
                    </motion.div>

                    {/* Loading Progress Bar */}
                    <motion.div
                        className="w-64 h-1 bg-secondary/30 rounded-full mt-8 overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut",
                                delay: 1
                            }}
                            onAnimationComplete={() => {
                                setTimeout(() => {
                                    onComplete?.();
                                }, 300);
                            }}
                        />
                    </motion.div>

                    {/* Built on Celo Badge */}
                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold iqlify-gold-gradient text-primary-foreground rounded-full border border-gold-400/30 shadow-lg">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                ⚡
                            </motion.div>
                            Built on Celo
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

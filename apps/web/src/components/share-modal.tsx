'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import {
    MessageCircle,
    Copy,
    Share2,
    Trophy,
    TrendingUp,
    Download,
    FileText
} from 'lucide-react';
import { useState } from 'react';
import { generateCertificate } from '@/lib/certificate-generator';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    userRank?: number;
    totalEarnings?: number;
    streak?: number;
    userName?: string;
    walletAddress?: string;
    totalInterviews?: number;
    averageScore?: number;
}

export function ShareModal({
    isOpen,
    onClose,
    userRank = 127,
    totalEarnings = 0,
    streak = 0,
    userName,
    walletAddress = '',
    totalInterviews = 0,
    averageScore = 0
}: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const shareText = `🎯 Just ranked #${userRank} on IQlify! 
💰 Earned ${totalEarnings} CELO so far
🔥 ${streak} day streak
🚀 Master interviews while earning crypto rewards!

#IQlify #Celo #Web3 #InterviewPrep`;

    const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://iqlify.app';

    // Helper function to properly encode text with emojis for URLs
    const encodeShareText = (text: string): string => {
        // Use encodeURIComponent which properly handles emojis
        return encodeURIComponent(text);
    };

    // Custom social media icon components
    const TwitterIcon = () => (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );

    const FacebookIcon = () => (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );

    const WhatsAppIcon = () => (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>
    );

    const TelegramIcon = () => (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
    );

    const shareOptions = [
        {
            name: 'Twitter',
            icon: TwitterIcon,
            color: 'text-blue-400',
            bgColor: 'hover:bg-blue-400/20',
            action: () => {
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeShareText(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                window.open(twitterUrl, '_blank');
                onClose();
            }
        },
        {
            name: 'Facebook',
            icon: FacebookIcon,
            color: 'text-blue-600',
            bgColor: 'hover:bg-blue-600/20',
            action: () => {
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeShareText(shareText)}`;
                window.open(facebookUrl, '_blank');
                onClose();
            }
        },
        {
            name: 'WhatsApp',
            icon: WhatsAppIcon,
            color: 'text-green-500',
            bgColor: 'hover:bg-green-500/20',
            action: () => {
                const whatsappUrl = `https://wa.me/?text=${encodeShareText(shareText + ' ' + shareUrl)}`;
                window.open(whatsappUrl, '_blank');
                onClose();
            }
        },
        {
            name: 'Telegram',
            icon: TelegramIcon,
            color: 'text-blue-500',
            bgColor: 'hover:bg-blue-500/20',
            action: () => {
                const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeShareText(shareText)}`;
                window.open(telegramUrl, '_blank');
                onClose();
            }
        }
    ];

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareText + ' ' + shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleDownloadCertificate = async () => {
        if (!walletAddress) {
            console.error('Wallet address is required for certificate generation');
            return;
        }

        setIsGenerating(true);
        try {
            const issueDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            await generateCertificate({
                userName: userName || walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4),
                walletAddress,
                totalInterviews,
                averageScore,
                totalEarnings,
                currentStreak: streak,
                rank: userRank,
                issueDate
            });
        } catch (error) {
            console.error('Failed to generate certificate:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} title="Share Your Progress">
            <div className="space-y-6">
                {/* Share Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-secondary/30 rounded-lg p-4 border border-gold-400/20"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gold-400/20 rounded-full flex items-center justify-center">
                            <Trophy className="h-5 w-5 text-gold-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Your Achievement</h3>
                            <p className="text-sm text-muted-foreground">Share your progress with friends</p>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-gold-400" />
                            <span className="text-muted-foreground">Rank:</span>
                            <span className="font-semibold text-foreground">#{userRank}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Earnings:</span>
                            <span className="font-semibold text-gold-400">{totalEarnings} CELO</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Streak:</span>
                            <span className="font-semibold text-success">{streak} days</span>
                        </div>
                    </div>
                </motion.div>

                {/* Share Options */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gold-400">Share on Social Media</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {shareOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <Button
                                    key={option.name}
                                    onClick={option.action}
                                    variant="outline"
                                    className={`h-12 flex flex-row items-center justify-center gap-3 px-4 border-gold-400/30 text-gold-400 ${option.bgColor} transition-all duration-200`}
                                >
                                    <div className={`flex items-center justify-center ${option.color}`}>
                                        <Icon />
                                    </div>
                                    <span className="text-sm font-medium">{option.name}</span>
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Download Certificate */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gold-400">Download Certificate</h3>
                    <Button
                        onClick={handleDownloadCertificate}
                        disabled={isGenerating || !walletAddress}
                        className="w-full h-12 iqlify-button-primary flex items-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Generating Certificate...</span>
                            </>
                        ) : (
                            <>
                                <FileText className="h-4 w-4" />
                                <span>Download PDF Certificate</span>
                            </>
                        )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                        Get a professional certificate as proof of your competence
                    </p>
                </div>

                {/* Copy Link */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gold-400">Copy Link</h3>
                    <Button
                        onClick={copyToClipboard}
                        className="w-full h-12 iqlify-button-primary flex items-center gap-2"
                    >
                        {copied ? (
                            <>
                                <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white">✓</span>
                                </div>
                                <span>Copied to Clipboard!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4" />
                                <span>Copy Share Text</span>
                            </>
                        )}
                    </Button>
                </div>

                {/* Share Text Preview */}
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gold-400">Preview</h3>
                    <div className="bg-secondary/50 rounded-lg p-3 border border-gold-400/10">
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {shareText}
                        </p>
                    </div>
                </div>
            </div>
        </BottomSheet>
    );
}

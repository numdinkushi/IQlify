'use client';

import { HelpCircle, Mail, MessageCircle, Heart, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const SUPPORT_ADDRESS = '0xd3d42699a76760ac83a155eb483f5949b3095b3a' as const;

export function SupportContent() {
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        navigator.clipboard.writeText(SUPPORT_ADDRESS);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 text-sm text-foreground pb-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="h-5 w-5 text-gold-400" />
                    <h3 className="text-lg font-semibold text-gold-400">Support</h3>
                </div>
                <p className="text-muted-foreground">
                    We're here to help! Find answers to common questions or get in touch with our team.
                </p>
            </div>

            <section className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gold-400 mb-3 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Frequently Asked Questions
                    </h4>
                    <div className="space-y-3 text-muted-foreground">
                        <div>
                            <p className="font-medium text-foreground mb-1">How do I earn rewards?</p>
                            <p>Complete interview sessions and receive CELO tokens based on your performance. Higher scores and longer sessions typically earn more rewards.</p>
                        </div>
                        <div>
                            <p className="font-medium text-foreground mb-1">When will I receive my rewards?</p>
                            <p>Rewards are distributed immediately after claiming, sent directly to your connected wallet via smart contract.</p>
                        </div>
                        <div>
                            <p className="font-medium text-foreground mb-1">Can I use multiple wallets?</p>
                            <p>Each wallet address is treated as a separate account. Creating multiple accounts to exploit rewards violates our Terms of Service.</p>
                        </div>
                        <div>
                            <p className="font-medium text-foreground mb-1">What if my transaction fails?</p>
                            <p>If a transaction fails, no rewards are deducted. You can retry claiming after ensuring you have sufficient gas fees and are on the correct network.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gold-400 mb-3 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Contact Support
                    </h4>
                    <p className="text-muted-foreground mb-3">
                        Need help? Reach out to us through:
                    </p>
                    <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                        <li>In-app support (coming soon)</li>
                        <li>Email: support@iqlify.com</li>
                        <li>Discord community (coming soon)</li>
                    </ul>
                </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-gold-400/20">
                <div>
                    <h4 className="font-semibold text-gold-400 mb-3 flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Support the Project
                    </h4>
                    <p className="text-muted-foreground mb-4">
                        Love IQlify? Consider supporting our mission to help people master interviews while earning real money. Your contributions help us improve the platform and reach more users.
                    </p>
                    
                    <div className="bg-gold-400/10 border border-gold-400/30 rounded-lg p-4 space-y-3">
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Support Address (Celo Network):</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-background/50 px-3 py-2 rounded text-xs font-mono break-all">
                                    {SUPPORT_ADDRESS}
                                </code>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyAddress}
                                    className="border-gold-400/30 text-gold-400 flex-shrink-0"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-4 w-4 mr-1" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4 mr-1" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://celoscan.io/address/${SUPPORT_ADDRESS}`, '_blank')}
                                className="flex-1 border-gold-400/30 text-gold-400"
                            >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View on CeloScan
                            </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground pt-2 border-t border-gold-400/10">
                            💡 You can send CELO, cUSD, or any Celo network token to this address. Thank you for your support!
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-3 pt-4 border-t border-gold-400/20">
                <div>
                    <h4 className="font-semibold text-gold-400 mb-2">Report Issues</h4>
                    <p className="text-muted-foreground text-xs">
                        Found a bug or have a feature request? Let us know! Your feedback helps us build a better platform for everyone.
                    </p>
                </div>
            </section>
        </div>
    );
}


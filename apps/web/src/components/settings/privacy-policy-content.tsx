'use client';

import { Shield, Lock, Eye, FileText, Users, Globe } from 'lucide-react';

export function PrivacyPolicyContent() {
    return (
        <div className="space-y-6 text-sm text-foreground pb-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-gold-400" />
                    <h3 className="text-lg font-semibold text-gold-400">Privacy Policy</h3>
                </div>
                <p className="text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <section className="space-y-3">
                <div className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gold-400 mb-2">1. Information We Collect</h4>
                        <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                            <li><strong className="text-foreground">Wallet Address:</strong> Your blockchain wallet address is stored to process rewards and track your progress</li>
                            <li><strong className="text-foreground">Interview Data:</strong> Your interview responses, scores, and performance metrics</li>
                            <li><strong className="text-foreground">Usage Data:</strong> How you interact with the platform, including features used and time spent</li>
                            <li><strong className="text-foreground">Device Information:</strong> Basic device and browser information for compatibility</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-start gap-2">
                    <Eye className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gold-400 mb-2">2. How We Use Your Information</h4>
                        <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                            <li>Process and distribute rewards via Celo blockchain</li>
                            <li>Provide personalized interview experiences and feedback</li>
                            <li>Improve our services and develop new features</li>
                            <li>Maintain platform security and prevent fraud</li>
                            <li>Generate anonymized analytics and insights</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gold-400 mb-2">3. Data Sharing</h4>
                        <p className="text-muted-foreground mb-2">
                            We do not sell your personal information. We may share data only in these cases:
                        </p>
                        <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                            <li><strong className="text-foreground">Blockchain Transactions:</strong> Wallet addresses are publicly visible on the Celo blockchain</li>
                            <li><strong className="text-foreground">Service Providers:</strong> Trusted partners who help operate our platform (with strict confidentiality agreements)</li>
                            <li><strong className="text-foreground">Legal Requirements:</strong> When required by law or to protect our rights</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gold-400 mb-2">4. Blockchain & Decentralization</h4>
                        <p className="text-muted-foreground mb-2">
                            IQlify operates on the Celo blockchain, which means:
                        </p>
                        <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                            <li>Transaction data is immutable and publicly verifiable</li>
                            <li>You control your wallet and funds directly</li>
                            <li>We cannot reverse or modify blockchain transactions</li>
                            <li>Your wallet address may be visible in public blockchain explorers</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gold-400 mb-2">5. Your Rights</h4>
                        <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                            <li>Access your personal data stored on our platform</li>
                            <li>Request correction of inaccurate information</li>
                            <li>Request deletion of your account data (note: blockchain data cannot be deleted)</li>
                            <li>Opt-out of non-essential data collection</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gold-400 mb-2">6. Contact Us</h4>
                        <p className="text-muted-foreground">
                            For privacy-related questions or requests, please contact us through the Support section in Settings.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}


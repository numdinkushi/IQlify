'use client';

import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Gavel } from 'lucide-react';

export function TermsOfServiceContent() {
    return (
        <div className="space-y-6 text-sm text-foreground pb-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-gold-400" />
                    <h3 className="text-lg font-semibold text-gold-400">Terms of Service</h3>
                </div>
                <p className="text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <section className="space-y-3">
                <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gold-400 mb-2">1. Acceptance of Terms</h4>
                        <p className="text-muted-foreground">
                            By accessing and using IQlify, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use our service.
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-start gap-2">
                    <Scale className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gold-400 mb-2">2. Service Description</h4>
                        <p className="text-muted-foreground mb-2">
                            IQlify is an educational platform that provides:
                        </p>
                        <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                            <li>AI-powered interview practice sessions</li>
                            <li>Real-time feedback and performance analytics</li>
                            <li>Rewards in CELO tokens for completed interviews</li>
                            <li>Leaderboards and competitive features</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gold-400 mb-2">3. User Responsibilities</h4>
                        <p className="text-muted-foreground mb-2">You agree to:</p>
                        <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                            <li>Provide accurate information and maintain account security</li>
                            <li>Use the service only for lawful purposes</li>
                            <li>Not attempt to manipulate or game the reward system</li>
                            <li>Not share your account credentials with others</li>
                            <li>Respect intellectual property rights</li>
                            <li>Maintain the security of your blockchain wallet</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gold-400 mb-2">4. Prohibited Activities</h4>
                        <p className="text-muted-foreground mb-2">You may not:</p>
                        <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                            <li>Use automated systems or bots to complete interviews</li>
                            <li>Attempt to hack, reverse engineer, or compromise the platform</li>
                            <li>Create multiple accounts to exploit rewards</li>
                            <li>Share interview questions or answers publicly</li>
                            <li>Engage in any fraudulent or deceptive practices</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-start gap-2">
                    <Scale className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gold-400 mb-2">5. Rewards & Payments</h4>
                        <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                            <li>Rewards are distributed in CELO tokens via smart contract</li>
                            <li>Reward amounts are determined by interview performance and may vary</li>
                            <li>All transactions are final and irreversible once confirmed on blockchain</li>
                            <li>We reserve the right to adjust reward rates or suspend rewards for violations</li>
                            <li>You are responsible for any taxes on rewards received</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gold-400 mb-2">6. Disclaimers</h4>
                        <ul className="space-y-2 text-muted-foreground ml-4 list-disc">
                            <li>IQlify is provided "as is" without warranties of any kind</li>
                            <li>We do not guarantee interview success or job placement</li>
                            <li>Blockchain transactions may be subject to network fees and delays</li>
                            <li>We are not responsible for losses due to wallet security breaches</li>
                            <li>Service availability is not guaranteed and may be interrupted</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-start gap-2">
                    <Gavel className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gold-400 mb-2">7. Limitation of Liability</h4>
                        <p className="text-muted-foreground">
                            To the maximum extent permitted by law, IQlify and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-gold-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gold-400 mb-2">8. Changes to Terms</h4>
                        <p className="text-muted-foreground">
                            We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}


"use client";

import { useAccount, useBalance } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Copy, Phone, Wallet } from "lucide-react";

const cUSD_ADDRESS = "0x765de816845861e75a25fca122bb6898b8b1282a";
const USDC_ADDRESS = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";
const USDT_ADDRESS = "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e";

function BalanceDisplay({ address, token, symbol }: { address: `0x${string}`, token?: `0x${string}`, symbol: string; }) {
  const { data, isLoading } = useBalance({
    address,
    token,
  });

  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gold-400">{symbol}</span>
      <span className="font-semibold text-foreground">
        {isLoading ? (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border border-gold-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Loading...</span>
          </div>
        ) : (
          `${parseFloat(data?.formatted || '0').toFixed(4)}`
        )}
      </span>
    </div>
  );
}

function UserBalanceContent() {
  const { address, isConnected } = useAccount();
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    // Check if running in MiniPay
    if (typeof window !== 'undefined' && window.ethereum?.isMiniPay) {
      setIsMiniPay(true);

      // Try to get phone number from MiniPay (if available)
      // Note: This might not be available in all MiniPay versions
      try {
        // @ts-ignore
        if (window.ethereum?.minipay?.getPhoneNumber) {
          // @ts-ignore
          window.ethereum.minipay.getPhoneNumber().then(setPhoneNumber).catch(() => { });
        }
      } catch (error) {
        console.log('Phone number not available from MiniPay');
      }
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isConnected || !address) {
    return (
      <Card className="w-full max-w-md mx-auto mb-8 iqlify-card shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gold-400">Connect Your Wallet</CardTitle>
          <p className="text-sm text-muted-foreground pt-1">
            Connect your wallet to view your balance and start earning rewards!
          </p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mb-8 iqlify-card shadow-xl border-gold-400/20">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2 text-gold-400">
          <Wallet className="h-5 w-5 text-primary" />
          Balances
        </CardTitle>

        {/* Wallet Address */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Wallet Address:</p>
          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg border border-gold-400/10">
            <p className="text-sm font-mono text-foreground truncate flex-1">
              {address}
            </p>
            <button
              onClick={() => copyToClipboard(address)}
              className="p-2 hover:bg-gold-400/20 rounded-lg transition-colors"
              title="Copy address"
            >
              <Copy className="h-3 w-3 text-white" />
            </button>
          </div>
        </div>

        {/* Phone Number (if available) */}
        {isMiniPay && phoneNumber && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Phone Number:</p>
            <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg border border-gold-400/10">
              <Phone className="h-4 w-4 text-gold-400" />
              <p className="text-sm font-medium text-foreground">{phoneNumber}</p>
            </div>
          </div>
        )}

        {/* MiniPay Status */}
        {isMiniPay && (
          <div className="flex items-center gap-2 text-success text-sm font-medium">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            MiniPay Integration Active
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3 pt-4 border-t border-gold-400/20">
          <p className="text-sm font-semibold text-gold-400">Token Balances:</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/30 p-3 rounded-lg border border-gold-400/10">
              <BalanceDisplay address={address} symbol="CELO" token={undefined} />
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg border border-gold-400/10">
              <BalanceDisplay address={address} token={cUSD_ADDRESS} symbol="cUSD" />
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg border border-gold-400/10">
              <BalanceDisplay address={address} token={USDC_ADDRESS} symbol="USDC" />
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg border border-gold-400/10">
              <BalanceDisplay address={address} token={USDT_ADDRESS} symbol="USDT" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UserBalance() {
  return <UserBalanceContent />;
}

"use client";

import { ConnectButton as RainbowKitConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export function ConnectButton() {
  const [isMinipay, setIsMinipay] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
    // Only detect MiniPay if we're actually in the MiniPay environment
    // Check for specific MiniPay user agent or other indicators
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMinipayEnv = userAgent.includes('minipay') ||
        window.ethereum?.isMiniPay ||
        window.location.hostname.includes('minipay');

      setIsMinipay(isMinipayEnv);
    }
  }, []);

  if (!mounted) {
    return <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />;
  }

  // In MiniPay environment, show connection status based on actual wallet state
  if (isMinipay && typeof window !== 'undefined' && window.ethereum?.isMiniPay) {
    if (isConnected && address) {
      return (
        <div className="px-4 py-2 bg-success/20 text-success rounded-lg text-sm font-semibold border border-success/30 flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          MiniPay Connected
        </div>
      );
    } else {
      // Show connect button when disconnected in MiniPay
      return (
        <div className="rainbowkit-custom">
          <RainbowKitConnectButton />
        </div>
      );
    }
  }

  return (
    <div className="rainbowkit-custom">
      <RainbowKitConnectButton />
    </div>
  );
}

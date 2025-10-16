"use client";

import { ConnectButton as RainbowKitConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";

export function ConnectButton() {
  const [isMinipay, setIsMinipay] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // @ts-ignore
    if (typeof window !== 'undefined' && window.ethereum?.isMiniPay) {
      setIsMinipay(true);
    }
  }, []);

  if (!mounted) {
    return <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />;
  }

  if (isMinipay) {
    return (
      <div className="px-4 py-2 bg-success/20 text-success rounded-lg text-sm font-semibold border border-success/30 flex items-center gap-2">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        MiniPay Connected
      </div>
    );
  }

  return (
    <div className="rainbowkit-custom">
      <RainbowKitConnectButton />
    </div>
  );
}

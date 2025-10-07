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
      <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium">
        MiniPay Connected
      </div>
    );
  }

  return <RainbowKitConnectButton />;
}

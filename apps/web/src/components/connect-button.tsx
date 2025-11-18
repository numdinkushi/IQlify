"use client";

import { ConnectButton as RainbowKitConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "next-intl";

export function ConnectButton() {
  const [isMinipay, setIsMinipay] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const t = useTranslations();
  const buttonRef = useRef<HTMLDivElement>(null);
  const connectWalletText = t('common.connectWallet');

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

  // Update button text with translation
  useEffect(() => {
    if (!mounted || isConnected) return;
    
    const updateButtonText = () => {
      if (buttonRef.current) {
        // Try multiple selectors to find the button
        const button = buttonRef.current.querySelector('button[data-testid="rk-connect-button"]') as HTMLButtonElement ||
                      buttonRef.current.querySelector('button') as HTMLButtonElement;
        
        if (button && !isConnected) {
          // Get all text nodes and elements that might contain the button text
          const allTextElements: (HTMLElement | Text)[] = [];
          
          // Collect all spans
          button.querySelectorAll('span').forEach(span => allTextElements.push(span));
          
          // Collect all divs
          button.querySelectorAll('div').forEach(div => allTextElements.push(div));
          
          // Collect text nodes directly in button
          const walker = document.createTreeWalker(
            button,
            NodeFilter.SHOW_TEXT,
            null
          );
          let node;
          while (node = walker.nextNode()) {
            allTextElements.push(node as Text);
          }
          
          // Update any element that has text content different from our translation
          allTextElements.forEach(element => {
            if (element.textContent && 
                element.textContent.trim().length > 0 && 
                element.textContent.trim() !== connectWalletText &&
                (element.textContent.includes('Connect') || 
                 element.textContent.includes('连接') || 
                 element.textContent.includes('接続') ||
                 element.textContent.includes('Conectar') ||
                 element.textContent.includes('Verbinden') ||
                 element.textContent.includes('Connessione') ||
                 element.textContent.includes('Conecte') ||
                 element.textContent.includes('Connectez') ||
                 element.textContent.includes('Connetti') ||
                 element.textContent.includes('ウォレット') ||
                 element.textContent.includes('지갑') ||
                 element.textContent.includes('钱包') ||
                 element.textContent.includes('محفظة'))) {
              if (element instanceof Text) {
                element.textContent = connectWalletText;
              } else {
                element.textContent = connectWalletText;
              }
            }
          });
          
          // Fallback: update button text directly if it's different from translation
          if (button.textContent && 
              button.textContent.trim() !== connectWalletText &&
              (button.textContent.includes('Connect') || 
               button.textContent.includes('连接') || 
               button.textContent.includes('接続') ||
               button.textContent.includes('Conectar') ||
               button.textContent.includes('Verbinden') ||
               button.textContent.includes('Connessione'))) {
            button.textContent = connectWalletText;
          }
        }
      }
    };

    // Update immediately with a small delay to let RainbowKit render
    const timeoutId = setTimeout(updateButtonText, 100);
    updateButtonText();

    // Use MutationObserver to catch when RainbowKit updates the button
    if (buttonRef.current) {
      const observer = new MutationObserver(() => {
        // Add a small delay to ensure RainbowKit has finished updating
        setTimeout(updateButtonText, 50);
      });
      observer.observe(buttonRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
      });

      // Also set up an interval as a fallback
      const intervalId = setInterval(updateButtonText, 500);

      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        observer.disconnect();
      };
    }
    
    return () => clearTimeout(timeoutId);
  }, [mounted, isConnected, connectWalletText]);

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
        <div className="rainbowkit-custom" ref={buttonRef} data-connect-text={connectWalletText}>
          <RainbowKitConnectButton />
        </div>
      );
    }
  }

  return (
    <div className="rainbowkit-custom" ref={buttonRef} data-connect-text={connectWalletText}>
      <RainbowKitConnectButton />
    </div>
  );
}

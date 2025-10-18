"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { useAccount } from "wagmi";

import { ConnectButton } from "@/components/connect-button";
import { AvatarIcon } from "@/components/avatar-icon";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Docs", href: "https://docs.celo.org", external: true },
];

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold-400/20 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-12 max-w-screen-2xl items-center justify-between px-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image
            src="/assets/logo/logo.png"
            alt="IQlify Logo"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="font-bold text-base iqlify-gold-text">
            IQlify
          </span>
        </Link>

        {/* Right side - Connect Button or Avatar */}
        <div className="flex items-center gap-3">
          {isConnected && address ? (
            <AvatarIcon />
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
    </header>
  );
}

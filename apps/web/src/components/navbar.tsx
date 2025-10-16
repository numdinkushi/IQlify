"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ConnectButton } from "@/components/connect-button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Docs", href: "https://docs.celo.org", external: true },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold-400/20 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-gold-400/20">
                <Menu className="h-5 w-5 text-gold-400" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 iqlify-card border-gold-400/20">
              <div className="flex items-center gap-2 mb-8">
                <Image
                  src="/assets/logo/logo.png"
                  alt="IQlify Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="font-bold text-lg iqlify-gold-text">
                  IQlify
                </span>
              </div>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={`flex items-center gap-2 text-base font-medium transition-colors hover:text-gold-400 ${pathname === link.href ? "text-gold-400" : "text-foreground/70"
                      }`}
                  >
                    {link.name}
                    {link.external && <ExternalLink className="h-4 w-4" />}
                  </Link>
                ))}
                <div className="mt-6 pt-6 border-t border-gold-400/20">
                  <Button asChild className="w-full iqlify-button-primary">
                    <ConnectButton />
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/assets/logo/logo.png"
              alt="IQlify Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold text-lg sm:text-xl iqlify-gold-text -ml-2">
              IQlify
            </span>
          </Link>
        </div>

        {/* Mobile Connect Wallet Button */}
        <div className="flex md:hidden">
          <ConnectButton />
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-gold-400 ${pathname === link.href
                ? "text-gold-400"
                : "text-foreground/70"
                }`}
            >
              {link.name}
              {link.external && <ExternalLink className="h-4 w-4" />}
            </Link>
          ))}

          <div className="flex items-center gap-3">
            <ConnectButton />
          </div>
        </nav>
      </div>
    </header>
  );
}

"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserBalance } from "@/components/user-balance";
import { Zap } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

export default function Home() {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  useEffect(() => {
    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Explain how AI works in a few words",
      });
      console.log(response.text);
    }

    main();
  }, []);



  return (
    <main className="flex-1 iqlify-grid-bg">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-semibold iqlify-gold-gradient text-primary-foreground rounded-full border border-gold-400/30 shadow-lg"
            >
              <Zap className="h-4 w-4" />
              Built on Celo
            </div>

            {/* Main Heading */}
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Welcome to{" "}
              <span className="iqlify-gold-text">IQlify</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              IQlify is a mobile-first educational quiz game that teaches through gamified learning while rewarding users with instant cUSD payments via MiniPay integration and CELO tokens.
            </p>

            {/* User Balance Display */}
            <UserBalance />

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Button size="lg" className="iqlify-button-primary px-8 py-3 text-base font-medium rounded-xl">
                Start Learning & Earning
              </Button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

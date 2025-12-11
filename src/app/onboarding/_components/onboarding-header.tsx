"use client";

import Link from "next/link";
import { ClipstartLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function OnboardingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-17.5 border-b border-white/10 bg-[#0C1118]">
      <div className="flex items-center justify-between h-full py-4 px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <ClipstartLogo className="h-8.5 w-8.5" />
          <div className="text-left">
            <h1 className="text-base font-bold text-white leading-none mt-0.75">Clipstart</h1>
            <p className="text-xs text-[#BCBCBC] leading-none mt-1">Learning Hub</p>
          </div>
        </Link>

        <Button
          variant="outline"
          className="h-8.5 px-3 py-2.5 bg-[#1A2233] hover:bg-[#1A2233]/80 border-[#2E3A53] text-white font-medium text-xs leading-none rounded-[0.625rem] transition-colors"
        >
          Contact Us
        </Button>
      </div>
    </header>
  );
}

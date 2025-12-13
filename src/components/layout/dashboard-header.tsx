"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName: string;
  userAvatar?: string | null;
  activeCount: number;
  activeLabel: string; // "campaigns" for business, "clips" for clipper
}

export function DashboardHeader({ userName, userAvatar, activeCount, activeLabel }: DashboardHeaderProps) {
  return (
    <header className="h-17.5 border-b border-white/10 bg-[#0C1118]">
      <div className="flex items-center justify-between h-full px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 rounded-full overflow-hidden bg-[#1E2738]">
            {userAvatar ? (
              <Image src={userAvatar} alt={userName} fill className="object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-white/50 text-lg font-medium">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-[#D5DAE8] leading-none">Hello {userName}</span>
            <span className="text-xs text-[#767D8E] leading-none font-normal mt-0.5">
              Active: <span className="text-[#A1A6B4] font-medium">{activeCount}</span> {activeLabel}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="h-8.5 px-3 py-2.5 bg-[#1A2233] hover:bg-[#1A2233]/80 border border-[#2E3A53] text-[#DFE7FB] leading-none font-medium text-xs rounded-[0.625rem] transition-colors"
        >
          Contact Us
        </Button>
      </div>
    </header>
  );
}

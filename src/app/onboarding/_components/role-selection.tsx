"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Role = "business" | "clipper";

export function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<Role>("business");

  const handleContinue = () => {
    console.log("Selected role:", selectedRole);
  };

  return (
    <div className="flex flex-col items-center space-y-18.25">
      <h1 className="text-[2.375rem] font-bold text-white leading-none">Are you a...</h1>

      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() => setSelectedRole("business")}
          className={cn(
            "relative w-72.75 h-45.5 rounded-[1.25rem] transition-all duration-200",
            "bg-[#5079F0] hover:bg-[#5079F0]/90",
            selectedRole === "business" && "border border-white shadow-[0_0.375rem_1.14375rem_0_#FFFFFF42]"
          )}
        >
          <div className="absolute top-4 left-4">
            <div
              className={cn(
                "w-4.5 h-4.5 rounded-full flex items-center justify-center",
                selectedRole === "business" ? "bg-white" : "border-[0.109rem] border-white"
              )}
            >
              {selectedRole === "business" && (
                <div className="w-3.75 h-3.75 rounded-full border-[0.188rem] border-[#5079F0] bg-transparent" />
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center h-full pt-4">
            <span className="text-4xl font-bold leading-none text-white">Business</span>
            <span className="text-[1.125rem] leading-5.5 text-white/80 mt-1">Paying for views</span>
          </div>
        </button>

        <span className="text-white/90 text-2xl font-semibold leading-none">or</span>

        <button
          type="button"
          onClick={() => setSelectedRole("clipper")}
          className={cn(
            "relative w-72.75 h-45.5 rounded-[1.25rem] transition-all duration-200",
            "bg-[#39D67C] hover:bg-[#39D67C]/90",
            selectedRole === "clipper" && "border border-white shadow-[0_0.375rem_1.14375rem_0_#FFFFFF42]"
          )}
        >
          <div className="absolute top-4 left-4">
            <div
              className={cn(
                "w-4.5 h-4.5 rounded-full flex items-center justify-center",
                selectedRole === "clipper" ? "bg-white" : "border-[0.109rem] border-white"
              )}
            >
              {selectedRole === "clipper" && (
                <div className="w-3.75 h-3.75 rounded-full border-[0.188rem] border-[#39D67C] bg-transparent" />
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center h-full pt-4">
            <span className="text-4xl font-bold leading-none text-white">Clipper</span>
            <span className="text-[1.125rem] leading-5.5 text-white/80 mt-1">Getting paid for views</span>
          </div>
        </button>
      </div>

      <Button
        onClick={handleContinue}
        className="border border-[#2D3A5A] w-35 h-9.5 bg-[linear-gradient(135deg,#3B14B8_70.71%,#4318D1_0%)] hover:bg-[linear-gradient(135deg,#3B14B8_70.71%,#4318D1_0%)]/90 text-white font-bold text-base leading-[1.688rem] rounded-lg transition-colors"
      >
        Continue
      </Button>
    </div>
  );
}

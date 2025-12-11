"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { assignRoleAction } from "@/lib/actions/auth.actions";
import { cn } from "@/lib/utils";

type Role = "business" | "clipper";

export function RoleSelection() {
  const router = useRouter();
  const { update } = useSession();
  const [selectedRole, setSelectedRole] = useState<Role>("business");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await assignRoleAction(selectedRole);

      if (!result.success) {
        setError(result.error || "Failed to assign role");
        setIsSubmitting(false);
        return;
      }

      // Update the session with the new role
      await update({ role: selectedRole });

      if (result.redirectTo) {
        router.push(result.redirectTo);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-18.25">
      <h1 className="text-[2.375rem] font-bold text-white leading-none">Are you a...</h1>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 w-full max-w-md">
          <p className="text-sm text-red-500 text-center">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() => setSelectedRole("business")}
          disabled={isSubmitting}
          className={cn(
            "relative w-72.75 h-45.5 rounded-[1.25rem] transition-all duration-200",
            "bg-[#5079F0] hover:bg-[#5079F0]/90",
            selectedRole === "business" && "border border-white shadow-[0_0.375rem_1.14375rem_0_#FFFFFF42]",
            isSubmitting && "opacity-50 cursor-not-allowed"
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
          disabled={isSubmitting}
          className={cn(
            "relative w-72.75 h-45.5 rounded-[1.25rem] transition-all duration-200",
            "bg-[#39D67C] hover:bg-[#39D67C]/90",
            selectedRole === "clipper" && "border border-white shadow-[0_0.375rem_1.14375rem_0_#FFFFFF42]",
            isSubmitting && "opacity-50 cursor-not-allowed"
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
        disabled={isSubmitting}
        className="border border-[#2D3A5A] w-35 h-9.5 bg-[linear-gradient(135deg,#3B14B8_70.71%,#4318D1_0%)] hover:bg-[linear-gradient(135deg,#3B14B8_70.71%,#4318D1_0%)]/90 text-white font-bold text-base leading-[1.688rem] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Processing..." : "Continue"}
      </Button>
    </div>
  );
}

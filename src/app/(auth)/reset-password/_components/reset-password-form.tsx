"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ClipstartLogo } from "@/components/icons";
import { PasswordInput } from "../../_components/password-input";
import { resetPasswordSchema, type ResetPasswordFormData } from "../_schemas/reset-password.schema";
import { verifyResetTokenAction, resetPasswordAction } from "@/lib/actions/auth.actions";
import { cn } from "@/lib/utils";

type PageState = "loading" | "invalid" | "valid" | "success";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [serverError, setServerError] = useState<string | null>(null);

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    async function verifyToken() {
      if (!email || !token) {
        setPageState("invalid");
        return;
      }

      const result = await verifyResetTokenAction(email, token);

      if (!result.success) {
        setServerError(result.error || "Invalid or expired reset link.");
        setPageState("invalid");
        return;
      }

      setPageState("valid");
    }

    verifyToken();
  }, [email, token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError(null);

    const result = await resetPasswordAction(email, token, data.password);

    if (!result.success) {
      setServerError(result.error || "Failed to reset password");
      return;
    }

    setPageState("success");

    // Auto-redirect to login after 3 seconds
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };

  // Loading state
  if (pageState === "loading") {
    return (
      <div className="w-full max-w-116 space-y-7.5 rounded-[1.25rem] shadow-[0_0_1.25rem_0_#2D3A5A61] border border-[#2D3A5A] bg-[linear-gradient(90deg,#101522_100%,#161C2A_0%)] px-5.5 py-6.5">
        <div className="flex flex-col gap-7.5 items-center text-center">
          <div className="flex items-center justify-center gap-2.5">
            <ClipstartLogo className="h-11 w-11" />
            <div className="text-left">
              <h1 className="text-[1.375rem] font-bold text-white leading-none tracking-normal">Clipstart</h1>
              <p className="text-base text-[#BCBCBC]">Learning Hub</p>
            </div>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-[1.625rem] font-bold text-white leading-9.75">Verifying Link...</h2>
            <p className="text-sm leading-4.5 text-white/70 font-normal">Please wait while we verify your reset link</p>
          </div>
        </div>

        <div className="flex justify-center py-8">
          <div className="h-8 w-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (pageState === "invalid") {
    return (
      <div className="w-full max-w-116 space-y-7.5 rounded-[1.25rem] shadow-[0_0_1.25rem_0_#2D3A5A61] border border-[#2D3A5A] bg-[linear-gradient(90deg,#101522_100%,#161C2A_0%)] px-5.5 py-6.5">
        <div className="flex flex-col gap-7.5 items-center text-center">
          <div className="flex items-center justify-center gap-2.5">
            <ClipstartLogo className="h-11 w-11" />
            <div className="text-left">
              <h1 className="text-[1.375rem] font-bold text-white leading-none tracking-normal">Clipstart</h1>
              <p className="text-base text-[#BCBCBC]">Learning Hub</p>
            </div>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-[1.625rem] font-bold text-white leading-9.75">Invalid Reset Link</h2>
            <p className="text-sm leading-4.5 text-white/70 font-normal">
              {serverError || "This password reset link is invalid or has expired."}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Link
            href="/forgot-password"
            className="flex items-center justify-center w-full h-10.25 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold text-base leading-5.25 rounded-[0.625rem] transition-colors"
          >
            Request New Reset Link
          </Link>

          <p className="text-center text-base leading-5 text-white/70 font-normal">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-[#5079F0] hover:text-[#5079F0]/80 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (pageState === "success") {
    return (
      <div className="w-full max-w-116 space-y-7.5 rounded-[1.25rem] shadow-[0_0_1.25rem_0_#2D3A5A61] border border-[#2D3A5A] bg-[linear-gradient(90deg,#101522_100%,#161C2A_0%)] px-5.5 py-6.5">
        <div className="flex flex-col gap-7.5 items-center text-center">
          <div className="flex items-center justify-center gap-2.5">
            <ClipstartLogo className="h-11 w-11" />
            <div className="text-left">
              <h1 className="text-[1.375rem] font-bold text-white leading-none tracking-normal">Clipstart</h1>
              <p className="text-base text-[#BCBCBC]">Learning Hub</p>
            </div>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-[1.625rem] font-bold text-white leading-9.75">Password Reset!</h2>
            <p className="text-sm leading-4.5 text-white/70 font-normal">Your password has been successfully reset.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-[0.625rem] bg-[#0D2818] border border-[#1A5D3A]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#1A5D3A] flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-[#4ADE80]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-[#86EFAC] text-center font-medium">Redirecting you to sign in...</p>
            </div>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center w-full h-10.25 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold text-base leading-5.25 rounded-[0.625rem] transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  // Valid token - show reset form
  return (
    <div className="w-full max-w-116 space-y-7.5 rounded-[1.25rem] shadow-[0_0_1.25rem_0_#2D3A5A61] border border-[#2D3A5A] bg-[linear-gradient(90deg,#101522_100%,#161C2A_0%)] px-5.5 py-6.5">
      <div className="flex flex-col gap-7.5 items-center text-center">
        <div className="flex items-center justify-center gap-2.5">
          <ClipstartLogo className="h-11 w-11" />
          <div className="text-left">
            <h1 className="text-[1.375rem] font-bold text-white leading-none tracking-normal">Clipstart</h1>
            <p className="text-base text-[#BCBCBC]">Learning Hub</p>
          </div>
        </div>
        <div className="space-y-0.5">
          <h2 className="text-[1.625rem] font-bold text-white leading-9.75">Reset Password</h2>
          <p className="text-sm leading-4.5 text-white/70 font-normal">Enter your new password below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-[#FFBABE] text-center">{serverError}</p>
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-white leading-4">New Password</Label>
          <PasswordInput
            placeholder="Enter your new password"
            autoComplete="new-password"
            error={!!errors.password}
            {...register("password")}
          />
          {errors.password && <p className="text-xs text-[#FFBABE] mt-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-white leading-4">Confirm Password</Label>
          <PasswordInput
            placeholder="Confirm your new password"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p className="text-xs text-[#FFBABE] mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full h-10.25 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold text-base leading-5.25 rounded-[0.625rem] transition-colors"
          )}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>

        <p className="text-center text-base leading-5 text-white/70 font-normal">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-[#5079F0] hover:text-[#5079F0]/80 transition-colors">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

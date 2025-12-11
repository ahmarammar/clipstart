"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ClipstartLogo } from "@/components/icons";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../_schemas/forgot-password.schema";
import { forgotPasswordAction } from "@/lib/actions/auth.actions";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);

    const result = await forgotPasswordAction(data.email);

    if (!result.success) {
      setServerError(result.error || "Failed to send reset link");
      return;
    }

    setSubmittedEmail(data.email);
    setIsSuccess(true);
  };

  if (isSuccess) {
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
            <h2 className="text-[1.625rem] font-bold text-white leading-9.75">Check Your Email</h2>
            <p className="text-sm leading-4.5 text-white/70 font-normal">
              We&apos;ve sent a password reset link to
            </p>
            <p className="text-sm leading-4.5 text-[#5079F0] font-medium">
              {submittedEmail}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-[#1A2336] border border-[#2E3A53]">
            <p className="text-sm text-white/70 text-center">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setSubmittedEmail("");
                }}
                className="text-[#5079F0] hover:text-[#5079F0]/80 transition-colors font-medium"
              >
                try again
              </button>
            </p>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center w-full h-10.25 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold text-base leading-5.25 rounded-[0.625rem] transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

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
          <h2 className="text-[1.625rem] font-bold text-white leading-9.75">Forgot Password?</h2>
          <p className="text-sm leading-4.5 text-white/70 font-normal">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-white leading-4">Email</Label>
          <input
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            className={cn(
              "flex h-10 w-full rounded-[0.625rem] border border-[#2E3A53] bg-[#1A2336] py-3 px-3.5 leading-4 text-sm text-white placeholder:text-white/40 transition-colors disabled:cursor-not-allowed focus:outline-none disabled:opacity-50",
              errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10.25 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold text-base leading-5.25 rounded-[0.625rem] transition-colors"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
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

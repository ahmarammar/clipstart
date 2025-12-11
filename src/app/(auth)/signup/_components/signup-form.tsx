"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ClipstartLogo, GoogleIcon, FacebookIcon } from "@/components/icons";
import { PasswordInput } from "../../_components/password-input";
import { signupSchema, type SignupFormData } from "../_schemas/signup.schema";
import { signupAction } from "@/lib/actions/auth.actions";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSocialLoading, setIsSocialLoading] = useState<
    "google" | "facebook" | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);

    const result = await signupAction(data.name, data.email, data.password);

    if (!result.success) {
      setServerError(result.error || "Registration failed");
      return;
    }

    if (result.redirectTo) {
      router.push(result.redirectTo);
    }
  };

  // Handle Google signup via NextAuth
  const handleGoogleSignup = async () => {
    setIsSocialLoading("google");
    setServerError(null);

    try {
      await signIn("google", { callbackUrl: "/onboarding" });
    } catch {
      setServerError("Google sign up failed. Please try again.");
      setIsSocialLoading(null);
    }
  };

  // Handle Facebook signup via NextAuth
  const handleFacebookSignup = async () => {
    setIsSocialLoading("facebook");
    setServerError(null);

    try {
      await signIn("facebook", { callbackUrl: "/onboarding" });
    } catch {
      setServerError("Facebook sign up failed. Please try again.");
      setIsSocialLoading(null);
    }
  };

  const isLoading = isSubmitting || isSocialLoading !== null;

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
          <h2 className="text-[1.625rem] font-bold text-white leading-9.75">Create Your Account</h2>
          <p className="text-sm leading-4.5 text-white/70 font-normal">
            Please enter your information to get started now
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
          <Label className="text-sm font-medium text-white leading-4">Full Name</Label>
          <input
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            className={cn(
              "flex h-10 w-full rounded-[0.625rem] border border-[#2E3A53] bg-[#1A2336] py-3 px-3.5 leading-4 text-sm text-white placeholder:text-white/40 transition-colors disabled:cursor-not-allowed focus:outline-none disabled:opacity-50",
              errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

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

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-white leading-4">Create Password</Label>
          <PasswordInput
            placeholder="Enter your password"
            autoComplete="new-password"
            error={!!errors.password}
            {...register("password")}
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-white leading-4">Re-enter Password</Label>
          <PasswordInput
            placeholder="Enter your password again"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10.25 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold text-base leading-5.25 rounded-[0.625rem] transition-colors"
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 top-0.5 flex items-center">
            <div className="w-full border-t border-[#2E3A53]"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 text-sm text-white/50 bg-[linear-gradient(90deg,#101522_100%,#161C2A_0%)]">Or</span>
          </div>
        </div>

        <div className="flex gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="flex-1 h-11 bg-[#1A2336] hover:bg-[#1A2336]/80 border-[#2E3A53] text-white font-medium text-sm leading-4 rounded-[0.625rem] transition-colors"
          >
            <GoogleIcon className="mr-2.75 h-5 w-5" />
            {isSocialLoading === "google" ? "Signing up..." : "Sign Up with Google"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleFacebookSignup}
            disabled={isLoading}
            className="flex-1 h-11 bg-[#1A2336] hover:bg-[#1A2336]/80 border-[#2E3A53] text-white font-medium text-sm leading-4 rounded-[0.625rem] transition-colors"
          >
            <FacebookIcon className="mr-2.75 h-5 w-5" />
            {isSocialLoading === "facebook" ? "Signing up..." : "Sign Up with Facebook"}
          </Button>
        </div>

        <p className="text-center text-base leading-5 text-white/70 font-normal">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#5079F0] hover:text-[#5079F0]/80 transition-colors">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

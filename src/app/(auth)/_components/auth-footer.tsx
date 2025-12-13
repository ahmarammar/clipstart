"use client";

import Link from "next/link";

export function AuthFooter() {
  return (
    <footer className="sticky bottom-0 left-0 right-0 py-6 text-center z-10">
      <p className="text-sm leading-4.5 font-normal text-white/50">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="text-[#5079F0] hover:text-[#5079F0]/80 transition-colors">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-[#5079F0] hover:text-[#5079F0]/80 transition-colors">
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
}

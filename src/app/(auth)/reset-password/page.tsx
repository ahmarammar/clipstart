import { Suspense } from "react";
import { ResetPasswordForm } from "./_components/reset-password-form";
import { AuthFooter } from "../_components/auth-footer";

function ResetPasswordContent() {
  return <ResetPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
      <Suspense
        fallback={
          <div className="w-full max-w-116 space-y-7.5 rounded-[1.25rem] shadow-[0_0_1.25rem_0_#2D3A5A61] border border-[#2D3A5A] bg-[linear-gradient(90deg,#101522_100%,#161C2A_0%)] px-5.5 py-6.5">
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
      <AuthFooter />
    </main>
  );
}

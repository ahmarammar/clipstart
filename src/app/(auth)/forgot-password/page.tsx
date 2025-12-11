import { ForgotPasswordForm } from "./_components/forgot-password-form";
import { AuthFooter } from "../_components/auth-footer";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <ForgotPasswordForm />
      <AuthFooter />
    </main>
  );
}

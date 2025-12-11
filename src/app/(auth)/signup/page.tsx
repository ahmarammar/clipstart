import { SignupForm } from "./_components/signup-form";
import { AuthFooter } from "../_components/auth-footer";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <SignupForm />
      <AuthFooter />
    </main>
  );
}

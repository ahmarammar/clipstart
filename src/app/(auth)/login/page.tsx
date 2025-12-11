import { LoginForm } from "./_components/login-form";
import { AuthFooter } from "../_components/auth-footer";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <LoginForm />
      <AuthFooter />
    </main>
  );
}

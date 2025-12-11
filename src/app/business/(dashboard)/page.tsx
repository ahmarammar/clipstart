import { auth, type AuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function BusinessDashboardPage() {
  const session = (await auth()) as AuthSession | null;

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "business") {
    redirect("/clipper");
  }

  return (
    <div className="min-h-screen bg-[#0C101A]">
      <header className="border-b border-[#2D3A5A] bg-[#11151D]">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Business Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-white/70">Welcome, {session.user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-[#11151D] rounded-xl border border-[#2D3A5A] p-8">
          <h2 className="text-4xl font-bold text-[#5079F0] mb-4">Business</h2>
          <p className="text-white/70 text-lg">
            Welcome to your Business dashboard. Here you can manage your campaigns and track performance.
          </p>
          <div className="mt-6 p-4 bg-[#1A2336] rounded-lg border border-[#2E3A53]">
            <p className="text-white/50 text-sm">
              User ID: {session.user.id}
            </p>
            <p className="text-white/50 text-sm">
              Email: {session.user.email}
            </p>
            <p className="text-white/50 text-sm">
              Role: {session.user.role}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

import { auth, type AuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { businessNavigation } from "@/config/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export default async function BusinessLayout({ children }: { children: React.ReactNode }) {
  const session = (await auth()) as AuthSession | null;

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "business") {
    redirect("/clipper");
  }

  return (
    <div className="min-h-screen">
      <Sidebar sections={businessNavigation} />
      <div className="min-h-screen pl-67 bg-[linear-gradient(232.97deg,#0F1218_0.25%,#0F131D_16.99%,#10141D_39.48%,#10141D_61.96%,#0F131D_83.96%,#0F1218_99.75%)]">
        <div className="sticky top-0 left-67 right-0 z-50">
          <DashboardHeader
            userName={session?.user.name || "User"}
            userAvatar={null}
            activeCount={5}
            activeLabel="campaigns"
          />
        </div>
        {children}
      </div>
    </div>
  );
}

import { auth, type AuthSession } from "@/lib/auth";
import { MyInformationForm } from "@/components/account/my-information-form";

export default async function AccountPage() {
  const session = (await auth()) as AuthSession | null;

  return (
    <main>
      <MyInformationForm
        initialName={session?.user.name || ""}
        email={session?.user.email || ""}
        role={session?.user.role || ""}
      />
    </main>
  );
}

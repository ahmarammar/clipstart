import { OnboardingHeader } from "./_components/onboarding-header";
import { RoleSelection } from "./_components/role-selection";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(232.97deg,#11151D_16.99%,#11151D_39.48%,#11151D_61.96%,#11151D_83.96%,#11151D_99.75%)]">
      <OnboardingHeader />
      <main className="flex items-center justify-center min-h-screen pt-17.5">
        <RoleSelection />
      </main>
    </div>
  );
}

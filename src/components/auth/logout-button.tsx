"use client";

import { logoutAction } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant="outline"
        className="bg-transparent border-[#2E3A53] text-white hover:bg-[#1A2336] hover:text-white"
      >
        Sign Out
      </Button>
    </form>
  );
}

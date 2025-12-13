"use client";

import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { ClipstartLogo } from "@/components/icons";
import { SidebarNavItem, type NavItem } from "./sidebar-nav-item";
import { logoutAction } from "@/lib/actions/auth.actions";

export type SidebarSection = {
  title?: string;
  items: NavItem[];
};

interface SidebarProps {
  sections: SidebarSection[];
}

export function Sidebar({ sections }: SidebarProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-67 bg-[linear-gradient(190.77deg,#101521_0.22%,#0C101A_51.91%,#0B0F1A_99.78%)] border-r border-white/6 flex flex-col">
      <div className="relative top-6.5 left-8">
        <Link href="/" className="flex items-center gap-2.5">
          <ClipstartLogo className="h-8.75 w-8.5 rounded-[0.625rem]" />
          <div className="text-left">
            <h1 className="text-[1.125rem] font-bold text-white leading-none">Clipstart</h1>
            <p className="text-xs text-[#BCBCBC] leading-none mt-1">Learning Hub</p>
          </div>
        </Link>
      </div>

      <nav className="absolute top-23 left-4.5 flex-1 space-y-5 w-58 overflow-y-auto">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            {section.title && (
              <h2 className="px-4 mb-3 text-xs font-semibold text-[#5079F0] uppercase tracking-wider">
                {section.title}
              </h2>
            )}
            <div className="space-y-3">
              {section.items.map((item) => (
                <SidebarNavItem key={item.href} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="absolute bottom-8 left-4.5 w-58">
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          <Image
            src="/logout.svg"
            alt="Logout"
            width={0}
            height={0}
            className="w-6 h-6"
            style={{ filter: "opacity(0.5)" }}
          />
          <span className="text-base font-medium">
            {isPending ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}

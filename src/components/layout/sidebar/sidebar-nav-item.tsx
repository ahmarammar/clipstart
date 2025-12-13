"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: {
    type: "new" | "count";
    value: string | number;
  };
  showIndicator?: boolean;
};

interface SidebarNavItemProps {
  item: NavItem;
}

export function SidebarNavItem({ item }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center justify-between min-h-10.5 px-3.5 py-2.5 rounded-[0.625rem] transition-colors group",
        isActive
          ? "shadow-[0_0_1.25rem_0_#2D3A5A61] bg-[linear-gradient(178.92deg,#161C2A_0.92%,#101522_99.08%)] border border-[#2D3A5A]"
          : "hover:bg-[#1A2747]/50"
      )}
    >
      <div className="flex items-center gap-2">
        <Image
          src={item.icon}
          alt={item.label}
          width={0}
          height={0}
          sizes="100vw"
          className="w-auto h-auto transition-all"
          style={{
            filter: isActive
              ? "brightness(0) saturate(100%) invert(42%) sepia(70%) saturate(845%) hue-rotate(191deg) brightness(100%) contrast(100%)"
              : "brightness(0) invert(1)",
          }}
        />
        <span
          className={cn(
            "text-base font-normal leading-none transition-colors",
            isActive ? "text-[#5079F0]" : "text-white/50 group-hover:text-white/70"
          )}
        >
          {item.label}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {item.badge?.type === "new" && (
          <>
            <span className="p-1 h-4.5 flex items-center justify-center text-xs font-medium leading-4.5 text-[#161C2A] bg-[#FE7131] rounded-[0.875rem]">
              New
            </span>
            <span className="flex items-center justify-center min-w-5.75 h-5.5 px-2 py-0.5 text-xs leading-4.5 font-medium text-[#91A1C3] bg-[#1E2738] rounded-md">
              {item.badge.value}
            </span>
          </>
        )}
        {item.badge?.type === "count" && (
          <span className="flex items-center justify-center min-w-5.75 h-5.5 px-2 py-0.5 text-xs leading-4.5 font-medium text-[#91A1C3] bg-[#1E2738] rounded-md">
            {item.badge.value}
          </span>
        )}
        {item.showIndicator && !item.badge && (
          <span className={`w-6.75 h-1 rounded-[0.625rem] ${isActive ? "bg-[#5079F0]" : "bg-[#1E2738]"}`} />
        )}
      </div>
    </Link>
  );
}

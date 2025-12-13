import type { SidebarSection } from "@/components/layout/sidebar";

export const clipperNavigation: SidebarSection[] = [
  {
    items: [
      {
        label: "Home",
        href: "/clipper",
        icon: "/buildings.svg",
        showIndicator: true,
      },
      {
        label: "Dashboard",
        href: "/clipper/dashboard",
        icon: "/dashboard.svg",
      },
      {
        label: "My Clips",
        href: "/clipper/clips",
        icon: "/needs-approval.svg",
        badge: { type: "count", value: 5 },
      },
    ],
  },
  {
    title: "Categories",
    items: [
      {
        label: "E-Commerce",
        href: "/clipper/categories/e-commerce",
        icon: "/shopping-cart.svg",
        badge: { type: "count", value: 8 },
      },
      {
        label: "Music",
        href: "/clipper/categories/music",
        icon: "/music-playlist.svg",
        badge: { type: "count", value: 3 },
      },
      {
        label: "Social Media",
        href: "/clipper/categories/social-media",
        icon: "/social-media.svg",
        badge: { type: "count", value: 12 },
      },
      {
        label: "YouTube",
        href: "/clipper/categories/youtube",
        icon: "/youtube.svg",
        badge: { type: "count", value: 6 },
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        label: "My Information",
        href: "/clipper/account",
        icon: "/my-information.svg",
        showIndicator: true,
      },
    ],
  },
];

export const businessNavigation: SidebarSection[] = [
  {
    items: [
      {
        label: "Home",
        href: "/business",
        icon: "/buildings.svg",
        showIndicator: true,
      },
      {
        label: "Dashboard",
        href: "/business/dashboard",
        icon: "/dashboard.svg",
      },
      {
        label: "Needs Approval",
        href: "/business/approvals",
        icon: "/needs-approval.svg",
        badge: { type: "new", value: 2 },
      },
    ],
  },
  {
    title: "Sections",
    items: [
      {
        label: "E-Commerce",
        href: "/business/sections/e-commerce",
        icon: "/shopping-cart.svg",
        badge: { type: "count", value: 8 },
      },
      {
        label: "Music",
        href: "/business/sections/music",
        icon: "/music-playlist.svg",
        badge: { type: "count", value: 3 },
      },
      {
        label: "Social Media",
        href: "/business/sections/social-media",
        icon: "/social-media.svg",
        badge: { type: "count", value: 12 },
      },
      {
        label: "YouTube",
        href: "/business/sections/youtube",
        icon: "/youtube.svg",
        badge: { type: "count", value: 6 },
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        label: "My Information",
        href: "/business/account",
        icon: "/my-information.svg",
        showIndicator: true,
      },
    ],
  },
];

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, ScrollText, Settings, Users } from "lucide-react";

export const mobileFooterLinks = [
  { name: "Home", path: "/dashboard", icon: LayoutDashboard },
  { name: "Orgs", path: "/dashboard/organisations", icon: Building2 },
  { name: "Users", path: "/dashboard/users", icon: Users },
  { name: "Audit", path: "/dashboard/audit-logs", icon: ScrollText },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

export default function MobileFooter() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 px-2 py-1">
      <div className="flex justify-around items-center h-14">
        {mobileFooterLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full py-1 text-xs font-medium transition-colors ${
                isActive ? "text-[#0b2b5d]" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

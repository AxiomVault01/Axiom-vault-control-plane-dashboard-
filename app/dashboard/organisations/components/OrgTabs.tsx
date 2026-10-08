"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Overview", segment: "" },
  { label: "Users", segment: "/users" },
  { label: "Audit Log", segment: "/audit-log", isNew: true },
  { label: "Integrations", segment: "/integrations" },
  { label: "API Keys", segment: "/api-keys" },
];

export default function OrgTabs({ orgId }: { orgId: string }) {
  const pathname = usePathname();
  const base = `/dashboard/organisations/${orgId}`;

  return (
    <nav aria-label="Organisation sections" className="overflow-x-auto border-b border-slate-300">
      <ul className="flex min-w-max gap-2">
        {TABS.map(({ label, segment, isNew }) => {
          const href = `${base}${segment}`;
          const active = pathname === href;
          return (
            <li key={label}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`-mb-px flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm transition ${
                  active
                    ? "border-slate-900 font-semibold text-slate-900"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
                {isNew && (
                  <span className="rounded bg-slate-900 px-1 py-px text-[9px] font-bold text-white">
                    NEW
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

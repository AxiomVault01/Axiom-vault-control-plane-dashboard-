"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import type { BadgeTone } from "../data";

export const btnPrimary =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#0b2b5d] px-5 text-sm font-medium text-white transition hover:bg-[#0b2b5d]/90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-white";
export const btnOutline =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#0b2b5d] bg-white px-5 text-sm font-medium text-[#0b2b5d] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400";

export const inputClass =
  "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0b2b5d] focus:outline-none focus:ring-2 focus:ring-[#0b2b5d]/10 read-only:bg-slate-100 aria-invalid:border-red-500";

const toneClass: Record<BadgeTone, string> = {
  blue: "bg-blue-100 text-blue-600",
  pink: "bg-fuchsia-100 text-fuchsia-600",
  purple: "bg-purple-100 text-purple-600",
  gray: "bg-slate-100 text-slate-500",
};

export function RoleBadge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-md px-2 py-1.5 text-sm ${toneClass[tone]}`}>
      {children}
    </span>
  );
}

const TABS = [
  { label: "Roles", href: "/dashboard/roles", withRole: false },
  { label: "Role Details", href: "/dashboard/roles/details", withRole: true },
  { label: "Permission Matrix", href: "/dashboard/roles/permissions", withRole: true },
];

// Page title, action buttons and the three section tabs
export function RolesHeader({ actions, roleId }: { actions?: ReactNode; roleId?: string }) {
  const pathname = usePathname();
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Roles &amp; Permissions</h1>
          <p className="mt-2 text-sm text-slate-600">Control access within AxiomVault system</p>
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
      <nav aria-label="Roles sections" className="overflow-x-auto border-b border-slate-300">
        <ul className="flex min-w-max gap-2">
          {TABS.map(({ label, href, withRole }) => {
            const active = pathname === href;
            const target = withRole && roleId ? `${href}?role=${roleId}` : href;
            return (
              <li key={label}>
                <Link
                  href={target}
                  aria-current={active ? "page" : undefined}
                  className={`-mb-px flex border-b-2 px-4 py-3 text-sm transition ${
                    active
                      ? "border-slate-900 font-semibold text-slate-900"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-700">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map(({ label, href }, i) => (
          <Fragment key={label}>
            {i > 0 && <ChevronRight className="size-3.5 text-slate-500" aria-hidden="true" />}
            <li>
              {href ? (
                <Link href={href} className="hover:text-slate-900 hover:underline">
                  {label}
                </Link>
              ) : (
                <span aria-current="page" className="font-semibold text-slate-900">
                  {label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

// Role switcher used on the Role Details and Permission Matrix tabs
export function RolePicker({
  roles,
  value,
  onChange,
}: {
  roles: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      Role
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-900 focus:border-[#0b2b5d] focus:outline-none"
      >
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
  className = "",
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className={`size-4.5 shrink-0 cursor-pointer rounded accent-blue-700 ${className}`}
    />
  );
}

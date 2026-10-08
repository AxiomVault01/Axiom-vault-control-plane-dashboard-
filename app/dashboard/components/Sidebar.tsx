"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, X } from "lucide-react";
import { NAV, currentUser } from "../data";

interface SidebarProps {
  collapsed: boolean; // desktop icon-only mode
  mobileOpen: boolean; // off-canvas drawer below lg
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  // On mobile the drawer always shows labels
  const compact = collapsed && !mobileOpen;

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white text-slate-700 transition-[width,transform] duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${compact ? "w-20" : "w-72 lg:w-64"}`}
        aria-label="Sidebar"
      >
        <div
          className={`flex h-20 items-center px-5 ${compact ? "justify-center" : "justify-between"}`}
        >
          {compact ? (
            <span className="flex size-10 items-center justify-center rounded-lg bg-[#0b2b5d] text-sm font-extrabold text-white">
              A
            </span>
          ) : (
            <Image
              src="/axiomlogo.svg"
              alt="AxiomVault logo"
              width={140}
              height={40}
              priority
            />
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav
          className="mt-2 flex-1 overflow-y-auto px-3 pb-4"
          aria-label="Main"
        >
          {NAV.map((section, si) => (
            <div key={section.title} className={si > 0 ? "mt-4" : ""}>
              {compact ? (
                <div className="mx-auto mb-2 h-px w-8 bg-slate-200" />
              ) : (
                <p className="mb-1 px-1 text-sm font-semibold text-slate-900">
                  {section.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map(({ href, label, icon: Icon, badge }) => {
                  const active =
                    href === "/dashboard"
                      ? pathname === href
                      : pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={onCloseMobile}
                        title={compact ? label : undefined}
                        aria-current={active ? "page" : undefined}
                        className={`relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition ${
                          active
                            ? "bg-[#0b2b5d] font-semibold text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        } ${compact ? "justify-center" : ""}`}
                      >
                        <Icon className="size-4.5 shrink-0" aria-hidden="true" />
                        {!compact && (
                          <span className="flex-1 truncate">{label}</span>
                        )}
                        {badge ? (
                          compact ? (
                            <span
                              className="absolute right-2.5 top-2 size-2 rounded-full bg-red-500"
                              aria-label={`${badge} pending`}
                            />
                          ) : (
                            <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                              {badge}
                            </span>
                          )
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div
          className={`flex items-center gap-3 border-t border-slate-100 px-5 py-4 ${compact ? "justify-center" : ""}`}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
            {currentUser.initials}
          </span>
          {!compact && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-slate-900">
                {currentUser.name}
              </span>
              <span className="block truncate text-sm text-slate-600">
                {currentUser.email}
              </span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden min-h-12 items-center justify-center gap-2 border-t border-slate-100 text-sm text-slate-500 hover:text-slate-900 lg:flex"
        >
          <ChevronsLeft
            className={`size-5 transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
          {!collapsed && "Collapse"}
        </button>
      </aside>
    </>
  );
}

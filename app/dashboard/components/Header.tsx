"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bell, LogOut, Menu, Search, Settings, User, X } from "lucide-react";
import { currentUser, notifications } from "../data";

type Panel = "notifications" | "profile" | null;

export default function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const panelsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (panelsRef.current && !panelsRef.current.contains(e.target as Node))
        setPanel(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/dashboard/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  const toggle = (p: Panel) => setPanel((cur) => (cur === p ? null : p));

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="-ml-2 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="size-6" />
        </button>

        <form
          onSubmit={submitSearch}
          role="search"
          className="hidden max-w-md flex-1 md:block"
        >
          <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-slate-400 focus-within:border-[#0b2b5d] focus-within:ring-2 focus-within:ring-[#0b2b5d]/15">
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">Search</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search organizations, users, events..."
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </label>
        </form>
        <div className="flex-1 md:hidden" />

        <button
          type="button"
          onClick={() => setSearchOpen((v) => !v)}
          aria-label="Search"
          className="rounded-lg p-2.5 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
        </button>

        <div ref={panelsRef} className="flex items-center gap-1 sm:gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => toggle("notifications")}
              aria-label={`Notifications, ${notifications.length} unread`}
              aria-expanded={panel === "notifications"}
              className="relative rounded-lg p-2.5 text-slate-700 hover:bg-slate-100"
            >
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            {panel === "notifications" && (
              <div className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <p className="border-b border-slate-100 px-4 py-3 text-sm font-bold">
                  Notifications
                </p>
                <ul className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <li key={n.id}>
                      <Link
                        href={n.href}
                        onClick={() => setPanel(null)}
                        className="block px-4 py-3 hover:bg-slate-50"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {n.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {n.detail}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <span className="hidden h-8 w-px bg-slate-200 sm:block" />

          <div className="relative">
            <button
              type="button"
              onClick={() => toggle("profile")}
              aria-expanded={panel === "profile"}
              aria-label="Account menu"
              className="flex items-center gap-2 rounded-lg p-1.5 text-left hover:bg-slate-100"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {currentUser.initials}
              </span>
              <span className="hidden sm:block">
                <span className="block text-sm font-semibold text-slate-900">
                  {currentUser.name}
                </span>
                <span className="block text-xs text-slate-500">
                  Last login: {currentUser.lastLogin}
                </span>
              </span>
            </button>
            {panel === "profile" && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setPanel(null)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
                >
                  <User className="size-4 text-slate-500" /> Your profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setPanel(null)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
                >
                  <Settings className="size-4 text-slate-500" /> Settings
                </Link>
                <button
                  type="button"
                  onClick={() => router.push("/login")} // TODO: call your sign-out endpoint first
                  className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="size-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <form
          onSubmit={submitSearch}
          role="search"
          className="border-t border-slate-100 px-4 py-3 md:hidden"
        >
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search organizations, users, events..."
            aria-label="Search"
            className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:border-[#0b2b5d] focus:outline-none"
          />
        </form>
      )}
    </header>
  );
}

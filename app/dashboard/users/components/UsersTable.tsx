"use client";

import { useCallback, useMemo, useState } from "react";
import { Search, ShieldCheck, ShieldX } from "lucide-react";
import { Pagination } from "../../organisations/components/ui";
import { ROLES, users as initialUsers, type PlatformUser, type Role } from "../data";
import { Avatar, RoleBadge, StatusLabel } from "./badges";
import UserDetailsModal from "./UserDetailsModal";

const FILTERS = ["All", ...ROLES] as const;
type Filter = "All" | Role;
const RANGES = ["Last 24 hours", "Last 7 days", "Last 30 days", "All time"];
const PAGE_SIZE = 8;

export default function UsersTable() {
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [range, setRange] = useState(RANGES[0]);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (filter === "All" || u.role === filter) &&
        (!q ||
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.organisation.toLowerCase().includes(q) ||
          u.id.includes(q)),
    );
  }, [users, filter, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const selected = users.find((u) => u.id === selectedId) ?? null;
  const closeModal = useCallback(() => setSelectedId(null), []);

  const toggleSuspend = (id: string) =>
    setUsers((list) =>
      list.map((u) =>
        u.id === id ? { ...u, status: u.status === "Suspended" ? "Active" : "Suspended" } : u,
      ),
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 md:flex-row md:items-center">
        <label className="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-slate-400 focus-within:border-[#0b2b5d] md:w-64">
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="sr-only">Search users</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or organisation ID..."
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </label>

        <div
          role="tablist"
          aria-label="Filter by role"
          className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-md bg-slate-100 p-1"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`whitespace-nowrap rounded px-3 py-1 text-xs font-medium ${
                filter === f ? "bg-white text-orange-700 shadow-sm" : "text-slate-700 hover:text-slate-900"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <label className="md:ml-auto">
          <span className="sr-only">Time range</span>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="h-9 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:border-[#0b2b5d] focus:outline-none"
          >
            {RANGES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left text-sm">
            <thead className="bg-slate-100 text-slate-900">
              <tr>
                {["User", "Role", "Organisation", "Status", "MFA"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-4 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => setSelectedId(u.id)}
                  className="cursor-pointer border-t border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(u.id);
                      }}
                      className="flex items-center gap-3 text-left"
                    >
                      <Avatar id={u.id} name={u.name} />
                      <span className="min-w-0">
                        <span className="block font-medium text-slate-900">{u.name}</span>
                        <span className="block text-xs text-slate-600">{u.email}</span>
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-4 py-3">{u.organisation}</td>
                  <td className="px-4 py-3">
                    <StatusLabel status={u.status} />
                  </td>
                  <td className="px-4 py-3">
                    {u.mfa ? (
                      <span className="inline-flex items-center gap-2 text-emerald-600">
                        <ShieldCheck className="size-4.5" aria-hidden="true" /> Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-red-500">
                        <ShieldX className="size-4.5" aria-hidden="true" /> Disabled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={current}
          pageCount={pageCount}
          onChange={setPage}
          summary={
            filtered.length
              ? `Showing ${start + 1}-${start + visible.length} of ${filtered.length} Users`
              : "Showing 0 Users"
          }
        />
      </div>

      <UserDetailsModal user={selected} onClose={closeModal} onToggleSuspend={toggleSuspend} />
    </div>
  );
}

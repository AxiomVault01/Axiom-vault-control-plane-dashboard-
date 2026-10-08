"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { organisations, type Billing, type OrgStatus } from "../data";
import { Pagination } from "./ui";

const FILTERS = ["All", "Active", "Suspended", "Trial"] as const;
type Filter = (typeof FILTERS)[number];
const PAGE_SIZE = 8;

const billingClass: Record<Billing, string> = {
  Paid: "text-emerald-600",
  Overdue: "text-red-600",
  Trial: "text-orange-500",
};

const statusClass: Record<OrgStatus, string> = {
  Active: "text-emerald-600",
  Suspended: "text-red-600",
  Trial: "text-orange-500",
};

export default function OrganisationsTable() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return organisations.filter(
      (o) =>
        (filter === "All" || o.status === filter) &&
        (!q || o.name.toLowerCase().includes(q) || o.id.includes(q)),
    );
  }, [filter, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 md:flex-row md:items-center">
        <h2 className="flex-1 text-sm font-semibold text-slate-900">All Organisations</h2>
        <div role="tablist" aria-label="Filter by status" className="flex w-fit gap-1 rounded-md bg-slate-100 p-1">
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
              className={`rounded px-3 py-1 text-xs font-medium ${
                filter === f ? "bg-white text-orange-700 shadow-sm" : "text-slate-700 hover:text-slate-900"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <label className="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-slate-400 focus-within:border-[#0b2b5d] md:w-64">
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="sr-only">Search organisations</span>
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
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-slate-100 text-slate-900">
              <tr>
                {["Organization Name", "Plan", "Users", "Billing", "Last Active", "Status"].map((h) => (
                  <th key={h} scope="col" className="border-r border-slate-200 px-4 py-4 font-medium last:border-r-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => router.push(`/dashboard/organisations/${o.id}`)}
                  className="cursor-pointer border-t border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <td className="px-4 py-4">
                    <Link
                      href={`/dashboard/organisations/${o.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-slate-900 hover:underline"
                    >
                      {o.name}
                    </Link>
                  </td>
                  <td className="px-4 py-4">{o.plan}</td>
                  <td className="px-4 py-4">{o.users} Users</td>
                  <td className={`px-4 py-4 ${billingClass[o.billing]}`}>{o.billing}</td>
                  <td className="px-4 py-4">{o.lastActive}</td>
                  <td className={`px-4 py-4 ${statusClass[o.status]}`}>{o.status}</td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    No organisations match your search.
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
              ? `Showing ${start + 1}-${start + visible.length} of ${filtered.length} Organisations`
              : "Showing 0 Organisations"
          }
        />
      </div>
    </div>
  );
}

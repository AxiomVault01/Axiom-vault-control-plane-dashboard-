"use client";

import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, ClipboardList, FilePen, MoreVertical, Search, SlidersHorizontal, TrendingUp } from "lucide-react";
import { Pagination } from "../../organisations/components/ui";
import { DEPARTMENTS, draftName, draftType, type Draft } from "../data";
import { useRoles } from "../RolesProvider";
import SuccessModal from "./modals/SuccessModal";
import { Breadcrumbs, Checkbox, btnOutline, btnPrimary } from "./ui";

const PAGE_SIZE = 8;
const DAY = 86_400_000;
const SORTS = { recent: "Recently Modified", oldest: "Oldest First", name: "Name A–Z" } as const;
type Sort = keyof typeof SORTS;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDate = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const fmtTime = (d: Date) =>
  `${String(d.getHours() % 12 || 12).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() < 12 ? "AM" : "PM"}`;

function timeAgo(ms: number) {
  const mins = Math.round(ms / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

// Current time, minute-precision. Null during prerender so "Today"/"x ago" never mismatch on hydration.
const noopSubscribe = () => () => {};
const useNow = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => null,
  );

function StatCard({ label, value, caption, icon }: { label: string; value: ReactNode; caption: ReactNode; icon: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-300 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-slate-700">{label}</p>
        {icon}
      </div>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{caption}</p>
    </section>
  );
}

const selectClass =
  "h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-900 focus:border-[#0b2b5d] focus:outline-none";

export default function SavedDrafts() {
  const router = useRouter();
  const { drafts, deleteDrafts } = useRoles();
  const now = useNow();

  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [moreFilters, setMoreFilters] = useState(false);
  const [sort, setSort] = useState<Sort>("recent");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [menu, setMenu] = useState<string | null>(null);
  const [deletedCount, setDeletedCount] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = drafts.filter((d) => {
      const haystack = [draftName(d.form), d.id, d.form.fullName, d.form.jobTitle].join(" ").toLowerCase();
      return (
        (!q || haystack.includes(q)) &&
        (!type || draftType(d) === type) &&
        (!status || d.status === status) &&
        (!department || d.form.department === department)
      );
    });
    const time = (d: Draft) => new Date(d.editedAt).getTime();
    return list.sort((a, b) =>
      sort === "name"
        ? draftName(a.form).localeCompare(draftName(b.form))
        : sort === "oldest"
          ? time(a) - time(b)
          : time(b) - time(a),
    );
  }, [drafts, query, type, status, department, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const allVisibleSelected = visible.length > 0 && visible.every((d) => selected.has(d.id));
  const toggleAll = (on: boolean) =>
    setSelected((s) => {
      const next = new Set(s);
      visible.forEach((d) => (on ? next.add(d.id) : next.delete(d.id)));
      return next;
    });
  const toggleOne = (id: string, on: boolean) =>
    setSelected((s) => {
      const next = new Set(s);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const remove = (ids: string[]) => {
    deleteDrafts(ids);
    setSelected((s) => new Set([...s].filter((id) => !ids.includes(id))));
    setMenu(null);
    setDeletedCount(ids.length);
  };

  // Stats
  const latest = drafts.reduce<Draft | null>((a, d) => (!a || d.editedAt > a.editedAt ? d : a), null);
  const latestDate = latest ? new Date(latest.editedAt) : null;
  const isToday = (d: Date) => now !== null && new Date(now).toDateString() === d.toDateString();
  const createdThisWeek = now === null ? 0 : drafts.filter((d) => now - new Date(d.createdAt).getTime() < 7 * DAY).length;
  const createdToday = drafts.filter((d) => isToday(new Date(d.createdAt))).length;
  const pending = drafts.filter((d) => d.status === "Pending Review").length;

  const resetPage = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Roles & Permissions", href: "/dashboard/roles" }, { label: "Saved Drafts" }]} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <h1 className="text-2xl font-semibold text-slate-900">Saved Drafts</h1>
          <p className="mt-1 text-sm text-slate-600">
            Continue editing administrator roles and administrator accounts that were previously saved as drafts.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => router.push("/dashboard/roles")} className={btnOutline}>
            Cancel
          </button>
          <button
            type="button"
            disabled={selected.size === 0}
            onClick={() => remove([...selected])}
            className={btnOutline}
          >
            Delete Selected{selected.size > 0 && ` (${selected.size})`}
          </button>
          <Link href="/dashboard/roles/create" className={btnPrimary}>
            Create Role
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Drafts"
          value={drafts.length}
          icon={<FilePen className="size-5 rounded bg-indigo-100 p-0.5 text-indigo-600" aria-hidden="true" />}
          caption={
            <span className="flex items-center gap-1 text-green-700">
              <TrendingUp className="size-3.5" aria-hidden="true" /> +{createdThisWeek} this week
            </span>
          }
        />
        <StatCard
          label="Last Modified"
          value={latestDate ? (isToday(latestDate) ? "Today" : fmtDate(latestDate)) : "—"}
          icon={<Clock className="size-5 rounded bg-slate-200 p-0.5 text-slate-700" aria-hidden="true" />}
          caption={latestDate && now !== null ? `Updated ${timeAgo(now - latestDate.getTime())}` : "No drafts yet"}
        />
        <StatCard
          label="Pending Review"
          value={pending}
          icon={<ClipboardList className="size-5 rounded bg-red-100 p-0.5 text-red-600" aria-hidden="true" />}
          caption="Require authorization"
        />
        <StatCard
          label="Recently Created"
          value={createdToday}
          icon={
            <span className="rounded bg-green-300 px-1 text-[9px] font-bold leading-4 text-green-900" aria-hidden="true">
              NEW
            </span>
          }
          caption="Created today"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-300 bg-white px-3 py-3 lg:flex-row lg:flex-wrap lg:items-center">
        <label className="flex h-9 items-center gap-2 rounded-md border border-slate-300 px-3 text-slate-500 focus-within:border-[#0b2b5d] lg:w-64">
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="sr-only">Search drafts</span>
          <input
            type="search"
            value={query}
            onChange={(e) => resetPage(setQuery)(e.target.value)}
            placeholder="Search drafts..."
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none"
          />
        </label>
        <div className="hidden h-7 w-px bg-slate-300 lg:block" />
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Draft type" value={type} onChange={(e) => resetPage(setType)(e.target.value)} className={selectClass}>
            <option value="">Draft Type</option>
            <option>Administrator</option>
            <option>Role</option>
          </select>
          <select aria-label="Status" value={status} onChange={(e) => resetPage(setStatus)(e.target.value)} className={selectClass}>
            <option value="">Status</option>
            <option>Draft</option>
            <option>Pending Review</option>
          </select>
          <button
            type="button"
            aria-expanded={moreFilters}
            onClick={() => setMoreFilters((m) => !m)}
            className={`flex h-9 items-center gap-1.5 rounded-md border px-2 text-xs ${
              moreFilters ? "border-[#0b2b5d] text-[#0b2b5d]" : "border-slate-300 text-slate-900"
            }`}
          >
            <SlidersHorizontal className="size-3.5" aria-hidden="true" /> More Filters
          </button>
          {moreFilters && (
            <select
              aria-label="Department"
              value={department}
              onChange={(e) => resetPage(setDepartment)(e.target.value)}
              className={selectClass}
            >
              <option value="">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-900 lg:ml-auto">
          Sort by:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="bg-transparent text-xs font-medium text-blue-700 focus:outline-none"
          >
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-xl border border-slate-300 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="bg-indigo-50 text-xs font-semibold uppercase tracking-wide text-slate-700">
              <tr>
                <th scope="col" className="w-12 rounded-tl-xl px-4 py-4">
                  <Checkbox label="Select all drafts on this page" checked={allVisibleSelected} onChange={toggleAll} />
                </th>
                {["Draft Name", "Type", "Role", "Assignee", "Department", "Last Edited", "Status", "Actions"].map((h) => (
                  <th key={h} scope="col" className="px-3 py-4 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((d) => {
                const edited = new Date(d.editedAt);
                return (
                  <tr key={d.id} className={`border-t border-slate-300 ${selected.has(d.id) ? "bg-indigo-50/40" : ""}`}>
                    <td className="px-4 py-5">
                      <Checkbox
                        label={`Select ${draftName(d.form)}`}
                        checked={selected.has(d.id)}
                        onChange={(on) => toggleOne(d.id, on)}
                      />
                    </td>
                    <td className="max-w-40 px-3 py-5">
                      <p className="font-semibold text-slate-900">{draftName(d.form)}</p>
                      <p className="text-[11px] text-slate-500">#{d.id}</p>
                    </td>
                    <td className="px-3 py-5">
                      <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-700">
                        {draftType(d)}
                      </span>
                    </td>
                    <td className="px-3 py-5 text-slate-700">{d.form.jobTitle || "—"}</td>
                    <td className="px-3 py-5 text-slate-700">{d.form.fullName || "—"}</td>
                    <td className="px-3 py-5 text-slate-700">{d.form.department || "—"}</td>
                    <td className="px-3 py-5 text-slate-700">
                      <p>{d.editedBy}</p>
                      <p className="text-[11px] text-slate-500">
                        {fmtDate(edited)} • {fmtTime(edited)}
                      </p>
                    </td>
                    <td className="px-3 py-5">
                      <span
                        className={`whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                          d.status === "Draft" ? "bg-indigo-100 text-indigo-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="relative px-3 py-5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/roles/create?draft=${d.id}`}
                          className="text-xs font-medium text-orange-500 hover:underline"
                        >
                          Continue
                        </Link>
                        <button
                          type="button"
                          aria-label={`More actions for ${draftName(d.form)}`}
                          aria-expanded={menu === d.id}
                          onClick={() => setMenu(menu === d.id ? null : d.id)}
                          className="rounded p-1 text-slate-700 hover:bg-slate-100"
                        >
                          <MoreVertical className="size-4" />
                        </button>
                      </div>
                      {menu === d.id && (
                        <>
                          <button
                            type="button"
                            aria-label="Close menu"
                            className="fixed inset-0 z-10 cursor-default"
                            onClick={() => setMenu(null)}
                          />
                          <div role="menu" className="absolute right-3 top-12 z-20 w-36 rounded-md border border-slate-200 bg-white py-1 text-xs shadow-lg">
                            <Link
                              role="menuitem"
                              href={`/dashboard/roles/create?draft=${d.id}`}
                              className="block px-3 py-2 text-slate-700 hover:bg-slate-50"
                            >
                              Continue editing
                            </Link>
                            <button
                              role="menuitem"
                              type="button"
                              onClick={() => remove([d.id])}
                              className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
                            >
                              Delete draft
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                    {drafts.length ? "No drafts match your filters." : "You have no saved drafts."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={current}
        pageCount={pageCount}
        onChange={setPage}
        summary={
          filtered.length
            ? `Showing ${start + 1}-${start + visible.length} of ${filtered.length} Drafts`
            : "Showing 0 Drafts"
        }
      />

      <SuccessModal
        open={deletedCount > 0}
        message={deletedCount > 1 ? `${deletedCount} drafts successfully deleted` : "Draft successfully deleted"}
        onClose={() => setDeletedCount(0)}
      />
    </div>
  );
}

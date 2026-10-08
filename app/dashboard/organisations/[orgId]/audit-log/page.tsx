"use client";

import { useMemo, useState } from "react";
import { CalendarDays, FileDown, ListFilter, Search } from "lucide-react";
import { Pagination, Panel, Pill } from "../../components/ui";
import { auditLogs, initials, type AuditLog, type LogStatus } from "../../data";

const PAGE_SIZE = 3;
const STATUSES: LogStatus[] = ["Success", "Warning", "Failed"];

const statusPill: Record<LogStatus, string> = {
  Success: "bg-emerald-50 text-emerald-700",
  Warning: "bg-amber-50 text-amber-700",
  Failed: "bg-red-50 text-red-600",
};

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "2-digit" });

function exportCsv(rows: AuditLog[]) {
  const header = ["Timestamp", "User", "Action", "Resource", "IP Address", "Status", "Hash"];
  const lines = rows.map((r) =>
    [r.timestamp, r.user, r.action, r.resource, r.ip, r.status, r.hash]
      .map((v) => `"${v.replace(/"/g, '""')}"`)
      .join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "audit-logs.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// Audit Log tab
export default function OrganisationAuditLogPage() {
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("2023-10-01");
  const [to, setTo] = useState("2023-10-31");
  const [statuses, setStatuses] = useState<LogStatus[]>(STATUSES);
  const [panel, setPanel] = useState<"date" | "filters" | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return auditLogs.filter((l) => {
      const day = l.timestamp.slice(0, 10);
      return (
        (!from || day >= from) &&
        (!to || day <= to) &&
        statuses.includes(l.status) &&
        (!q || [l.user, l.action, l.resource, l.ip].some((v) => v.toLowerCase().includes(q)))
      );
    });
  }, [query, from, to, statuses]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const toggleStatus = (s: LogStatus) => {
    setStatuses((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
    setPage(1);
  };

  const control =
    "flex h-9 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 hover:bg-slate-50";

  return (
    <Panel className="overflow-hidden rounded-md">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <label className="flex h-9 items-center gap-2 rounded border border-slate-200 px-3 text-slate-500 focus-within:border-[#0b2b5d]">
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">Search logs</span>
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search logs..."
              className="w-32 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </label>

          <div className="relative">
            <button type="button" className={control} aria-expanded={panel === "date"} onClick={() => setPanel((p) => (p === "date" ? null : "date"))}>
              <CalendarDays className="size-4" aria-hidden="true" />
              {from ? fmtDate(from) : "Any"} - {to ? fmtDate(to) : "Any"}
            </button>
            {panel === "date" && (
              <div className="absolute left-0 z-10 mt-1 w-56 space-y-2 rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg">
                <label className="block">
                  <span className="text-slate-600">From</span>
                  <input type="date" value={from} max={to || undefined} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="mt-1 h-9 w-full rounded border border-slate-200 px-2" />
                </label>
                <label className="block">
                  <span className="text-slate-600">To</span>
                  <input type="date" value={to} min={from || undefined} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="mt-1 h-9 w-full rounded border border-slate-200 px-2" />
                </label>
              </div>
            )}
          </div>

          <div className="relative">
            <button type="button" className={control} aria-expanded={panel === "filters"} onClick={() => setPanel((p) => (p === "filters" ? null : "filters"))}>
              <ListFilter className="size-4" aria-hidden="true" />
              Filters
              {statuses.length < STATUSES.length && (
                <span className="rounded-full bg-[#0b2b5d] px-1.5 text-[10px] text-white">{statuses.length}</span>
              )}
            </button>
            {panel === "filters" && (
              <div className="absolute left-0 z-10 mt-1 w-44 rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg">
                <p className="mb-2 font-semibold text-slate-900">Status</p>
                {STATUSES.map((s) => (
                  <label key={s} className="flex items-center gap-2 py-1 text-slate-700">
                    <input type="checkbox" checked={statuses.includes(s)} onChange={() => toggleStatus(s)} className="accent-[#0b2b5d]" />
                    {s}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => exportCsv(filtered)}
          disabled={!filtered.length}
          className="flex h-9 items-center justify-center gap-2 rounded bg-black px-4 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <FileDown className="size-4" aria-hidden="true" /> Export Logs
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-200 text-left text-xs">
          <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-700">
            <tr>
              {["Timestamp", "User", "Action", "Resource", "IP Address", "Status", "Hash"].map((h, i) => (
                <th key={h} scope="col" className={`px-4 py-3 font-semibold ${i === 0 ? "sm:pl-12" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((l) => {
              const failed = l.status === "Failed";
              return (
                <tr key={l.id} className="border-t border-slate-100">
                  <td className="px-4 py-4 text-slate-800 sm:pl-12">{l.timestamp}</td>
                  <td className="px-4 py-4">
                    <span className="flex items-center gap-2 text-slate-900">
                      <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${l.user === "System Agent" ? "bg-slate-300 text-slate-800" : "bg-slate-800 text-white"}`}>
                        {initials(l.user)}
                      </span>
                      {l.user}
                    </span>
                  </td>
                  <td className={`px-4 py-4 ${failed ? "font-semibold text-red-700" : "text-slate-900"}`}>{l.action}</td>
                  <td className="px-4 py-4 text-slate-800">{l.resource}</td>
                  <td className={`px-4 py-4 font-mono ${failed ? "text-red-600" : "text-slate-700"}`}>{l.ip}</td>
                  <td className="px-4 py-4"><Pill className={statusPill[l.status]}>{l.status}</Pill></td>
                  <td className="px-4 py-4 text-slate-800">{l.hash}</td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">No logs match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100">
        <Pagination
          page={current}
          pageCount={pageCount}
          onChange={setPage}
          summary={filtered.length ? `Showing ${start + 1}-${start + visible.length} of ${filtered.length} logs` : "Showing 0 logs"}
        />
      </div>
    </Panel>
  );
}

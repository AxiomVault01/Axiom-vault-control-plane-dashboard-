"use client";

import { useMemo, useState } from "react";
import { Check, Download, RefreshCw, Search } from "lucide-react";
import { toast } from "react-toastify";
import { PageTitle, Pagination } from "../organisations/components/ui";
import Dropdown from "./components/Dropdown";
import EventDetailsModal from "./components/EventDetailsModal";
import { severityClass } from "./components/severity";
import {
  NOW,
  TIME_RANGES,
  auditEvents,
  auditOrganisations,
  eventTime,
  type AuditEvent,
  type Severity,
} from "./data";

const SEVERITIES = ["All", "Critical", "Warning", "Info"] as const;
type SeverityFilter = (typeof SEVERITIES)[number];
type TimeRange = (typeof TIME_RANGES)[number]["label"];
const PAGE_SIZE = 8;

function exportCsv(rows: AuditEvent[]) {
  const header = ["Event ID", "Timestamp", "Severity", "Event", "User", "Organisation", "IP", "Details"];
  const lines = rows.map((r) =>
    [r.id, r.timestamp, r.severity, r.event, r.user, r.organisation, r.ip, r.details]
      .map((v) => `"${v.replace(/"/g, '""')}"`)
      .join(","),
  );
  const url = URL.createObjectURL(new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "audit-log.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function AuditLogExplorerPage() {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<SeverityFilter>("All");
  const [range, setRange] = useState<TimeRange>("Last 24 hours");
  const [org, setOrg] = useState<string | null>(null); // null = all
  const [orgQuery, setOrgQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AuditEvent | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const hours = TIME_RANGES.find((r) => r.label === range)!.hours;
    const since = NOW.getTime() - hours * 3_600_000;
    return auditEvents.filter(
      (e) =>
        (severity === "All" || e.severity === (severity.toLowerCase() as Severity)) &&
        (!org || e.organisation === org) &&
        eventTime(e).getTime() >= since &&
        (!q || [e.user, e.organisation, e.orgId, e.event, e.ip, e.id].some((v) => v.toLowerCase().includes(q))),
    );
  }, [query, severity, range, org]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  // Every filter change goes back to page 1
  const update = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Audit log is up to date");
    }, 700);
  };

  const orgMatches = auditOrganisations.filter((o) => o.toLowerCase().includes(orgQuery.trim().toLowerCase()));

  const item = "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-50";

  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div className="flex flex-wrap items-start gap-x-12 gap-y-4">
        <PageTitle title="Audit Log Explorer" subtitle="Tamper-evident activity trail across the platform" />
        <div className="flex gap-3 sm:mt-6">
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              exportCsv(filtered);
              toast.success(`Exported ${filtered.length} events`);
            }}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 rounded-md bg-[#0b2b5d] px-3 py-2 text-xs font-medium text-white hover:bg-[#0b2b5d]/90 disabled:opacity-60"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Export
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 lg:flex-row lg:items-center">
        <label className="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-slate-400 focus-within:border-[#0b2b5d] lg:w-64">
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="sr-only">Search audit log</span>
          <input
            type="search"
            value={query}
            onChange={(e) => update(setQuery)(e.target.value)}
            placeholder="Search by name or organisation ID..."
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </label>

        <div role="tablist" aria-label="Filter by severity" className="flex w-fit gap-1 rounded-md bg-slate-100 p-1">
          {SEVERITIES.map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={severity === s}
              onClick={() => update(setSeverity)(s)}
              className={`rounded px-3 py-1 text-xs font-medium ${
                severity === s ? "bg-white text-orange-700 shadow-sm" : "text-slate-700 hover:text-slate-900"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 lg:ml-auto">
          <Dropdown label={range} ariaLabel="Time range">
            {(close) =>
              TIME_RANGES.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  role="option"
                  aria-selected={range === r.label}
                  className={item}
                  onClick={() => {
                    update(setRange)(r.label);
                    close();
                  }}
                >
                  {r.label}
                  {range === r.label && <Check className="size-3.5 text-[#0b2b5d]" aria-hidden="true" />}
                </button>
              ))
            }
          </Dropdown>

          <Dropdown label={org ?? "All Organisations"} ariaLabel="Filter by organisation" active={!!org} menuClassName="w-64">
            {(close) => (
              <>
                <div className="border-b border-slate-100 px-2 pb-2 pt-1">
                  <input
                    type="search"
                    autoFocus
                    value={orgQuery}
                    onChange={(e) => setOrgQuery(e.target.value)}
                    placeholder="Search organisations..."
                    aria-label="Search organisations"
                    className="h-8 w-full rounded border border-slate-200 px-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0b2b5d] focus:outline-none"
                  />
                </div>
                <ul role="listbox" aria-label="Organisations" className="max-h-64 overflow-y-auto">
                  {[null, ...orgMatches].map((o) => (
                    <li key={o ?? "all"}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={org === o}
                        className={item}
                        onClick={() => {
                          update(setOrg)(o);
                          setOrgQuery("");
                          close();
                        }}
                      >
                        <span className="truncate">{o ?? "All Organisations"}</span>
                        {org === o && <Check className="size-3.5 shrink-0 text-[#0b2b5d]" aria-hidden="true" />}
                      </button>
                    </li>
                  ))}
                  {orgMatches.length === 0 && <li className="px-3 py-2 text-slate-500">No organisations found</li>}
                </ul>
              </>
            )}
          </Dropdown>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-240 text-left text-sm">
            <thead className="bg-slate-100 text-slate-900">
              <tr>
                {["Timestamp", "Severity", "Events", "Users", "Organisation", "IP"].map((h) => (
                  <th key={h} scope="col" className="border-r border-slate-200 px-4 py-4 text-base font-medium last:border-r-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className="cursor-pointer border-t border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap border-r border-slate-200 px-4 py-5 font-mono text-[13px]">
                    {/* Real button so rows are reachable by keyboard */}
                    <button type="button" onClick={() => setSelected(e)} className="text-left hover:underline">
                      {e.timestamp}
                    </button>
                  </td>
                  <td className={`border-r border-slate-200 px-4 py-5 font-mono text-[13px] ${severityClass[e.severity]}`}>
                    {e.severity}
                  </td>
                  <td className="border-r border-slate-200 px-4 py-5 font-mono text-[13px] text-blue-600">{e.event}</td>
                  <td className="border-r border-slate-200 px-4 py-5">{e.user}</td>
                  <td className="border-r border-slate-200 px-4 py-5">{e.organisation}</td>
                  <td className="whitespace-nowrap px-4 py-5 font-mono text-[13px]">{e.ip}</td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-600">
                    No events match these filters.
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
              ? `Showing ${start + 1}-${start + visible.length} of ${filtered.length} events`
              : "Showing 0 events"
          }
        />
      </div>

      <EventDetailsModal event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

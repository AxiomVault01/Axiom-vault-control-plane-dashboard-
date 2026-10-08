"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Download, Search, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../../roles/components/modals/Modal";
import { liveTemplates, logsFor, makeEntry, type LogEntry, type LogLevel, type Service } from "../data";
import StatusPill from "./StatusPill";

const LEVELS: LogLevel[] = ["INFO", "WARN", "ERROR", "DEBUG"];
const LIVE_INTERVAL_MS = 2500;
const MAX_ENTRIES = 200;

const levelDot: Record<LogLevel, string> = {
  INFO: "bg-blue-500",
  WARN: "bg-orange-500",
  ERROR: "bg-red-500",
  DEBUG: "bg-slate-400",
};

const levelBadge: Record<LogLevel, string> = {
  INFO: "text-blue-600",
  WARN: "text-orange-600",
  ERROR: "text-red-600",
  DEBUG: "text-slate-800",
};

const levelText: Record<LogLevel, string> = {
  INFO: "text-blue-400",
  WARN: "text-orange-400",
  ERROR: "text-red-400",
  DEBUG: "text-slate-100",
};

function exportLogs(svc: Service, rows: LogEntry[]) {
  const text = rows.map((r) => `${r.time} [${r.level}] ${r.message} ${JSON.stringify(r.meta)}`).join("\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${svc.id}-logs.log`;
  a.click();
  URL.revokeObjectURL(url);
}

// Render with key={service.id} so state resets per service
export default function ServiceLogsModal({ service, onClose }: { service: Service; onClose: () => void }) {
  const [entries, setEntries] = useState(() => logsFor(service));
  const [live, setLive] = useState(true);
  const [level, setLevel] = useState<LogLevel | "All">("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const tick = useRef(0);

  // Live mode: prepend a new entry on an interval
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      setEntries((prev) => {
        const latest = prev[0];
        const lastMs = Date.parse(`2024-06-17T${latest.time}Z`);
        const next = makeEntry(
          liveTemplates[tick.current++ % liveTemplates.length],
          service,
          latest.id + 1,
          lastMs + LIVE_INTERVAL_MS + Math.floor(Math.random() * 400),
        );
        return [next, ...prev].slice(0, MAX_ENTRIES);
      });
    }, LIVE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [live, service]);

  const counts = useMemo(
    () => Object.fromEntries(LEVELS.map((l) => [l, entries.filter((e) => e.level === l).length])) as Record<LogLevel, number>,
    [entries],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) =>
        (level === "All" || e.level === level) &&
        (!q || e.message.toLowerCase().includes(q) || JSON.stringify(e.meta).toLowerCase().includes(q)),
    );
  }, [entries, level, query]);

  const toggle = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <Modal open onClose={onClose} labelledBy="service-logs-title" className="max-w-3xl rounded-2xl">
      <div className="overflow-y-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 px-5 pt-6 sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="service-logs-title" className="text-lg font-bold text-slate-900">
                {service.name}
              </h2>
              <StatusPill status={service.status} />
            </div>
            <p className="mt-2 font-mono text-xs text-slate-700">
              {service.region} · uptime {service.uptime}%{service.latencyMs !== null && ` · p50 ${service.latencyMs}ms`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLive((l) => !l)}
              aria-pressed={live}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium ${
                live ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"
              }`}
            >
              <span className={`size-1.5 rounded-full ${live ? "animate-pulse bg-blue-500" : "bg-slate-400"}`} aria-hidden="true" />
              {live ? "Live" : "Paused"}
            </button>
            <button
              type="button"
              onClick={() => {
                exportLogs(service, visible);
                toast.success(`Exported ${visible.length} log entries`);
              }}
              className="flex items-center gap-2 rounded-md bg-[#0b2b5d] px-3 py-2 text-xs font-medium text-white hover:bg-[#0b2b5d]/90"
            >
              <Download className="size-3.5" aria-hidden="true" />
              Export
            </button>
            <button type="button" onClick={onClose} aria-label="Close" className="ml-1 text-slate-900 hover:text-slate-600">
              <XCircle className="size-5" />
            </button>
          </div>
        </div>

        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 px-5 text-xs text-slate-700 sm:px-6">
          Log counts (last 24h):
          {LEVELS.map((l) => (
            <span key={l} className="flex items-center gap-1 font-mono">
              <span className={`size-1.5 rounded-full ${levelDot[l]}`} aria-hidden="true" />
              {l} {counts[l]}
            </span>
          ))}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 px-5 sm:px-6">
          <label className="flex h-9 w-full items-center gap-2 rounded-md border border-slate-200 px-3 text-slate-400 focus-within:border-[#0b2b5d] sm:w-56">
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">Filter logs</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter logs… (message, metadata)"
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </label>
          <div role="tablist" aria-label="Filter by level" className="flex gap-1 rounded-md bg-slate-100 p-1">
            {(["All", ...LEVELS] as const).map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={level === l}
                onClick={() => setLevel(l)}
                className={`rounded px-2.5 py-1 text-[11px] font-medium ${
                  level === l ? "bg-white text-orange-700 shadow-sm" : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="ml-auto text-xs text-slate-700">
            Showing {visible.length}/{entries.length} entries
          </p>
        </div>

        <div className="m-3 mt-5 rounded-xl bg-[#1e2f52] py-3 font-mono text-[13px] sm:mx-3">
          <ul aria-live={live ? "polite" : "off"} aria-relevant="additions">
            {visible.map((e) => {
              const open = expanded.has(e.id);
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => toggle(e.id)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-4 px-4 py-2 text-left hover:bg-white/5"
                  >
                    <span className="shrink-0 text-slate-100">{e.time}</span>
                    <span className={`w-12 shrink-0 rounded-sm bg-white py-0.5 text-center text-[9px] font-semibold ${levelBadge[e.level]}`}>
                      {e.level}
                    </span>
                    <span className={`min-w-0 flex-1 truncate ${levelText[e.level]}`}>{e.message}</span>
                    <ChevronRight
                      className={`size-4 shrink-0 text-white transition-transform ${open ? "rotate-90" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  {open && (
                    <pre className="mx-4 mb-2 overflow-x-auto rounded bg-black/20 p-3 text-[11px] leading-relaxed text-emerald-400">
                      {JSON.stringify({ message: e.message, ...e.meta }, null, 2)}
                    </pre>
                  )}
                </li>
              );
            })}
            {visible.length === 0 && <li className="px-4 py-8 text-center text-slate-300">No log entries match these filters.</li>}
          </ul>
          <p className="mt-4 flex items-center gap-2 px-4 text-[11px] text-slate-200">
            <span className={`size-1.5 rounded-full ${live ? "animate-pulse bg-blue-400" : "bg-slate-400"}`} aria-hidden="true" />
            {live ? "Waiting for new log entries…" : "Live tail paused"}
          </p>
        </div>
      </div>
    </Modal>
  );
}

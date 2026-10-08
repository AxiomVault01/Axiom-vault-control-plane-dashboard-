"use client";

import { useState } from "react";
import { Activity, ChartColumn, CircleAlert, Download, RefreshCw, Server, Zap, type LucideIcon } from "lucide-react";
import { toast } from "react-toastify";
import { PageTitle, Panel } from "../organisations/components/ui";
import LatencyChart, { ChartLegend } from "./components/LatencyChart";
import ServiceLogsModal from "./components/ServiceLogsModal";
import StatusPill from "./components/StatusPill";
import { LAST_UPDATED, healthStats, services, type Service } from "./data";

const tones: Record<(typeof healthStats)[number]["tone"], { icon: LucideIcon; text: string }> = {
  blue: { icon: Activity, text: "text-blue-500" },
  green: { icon: Zap, text: "text-emerald-500" },
  fuchsia: { icon: ChartColumn, text: "text-fuchsia-500" },
  red: { icon: CircleAlert, text: "text-red-500" },
};

const fmtLatency = (ms: number | null) => (ms === null ? "—" : `${ms}ms`);

function exportCsv() {
  const header = ["Service", "Status", "Uptime (30d)", "Latency", "Region", "Version"];
  const lines = services.map((s) =>
    [s.name, s.status, `${s.uptime}%`, fmtLatency(s.latencyMs), s.region, s.version].map((v) => `"${v.replace(/"/g, '""')}"`).join(","),
  );
  const url = URL.createObjectURL(new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "system-health.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function SystemHealthPage() {
  const [lastUpdated, setLastUpdated] = useState(LAST_UPDATED);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<Service | null>(null);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date().toISOString().slice(11, 19));
      setRefreshing(false);
      toast.success("Service status refreshed");
    }, 700);
  };

  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle title="System Health" subtitle="Real-time monitoring of platform infrastructure" />
        <div className="flex gap-3">
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
              exportCsv();
              toast.success("System health report exported");
            }}
            className="flex items-center gap-2 rounded-md bg-[#0b2b5d] px-3 py-2 text-xs font-medium text-white hover:bg-[#0b2b5d]/90"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {healthStats.map(({ label, value, caption, tone }) => {
          const { icon: Icon, text } = tones[tone];
          return (
            <section
              key={label}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-900">{label}</p>
                <Icon className={`size-5 shrink-0 ${text}`} aria-hidden="true" />
              </div>
              <p className={`mt-2 text-2xl font-semibold ${text}`}>{value}</p>
              <p className="mt-3 text-xs text-slate-700">{caption}</p>
            </section>
          );
        })}
      </div>

      <Panel className="p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase text-slate-900">API Latency - 24h</h2>
          <ChartLegend />
        </div>
        <LatencyChart />
      </Panel>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0b1f45] px-4 py-4">
          <h2 className="text-base font-semibold text-white">Service Status</h2>
          <p className="font-mono text-sm text-white">Last updated: {lastUpdated} UTC</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left text-sm">
            <thead className="bg-slate-100 text-slate-900">
              <tr>
                {["Service", "Status", "Uptime (30d)", "Latency", "Region"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-4 font-medium">
                    {h}
                  </th>
                ))}
                <th scope="col" className="px-4 py-4 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <span className="flex items-center gap-3 font-medium text-slate-900">
                      <Server className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
                      {s.name}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusPill status={s.status} />
                  </td>
                  <td className="px-4 py-4 text-slate-700">{s.uptime}%</td>
                  <td className={`px-4 py-4 ${s.status === "Degraded" ? "font-medium text-amber-700" : "text-slate-700"}`}>
                    {fmtLatency(s.latencyMs)}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700">{s.region}</span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setSelected(s)}
                      aria-label={`View ${s.name} logs`}
                      className="text-sm font-medium text-orange-700 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selected && <ServiceLogsModal key={selected.id} service={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

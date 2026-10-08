"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  ArrowRightCircle,
  Building2,
  ChartNoAxesCombined,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import {
  auditEvents,
  kpis,
  revenue,
  revenueSummary,
  services,
  subscriptionAlerts,
  type AuditLevel,
  type Kpi,
  type ServiceStatus,
} from "../data";

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border border-slate-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] ${className}`}
    >
      {children}
    </section>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-[#9a3d12] hover:underline"
    >
      {children}
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}

/* ---------- KPI cards ---------- */

const kpiIcon: Record<Kpi["tone"], { icon: typeof Activity; className: string }> = {
  blue: { icon: ChartNoAxesCombined, className: "text-blue-500" },
  green: { icon: Building2, className: "text-emerald-500" },
  amber: { icon: ShieldAlert, className: "text-amber-700" },
  pink: { icon: Activity, className: "text-fuchsia-500" },
};

function KpiCard({ kpi }: { kpi: Kpi }) {
  const { icon: Icon, className } = kpiIcon[kpi.tone];
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-700">
          {kpi.label}
        </p>
        <Icon className={`size-5 shrink-0 ${className}`} aria-hidden="true" />
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{kpi.value}</p>
      <p className="mt-4 flex items-center gap-2 text-xs text-slate-700">
        <ArrowRightCircle className="size-4 text-emerald-500" aria-hidden="true" />
        <span className="font-medium text-emerald-600">{kpi.change}</span>
        {kpi.caption}
      </p>
    </Card>
  );
}

/* ---------- Revenue chart ---------- */

const CHART = { w: 640, h: 260, left: 64, right: 16, top: 12, bottom: 32 };
const Y_MAX = 1000;
const Y_TICKS = [0, 250, 500, 750, 1000];

function RevenueChart() {
  const [hover, setHover] = useState<number | null>(null);
  const plotW = CHART.w - CHART.left - CHART.right;
  const plotH = CHART.h - CHART.top - CHART.bottom;
  const step = plotW / (revenue.length - 1);
  const x = (i: number) => CHART.left + i * step;
  const y = (v: number) => CHART.top + plotH - (v / Y_MAX) * plotH;

  const line = revenue
    .map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.value)}`)
    .join(" ");
  const area = `${line} L${x(revenue.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const active = hover !== null ? revenue[hover] : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${CHART.w} ${CHART.h}`}
        className="h-auto w-full"
        role="img"
        aria-label="Monthly recurring revenue, January to December, rising from $0K to $1000K"
        onMouseLeave={() => setHover(null)}
      >
        {Y_TICKS.map((t) => (
          <g key={t}>
            <line
              x1={CHART.left}
              x2={CHART.w - CHART.right}
              y1={y(t)}
              y2={y(t)}
              className="stroke-slate-100"
            />
            <text
              x={CHART.left - 12}
              y={y(t)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-slate-700 text-[13px]"
            >
              ${t}K
            </text>
          </g>
        ))}

        <path d={area} className="fill-blue-100" />
        <path d={line} fill="none" strokeWidth={2} className="stroke-blue-400" />

        {revenue.map((d, i) => (
          <text
            key={d.month}
            x={x(i)}
            y={CHART.h - 8}
            textAnchor="middle"
            className="fill-slate-700 text-[13px]"
          >
            {d.month}
          </text>
        ))}

        {active && hover !== null && (
          <g pointerEvents="none">
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={CHART.top}
              y2={y(0)}
              className="stroke-slate-300"
              strokeDasharray="3 3"
            />
            <circle
              cx={x(hover)}
              cy={y(active.value)}
              r={5}
              strokeWidth={2}
              className="fill-blue-500 stroke-white"
            />
          </g>
        )}

        {/* Hit targets: one full-height column per month */}
        {revenue.map((d, i) => (
          <rect
            key={d.month}
            x={x(i) - step / 2}
            y={CHART.top}
            width={step}
            height={plotH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>

      {active && hover !== null && (
        <div
          className="pointer-events-none absolute top-2 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md"
          style={{
            left: `${Math.min(Math.max((x(hover) / CHART.w) * 100, 12), 88)}%`,
          }}
        >
          <p className="text-slate-500">{active.month}</p>
          <p className="font-semibold text-slate-900">${active.value}K MRR</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Subscription alerts ---------- */

function SubscriptionAlerts() {
  return (
    <Card className="flex flex-col p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Subscription Alerts</h2>
        <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs text-orange-800">
          {subscriptionAlerts.length} Active
        </span>
      </div>
      <ul className="mt-4 flex-1 space-y-4">
        {subscriptionAlerts.map((a) => {
          const critical = a.severity === "critical";
          return (
            <li
              key={a.id}
              className={`flex gap-3 rounded-lg p-4 ${critical ? "bg-red-50" : "bg-amber-50/70"}`}
            >
              <TriangleAlert
                className={`mt-0.5 size-5 shrink-0 ${critical ? "text-red-500" : "text-amber-500"}`}
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">{a.org}</p>
                <p
                  className={`mt-1 text-sm ${critical ? "text-red-600" : "text-amber-600"}`}
                >
                  {a.issue}
                </p>
                <p className="mt-2 text-xs text-slate-700">{a.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 text-center">
        <FooterLink href="/dashboard/billing">View billings dashboard</FooterLink>
      </div>
    </Card>
  );
}

/* ---------- System health ---------- */

const statusClass: Record<ServiceStatus, { dot: string; text: string }> = {
  Operational: { dot: "bg-emerald-500", text: "text-emerald-600" },
  Degraded: { dot: "bg-amber-500", text: "text-red-500" },
  Down: { dot: "bg-red-500", text: "text-red-600" },
};

function SystemHealth() {
  const allOk = services.every((s) => s.status === "Operational");
  return (
    <Card className="flex flex-col p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">System Health</h2>
        <span
          className={`size-2 rounded-full ${allOk ? "bg-emerald-500" : "bg-amber-500"}`}
          aria-label={allOk ? "All systems operational" : "Some systems degraded"}
        />
      </div>
      <ul className="mt-4 flex-1 space-y-4">
        {services.map((s) => (
          <li key={s.name} className="flex items-center gap-2 text-sm">
            <span className={`size-1.5 rounded-full ${statusClass[s.status].dot}`} />
            <span className="flex-1 text-slate-800">{s.name}</span>
            {s.latency && (
              <span className="text-xs font-medium text-slate-900">{s.latency}</span>
            )}
            <span className={`w-20 text-right text-xs ${statusClass[s.status].text}`}>
              {s.status}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-center">
        <FooterLink href="/dashboard/system-health">Full system status</FooterLink>
      </div>
    </Card>
  );
}

/* ---------- Recent audit activity ---------- */

const levelClass: Record<AuditLevel, string> = {
  Info: "bg-blue-100 text-blue-700",
  Warning: "bg-amber-100 text-amber-700",
  Critical: "bg-red-100 text-red-600",
};

function AuditActivity() {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Recent Audit Activity</h2>
        <FooterLink href="/dashboard/audit-logs">View all</FooterLink>
      </div>
      <ul className="mt-4 divide-y divide-slate-50">
        {auditEvents.map((e) => (
          <li
            key={e.id}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 py-3 text-xs sm:grid-cols-[auto_minmax(0,11rem)_1fr_auto]"
          >
            <span
              className={`rounded px-2 py-0.5 font-mono text-[11px] ${levelClass[e.level]}`}
            >
              {e.level}
            </span>
            <span className="truncate font-mono text-[#1e3a8a]">{e.event}</span>
            <span className="col-span-3 row-start-2 text-slate-800 sm:col-span-1 sm:row-start-auto">
              {e.description}
            </span>
            <span className="col-start-3 row-start-1 text-slate-800 sm:col-start-auto">
              {e.time}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ---------- Page composition ---------- */

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard key={k.label} kpi={k} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-3">
          <Card className="p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-slate-900">Revenue Growth</h2>
            <p className="mt-1 text-sm text-slate-700">
              MRR trend over 12 months (USD thousands)
            </p>
            <div className="mt-4">
              <RevenueChart />
            </div>
          </Card>
          <Card className="grid grid-cols-3 gap-4 px-4 py-4 sm:px-5">
            {revenueSummary.map((s) => (
              <div key={s.label}>
                <p className="text-xs text-slate-700">{s.label}</p>
                <p className="mt-1.5 text-sm font-medium text-slate-900">{s.value}</p>
              </div>
            ))}
          </Card>
        </div>
        <SubscriptionAlerts />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <SystemHealth />
        <AuditActivity />
      </div>
    </div>
  );
}

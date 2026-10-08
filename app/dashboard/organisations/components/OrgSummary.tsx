import type { ReactNode } from "react";
import { CircleCheck, CreditCard, Info, Radio, TrendingUp } from "lucide-react";
import { orgProfile as p, type Plan } from "../data";
import { Panel, ProgressBar } from "./ui";

function StatCard({ label, aside, children }: { label: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <Panel className="rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-800">{label}</p>
        {aside}
      </div>
      {children}
    </Panel>
  );
}

function InfoCard({ icon, title, aside, children }: { icon: ReactNode; title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <Panel className="overflow-hidden rounded-md">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
        {icon}
        <h2 className="flex-1 text-xs font-semibold uppercase tracking-wide text-slate-900">{title}</h2>
        {aside}
      </div>
      <div className="p-4">{children}</div>
    </Panel>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 text-xs last:border-0">
      <span className="text-slate-600">{label}</span>
      <span className="text-right text-slate-900">{children}</span>
    </div>
  );
}

// Stat cards + information panels shown above every organisation tab
export default function OrgSummary({ plan }: { plan: Plan }) {
  const nodePercent = Math.round((p.nodesUsed / p.nodesTotal) * 100);
  const maxBar = Math.max(...p.latencyBars);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          aside={
            <span className="flex items-center gap-1 text-[11px] text-emerald-600">
              <TrendingUp className="size-3" aria-hidden="true" /> {p.usersTrend}
            </span>
          }
        >
          <p className="mt-3 text-2xl font-semibold text-slate-900">{p.totalUsers}</p>
          <div className="mt-3">
            <ProgressBar percent={72} />
          </div>
        </StatCard>

        <StatCard
          label="Active Alerts"
          aside={
            <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
              {p.criticalAlerts} CRITICAL
            </span>
          }
        >
          <p className="mt-3 text-2xl font-semibold text-slate-900">{p.activeAlerts}</p>
          <p className="mt-2 text-[11px] text-slate-700">Last updated 4 mins ago</p>
        </StatCard>

        <StatCard label="Alerts Processed" aside={<span className="text-[11px] font-semibold text-slate-700">24H</span>}>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{p.alertsProcessed}</p>
          <div className="mt-2 flex h-4 items-end gap-1" aria-hidden="true">
            {[30, 50, 40, 90, 70].map((h, i) => (
              <span key={i} className={`w-1 ${i >= 3 ? "bg-slate-900" : "bg-slate-300"}`} style={{ height: `${h}%` }} />
            ))}
          </div>
        </StatCard>

        <StatCard label="Storage Used" aside={<span className="text-[11px] text-slate-700">{p.storagePercent}% Capacity</span>}>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{p.storageUsed}</p>
          <div className="mt-3">
            <ProgressBar percent={p.storagePercent} className="bg-red-700" />
          </div>
        </StatCard>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <InfoCard icon={<Info className="size-4 text-slate-700" />} title="Organisation Information">
          <Row label="Org ID">
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-700">
              {p.orgId}
            </span>
          </Row>
          <Row label="Industry">{p.industry}</Row>
          <Row label="Headquarters">{p.headquarters}</Row>
          <Row label="Deployment">{p.deployment}</Row>
        </InfoCard>

        <InfoCard
          icon={<CreditCard className="size-4 text-slate-700" />}
          title="Subscription Plan"
          aside={
            <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              {plan}
            </span>
          }
        >
          <div className="pb-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Node Utilization</span>
              <span className="font-semibold text-slate-900">
                {p.nodesUsed} / {p.nodesTotal} Nodes
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar percent={nodePercent} />
            </div>
          </div>
          <Row label="Next Renewal">{p.nextRenewal}</Row>
          <Row label="Billing Contact">
            <a href={`mailto:${p.billingContact}`} className="underline hover:text-[#0b2b5d]">
              {p.billingContact}
            </a>
          </Row>
        </InfoCard>

        <InfoCard icon={<Radio className="size-4 text-emerald-600" />} title="Ingestion Health">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-semibold text-slate-900">
              <span className="size-2 rounded-full bg-emerald-500" /> {p.uptime} Uptime
            </span>
            <span className="text-[11px] font-semibold text-emerald-600">HEALTHY</span>
          </div>
          <div className="mt-3 rounded bg-slate-100 p-2">
            <p className="text-[10px] text-slate-700">{p.latency} Latency</p>
            <div className="mt-1 flex h-10 items-end justify-between gap-1" aria-hidden="true">
              {p.latencyBars.map((v, i) => (
                <span key={i} className="w-1.5 bg-slate-400" style={{ height: `${(v / maxBar) * 100}%` }} />
              ))}
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-700">
            <CircleCheck className="size-3.5" aria-hidden="true" /> Real-time verification:{" "}
            <span className="font-semibold text-slate-900">Healthy</span>
          </p>
        </InfoCard>
      </div>
    </div>
  );
}

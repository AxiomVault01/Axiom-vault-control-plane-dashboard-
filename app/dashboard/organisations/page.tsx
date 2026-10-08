import { ArrowRightCircle, Building, Building2, Hourglass, ShieldAlert, type LucideIcon } from "lucide-react";
import OrganisationsTable from "./components/OrganisationsTable";
import { PageTitle } from "./components/ui";
import { orgStats } from "./data";

const stats: {
  label: string;
  value: number;
  change: string;
  caption: string;
  icon: LucideIcon;
  iconClass: string;
  valueClass: string;
}[] = [
  { label: "Total Organisation", value: orgStats.total, change: "+12.3%", caption: "vs last month", icon: Building, iconClass: "text-slate-700", valueClass: "text-slate-900" },
  { label: "Active Organizations", value: orgStats.active, change: "+2", caption: "new this month", icon: Building2, iconClass: "text-emerald-500", valueClass: "text-slate-900" },
  { label: "Suspended", value: orgStats.suspended, change: "-3", caption: "this month", icon: ShieldAlert, iconClass: "text-amber-700", valueClass: "text-red-600" },
  { label: "Trial", value: orgStats.trial, change: "+2", caption: "this month", icon: Hourglass, iconClass: "text-amber-700", valueClass: "text-red-600" },
];

export default function OrganisationsPage() {
  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <PageTitle
        title="Organisations"
        subtitle="Manage all client organisations on the AxiomVault platform"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, change, caption, icon: Icon, iconClass, valueClass }) => (
          <section
            key={label}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-700">
                {label}
              </p>
              <Icon className={`size-5 shrink-0 ${iconClass}`} aria-hidden="true" />
            </div>
            <p className={`mt-2 text-2xl font-semibold ${valueClass}`}>{value}</p>
            <p className="mt-4 flex items-center gap-2 text-xs text-slate-700">
              <ArrowRightCircle className="size-4 text-emerald-500" aria-hidden="true" />
              <span className="font-medium text-emerald-600">{change}</span>
              {caption}
            </p>
          </section>
        ))}
      </div>

      <OrganisationsTable />
    </div>
  );
}

import { ArrowRightCircle } from "lucide-react";
import { PageTitle, Panel } from "../organisations/components/ui";
import ExportButton from "./components/ExportButton";
import InvoicesTable from "./components/InvoicesTable";
import PlanDonut from "./components/PlanDonut";
import RevenueChart from "./components/RevenueChart";
import { billingStats } from "./data";

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageTitle title="Billing Dashboard" subtitle="Revenue analytics and subscription management" />
        <ExportButton />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {billingStats.map(({ label, value, change }) => (
          <section
            key={label}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-700">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
            <p className="mt-4 flex items-center gap-2 text-xs text-slate-700">
              <ArrowRightCircle className="size-4 text-emerald-500" aria-hidden="true" />
              <span className="font-medium text-emerald-600">{change}</span>
              vs last month
            </p>
          </section>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Panel className="p-4 lg:col-span-3">
          <h2 className="text-base font-semibold text-slate-900">Revenue Growth</h2>
          <p className="mt-1 text-sm text-slate-600">MRR trend over 12 months (USD thousands)</p>
          <div className="mt-4">
            <RevenueChart />
          </div>
        </Panel>
        <Panel className="p-4 lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Revenue by Plan</h2>
          <PlanDonut />
        </Panel>
      </div>

      <InvoicesTable />
    </div>
  );
}

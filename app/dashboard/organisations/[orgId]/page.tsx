import IngestionChart from "../components/IngestionChart";
import { Panel, ProgressBar } from "../components/ui";
import { alertBreakdown, resources } from "../data";

// Overview tab
export default function OrganisationOverviewPage() {
  const totalAlerts = alertBreakdown.reduce((sum, a) => sum + a.count, 0);

  return (
    <div className="space-y-8">
      <Panel className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Data Ingestion Trend (Last 30 Days)</h2>
        <p className="text-xs text-slate-600">Consolidated stream volume across telemetry types</p>
        <div className="mt-2">
          <IngestionChart />
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Panel className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Active Alert Status</h2>
          <div className="mt-5 flex h-2.5 gap-0.5 overflow-hidden rounded-sm" role="img" aria-label="Alert severity breakdown">
            {alertBreakdown.map((a) => (
              <span key={a.label} className={a.bar} style={{ flexGrow: a.count }} title={`${a.label}: ${a.count}`} />
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {alertBreakdown.map((a) => (
              <div key={a.label} className="rounded border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-600">{a.label}</p>
                <p className={`mt-1 text-lg font-semibold ${a.text}`}>{a.count}</p>
              </div>
            ))}
          </div>
          <p className="sr-only">{totalAlerts} active alerts in total</p>
        </Panel>

        <Panel className="flex flex-col p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Resource Utilization</h2>
          <ul className="mt-4 flex-1 space-y-4">
            {resources.map((r) => (
              <li key={r.label}>
                <div className="mb-1.5 flex justify-between text-xs text-slate-800">
                  <span>{r.label}</span>
                  <span>{r.value}</span>
                </div>
                <ProgressBar percent={r.percent} />
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-600">
            <span>Status: Normal</span>
            <span>Updated: 2m ago</span>
          </div>
        </Panel>
      </div>
    </div>
  );
}

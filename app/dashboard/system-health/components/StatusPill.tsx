import type { ServiceStatus } from "../data";

const pill: Record<ServiceStatus, string> = {
  Operational: "bg-emerald-50 text-emerald-700",
  Degraded: "bg-amber-50 text-amber-700",
  Outage: "bg-red-50 text-red-600",
};

const dot: Record<ServiceStatus, string> = {
  Operational: "bg-emerald-500",
  Degraded: "bg-amber-500",
  Outage: "bg-red-500",
};

export default function StatusPill({ status }: { status: ServiceStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium ${pill[status]}`}>
      <span className={`size-1.5 rounded-full ${dot[status]}`} aria-hidden="true" />
      {status}
    </span>
  );
}

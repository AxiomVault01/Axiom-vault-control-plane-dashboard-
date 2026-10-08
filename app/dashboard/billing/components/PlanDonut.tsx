import { formatUSD, planRevenue } from "../data";

const R = 70;
const STROKE = 30;
const CIRC = 2 * Math.PI * R;

export default function PlanDonut() {
  const total = planRevenue.reduce((sum, p) => sum + p.revenue, 0);
  let offset = 0;

  return (
    <div>
      <svg
        viewBox="0 0 200 200"
        className="mx-auto size-44"
        role="img"
        aria-label={`Revenue by plan: ${planRevenue.map((p) => `${p.plan} ${formatUSD(p.revenue)}`).join(", ")}`}
      >
        {/* Segments start at 12 o'clock and run clockwise */}
        <g transform="rotate(-90 100 100)">
          {planRevenue.map((p) => {
            const len = (p.revenue / total) * CIRC;
            const seg = (
              <circle
                key={p.plan}
                cx={100}
                cy={100}
                r={R}
                fill="none"
                stroke={p.color}
                strokeWidth={STROKE}
                strokeDasharray={`${len} ${CIRC - len}`}
                strokeDashoffset={-offset}
              >
                <title>{`${p.plan}: ${formatUSD(p.revenue)}`}</title>
              </circle>
            );
            offset += len;
            return seg;
          })}
        </g>
      </svg>

      <ul className="mt-6 space-y-2.5 text-sm">
        {planRevenue.map((p) => (
          <li key={p.plan} className="flex items-center gap-2 text-slate-700">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
            {p.plan}
            <span className="ml-2 text-slate-600">({p.orgs})</span>
            <span className="ml-auto font-semibold text-slate-900">{formatUSD(p.revenue)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

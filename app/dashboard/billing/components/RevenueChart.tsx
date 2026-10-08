"use client";

import { useState } from "react";
import { MONTHS, mrrTrend } from "../data";

const C = { w: 640, h: 300, left: 56, right: 12, top: 12, bottom: 30 };
const Y_MAX = 1000;
const Y_TICKS = [0, 250, 500, 750, 1000];

const plotW = C.w - C.left - C.right;
const plotH = C.h - C.top - C.bottom;
const x = (i: number) => C.left + (i / (MONTHS.length - 1)) * plotW;
const y = (v: number) => C.top + plotH - (v / Y_MAX) * plotH;

// Catmull-Rom spline through the points, as cubic Béziers
function smoothLine(values: number[]) {
  const pts = values.map((v, i) => [x(i), y(v)] as const);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

const line = smoothLine(mrrTrend);
const area = `${line} L${x(mrrTrend.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;

export default function RevenueChart() {
  const [hover, setHover] = useState<number | null>(null);
  const colW = plotW / (MONTHS.length - 1);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${C.w} ${C.h}`}
        className="h-auto w-full"
        role="img"
        aria-label="Monthly recurring revenue over the last 12 months, rising from $42K in January to $847K in December"
        onMouseLeave={() => setHover(null)}
      >
        {Y_TICKS.map((t) => (
          <text key={t} x={C.left - 10} y={y(t)} textAnchor="end" dominantBaseline="middle" className="fill-slate-700 text-[11px]">
            ${t}K
          </text>
        ))}
        {MONTHS.map((m, i) => (
          <text key={m} x={x(i)} y={C.h - 8} textAnchor="middle" className="fill-slate-700 text-[11px]">
            {m}
          </text>
        ))}

        <path d={area} className="fill-blue-100" />
        <path d={line} fill="none" className="stroke-blue-300" strokeWidth={1.5} />

        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={C.top} y2={y(0)} className="stroke-slate-300" strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(mrrTrend[hover])} r={4.5} className="fill-blue-500" stroke="white" strokeWidth={2} />
          </g>
        )}

        {/* Hit targets: one full-height column per month */}
        {MONTHS.map((m, i) => (
          <rect
            key={m}
            x={x(i) - colW / 2}
            y={C.top}
            width={colW}
            height={plotH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute top-2 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md"
          style={{ left: `${Math.min(Math.max((x(hover) / C.w) * 100, 14), 86)}%` }}
        >
          <p className="text-slate-500">{MONTHS[hover]}</p>
          <p className="font-semibold text-slate-900">${mrrTrend[hover].toLocaleString("en-US")}K MRR</p>
        </div>
      )}
    </div>
  );
}

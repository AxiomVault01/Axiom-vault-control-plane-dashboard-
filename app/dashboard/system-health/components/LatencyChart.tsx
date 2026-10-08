"use client";

import { useState } from "react";
import { latencySeries, throughputSeries } from "../data";

const C = { w: 760, h: 260, left: 44, right: 44, top: 12, bottom: 32 };
const LAT_MAX = 100; // ms
const TP_MAX = 22; // K/s
const LAT_TICKS = [0, 25, 50, 75, 100];
const TP_TICKS = [0, 6, 11, 17, 22];
const HOURS = latencySeries.length;

const LAT_COLOR = "#a3420f";
const TP_COLOR = "#10b981";

const plotW = C.w - C.left - C.right;
const plotH = C.h - C.top - C.bottom;
const x = (i: number) => C.left + (i / (HOURS - 1)) * plotW;
const yLat = (v: number) => C.top + plotH - (v / LAT_MAX) * plotH;
const yTp = (v: number) => C.top + plotH - (v / TP_MAX) * plotH;
const hour = (i: number) => `${String(i).padStart(2, "0")}.00`;

// Catmull-Rom spline through the points, as cubic Béziers
function smoothPath(values: number[], y: (v: number) => number) {
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

const latPath = smoothPath(latencySeries, yLat);
const tpPath = smoothPath(throughputSeries, yTp);

export function ChartLegend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-700">
      {[
        { label: "p50 Latency", color: LAT_COLOR },
        { label: "Throughput (K/s)", color: TP_COLOR },
      ].map((s) => (
        <li key={s.label} className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded" style={{ background: s.color }} />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

export default function LatencyChart() {
  const [hover, setHover] = useState<number | null>(null);
  const colW = plotW / (HOURS - 1);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${C.w} ${C.h}`}
        className="h-auto w-full"
        role="img"
        aria-label="API p50 latency and throughput over the last 24 hours. Latency peaks at 88ms around 12:00; throughput peaks at 19.8K requests per second."
        onMouseLeave={() => setHover(null)}
      >
        {LAT_TICKS.map((t) => (
          <g key={t}>
            <line x1={C.left} x2={C.w - C.right} y1={yLat(t)} y2={yLat(t)} className="stroke-slate-100" />
            <text x={C.left - 8} y={yLat(t)} textAnchor="end" dominantBaseline="middle" className="fill-slate-700 text-[10px]">
              {t}ms
            </text>
          </g>
        ))}
        {TP_TICKS.map((t) => (
          <text key={t} x={C.w - C.right + 8} y={yTp(t)} dominantBaseline="middle" className="fill-slate-700 text-[10px]">
            {t}K
          </text>
        ))}
        {latencySeries.map((_, i) =>
          i % 2 === 0 ? (
            <text key={i} x={x(i)} y={C.h - 8} textAnchor="middle" className="fill-slate-700 text-[10px]">
              {hour(i)}
            </text>
          ) : null,
        )}

        <path d={tpPath} fill="none" stroke={TP_COLOR} strokeWidth={1.5} strokeOpacity={0.7} />
        <path d={latPath} fill="none" stroke={LAT_COLOR} strokeWidth={2} strokeLinecap="round" />

        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={C.top} y2={yLat(0)} className="stroke-slate-300" strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={yTp(throughputSeries[hover])} r={4} fill={TP_COLOR} stroke="white" strokeWidth={2} />
            <circle cx={x(hover)} cy={yLat(latencySeries[hover])} r={4.5} fill={LAT_COLOR} stroke="white" strokeWidth={2} />
          </g>
        )}

        {latencySeries.map((_, i) => (
          <rect
            key={i}
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
          <p className="mb-1 text-slate-500">{hour(hover)} UTC</p>
          <p className="flex items-center gap-2 text-slate-700">
            <span className="size-2 rounded-full" style={{ background: LAT_COLOR }} />
            p50 Latency <span className="ml-auto pl-3 font-semibold text-slate-900">{latencySeries[hover]}ms</span>
          </p>
          <p className="flex items-center gap-2 text-slate-700">
            <span className="size-2 rounded-full" style={{ background: TP_COLOR }} />
            Throughput <span className="ml-auto pl-3 font-semibold text-slate-900">{throughputSeries[hover]}K/s</span>
          </p>
        </div>
      )}
    </div>
  );
}

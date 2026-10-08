"use client";

import { useState } from "react";
import { ingestionDays, ingestionSeries } from "../data";

const C = { w: 760, h: 320, left: 44, right: 96, top: 16, bottom: 32 };
const Y_MAX = 100;
const Y_TICKS = [0, 25, 50, 75, 100];
const X_TICKS = [1, 5, 10, 15, 20, 25, 30];

const plotW = C.w - C.left - C.right;
const plotH = C.h - C.top - C.bottom;
const x = (day: number) => C.left + ((day - 1) / 29) * plotW;
const y = (v: number) => C.top + plotH - (v / Y_MAX) * plotH;

// Catmull-Rom spline through the points, as cubic Béziers
function smoothPath(values: number[]) {
  const pts = values.map((v, i) => [x(ingestionDays[i]), y(v)] as const);
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

// End-of-line labels, nudged apart so they never overlap
function endLabels() {
  const last = ingestionDays.length - 1;
  const labels = ingestionSeries
    .map((s) => ({ key: s.key, label: s.label, y: y(s.values[last]) }))
    .sort((a, b) => a.y - b.y);
  for (let i = 1; i < labels.length; i++) {
    labels[i].y = Math.max(labels[i].y, labels[i - 1].y + 14);
  }
  return labels;
}

export default function IngestionChart() {
  const [hover, setHover] = useState<number | null>(null);
  const labels = endLabels();

  return (
    <div>
      <ul className="flex flex-wrap justify-end gap-x-5 gap-y-1 text-xs font-medium text-slate-700">
        {ingestionSeries.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>

      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${C.w} ${C.h}`}
          className="h-auto w-full"
          role="img"
          aria-label="Daily ingestion volume for Auth Logs, Audit Logs and System Metrics over the last 30 days"
          onMouseLeave={() => setHover(null)}
        >
          {Y_TICKS.map((t) => (
            <g key={t}>
              <line x1={C.left} x2={C.w - C.right} y1={y(t)} y2={y(t)} className="stroke-slate-100" />
              <text x={C.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" className="fill-slate-600 text-[10px]">
                {t === 0 ? "0" : `${t}M`}
              </text>
            </g>
          ))}
          {X_TICKS.map((d) => (
            <text key={d} x={x(d)} y={C.h - 8} textAnchor="middle" className="fill-slate-600 text-[10px]">
              JUN {d}
            </text>
          ))}

          {ingestionSeries.map((s) => (
            <path
              key={s.key}
              d={smoothPath(s.values)}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray={s.dashed ? "6 4" : undefined}
              strokeLinecap="round"
            />
          ))}

          {labels.map((l) => (
            <text key={l.key} x={C.w - C.right + 8} y={l.y} dominantBaseline="middle" className="fill-slate-700 text-[10px]">
              {l.label}
            </text>
          ))}

          {hover !== null && (
            <g pointerEvents="none">
              <line
                x1={x(ingestionDays[hover])}
                x2={x(ingestionDays[hover])}
                y1={C.top}
                y2={y(0)}
                className="stroke-slate-300"
                strokeDasharray="3 3"
              />
              {ingestionSeries.map((s) => (
                <circle
                  key={s.key}
                  cx={x(ingestionDays[hover])}
                  cy={y(s.values[hover])}
                  r={4.5}
                  fill={s.color}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </g>
          )}

          {/* Hit targets: one full-height column per data point */}
          {ingestionDays.map((d, i) => {
            const prev = i > 0 ? x(ingestionDays[i - 1]) : x(d);
            const next = i < ingestionDays.length - 1 ? x(ingestionDays[i + 1]) : x(d);
            const left = (prev + x(d)) / 2;
            const right = (x(d) + next) / 2;
            return (
              <rect
                key={d}
                x={left}
                y={C.top}
                width={Math.max(right - left, 1)}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
            );
          })}
        </svg>

        {hover !== null && (
          <div
            className="pointer-events-none absolute top-2 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md"
            style={{ left: `${Math.min(Math.max((x(ingestionDays[hover]) / C.w) * 100, 14), 80)}%` }}
          >
            <p className="mb-1 text-slate-500">Jun {ingestionDays[hover]}</p>
            {ingestionSeries.map((s) => (
              <p key={s.key} className="flex items-center gap-2 text-slate-700">
                <span className="size-2 rounded-full" style={{ background: s.color }} />
                {s.label}
                <span className="ml-auto pl-3 font-semibold text-slate-900">{s.values[hover]}M</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

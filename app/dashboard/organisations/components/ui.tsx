import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Shared building blocks for the organisations pages

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] ${className}`}
    >
      {children}
    </section>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
    </div>
  );
}

export function Pill({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${className}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ percent, className = "bg-slate-900" }: { percent: number; className?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div className={`h-full rounded-full ${className}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

export function Pagination({
  page,
  pageCount,
  onChange,
  summary,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  summary: string;
}) {
  const btn =
    "inline-flex items-center gap-1 text-sm disabled:cursor-not-allowed disabled:text-slate-300";
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs text-slate-700">
      <p>{summary}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`${btn} text-slate-600`}
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft className="size-4" /> Previous
        </button>
        {Array.from({ length: Math.max(pageCount, 1) }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`min-w-6 rounded px-1 py-0.5 text-xs ${
              p === page ? "bg-[#0b2b5d] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {String(p).padStart(2, "0")}
          </button>
        ))}
        <button
          type="button"
          className={`${btn} text-orange-600`}
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
        >
          Next <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

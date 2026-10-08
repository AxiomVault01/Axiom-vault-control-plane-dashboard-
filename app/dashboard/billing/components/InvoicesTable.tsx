"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Filter } from "lucide-react";
import { toast } from "react-toastify";
import { formatUSD, invoices, type InvoiceStatus } from "../data";

const FILTERS = ["All", "Paid", "Pending", "Failed"] as const;
type StatusFilter = (typeof FILTERS)[number];

const statusClass: Record<InvoiceStatus, string> = {
  Paid: "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Failed: "bg-red-50 text-red-600",
};

export default function InvoicesTable() {
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the filter menu on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const visible = filter === "All" ? invoices : invoices.filter((i) => i.status === filter);

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 bg-slate-100 px-4 py-3">
        <h2 className="text-base font-semibold text-slate-900">Recent Invoices</h2>
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-50"
          >
            <Filter className="size-3.5" aria-hidden="true" />
            Filter
            {filter !== "All" && <span className="text-orange-700">· {filter}</span>}
          </button>
          {open && (
            <ul role="menu" className="absolute right-0 z-10 mt-1 w-36 rounded-md border border-slate-200 bg-white py-1 text-xs shadow-lg">
              {FILTERS.map((f) => (
                <li key={f}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={filter === f}
                    onClick={() => {
                      setFilter(f);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
                  >
                    {f}
                    {filter === f && <Check className="size-3.5 text-[#0b2b5d]" aria-hidden="true" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-170 text-left text-sm">
          <thead className="bg-slate-100 text-slate-900">
            <tr>
              {["Invoice ID", "Organisation", "Amount", "Date", "Status"].map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((inv) => (
              <tr key={inv.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-5 font-medium text-slate-900">{inv.id}</td>
                <td className="px-4 py-5 text-xs text-slate-800">{inv.organisation}</td>
                <td className="px-4 py-5 font-semibold text-slate-900">{formatUSD(inv.amount)}</td>
                <td className="px-4 py-5 text-slate-700">{inv.date}</td>
                <td className="px-4 py-5">
                  <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${statusClass[inv.status]}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-5 text-right">
                  <button
                    type="button"
                    onClick={() => toast.info(`Preparing ${inv.id}.pdf…`)}
                    className="text-sm text-orange-700 hover:underline"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-600">
                  No {filter.toLowerCase()} invoices.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

"use client";

import { Download } from "lucide-react";
import { toast } from "react-toastify";
import { invoices } from "../data";

// Downloads the invoice list as CSV
export default function ExportButton() {
  const exportCsv = () => {
    const rows = [
      ["Invoice ID", "Organisation", "Amount (USD)", "Date", "Status"],
      ...invoices.map((i) => [i.id, i.organisation, String(i.amount), i.date, i.status]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "billing-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Billing report exported");
  };

  return (
    <button
      type="button"
      onClick={exportCsv}
      className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[#0b2b5d] px-3 py-2 text-xs font-medium text-white hover:bg-[#0b2b5d]/90"
    >
      <Download className="size-3.5" aria-hidden="true" />
      Export Report
    </button>
  );
}

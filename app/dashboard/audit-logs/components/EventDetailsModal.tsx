"use client";

import type { ReactNode } from "react";
import { Copy, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../../roles/components/modals/Modal";
import { rawPayload, type AuditEvent } from "../data";
import { severityClass } from "./severity";

function Row({ label, children, mono }: { label: string; children: ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="shrink-0 text-slate-700">{label}</span>
      <span className={`break-all text-right text-slate-900 ${mono ? "font-mono text-[13px]" : ""}`}>{children}</span>
    </div>
  );
}

export default function EventDetailsModal({ event, onClose }: { event: AuditEvent | null; onClose: () => void }) {
  if (!event) return null;

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(event.id);
      toast.success("Event ID copied to clipboard");
    } catch {
      toast.error("Could not copy event ID");
    }
  };

  return (
    <Modal open onClose={onClose} labelledBy="event-details-title" className="max-w-md rounded-2xl">
      <div className="flex items-center justify-between px-5 pt-5">
        <h2 id="event-details-title" className="text-base font-medium text-slate-900">
          Event Details
        </h2>
        <button type="button" onClick={onClose} aria-label="Close" className="text-slate-900 hover:text-slate-600">
          <XCircle className="size-5" />
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto px-5 pb-5 pt-4">
        <div className="flex gap-4 rounded-md bg-slate-100 px-3 py-2.5 font-mono text-sm">
          <span className={`font-semibold ${severityClass[event.severity]}`}>{event.severity}</span>
          <div className="min-w-0">
            <p className="break-all font-semibold text-blue-600">{event.event}</p>
            <p className="text-[11px] text-slate-700">{event.id}</p>
          </div>
        </div>

        <div className="rounded-md bg-slate-100 px-3 py-3 text-sm">
          <p className="text-slate-600">Details</p>
          <p className="mt-1 text-slate-900">{event.details}</p>
        </div>

        <div>
          <Row label="Timestamp" mono>{event.timestamp}</Row>
          <Row label="User" mono>{event.user}</Row>
          <Row label="Organization">{event.organisation}</Row>
          <Row label="IP Address" mono>{event.ip}</Row>
          <Row label="Event ID" mono>{event.id}</Row>
        </div>

        <div className="rounded-lg bg-[#1e2f52] p-3">
          <p className="text-xs font-medium uppercase text-white">Raw Payload</p>
          <pre className="mt-2 overflow-x-auto text-[11px] leading-relaxed text-emerald-400">{rawPayload(event)}</pre>
        </div>

        <button
          type="button"
          onClick={copyId}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
        >
          <Copy className="size-4" aria-hidden="true" />
          Copy ID
        </button>
      </div>
    </Modal>
  );
}

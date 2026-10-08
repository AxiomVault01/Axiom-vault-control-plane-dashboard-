"use client";

import { Check } from "lucide-react";
import Modal from "./Modal";
import { btnOutline, btnPrimary } from "../ui";

interface SuccessModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
  // Optional second button, e.g. "View Roles"
  action?: { label: string; onClick: () => void };
}

export default function SuccessModal({ open, message, onClose, action }: SuccessModalProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="success-title" className="max-w-3xl">
      <div className="flex min-h-80 flex-col items-center justify-center px-6 py-16 text-center sm:min-h-115">
        <span className="flex size-12 items-center justify-center rounded-full bg-green-500">
          <span className="flex size-7 items-center justify-center rounded-full bg-white">
            <Check className="size-4.5 text-green-500" strokeWidth={3} aria-hidden="true" />
          </span>
        </span>
        <h2 id="success-title" className="mt-2 text-lg font-semibold text-black">
          Success!
        </h2>
        <p className="mt-1 text-sm text-slate-600">{message}</p>
        <div className={`mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center ${action ? "sm:gap-4" : ""}`}>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className={`${action ? btnOutline : btnPrimary} w-full sm:w-auto ${action ? "sm:min-w-40" : "sm:min-w-75"}`}
          >
            Close
          </button>
          {action && (
            <button type="button" onClick={action.onClick} className={`${btnPrimary} w-full sm:w-auto sm:min-w-40`}>
              {action.label}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

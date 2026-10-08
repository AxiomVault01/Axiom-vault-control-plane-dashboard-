"use client";

import { useEffect, type ReactNode } from "react";
import { CheckCircle2, Lock, LockOpen, PenLine, XCircle } from "lucide-react";
import { permissionsFor, recentActivity, type PlatformUser } from "../data";
import { Avatar, RoleBadge, StatusLabel } from "./badges";

interface UserDetailsModalProps {
  user: PlatformUser | null;
  onClose: () => void;
  onToggleSuspend: (id: string) => void;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span className="text-slate-600">{label}</span>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="mt-3 text-sm font-semibold text-slate-900 first:mt-0">{children}</h3>;
}

export default function UserDetailsModal({ user, onClose, onToggleSuspend }: UserDetailsModalProps) {
  // Close on Escape and lock page scroll while open
  useEffect(() => {
    if (!user) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [user, onClose]);

  if (!user) return null;

  const suspended = user.status === "Suspended";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-details-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between px-5 pt-5 sm:px-6">
          <h2 id="user-details-title" className="text-base font-medium text-slate-900">
            User Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full text-slate-900 transition hover:text-slate-600"
          >
            <XCircle className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-2 sm:px-6">
          <div className="flex flex-col items-center border-b border-slate-200 pb-5 pt-4 text-center">
            <Avatar id={user.id} name={user.name} size="lg" />
            <p className="mt-4 text-base font-bold text-slate-900">{user.name}</p>
            <p className="mt-1 break-all text-xs text-slate-600">{user.email}</p>
            <div className="mt-4 flex items-center gap-4">
              <RoleBadge role={user.role} size="sm" />
              <StatusLabel status={user.status} />
            </div>
          </div>

          <div className="py-4">
            <SectionTitle>Details</SectionTitle>
            <Row label="User ID">
              <span className="font-mono text-slate-700">{user.id}</span>
            </Row>
            <Row label="Organization">
              <span className="text-right font-medium text-slate-900">{user.organisation}</span>
            </Row>
            <Row label="Last Active">
              <span className="font-medium text-slate-900">{user.lastActive}</span>
            </Row>
            <Row label="MFA">
              <span className="font-medium text-slate-900">{user.mfa ? "Enabled" : "Disabled"}</span>
            </Row>

            <SectionTitle>Permissions</SectionTitle>
            {permissionsFor(user.role).map((p) => (
              <Row key={p.label} label={p.label}>
                {p.granted ? (
                  <CheckCircle2 className="size-4.5 text-emerald-500" aria-label="Granted" />
                ) : (
                  <XCircle className="size-4.5 text-slate-400" aria-label="Not granted" />
                )}
              </Row>
            ))}

            <SectionTitle>Recent Activity</SectionTitle>
            {recentActivity.map((a) => (
              <div key={a.event} className="flex items-center justify-between py-1.5 text-sm">
                <span className="font-mono text-xs text-blue-500">{a.event}</span>
                <span className="text-slate-600">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 px-5 pb-5 pt-3 sm:gap-7 sm:px-6">
          <button
            type="button"
            className="flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#0b2b5d] text-xs font-medium text-white transition hover:bg-[#0b2b5d]/90"
          >
            <PenLine className="size-4" aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onToggleSuspend(user.id)}
            className="flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-900 text-xs font-medium text-slate-900 transition hover:bg-slate-50"
          >
            {suspended ? (
              <LockOpen className="size-4" aria-hidden="true" />
            ) : (
              <Lock className="size-4" aria-hidden="true" />
            )}
            {suspended ? "Reactivate" : "Suspend"}
          </button>
        </div>
      </div>
    </div>
  );
}

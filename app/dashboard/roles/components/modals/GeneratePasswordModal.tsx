"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Copy, Info, RotateCw, Star, X } from "lucide-react";
import { STRENGTH_LABELS, generatePassword, passwordChecks } from "../../data";
import { btnOutline, btnPrimary } from "../ui";
import Modal from "./Modal";

export type PasswordOptions = {
  sendCredentials: boolean;
  forcePasswordChange: boolean;
  requireMfa: boolean;
  expires24h: boolean;
};

interface GeneratePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onUse: (password: string, options: PasswordOptions) => void;
  initialOptions: PasswordOptions;
}

export default function GeneratePasswordModal(props: GeneratePasswordModalProps) {
  return (
    <Modal open={props.open} onClose={props.onClose} labelledBy="generate-password-title" className="max-w-md">
      <GeneratePasswordBody {...props} />
    </Modal>
  );
}

const OPTION_LABELS: [keyof PasswordOptions, string][] = [
  ["sendCredentials", "Automatically send login credentials by email"],
  ["forcePasswordChange", "Require password change on first login"],
  ["requireMfa", "Require Multi-Factor Authentication on first login"],
  ["expires24h", "Password expires after 24 hours if unused"],
];

function GeneratePasswordBody({ onClose, onUse, initialOptions }: GeneratePasswordModalProps) {
  // Body only mounts after a click, so browser crypto is always available here
  const [password, setPassword] = useState(generatePassword);
  const [options, setOptions] = useState(initialOptions);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const checks = passwordChecks(password);
  const score = checks.filter((c) => c.ok).length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
    } catch {}
  };

  return (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 pb-4 pt-5">
        <div>
          <h2 id="generate-password-title" className="text-lg font-semibold text-slate-900">
            Generate Temporary Password
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Create a secure temporary password that will be sent to the administrator via email.
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="text-slate-600 hover:text-slate-900">
          <X className="size-5" />
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto px-5 py-4">
        <output
          aria-live="polite"
          className="block rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-center font-mono text-lg font-semibold tracking-[0.2em] text-blue-700"
        >
          {password || "…"}
        </output>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={copy} className={`${btnOutline} border-slate-900 text-slate-900`}>
            {copied ? <CheckCircle2 className="size-4 text-green-600" /> : <Copy className="size-4" />}
            {copied ? "Copied!" : "Copy Password"}
          </button>
          <button
            type="button"
            onClick={() => setPassword(generatePassword())}
            className="inline-flex min-h-10 items-center justify-center gap-2 text-sm font-medium text-slate-900 hover:underline"
          >
            <RotateCw className="size-4" /> Regenerate Password
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="flex gap-0.5" aria-label={`${score} of 5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`size-4.5 ${i < score ? "fill-orange-700 text-orange-700" : "text-slate-300"}`}
                  aria-hidden="true"
                />
              ))}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wide text-orange-700">
              {STRENGTH_LABELS[score]}
            </span>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {checks.map((c) => (
              <li
                key={c.label}
                className={`flex items-center gap-1.5 text-xs ${c.ok ? "text-orange-700" : "text-slate-400"}`}
              >
                <CheckCircle2 className={`size-4 ${c.ok ? "fill-orange-700 text-white" : ""}`} aria-hidden="true" />
                {c.label}
              </li>
            ))}
          </ul>
        </div>

        <fieldset className="space-y-3 rounded-lg bg-slate-100 px-4 py-4">
          <legend className="sr-only">Delivery options</legend>
          {OPTION_LABELS.map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-3 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(e) => setOptions((o) => ({ ...o, [key]: e.target.checked }))}
                className="size-4.5 shrink-0 accent-blue-700"
              />
              {label}
            </label>
          ))}
        </fieldset>

        <p className="flex items-start gap-2 rounded-r-md border-l-4 border-blue-700 bg-blue-50 px-3 py-3 text-xs text-slate-700">
          <Info className="mt-px size-4 shrink-0 fill-blue-700 text-white" aria-hidden="true" />
          The administrator will receive an email containing their username, temporary password and a secure login link.
        </p>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
        <button type="button" onClick={onClose} className={`${btnOutline} min-h-9 rounded-lg border-slate-900 px-4 text-xs text-slate-900`}>
          Cancel
        </button>
        <button
          type="button"
          disabled={!password}
          onClick={() => onUse(password, options)}
          className={`${btnPrimary} min-h-9 rounded-lg px-4 text-xs`}
        >
          Use Password
        </button>
      </div>
    </>
  );
}

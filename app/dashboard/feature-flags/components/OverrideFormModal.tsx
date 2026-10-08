"use client";

import { useState, type FormEvent } from "react";
import Modal from "../../roles/components/modals/Modal";
import { btnOutline, btnPrimary, inputClass } from "../../roles/components/ui";
import { overrideOrganisations, type Flag, type Override } from "../data";
import { Field, ModalHeader } from "./FlagFormModal";

interface OverrideFormModalProps {
  flags: Flag[];
  defaultFlagKey?: string;
  onClose: () => void;
  onSave: (override: Omit<Override, "id" | "setBy">) => void;
}

export default function OverrideFormModal({ flags, defaultFlagKey, onClose, onSave }: OverrideFormModalProps) {
  const [organisation, setOrganisation] = useState("");
  const [flagKey, setFlagKey] = useState(defaultFlagKey ?? flags[0]?.key ?? "");
  const [value, setValue] = useState(true);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const orgError = !organisation ? "Choose an organisation" : undefined;
  const flag = flags.find((f) => f.key === flagKey);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (orgError || !flagKey) return;
    onSave({ organisation, flagKey, value, note: note.trim() });
  };

  return (
    <Modal open onClose={onClose} labelledBy="override-form-title" className="max-w-lg rounded-2xl">
      <ModalHeader id="override-form-title" title="Add Override" onClose={onClose} />
      <form onSubmit={submit} noValidate className="space-y-4 overflow-y-auto px-5 pb-5 pt-4">
        <Field id="ov-org" label="Organisation" error={submitted ? orgError : undefined}>
          <select
            id="ov-org"
            value={organisation}
            onChange={(e) => setOrganisation(e.target.value)}
            aria-invalid={submitted && !!orgError}
            aria-describedby={submitted && orgError ? "ov-org-error" : undefined}
            className={inputClass}
          >
            <option value="" disabled>
              Select an organisation
            </option>
            {overrideOrganisations.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field id="ov-flag" label="Flag">
          <select id="ov-flag" value={flagKey} onChange={(e) => setFlagKey(e.target.value)} className={`${inputClass} font-mono`}>
            {flags.map((f) => (
              <option key={f.key} value={f.key}>
                {f.key}
              </option>
            ))}
          </select>
          {flag && (
            <p className="mt-1 text-xs text-slate-600">Global value: {flag.enabled ? "ON" : "OFF"}</p>
          )}
        </Field>
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-slate-900">Value for this organisation</legend>
          <div className="flex w-fit gap-1 rounded-md bg-slate-100 p-1">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={value === v}
                onClick={() => setValue(v)}
                className={`flex items-center gap-1.5 rounded px-4 py-1.5 font-mono text-xs ${
                  value === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                }`}
              >
                <span className={`size-1.5 rounded-full ${v ? "bg-emerald-500" : "bg-red-500"}`} aria-hidden="true" />
                {v ? "ON" : "OFF"}
              </button>
            ))}
          </div>
        </fieldset>
        <Field id="ov-note" label="Reason">
          <input
            id="ov-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Early access pilot participant"
            className={inputClass}
          />
        </Field>
        <p className="text-xs text-slate-600">An existing override for the same organisation and flag will be replaced.</p>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={btnOutline}>
            Cancel
          </button>
          <button type="submit" className={btnPrimary} disabled={flags.length === 0}>
            Add Override
          </button>
        </div>
      </form>
    </Modal>
  );
}

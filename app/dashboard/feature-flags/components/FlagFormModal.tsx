"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { XCircle } from "lucide-react";
import Modal from "../../roles/components/modals/Modal";
import { btnOutline, btnPrimary, inputClass } from "../../roles/components/ui";
import { CATEGORIES, toFlagKey, type Category, type Flag } from "../data";
import Toggle from "./Toggle";

interface FlagFormModalProps {
  flag: Flag | null; // null = create
  existingKeys: string[];
  onClose: () => void;
  onSave: (flag: Flag) => void;
}

export function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-900">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function ModalHeader({ id, title, onClose }: { id: string; title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5">
      <h2 id={id} className="text-base font-medium text-slate-900">
        {title}
      </h2>
      <button type="button" onClick={onClose} aria-label="Close" className="text-slate-900 hover:text-slate-600">
        <XCircle className="size-5" />
      </button>
    </div>
  );
}

// Create or edit a flag. Render with a key so the form resets per flag.
export default function FlagFormModal({ flag, existingKeys, onClose, onSave }: FlagFormModalProps) {
  const editing = flag !== null;
  const [name, setName] = useState(flag?.name ?? "");
  const [key, setKey] = useState(flag?.key ?? "");
  const [keyTouched, setKeyTouched] = useState(editing);
  const [description, setDescription] = useState(flag?.description ?? "");
  const [category, setCategory] = useState<Category>(flag?.category ?? "Detection");
  const [enabled, setEnabled] = useState(flag?.enabled ?? false);
  const [submitted, setSubmitted] = useState(false);

  const finalKey = keyTouched ? key : toFlagKey(name);
  const errors = {
    name: !name.trim() ? "Name is required" : undefined,
    key: !finalKey
      ? "Key is required"
      : !/^[a-z0-9_]+$/.test(finalKey)
        ? "Use lowercase letters, numbers and underscores only"
        : !editing && existingKeys.includes(finalKey)
          ? "A flag with this key already exists"
          : undefined,
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.name || errors.key) return;
    onSave({ key: finalKey, name: name.trim(), description: description.trim(), category, enabled });
  };

  const show = (err?: string) => (submitted ? err : undefined);

  return (
    <Modal open onClose={onClose} labelledBy="flag-form-title" className="max-w-lg rounded-2xl">
      <ModalHeader id="flag-form-title" title={editing ? "Edit Flag" : "New Flag"} onClose={onClose} />
      <form onSubmit={submit} noValidate className="space-y-4 overflow-y-auto px-5 pb-5 pt-4">
        <Field id="flag-name" label="Name" error={show(errors.name)}>
          <input
            id="flag-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Device Fingerprinting"
            aria-invalid={!!show(errors.name)}
            aria-describedby={show(errors.name) ? "flag-name-error" : undefined}
            className={inputClass}
          />
        </Field>
        <Field id="flag-key" label="Key" error={show(errors.key)}>
          <input
            id="flag-key"
            value={finalKey}
            readOnly={editing}
            onChange={(e) => {
              setKeyTouched(true);
              setKey(e.target.value);
            }}
            placeholder="device_fingerprinting"
            aria-invalid={!!show(errors.key)}
            aria-describedby={show(errors.key) ? "flag-key-error" : undefined}
            className={`${inputClass} font-mono`}
          />
        </Field>
        <Field id="flag-description" label="Description">
          <textarea
            id="flag-description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this flag control?"
            className={`${inputClass} h-auto resize-y py-2.5`}
          />
        </Field>
        <Field id="flag-category" label="Category">
          <select id="flag-category" value={category} onChange={(e) => setCategory(e.target.value as Category)} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-3">
          <span className="text-sm text-slate-900">Enabled globally</span>
          <Toggle checked={enabled} onChange={setEnabled} label="Enabled globally" />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={btnOutline}>
            Cancel
          </button>
          <button type="submit" className={btnPrimary}>
            {editing ? "Save Changes" : "Create Flag"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

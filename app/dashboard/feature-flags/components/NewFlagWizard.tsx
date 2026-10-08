"use client";

import { useState, type ReactNode } from "react";
import { Check, Globe, Info, Pause, Play } from "lucide-react";
import Modal from "../../roles/components/modals/Modal";
import { btnOutline, btnPrimary } from "../../roles/components/ui";
import { CATEGORIES, TOTAL_ORGS, toFlagKey, type Category, type Flag } from "../data";
import { ModalHeader } from "./FlagFormModal";

const STEPS = ["Basic details", "Rollout & activation", "Review & create"];
const PRESETS = [0, 10, 25, 50, 75, 100];

const input =
  "w-full rounded-md bg-slate-100 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b2b5d]/20 aria-invalid:ring-2 aria-invalid:ring-red-300";

interface Draft {
  name: string;
  key: string;
  keyTouched: boolean; // stop deriving the key from the name once edited
  description: string;
  category: Category | null;
  enabled: boolean;
  rollout: number;
}

const emptyDraft: Draft = { name: "", key: "", keyTouched: false, description: "", category: null, enabled: false, rollout: 100 };

interface NewFlagWizardProps {
  existingKeys: string[];
  onClose: () => void;
  onCreate: (flag: Flag) => void;
}

function Label({ htmlFor, children, hint }: { htmlFor?: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-slate-700">
      {children}
      {hint}
    </label>
  );
}

const Req = () => <span className="text-orange-700"> *</span>;

function StateCard({ selected, onSelect, icon, title, body }: { selected: boolean; onSelect: () => void; icon: ReactNode; title: string; body: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex flex-col items-center rounded-xl border px-4 py-6 text-center transition ${
        selected ? "border-[#0b2b5d]/50 bg-slate-300/60 text-slate-900" : "border-slate-200 text-slate-400 hover:border-slate-300"
      }`}
    >
      <span className={`flex size-6 items-center justify-center rounded-full text-white ${selected ? "bg-[#0b2b5d]" : "bg-slate-300"}`}>
        {icon}
      </span>
      <span className="mt-3 text-base font-medium">{title}</span>
      <span className={`mt-1 text-sm ${selected ? "text-slate-700" : ""}`}>{body}</span>
    </button>
  );
}

function ReviewRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-white px-3 py-3 text-sm">
      <span className="text-slate-700">{label}</span>
      <span className="min-w-0 break-words text-right text-slate-900">{children}</span>
    </div>
  );
}

export default function NewFlagWizard({ existingKeys, onClose, onCreate }: NewFlagWizardProps) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [created, setCreated] = useState<Flag | null>(null);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const key = draft.keyTouched ? draft.key : toFlagKey(draft.name);
  const keyError = !key
    ? undefined
    : !/^[a-z0-9_]+$/.test(key)
      ? "Use lowercase letters, numbers and underscores only"
      : existingKeys.includes(key)
        ? "A flag with this key already exists"
        : undefined;
  const step1Valid = !!draft.name.trim() && !!key && !keyError && !!draft.category;

  const reach = Math.round((TOTAL_ORGS * draft.rollout) / 100);

  const create = () => {
    const flag: Flag = {
      key,
      name: draft.name.trim(),
      description: draft.description.trim(),
      category: draft.category!,
      enabled: draft.enabled,
      rollout: draft.rollout,
    };
    onCreate(flag);
    setCreated(flag);
  };

  const restart = () => {
    setDraft(emptyDraft);
    setStep(0);
    setCreated(null);
  };

  if (created) {
    return (
      <Modal open onClose={onClose} labelledBy="flag-created-title" className="max-w-md rounded-2xl">
        <div className="flex flex-col items-center px-6 py-8 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-green-500">
            <span className="flex size-7 items-center justify-center rounded-full bg-white">
              <Check className="size-4.5 text-green-500" strokeWidth={3} aria-hidden="true" />
            </span>
          </span>
          <h2 id="flag-created-title" className="mt-4 text-lg font-semibold text-slate-900">
            Flag created successfully
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            {created.enabled
              ? `${created.name} is now live and rolling out to ${created.rollout}% of organizations.`
              : `${created.name} has been created and is disabled until you turn it on.`}
          </p>
          <div className="mt-5 flex gap-3">
            <button type="button" onClick={onClose} className={btnOutline}>
              Close
            </button>
            <button type="button" onClick={restart} className={btnPrimary}>
              Create another
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open onClose={onClose} labelledBy="new-flag-title" className="max-w-xl rounded-2xl">
      <div className="flex min-h-0 flex-col bg-slate-100">
        <ModalHeader id="new-flag-title" title="New Feature Flag" onClose={onClose} />
        <p className="px-5 text-xs text-slate-700">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>

        <div
          className="mx-5 mt-4 h-4 rounded-full bg-white p-0.5"
          role="progressbar"
          aria-label="Progress"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
        >
          <div className="h-full rounded-full bg-[#1e2f52] transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        <div className="mx-5 mt-5 overflow-y-auto rounded-2xl bg-white p-5">
          {step === 0 && (
            <div className="space-y-5 py-2">
              <div>
                <Label htmlFor="nf-name">
                  Display name
                  <Req />
                </Label>
                <input
                  id="nf-name"
                  autoFocus
                  value={draft.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g Real-Time Anomaly Scoring"
                  className={`${input} h-9`}
                />
              </div>
              <div>
                <Label htmlFor="nf-key" hint={<span className="text-xs font-normal text-slate-600"> — used in code</span>}>
                  Flag key
                  <Req />
                </Label>
                <input
                  id="nf-key"
                  value={key}
                  onChange={(e) => setDraft((d) => ({ ...d, key: e.target.value, keyTouched: true }))}
                  placeholder="real_time_anomaly_scoring"
                  aria-invalid={!!keyError}
                  aria-describedby={keyError ? "nf-key-error" : undefined}
                  className={`${input} h-9 font-mono`}
                />
                {keyError && (
                  <p id="nf-key-error" className="mt-1 text-xs text-red-600">
                    {keyError}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="nf-desc">
                  Description <span className="font-normal text-slate-500">(optional)</span>
                </Label>
                <textarea
                  id="nf-desc"
                  rows={3}
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe what this flag controls and when it could be enabled..."
                  className={`${input} resize-y py-2`}
                />
              </div>
              <fieldset>
                <legend className="mb-3 text-sm font-medium text-slate-700">
                  Category
                  <Req />
                </legend>
                <div role="radiogroup" className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={draft.category === c}
                      onClick={() => set("category", c)}
                      className={`min-w-15 rounded-md border px-2.5 py-1 text-[11px] transition ${
                        draft.category === c
                          ? "border-[#0b2b5d] bg-[#0b2b5d] text-white"
                          : "border-[#0b2b5d] text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="mb-3 text-sm font-medium text-slate-900">Initial state</p>
                <div role="radiogroup" aria-label="Initial state" className="grid gap-4 sm:grid-cols-2">
                  <StateCard
                    selected={!draft.enabled}
                    onSelect={() => set("enabled", false)}
                    icon={<Pause className="size-3" fill="currentColor" aria-hidden="true" />}
                    title="Disabled"
                    body="Create flag but keep it off - enable manually when ready."
                  />
                  <StateCard
                    selected={draft.enabled}
                    onSelect={() => set("enabled", true)}
                    icon={<Play className="size-3" aria-hidden="true" />}
                    title="Enabled"
                    body="Activate immediately on creation"
                  />
                </div>
              </div>

              <fieldset disabled={!draft.enabled} className="group">
                <div className="flex items-center justify-between">
                  <label htmlFor="nf-rollout" className="text-sm text-slate-900 group-disabled:text-slate-400">
                    Rollout Percentage
                  </label>
                  <span className="text-lg font-semibold text-orange-700 group-disabled:text-orange-300">{draft.rollout}%</span>
                </div>
                <input
                  id="nf-rollout"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={draft.enabled ? draft.rollout : 0}
                  onChange={(e) => set("rollout", Number(e.target.value))}
                  style={{
                    background: draft.enabled
                      ? `linear-gradient(to right, #1e2f52 ${draft.rollout}%, #f1f5f9 ${draft.rollout}%)`
                      : "#f8fafc",
                  }}
                  className="mt-3 h-4 w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#0b1f45] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0b1f45] disabled:[&::-webkit-slider-thumb]:bg-slate-400"
                />
                <div className="mt-3 flex flex-wrap gap-3">
                  {PRESETS.map((p) => {
                    const active = draft.enabled ? draft.rollout === p : p === 0;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => set("rollout", p)}
                        aria-pressed={active}
                        className={`w-15 rounded-md border py-1 text-[11px] transition group-disabled:border-slate-200 group-disabled:text-slate-400 ${
                          active ? "border-[#0b2b5d] bg-slate-300/60 text-slate-900 group-disabled:bg-slate-100" : "border-[#0b2b5d] text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        {p}%
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-[11px] text-slate-700 group-disabled:text-slate-400">
                  Rollout uses consistent hashing on organisation ID — the same org always gets the same result.
                </p>
              </fieldset>

              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
                  <Globe className="size-4" aria-hidden="true" /> Environment scope
                </p>
                <p className="mt-2 text-[11px] text-slate-700">
                  This flag will be created in Production. You can configure separate values for Staging and Development after creation.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-700">Review your flag configuration before creating. You can edit all settings after creation.</p>
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase text-slate-900">Details</h3>
                <div className="space-y-2 rounded-lg bg-slate-50 p-2">
                  <ReviewRow label="Display name">{draft.name.trim()}</ReviewRow>
                  <ReviewRow label="Flag key">
                    <span className="break-all font-mono text-blue-600">{key}</span>
                  </ReviewRow>
                  <ReviewRow label="Category">{draft.category}</ReviewRow>
                  <ReviewRow label="Description">{draft.description.trim() || "—"}</ReviewRow>
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase text-slate-900">Rollout</h3>
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
                  <span
                    className={`relative h-5 w-9 shrink-0 rounded-full ${draft.enabled ? "bg-indigo-600" : "bg-slate-400"}`}
                    aria-hidden="true"
                  >
                    <span className={`absolute top-0.5 size-4 rounded-full ${draft.enabled ? "translate-x-4.5 bg-white" : "translate-x-0.5 bg-slate-700"}`} />
                  </span>
                  {draft.enabled ? (
                    <div>
                      <p className="text-blue-600">Enabled on creation</p>
                      <p className="text-slate-700">
                        Rolling out to <strong className="text-slate-900">{draft.rollout}%</strong> of organizations
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-700">Disabled on creation</p>
                  )}
                </div>
              </div>
              {draft.enabled && (
                <div className="rounded-xl border border-slate-300 bg-amber-50/50 p-3 text-amber-600">
                  <p className="flex items-center gap-2 text-sm">
                    <Info className="size-4" aria-hidden="true" /> Estimated impact
                  </p>
                  <p className="mt-2 text-[11px]">
                    With {draft.rollout}% rollout, approximately <strong>{reach}</strong> of {TOTAL_ORGS} organisations will see this flag
                    enabled immediately.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-5">
          <div className="flex gap-1" aria-hidden="true">
            {STEPS.map((s, i) => (
              <span key={s} className={`h-1.5 rounded-full ${i === step ? "w-6 bg-[#1e2f52]" : "w-2.5 bg-slate-300"}`} />
            ))}
          </div>
          <div className="flex gap-3">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="px-2 text-sm font-medium text-slate-700 hover:text-slate-900">
                Back
              </button>
            )}
            <button type="button" onClick={onClose} className={btnOutline}>
              Cancel
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep(step + 1)} disabled={step === 0 && !step1Valid} className={btnPrimary}>
                Next
              </button>
            ) : (
              <button type="button" onClick={create} className={btnPrimary}>
                Create Flag
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

"use client";

import { useState } from "react";
import { CirclePlus, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { PageTitle } from "../organisations/components/ui";
import FlagFormModal from "./components/FlagFormModal";
import FlagRow from "./components/FlagRow";
import NewFlagWizard from "./components/NewFlagWizard";
import OverrideFormModal from "./components/OverrideFormModal";
import { CATEGORIES, initialFlags, initialOverrides, type Category, type Flag, type Override } from "./data";

type Tab = "All" | Category;

// Which form modal is open: a new flag, editing one, or a new override
type Dialog = { kind: "flag"; flag: Flag | null } | { kind: "override"; flagKey?: string } | null;

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState(initialFlags);
  const [overrides, setOverrides] = useState(initialOverrides);
  const [tab, setTab] = useState<Tab>("All");
  const [dialog, setDialog] = useState<Dialog>(null);

  const enabledCount = flags.filter((f) => f.enabled).length;
  const stats = [
    { label: "Total Flags", value: flags.length },
    { label: "Enabled", value: enabledCount },
    { label: "Disabled", value: flags.length - enabledCount },
    { label: "Org Overrides", value: overrides.length },
  ];

  const visible = tab === "All" ? flags : flags.filter((f) => f.category === tab);

  const toggleFlag = (key: string, enabled: boolean) => {
    setFlags((prev) => prev.map((f) => (f.key === key ? { ...f, enabled } : f)));
    toast.success(`${flags.find((f) => f.key === key)?.name} ${enabled ? "enabled" : "disabled"}`);
  };

  const saveFlag = (flag: Flag) => {
    const exists = flags.some((f) => f.key === flag.key);
    setFlags((prev) => (exists ? prev.map((f) => (f.key === flag.key ? flag : f)) : [...prev, flag]));
    toast.success(exists ? `${flag.name} updated` : `${flag.name} created`);
    setDialog(null);
  };

  const deleteFlag = (flag: Flag) => {
    const linked = overrides.filter((o) => o.flagKey === flag.key).length;
    const msg = linked
      ? `Delete "${flag.name}" and its ${linked} organisation override${linked > 1 ? "s" : ""}?`
      : `Delete "${flag.name}"?`;
    if (!window.confirm(msg)) return;
    setFlags((prev) => prev.filter((f) => f.key !== flag.key));
    setOverrides((prev) => prev.filter((o) => o.flagKey !== flag.key));
    toast.success(`${flag.name} deleted`);
  };

  const saveOverride = (o: Omit<Override, "id" | "setBy">) => {
    setOverrides((prev) => [
      ...prev.filter((p) => !(p.organisation === o.organisation && p.flagKey === o.flagKey)),
      { ...o, id: `ov_${Date.now()}`, setBy: "admin" },
    ]);
    toast.success(`Override added for ${o.organisation}`);
    setDialog(null);
  };

  const removeOverride = (o: Override) => {
    setOverrides((prev) => prev.filter((p) => p.id !== o.id));
    toast.success(`Override removed for ${o.organisation}`);
  };

  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle title="Feature Flags" subtitle="Control feature rollouts globally and per organisation" />
        <button
          type="button"
          onClick={() => setDialog({ kind: "flag", flag: null })}
          className="flex items-center gap-2 rounded-md bg-[#0b2b5d] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#0b2b5d]/90"
        >
          <CirclePlus className="size-4" aria-hidden="true" />
          New Flag
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map(({ label, value }) => (
          <section
            key={label}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
          >
            <p className="text-[11px] font-medium text-slate-900">{label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
          </section>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div role="tablist" aria-label="Filter by category" className="flex w-fit gap-1 rounded-lg bg-blue-50 p-1.5">
          {(["All", ...CATEGORIES] as const).map((t) => {
            const count = t === "All" ? flags.length : flags.filter((f) => f.category === t).length;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                aria-controls="flag-list"
                onClick={() => setTab(t)}
                title={`${count} flag${count === 1 ? "" : "s"}`}
                className={`whitespace-nowrap rounded px-3 py-1.5 text-xs font-medium ${
                  tab === t ? "bg-white text-orange-700 shadow-sm" : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <section id="flag-list" role="tabpanel" className="rounded-xl border border-slate-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        {visible.length ? (
          <ul>
            {visible.map((f) => (
              <FlagRow
                key={f.key}
                flag={f}
                onToggle={(enabled) => toggleFlag(f.key, enabled)}
                onEdit={() => setDialog({ kind: "flag", flag: f })}
                onAddOverride={() => setDialog({ kind: "override", flagKey: f.key })}
                onDelete={() => deleteFlag(f)}
              />
            ))}
          </ul>
        ) : (
          <p className="px-4 py-10 text-center text-sm text-slate-600">No {tab === "All" ? "" : `${tab} `}flags yet.</p>
        )}
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 px-4 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Organisation Overrides</h2>
            <p className="mt-0.5 text-xs text-slate-700">Per-org flag values that take precedence over global rollout settings</p>
          </div>
          <button
            type="button"
            onClick={() => setDialog({ kind: "override" })}
            className="flex items-center gap-2 rounded-md bg-[#0b2b5d] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#0b2b5d]/90"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add Override
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-slate-700">
              <tr>
                {["Organisation", "Flag", "Value", "Set By"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-4 font-medium">
                    {h}
                  </th>
                ))}
                <th scope="col" className="px-4 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {overrides.map((o) => (
                <tr key={o.id} className="border-t border-slate-200 first:border-t-0">
                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-900">{o.organisation}</p>
                    {o.note && <p className="mt-0.5 text-xs text-slate-700">{o.note}</p>}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-blue-800">{o.flagKey}</td>
                  <td className="px-4 py-4">
                    <span className="flex items-center gap-2 font-mono text-xs text-slate-700">
                      <span className={`size-1.5 rounded-full ${o.value ? "bg-emerald-500" : "bg-red-500"}`} aria-hidden="true" />
                      {o.value ? "ON" : "OFF"}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-700">{o.setBy}</td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => removeOverride(o)}
                      aria-label={`Remove ${o.flagKey} override for ${o.organisation}`}
                      className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {overrides.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-600">
                    No organisation overrides. Every organisation uses the global value.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {dialog?.kind === "flag" && !dialog.flag && (
        <NewFlagWizard
          existingKeys={flags.map((f) => f.key)}
          onClose={() => setDialog(null)}
          onCreate={(flag) => setFlags((prev) => [...prev, flag])}
        />
      )}
      {dialog?.kind === "flag" && dialog.flag && (
        <FlagFormModal
          key={dialog.flag.key}
          flag={dialog.flag}
          existingKeys={flags.map((f) => f.key)}
          onClose={() => setDialog(null)}
          onSave={saveFlag}
        />
      )}
      {dialog?.kind === "override" && (
        <OverrideFormModal
          flags={flags}
          defaultFlagKey={dialog.flagKey}
          onClose={() => setDialog(null)}
          onSave={saveOverride}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { CircleCheck, RotateCcw, Zap } from "lucide-react";
import { toast } from "react-toastify";
import Toggle from "../feature-flags/components/Toggle";
import { PageTitle, Panel } from "../organisations/components/ui";
import Slider from "./components/Slider";
import { globalImpact, initialConfig, ruleStats, type Rule } from "./data";

export default function DetectionConfigPage() {
  const [saved, setSaved] = useState(initialConfig);
  const [config, setConfig] = useState(initialConfig);

  const dirty = JSON.stringify(saved) !== JSON.stringify(config);
  const impact = globalImpact(config.globalSensitivity);

  const updateRule = (id: string, patch: Partial<Rule>) =>
    setConfig((c) => ({ ...c, rules: c.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));

  const save = () => {
    setSaved(config);
    toast.success("Detection configuration saved");
  };

  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle title="Detection Configuration" subtitle="Tune fraud detection rules, sensitivity, and thresholds" />
        <div className="flex items-center gap-3">
          {dirty && (
            <>
              <span className="text-xs font-medium text-orange-700">Unsaved changes</span>
              <button
                type="button"
                onClick={() => setConfig(saved)}
                className="flex items-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" /> Discard
              </button>
            </>
          )}
          <button
            type="button"
            onClick={save}
            disabled={!dirty}
            className="flex items-center gap-2 rounded-md bg-[#0b2b5d] px-3 py-2 text-xs font-medium text-white hover:bg-[#0b2b5d]/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CircleCheck className="size-4" aria-hidden="true" />
            Save Changes
          </button>
        </div>
      </div>

      <Panel className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              <label htmlFor="global-sensitivity">Global Detection Sensitivity</label>
            </h2>
            <p className="mt-1 text-xs text-slate-700">Master sensitivity affecting all detection rules</p>
          </div>
          <p className="text-xl font-bold text-slate-900">
            {config.globalSensitivity}
            <span className="text-xs font-medium text-slate-700">/100</span>
          </p>
        </div>
        <div className="mt-5">
          <Slider
            id="global-sensitivity"
            size="lg"
            value={config.globalSensitivity}
            onChange={(v) => setConfig((c) => ({ ...c, globalSensitivity: v }))}
            label="Global detection sensitivity"
            track="#0b1f45"
            thumb="#64748b"
          />
        </div>
        <div className="mt-3 flex justify-between gap-4 text-[11px] text-slate-700">
          <span>0 — Minimal (fewer alerts)</span>
          <span className="text-right">100 — Maximum (most alerts)</span>
        </div>
        <dl className="mt-5 grid grid-cols-3 divide-x divide-slate-400 rounded-lg bg-slate-50 py-5 text-center text-xs" aria-live="polite">
          <div className="px-2">
            <dt className="text-slate-700">Estimated Daily Alerts</dt>
            <dd className="mt-2 font-medium text-slate-900">{impact.dailyAlerts}</dd>
          </div>
          <div className="px-2">
            <dt className="text-slate-700">Est. False Positives</dt>
            <dd className="mt-2 font-medium text-slate-900">{impact.falsePositive.toFixed(1)}%</dd>
          </div>
          <div className="px-2">
            <dt className="text-slate-700">True Positive Rate</dt>
            <dd className="mt-2 font-medium text-slate-900">{impact.truePositive}%</dd>
          </div>
        </dl>
      </Panel>

      <section>
        <h2 className="mb-4 text-base font-semibold text-slate-900">Detection Rules</h2>
        <ul className="space-y-4">
          {config.rules.map((r) => {
            const stats = ruleStats(r);
            const sliderId = `rule-${r.id}`;
            return (
              <li key={r.id}>
                <Panel className={`p-4 transition-opacity ${r.enabled ? "" : "opacity-50"}`}>
                  <div className="flex items-center gap-3">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-slate-700">
                      <Zap className="size-3 text-slate-700" aria-hidden="true" />
                    </span>
                    <h3 className="text-sm font-medium text-slate-900">{r.name}</h3>
                    <span className="rounded-full border border-slate-300 px-2 py-px text-[10px] text-slate-700">{r.tag}</span>
                    <span className="ml-auto">
                      <Toggle
                        checked={r.enabled}
                        onChange={(enabled) => updateRule(r.id, { enabled })}
                        label={`${r.name} ${r.enabled ? "enabled" : "disabled"}`}
                      />
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <label htmlFor={sliderId} className="shrink-0 text-xs text-slate-700">
                      Sensitivity:
                    </label>
                    <Slider
                      id={sliderId}
                      value={r.sensitivity}
                      onChange={(sensitivity) => updateRule(r.id, { sensitivity })}
                      label={`${r.name} sensitivity`}
                      track={r.color.track}
                      thumb={r.color.thumb}
                      disabled={!r.enabled}
                    />
                    <span className="w-8 shrink-0 text-right text-sm font-semibold" style={{ color: r.color.text }}>
                      {r.sensitivity}
                    </span>
                  </div>
                  <p className="mt-3 text-[11px] text-slate-700">
                    False positive: <strong className="text-slate-900">{stats.falsePositive.toFixed(1)}%</strong>
                    <span className="ml-2">Triggered (30d):</span>{" "}
                    <strong className="text-slate-900">{stats.triggered.toLocaleString("en-US")}</strong>
                  </p>
                </Panel>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { VARIABLES, channelFields, type Channel, type TemplateContent } from "../data";

interface TemplateFieldsProps {
  idPrefix: string;
  channel: Channel;
  value: TemplateContent;
  onChange: (patch: Partial<TemplateContent>) => void;
  variables?: string[];
}

const field =
  "w-full rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0b2b5d] focus:outline-none focus:ring-2 focus:ring-[#0b2b5d]/10";

// Subject / sender / body inputs plus clickable variable chips.
// A chip is inserted at the cursor of whichever text field was focused last.
export default function TemplateFields({ idPrefix, channel, value, onChange, variables = VARIABLES }: TemplateFieldsProps) {
  const labels = channelFields[channel];
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const lastFocused = useRef<"subject" | "body">("body");

  const insert = (name: string) => {
    const target = lastFocused.current === "subject" && labels.subject ? "subject" : "body";
    const el = target === "subject" ? subjectRef.current : bodyRef.current;
    const token = `{{${name}}}`;
    const text = value[target];
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    onChange({ [target]: text.slice(0, start) + token + text.slice(end) });
    // Put the caret after the inserted token once React has re-rendered
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + token.length, start + token.length);
    });
  };

  return (
    <div className="space-y-5">
      {(labels.subject || labels.fromName) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {labels.subject && (
            <div className={labels.fromName ? "" : "sm:col-span-2"}>
              <label htmlFor={`${idPrefix}-subject`} className="mb-2 block text-xs font-medium text-slate-900">
                {labels.subject}
              </label>
              <input
                id={`${idPrefix}-subject`}
                ref={subjectRef}
                value={value.subject}
                onFocus={() => (lastFocused.current = "subject")}
                onChange={(e) => onChange({ subject: e.target.value })}
                placeholder={channel === "webhook" ? "https://" : "🚨 High-Priority Fraud Alert - {{org_name}}"}
                className={`${field} h-9 font-mono`}
              />
            </div>
          )}
          {labels.fromName && (
            <div className={labels.subject ? "" : "sm:col-span-2"}>
              <label htmlFor={`${idPrefix}-from`} className="mb-2 block text-xs font-medium text-slate-900">
                {labels.fromName}
              </label>
              <input
                id={`${idPrefix}-from`}
                value={value.fromName}
                onChange={(e) => onChange({ fromName: e.target.value })}
                placeholder={channel === "sms" ? "AXIOMVLT" : "AxiomVault Fraud Intelligence"}
                className={`${field} h-9`}
              />
            </div>
          )}
        </div>
      )}

      <div>
        <label htmlFor={`${idPrefix}-body`} className="mb-2 block text-xs font-medium text-slate-900">
          {labels.body}
        </label>
        <textarea
          id={`${idPrefix}-body`}
          ref={bodyRef}
          rows={channel === "sms" ? 4 : 12}
          value={value.body}
          onFocus={() => (lastFocused.current = "body")}
          onChange={(e) => onChange({ body: e.target.value })}
          placeholder={channel === "webhook" ? '{\n  "event_id": "{{event_id}}"\n}' : "Dear {{recipient_name}},"}
          className={`${field} resize-y py-2 font-mono leading-relaxed [scrollbar-color:#1e2f52_#e2e8f0]`}
        />
        {channel === "sms" && <p className="mt-1 text-right text-[11px] text-slate-600">{value.body.length} / 160 characters</p>}
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-slate-900">Available Variables</p>
        <ul className="flex flex-wrap gap-2" aria-label="Insert variable">
          {variables.map((v) => (
            <li key={v}>
              <button
                type="button"
                onClick={() => insert(v)}
                title={`Insert {{${v}}}`}
                className="rounded bg-slate-200 px-2 py-1 font-mono text-[10px] text-slate-800 hover:bg-slate-300"
              >
                {`{{${v}}}`}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

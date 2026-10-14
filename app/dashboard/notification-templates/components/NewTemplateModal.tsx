"use client";

import { useState, type FormEvent } from "react";
import { Mail, Smartphone, Webhook, XCircle, type LucideIcon } from "lucide-react";
import Modal from "../../roles/components/modals/Modal";
import { btnOutline, btnPrimary } from "../../roles/components/ui";
import {
  SEVERITY_LEVELS,
  TEMPLATE_EVENTS,
  today,
  type Channel,
  type SeverityLevel,
  type Template,
  type TemplateContent,
} from "../data";
import TemplateFields from "./TemplateFields";

const input =
  "w-full rounded-md bg-slate-100 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b2b5d]/20 aria-invalid:ring-2 aria-invalid:ring-red-300";

export const CHANNELS: { id: Channel; label: string; icon: LucideIcon }[] = [
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: Smartphone },
  { id: "webhook", label: "Webhook", icon: Webhook },
];

const severityStyle: Record<SeverityLevel, { on: string; dot: string }> = {
  Critical: { on: "border-red-500 bg-red-50 text-red-600", dot: "bg-red-500" },
  High: { on: "border-amber-400 bg-amber-50 text-amber-600", dot: "bg-amber-500" },
  Medium: { on: "border-orange-400 bg-orange-50 text-orange-600", dot: "bg-orange-400" },
  Low: { on: "border-blue-500 bg-blue-50 text-blue-600", dot: "bg-blue-500" },
};

const Req = () => <span className="text-orange-700"> *</span>;

interface NewTemplateModalProps {
  existingNames: string[];
  onClose: () => void;
  onCreate: (template: Template) => void;
}

export default function NewTemplateModal({ existingNames, onClose, onCreate }: NewTemplateModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [channel, setChannel] = useState<Channel>("email");
  const [event, setEvent] = useState("");
  const [severities, setSeverities] = useState<SeverityLevel[]>([]);
  const [content, setContent] = useState<TemplateContent>({ subject: "", fromName: "", body: "" });
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    name: !name.trim()
      ? "Template name is required"
      : existingNames.some((n) => n.toLowerCase() === name.trim().toLowerCase())
        ? "A template with this name already exists"
        : undefined,
    event: !event ? "Choose the event that sends this template" : undefined,
    body: !content.body.trim() ? "Body can't be empty" : undefined,
  };
  const show = (e?: string) => (submitted ? e : undefined);

  const toggleSeverity = (s: SeverityLevel) =>
    setSeverities((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : SEVERITY_LEVELS.filter((x) => x === s || prev.includes(x))));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.name || errors.event || errors.body) return;
    const date = today();
    onCreate({
      id: `tpl_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      channel,
      event,
      severities,
      status: "draft",
      version: 1,
      modified: date,
      ...content,
      history: [{ ...content, version: 1, date, note: "Initial draft", author: "admin" }],
    });
  };

  return (
    <Modal open onClose={onClose} labelledBy="new-template-title" className="max-w-2xl rounded-2xl">
      <form onSubmit={submit} noValidate className="flex min-h-0 flex-col bg-slate-100">
        <div className="flex items-start justify-between px-5 pt-5">
          <div>
            <h2 id="new-template-title" className="text-base font-semibold text-slate-900">
              New Notification Template
            </h2>
            <p className="mt-0.5 text-xs text-slate-700">Enter details below</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-900 hover:text-slate-600">
            <XCircle className="size-5" />
          </button>
        </div>

        <div className="mx-5 mt-5 space-y-5 overflow-y-auto rounded-2xl bg-white p-5">
          <div>
            <label htmlFor="nt-name" className="mb-2 block text-sm font-medium text-slate-700">
              Template name
              <Req />
            </label>
            <input
              id="nt-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. High Severity Fraud Alert - Email"
              aria-invalid={!!show(errors.name)}
              aria-describedby={show(errors.name) ? "nt-name-error" : undefined}
              className={`${input} h-9`}
            />
            {show(errors.name) && <p id="nt-name-error" className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="nt-desc" className="mb-2 block text-sm font-medium text-slate-700">
              Internal description <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <input
              id="nt-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose and audience of this template"
              className={`${input} h-9`}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="nt-event" className="mb-2 block text-sm font-medium text-slate-700">
                Template event
                <Req />
              </label>
              <select
                id="nt-event"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                aria-invalid={!!show(errors.event)}
                aria-describedby={show(errors.event) ? "nt-event-error" : undefined}
                className={`${input} h-9 ${event ? "font-mono" : "text-slate-400"}`}
              >
                <option value="" disabled>
                  Select event
                </option>
                {TEMPLATE_EVENTS.map((ev) => (
                  <option key={ev} value={ev} className="font-mono text-slate-900">
                    {ev}
                  </option>
                ))}
              </select>
              {show(errors.event) && <p id="nt-event-error" className="mt-1 text-xs text-red-600">{errors.event}</p>}
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-slate-700">Channel</legend>
              <div className="flex gap-1 rounded-md bg-slate-100 p-1">
                {CHANNELS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={channel === id}
                    onClick={() => setChannel(id)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded py-1.5 text-xs font-medium ${
                      channel === id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <fieldset>
            <legend className="mb-3 text-xs font-semibold text-slate-900">Send for severity levels</legend>
            <div className="flex flex-wrap gap-3">
              {SEVERITY_LEVELS.map((s) => {
                const on = severities.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleSeverity(s)}
                    className={`flex min-w-24 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm transition ${
                      on ? severityStyle[s].on : "border-slate-300 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    <span className={`size-3 rounded-full ${severityStyle[s].dot}`} aria-hidden="true" />
                    {s}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="rounded-lg border border-slate-300 p-4">
            <TemplateFields
              idPrefix="nt"
              channel={channel}
              value={content}
              onChange={(patch) => setContent((c) => ({ ...c, ...patch }))}
            />
            {show(errors.body) && <p className="mt-2 text-xs text-red-600">{errors.body}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-5 py-5">
          <button type="button" onClick={onClose} className={btnOutline}>
            Cancel
          </button>
          <button type="submit" className={btnPrimary}>
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}

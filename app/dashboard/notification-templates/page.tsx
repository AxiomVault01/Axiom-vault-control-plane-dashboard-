"use client";

import { useMemo, useState } from "react";
import { CirclePlus, History, RotateCcw, Search } from "lucide-react";
import { toast } from "react-toastify";
import { PageTitle } from "../organisations/components/ui";
import NewTemplateModal, { CHANNELS } from "./components/NewTemplateModal";
import TemplateFields from "./components/TemplateFields";
import TemplatePreview from "./components/TemplatePreview";
import { initialTemplates, today, type Template, type TemplateContent, type TemplateStatus } from "./data";

const TABS = ["Template Editor", "Live Preview", "Version History"] as const;
type Tab = (typeof TABS)[number];

const statusClass: Record<TemplateStatus, string> = {
  active: "bg-blue-50 text-blue-700",
  draft: "bg-slate-100 text-slate-600",
};

const contentOf = (t: Template): TemplateContent => ({ subject: t.subject, fromName: t.fromName, body: t.body });
const sameContent = (a: TemplateContent, b: TemplateContent) =>
  a.subject === b.subject && a.fromName === b.fromName && a.body === b.body;

function StatusBadge({ status }: { status: TemplateStatus }) {
  return <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${statusClass[status]}`}>{status}</span>;
}

export default function NotificationTemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedId, setSelectedId] = useState(initialTemplates[0].id);
  const [draft, setDraft] = useState<TemplateContent>(contentOf(initialTemplates[0]));
  const [tab, setTab] = useState<Tab>("Template Editor");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const selected = templates.find((t) => t.id === selectedId) ?? templates[0];
  const dirty = !sameContent(draft, contentOf(selected));
  const channelIcon = (t: Template) => CHANNELS.find((c) => c.id === t.channel)!.icon;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? templates.filter((t) => [t.name, t.event, t.channel].some((v) => v.toLowerCase().includes(q))) : templates;
  }, [templates, query]);

  const select = (t: Template) => {
    if (t.id === selectedId) return;
    if (dirty && !window.confirm("Discard unsaved changes to this template?")) return;
    setSelectedId(t.id);
    setDraft(contentOf(t));
  };

  const updateSelected = (fn: (t: Template) => Template) =>
    setTemplates((prev) => prev.map((t) => (t.id === selected.id ? fn(t) : t)));

  const save = () => {
    const date = today();
    updateSelected((t) => ({
      ...t,
      ...draft,
      version: t.version + 1,
      modified: date,
      history: [{ ...draft, version: t.version + 1, date, author: "admin", note: "Edited in template editor" }, ...t.history],
    }));
    toast.success(`Saved ${selected.name} as v${selected.version + 1}`);
  };

  const publish = () => {
    updateSelected((t) => ({ ...t, status: "active" }));
    toast.success(`${selected.name} is now active`);
  };

  const restore = (version: number) => {
    const v = selected.history.find((h) => h.version === version);
    if (!v) return;
    setDraft({ subject: v.subject, fromName: v.fromName, body: v.body });
    setTab("Template Editor");
    toast.info(`Loaded v${version} into the editor. Save to make it the current version.`);
  };

  const create = (t: Template) => {
    if (dirty && !window.confirm("Discard unsaved changes to the current template?")) return;
    setTemplates((prev) => [t, ...prev]);
    setSelectedId(t.id);
    setDraft(contentOf(t));
    setTab("Template Editor");
    setCreating(false);
    toast.success(`${t.name} created as a draft`);
  };

  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle title="Notification Templates" subtitle="Manage email, SMS, and webhook notification templates" />
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 rounded-md bg-[#0b2b5d] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#0b2b5d]/90"
        >
          <CirclePlus className="size-4" aria-hidden="true" />
          New Template
        </button>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[16rem_1fr]">
        <aside className="space-y-3 lg:sticky lg:top-6">
          <label className="flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-slate-400 focus-within:border-[#0b2b5d]">
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">Search templates</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </label>
          <ul className="flex gap-3 overflow-x-auto pb-1 lg:max-h-[calc(100dvh-14rem)] lg:flex-col lg:overflow-y-auto lg:overflow-x-visible lg:pb-0">
            {filtered.map((t) => {
              const Icon = channelIcon(t);
              const active = t.id === selected.id;
              return (
                <li key={t.id} className="w-56 shrink-0 lg:w-auto">
                  <button
                    type="button"
                    onClick={() => select(t)}
                    aria-current={active ? "true" : undefined}
                    className={`flex w-full gap-3 rounded-xl px-4 py-4 text-left transition ${
                      active ? "bg-blue-50 ring-1 ring-blue-100" : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-slate-900" aria-label={t.channel} />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-slate-900">{t.name}</span>
                      <span className="mt-1 block text-xs text-slate-600">{t.modified}</span>
                      <span className="mt-2 flex items-center gap-2 text-xs text-slate-700">
                        <StatusBadge status={t.status} /> v{t.version}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && <li className="px-2 py-6 text-center text-xs text-slate-600">No templates match “{query}”.</li>}
          </ul>
        </aside>

        <section className="rounded-2xl border border-slate-300 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-medium text-slate-900">{selected.name}</h2>
              <p className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-700">
                <StatusBadge status={selected.status} />
                <span>v{selected.version}</span>
                <span>Modified {selected.modified}</span>
                <span className="font-mono text-[11px] text-slate-500">{selected.event}</span>
              </p>
            </div>
            {selected.status === "draft" && !dirty && (
              <button
                type="button"
                onClick={publish}
                className="rounded-md border border-[#0b2b5d] px-3 py-1.5 text-xs font-medium text-[#0b2b5d] hover:bg-slate-50"
              >
                Publish
              </button>
            )}
          </div>

          <div role="tablist" aria-label="Template views" className="mt-5 flex gap-2 overflow-x-auto border-b border-slate-200">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${
                  tab === t ? "border-slate-900 text-slate-900" : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {t}
                {t === "Template Editor" && dirty && <span className="ml-1.5 inline-block size-1.5 rounded-full bg-orange-500 align-middle" aria-label="unsaved" />}
              </button>
            ))}
          </div>

          <div role="tabpanel" className="pt-5">
            {tab === "Template Editor" && (
              <>
                <TemplateFields
                  key={selected.id}
                  idPrefix="tpl"
                  channel={selected.channel}
                  value={draft}
                  onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
                />
                {dirty && (
                  <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4">
                    <span className="mr-auto text-xs font-medium text-orange-700">Unsaved changes</span>
                    <button
                      type="button"
                      onClick={() => setDraft(contentOf(selected))}
                      className="flex items-center gap-1.5 px-2 text-xs font-medium text-slate-700 hover:text-slate-900"
                    >
                      <RotateCcw className="size-3.5" aria-hidden="true" /> Discard
                    </button>
                    <button
                      type="button"
                      onClick={save}
                      disabled={!draft.body.trim()}
                      className="rounded-md bg-[#0b2b5d] px-4 py-2 text-xs font-medium text-white hover:bg-[#0b2b5d]/90 disabled:opacity-60"
                    >
                      Save as v{selected.version + 1}
                    </button>
                  </div>
                )}
              </>
            )}

            {tab === "Live Preview" && <TemplatePreview channel={selected.channel} content={draft} />}

            {tab === "Version History" && (
              <ol className="space-y-2">
                {selected.history.map((h) => {
                  const current = h.version === selected.version;
                  return (
                    <li key={h.version} className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm">
                      <History className="size-4 text-slate-500" aria-hidden="true" />
                      <span className="font-mono font-medium text-slate-900">v{h.version}</span>
                      {current && <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] text-blue-700">current</span>}
                      <span className="text-slate-700">{h.note}</span>
                      <span className="ml-auto text-xs text-slate-500">
                        {h.date} · {h.author}
                      </span>
                      {!current && (
                        <button type="button" onClick={() => restore(h.version)} className="text-xs font-medium text-orange-700 hover:underline">
                          Restore
                        </button>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </section>
      </div>

      {creating && (
        <NewTemplateModal
          existingNames={templates.map((t) => t.name)}
          onClose={() => setCreating(false)}
          onCreate={create}
        />
      )}
    </div>
  );
}

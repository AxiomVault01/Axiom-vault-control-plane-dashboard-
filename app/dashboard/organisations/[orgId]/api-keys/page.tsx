"use client";

import { useState, type FormEvent } from "react";
import { Copy, Eye, EyeOff, Info, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Panel, Pill } from "../../components/ui";
import { apiKeys as initialKeys, type ApiKey } from "../../data";

const mask = (token: string) => `${token.slice(0, 8)}••••••••••••${token.slice(-4)}`;

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return `ax_live_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

// API Keys tab
export default function OrganisationApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const copy = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      toast.success("Token copied to clipboard");
    } catch {
      toast.error("Could not copy token");
    }
  };

  const revoke = (id: string) => {
    setKeys((list) => list.map((k) => (k.id === id ? { ...k, revoked: true } : k)));
    if (revealed === id) setRevealed(null);
    toast.success("API key revoked");
  };

  const generate = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const key: ApiKey = {
      id: `k${Date.now()}`,
      name: name.trim(),
      token: randomToken(),
      createdBy: "Admin User (Admin)",
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      lastUsed: "Never",
      revoked: false,
    };
    setKeys((list) => [key, ...list]);
    setRevealed(key.id);
    setName("");
    setCreating(false);
    toast.success("New API key generated. Copy it now.");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded border border-slate-200 bg-slate-100 px-4 py-3 sm:flex-row sm:items-center">
        <p className="flex flex-1 items-center gap-2 text-xs text-slate-700">
          <Info className="size-4 shrink-0" aria-hidden="true" />
          API Keys allow programmatic authentication to AxiomVault ingestion endpoints.
        </p>
        <button
          type="button"
          onClick={() => setCreating((c) => !c)}
          className="flex h-9 items-center justify-center gap-1.5 rounded bg-black px-4 text-xs font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="size-4" aria-hidden="true" /> Generate New Key
        </button>
      </div>

      {creating && (
        <form onSubmit={generate} className="flex flex-col gap-2 rounded border border-slate-200 bg-white p-4 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Key name</span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Key name, e.g. Prod-Ingestion-Token-010"
              className="h-9 w-full rounded border border-slate-200 px-3 text-xs focus:border-[#0b2b5d] focus:outline-none"
            />
          </label>
          <button type="submit" disabled={!name.trim()} className="h-9 rounded bg-[#0b2b5d] px-4 text-xs font-semibold text-white disabled:bg-slate-300">
            Create key
          </button>
          <button type="button" onClick={() => setCreating(false)} className="h-9 rounded border border-slate-300 px-4 text-xs text-slate-800 hover:bg-slate-50">
            Cancel
          </button>
        </form>
      )}

      <Panel className="overflow-hidden rounded-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left text-xs">
            <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-700">
              <tr>
                {["Key Name", "Token Preview", "Created By", "Date Created", "Last Used", "Actions"].map((h, i) => (
                  <th key={h} scope="col" className={`px-4 py-3 font-semibold ${i === 0 ? "sm:pl-10" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} className={`border-t border-slate-100 ${k.revoked ? "bg-slate-50 text-slate-400" : "text-slate-800"}`}>
                  <td className={`px-4 py-4 font-semibold sm:pl-10 ${k.revoked ? "line-through" : "text-slate-900"}`}>{k.name}</td>
                  <td className="px-4 py-4">
                    <span className="flex items-center gap-1.5">
                      <code
                        className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${
                          k.revoked ? "bg-red-50 text-red-300 line-through" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {revealed === k.id ? k.token : mask(k.token)}
                      </code>
                      {!k.revoked && (
                        <button type="button" onClick={() => copy(k.token)} aria-label={`Copy ${k.name}`} className="rounded p-1 text-slate-600 hover:bg-slate-100">
                          <Copy className="size-3.5" />
                        </button>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4">{k.createdBy}</td>
                  <td className="px-4 py-4">{k.created}</td>
                  <td className="px-4 py-4">{k.lastUsed}</td>
                  <td className="px-4 py-4">
                    {k.revoked ? (
                      <Pill className="bg-red-50 text-red-600">Revoked</Pill>
                    ) : (
                      <span className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setRevealed((r) => (r === k.id ? null : k.id))}
                          aria-label={revealed === k.id ? `Hide ${k.name}` : `Reveal ${k.name}`}
                          className="rounded p-1.5 text-slate-700 hover:bg-slate-100"
                        >
                          {revealed === k.id ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Revoke "${k.name}"? Apps using it will stop authenticating.`)) revoke(k.id);
                          }}
                          aria-label={`Revoke ${k.name}`}
                          className="rounded p-1.5 text-slate-700 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

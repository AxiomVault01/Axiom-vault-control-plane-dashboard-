"use client";

import { useState } from "react";
import { Cloud, Database, Webhook } from "lucide-react";
import { toast } from "react-toastify";
import { Panel, Pill } from "../../components/ui";
import { integrations as initialIntegrations, type Integration } from "../../data";

const icons: Record<Integration["icon"], typeof Cloud> = {
  cloud: Cloud,
  database: Database,
  webhook: Webhook,
};

// Integrations tab
export default function OrganisationIntegrationsPage() {
  const [items, setItems] = useState(initialIntegrations);
  const [configuring, setConfiguring] = useState<string | null>(null);

  const setConnected = (id: string, connected: boolean) => {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, connected } : i)));
    const name = items.find((i) => i.id === id)?.name;
    toast.success(connected ? `${name} connected` : `${name} disconnected`);
    setConfiguring(null);
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-800">
        Manage connected cloud provider integrations, log exporters, and external security tooling for this tenant environment.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((i) => {
          const Icon = icons[i.icon];
          const open = configuring === i.id;
          return (
            <Panel key={i.id} className="flex flex-col rounded-md p-4">
              <div className="flex items-start justify-between">
                <Icon className="size-6 text-slate-900" aria-hidden="true" />
                <Pill className={i.connected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}>
                  {i.connected ? "Connected" : "Inactive"}
                </Pill>
              </div>
              <h2 className="mt-3 text-sm font-semibold text-slate-900">{i.name}</h2>
              <p className="mt-1 flex-1 text-xs text-slate-700">{i.description}</p>

              {open && (
                <div className="mt-4 space-y-2 rounded border border-slate-200 bg-slate-50 p-3 text-xs">
                  <p className="text-slate-700">
                    {i.connected ? "This integration is active and syncing." : "Connect this integration to start forwarding events."}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConnected(i.id, !i.connected)}
                      className={`h-8 flex-1 rounded px-3 font-semibold text-white ${i.connected ? "bg-red-600 hover:bg-red-700" : "bg-black hover:bg-slate-800"}`}
                    >
                      {i.connected ? "Disconnect" : "Connect"}
                    </button>
                    <button type="button" onClick={() => setConfiguring(null)} className="h-8 rounded border border-slate-300 bg-white px-3 text-slate-800 hover:bg-slate-100">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!open && (
                <button
                  type="button"
                  onClick={() => setConfiguring(i.id)}
                  className={`mt-4 h-9 w-full rounded text-xs font-semibold ${
                    i.connected
                      ? "border border-slate-300 text-slate-900 hover:bg-slate-50"
                      : "bg-black text-white hover:bg-slate-800"
                  }`}
                >
                  {i.connected ? "Configure" : "Setup Integration"}
                </button>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Ellipsis, Pencil, Plus, Trash2 } from "lucide-react";
import type { Flag } from "../data";
import Toggle from "./Toggle";

interface FlagRowProps {
  flag: Flag;
  onToggle: (enabled: boolean) => void;
  onEdit: () => void;
  onAddOverride: () => void;
  onDelete: () => void;
}

export default function FlagRow({ flag, onToggle, onEdit, onAddOverride, onDelete }: FlagRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the actions menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const item = "flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50";
  const run = (fn: () => void) => () => {
    setMenuOpen(false);
    fn();
  };

  return (
    <li className="flex items-center gap-4 px-4 py-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-medium text-slate-900">{flag.name}</h3>
          <span className="rounded-full border border-slate-300 px-2 py-px text-[11px] text-slate-700">{flag.category}</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-700">{flag.description}</p>
        <p className="mt-2 font-mono text-[11px] text-slate-700">
          {flag.key}
          {flag.enabled && flag.rollout !== undefined && flag.rollout < 100 && (
            <span className="ml-2 rounded bg-orange-50 px-1.5 py-px font-sans text-orange-700">{flag.rollout}% rollout</span>
          )}
        </p>
      </div>

      <Toggle checked={flag.enabled} onChange={onToggle} label={`${flag.name} ${flag.enabled ? "enabled" : "disabled"}`} />

      <span className={`hidden w-16 text-right text-xs font-medium sm:inline ${flag.enabled ? "text-indigo-600" : "text-slate-600"}`}>
        {flag.enabled ? "Enabled" : "Disabled"}
      </span>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={`Actions for ${flag.name}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className={`rounded p-1 hover:bg-slate-100 ${flag.enabled ? "text-indigo-600" : "text-slate-500"}`}
        >
          <Ellipsis className="size-4" />
        </button>
        {menuOpen && (
          <div role="menu" className="absolute right-0 z-10 mt-1 w-40 rounded-md border border-slate-200 bg-white py-1 text-xs text-slate-700 shadow-lg">
            <button type="button" role="menuitem" className={item} onClick={run(onEdit)}>
              <Pencil className="size-3.5" aria-hidden="true" /> Edit flag
            </button>
            <button type="button" role="menuitem" className={item} onClick={run(onAddOverride)}>
              <Plus className="size-3.5" aria-hidden="true" /> Add override
            </button>
            <button type="button" role="menuitem" className={`${item} text-red-600`} onClick={run(onDelete)}>
              <Trash2 className="size-3.5" aria-hidden="true" /> Delete
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

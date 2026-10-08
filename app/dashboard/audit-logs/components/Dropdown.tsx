"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label: ReactNode;
  ariaLabel: string;
  active?: boolean;
  menuClassName?: string;
  // Render prop so items can close the menu after choosing
  children: (close: () => void) => ReactNode;
}

// Button + popover that closes on outside click or Escape
export default function Dropdown({ label, ariaLabel, active, menuClassName = "w-44", children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-medium hover:bg-slate-50 ${
          active ? "border-[#0b2b5d] text-[#0b2b5d]" : "border-slate-200 text-slate-900"
        }`}
      >
        <span className="max-w-44 truncate">{label}</span>
        <ChevronDown className={`size-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div className={`absolute right-0 z-20 mt-1 rounded-md border border-slate-200 bg-white py-1 text-xs shadow-lg ${menuClassName}`}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

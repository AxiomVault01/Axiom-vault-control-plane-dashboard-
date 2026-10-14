interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export default function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-[2.28rem] shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
        checked ? "bg-indigo-600" : "bg-slate-400"
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full shadow transition-transform cursor-pointer ${
          checked ? "translate-x-4.3 bg-white" : "-translate-x-4.5 bg-slate-700"
        }`}
      />
    </button>
  );
}

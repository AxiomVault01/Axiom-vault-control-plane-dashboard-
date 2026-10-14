import type { CSSProperties } from "react";

interface SliderProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  label: string;
  track: string; // filled portion
  thumb: string;
  disabled?: boolean;
  size?: "sm" | "lg";
}

// Native range input with a filled track and coloured thumb
export default function Slider({ id, value, onChange, label, track, thumb, disabled, size = "sm" }: SliderProps) {
  const h = size === "lg" ? "h-3" : "h-2.5";
  return (
    <input
      id={id}
      type="range"
      min={0}
      max={100}
      value={value}
      disabled={disabled}
      aria-label={label}
      onChange={(e) => onChange(Number(e.target.value))}
      style={
        {
          background: `linear-gradient(to right, ${track} ${value}%, #d4d4d8 ${value}%)`,
          "--thumb": thumb,
        } as CSSProperties
      }
      className={`${h} w-full cursor-pointer appearance-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-(--thumb) [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-(--thumb)`}
    />
  );
}

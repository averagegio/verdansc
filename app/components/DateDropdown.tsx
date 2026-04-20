"use client";

import { useRef } from "react";

type DateDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function DateDropdown({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
}: DateDropdownProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const input = inputRef.current as (HTMLInputElement & {
      showPicker?: () => void;
    }) | null;
    if (!input) return;
    input.focus();
    input.showPicker?.();
  };

  return (
    <div
      className={`group relative flex items-center rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 ${className}`}
    >
      <input
        ref={inputRef}
        className="w-full bg-transparent pr-8 text-sm text-slate-100 outline-none"
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={placeholder}
      />
      <button
        type="button"
        onClick={openPicker}
        className="absolute right-2 inline-flex h-6 w-6 items-center justify-center rounded-md border border-cyan-300/40 text-cyan-100 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-cyan-400/10"
        aria-label="Open calendar"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="h-3.5 w-3.5"
        >
          <rect
            x="3.5"
            y="5.5"
            width="17"
            height="15"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M7.5 3.5V7.5M16.5 3.5V7.5M3.5 9.5H20.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  );
}


import { Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";

interface PwInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggleShow: () => void;
  error?: string;
}

export function PwInput({
  label,
  value,
  onChange,
  show,
  onToggleShow,
  error,
}: PwInputProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <Lock
          size={13}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border bg-gray-50 outline-none transition-all"
          style={{
            borderColor: error ? "#fca5a5" : "#e5e7eb",
            color: "#111827",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
          }}
          onFocus={(e) => {
            if (!error) e.currentTarget.style.borderColor = "#15622f";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px rgba(21,98,47,0.08), inset 0 1px 2px rgba(0,0,0,0.04)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "#fca5a5" : "#e5e7eb";
            e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.04)";
          }}
        />
        <button
          type="button"
          onClick={onToggleShow}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5">
          <AlertTriangle size={11} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
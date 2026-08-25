import type { LucideIcon } from "lucide-react";

interface FieldInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  suffix?: React.ReactNode;
  error?: boolean;
}

export function FieldInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  suffix,
  error
}: FieldInputProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${Icon ? "pl-10" : "px-3"} ${suffix ? "pr-10" : "pr-3"} py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all`}
          style={{
            borderColor: error ? "#fca5a5" : "#e5e7eb",
            color: "#111827",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)"
          }}
        />
        {suffix && <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">{suffix}</div>}
      </div>
    </div>
  );
}
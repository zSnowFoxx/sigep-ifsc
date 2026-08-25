import { ChevronDown } from "lucide-react";

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

export default function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  const placeholder = `Todos os ${label.split(" ")[0].toLowerCase()}s`;

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-muted-foreground mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
          style={{ color: value ? "var(--foreground)" : "var(--muted-foreground)" }}
        >
          {options.map((option, idx) => (
            <option key={idx} value={option}>
              {option || placeholder}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>
    </div>
  );
}
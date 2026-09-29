import { Check, X } from "lucide-react";

interface StrengthRuleProps {
  ok: boolean;
  label: string;
}

export function StrengthRule({ ok, label }: StrengthRuleProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
          ok ? "bg-[#15622f]" : "bg-gray-200"
        }`}
      >
        {ok ? (
          <Check size={9} color="white" strokeWidth={3} />
        ) : (
          <X size={8} className="text-gray-400" strokeWidth={3} />
        )}
      </div>
      <span
        className={`text-xs transition-colors ${
          ok ? "text-[#0f4a23] font-medium" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
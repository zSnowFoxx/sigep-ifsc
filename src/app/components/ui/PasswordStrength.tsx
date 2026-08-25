import { Check, X } from "lucide-react";

export function PasswordStrength({ password }: { password: string }) {
  const rules = [
    { label: "Mínimo de 8 caracteres", ok: password.length >= 8 },
    { label: "Pelo menos 1 número", ok: /\d/.test(password) },
    { label: "Pelo menos 1 caractere especial (@, #, $, etc.)", ok: /[@#$%^&*!?]/.test(password) },
  ];
  return (
    <div className="space-y-1.5 pt-1">
      {rules.map((r) => (
        <div key={r.label} className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${r.ok ? "bg-[#15622f]" : "bg-gray-200"}`}>
            {r.ok ? <Check size={9} color="white" strokeWidth={3} /> : <X size={8} className="text-gray-400" strokeWidth={3} />}
          </div>
          <span className={`text-xs transition-colors ${r.ok ? "text-[#0f4a23] font-medium" : "text-gray-500"}`}>{r.label}</span>
        </div>
      ))}
    </div>
  );
}
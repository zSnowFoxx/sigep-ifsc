import { Check } from "lucide-react";

export function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-3 py-4 border-b border-gray-100">
      {Array.from({ length: total }).map((_, i) => {
        const done = i + 1 < step;
        const active = i + 1 === step;
        return (
          <div key={i} className="flex items-center gap-3">
            <div className={`flex items-center justify-center rounded-full font-bold text-xs transition-all ${done ? "w-7 h-7 bg-[#15622f] text-white" : active ? "w-7 h-7 bg-[#0f4a23] text-white ring-4 ring-[#0f4a23]/20" : "w-7 h-7 bg-gray-100 text-gray-400"}`}>
              {done ? <Check size={12} strokeWidth={3} /> : i + 1}
            </div>
            {i < total - 1 && <div className="h-0.5 w-8 transition-all" style={{ background: done ? "#15622f" : "#e5e7eb" }} />}
          </div>
        );
      })}
    </div>
  );
}
export function OtpBoxes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const slots = 6;
  const digits = value.padEnd(slots, " ").split("").slice(0, slots);

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          data-index={i}
          onChange={(e) => {
            const ch = e.target.value.replace(/\D/g, "").slice(-1);
            const arr = value.padEnd(slots, " ").split("").slice(0, slots);
            arr[i] = ch || " ";
            const next = e.currentTarget.parentElement?.querySelector<HTMLInputElement>(`[data-index="${i + 1}"]`);
            if (ch && next) next.focus();
            onChange(arr.join("").trimEnd());
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              const arr = value.padEnd(slots, " ").split("").slice(0, slots);
              if (arr[i].trim()) {
                arr[i] = " ";
                onChange(arr.join("").trimEnd());
              } else if (i > 0) {
                const prev = e.currentTarget.parentElement?.querySelector<HTMLInputElement>(`[data-index="${i - 1}"]`);
                prev?.focus();
              }
            }
          }}
          className="w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all"
          style={{
            borderColor: d.trim() ? "#15622f" : "#e5e7eb",
            color: "#0f4a23",
            background: d.trim() ? "#f0faf4" : "#f9fafb",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        />
      ))}
    </div>
  );
}
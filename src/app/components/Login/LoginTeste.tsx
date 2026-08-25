import { Lock } from "lucide-react";
import { credenciaisTeste } from "../../data/authData";

export default function LoginTeste() {
  return (
    <div className="px-10 pb-8">
      <div className="border-t border-gray-100 pt-5">
        <div
          className="rounded-xl border px-4 py-3 space-y-1.5"
          style={{ background: "#f8faf9", borderColor: "#d1e8d9" }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Lock size={11} style={{ color: "#15622f" }} />
            <span className="text-xs font-bold" style={{ color: "#0f4a23" }}>
              Credenciais de teste
            </span>
            <span
              className="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{ background: "#e8f0eb", color: "#15622f" }}
            >
              Pré-configurado
            </span>
          </div>
          {credenciaisTeste.map((row) => (
            <div key={row.label} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-14 shrink-0">{row.label}:</span>
              <code
                className="text-xs font-mono font-semibold px-2 py-0.5 rounded"
                style={{ background: "#e8f0eb", color: "#0f4a23" }}
              >
                {row.value}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
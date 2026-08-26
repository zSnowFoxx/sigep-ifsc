import { Database, Loader2, Zap, CheckCircle2, ChevronDown, User, Hash, ArrowLeft } from "lucide-react";
import type { Role } from "../../../types/auth";
import { FieldInput } from "../../ui/FieldInput";
import { GreenBtn } from "../../ui/GreenBtn";
import { OutlineBtn } from "../../ui/OutlineBtn";

interface RegisterDataProps {
  name: string;
  setName: (v: string) => void;
  siape: string;
  setSiape: (v: string) => void;
  role: Role | "";
  setRole: (v: Role | "") => void;
  roleOptions: string[];
  loadingOptions: boolean;
  sigaaLoading: boolean;
  sigaaFetched: boolean;
  manualMode: boolean;
  setManualMode: React.Dispatch<React.SetStateAction<boolean>>;
  onFetchSigaa: () => void;
  onClearSigaa: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function RegisterData({
  name, setName, siape, setSiape, role, setRole,
  roleOptions, loadingOptions, sigaaLoading, sigaaFetched,
  manualMode, setManualMode, onFetchSigaa, onClearSigaa, onNext, onBack
}: RegisterDataProps) {
  const step2Valid = name.trim() && siape.trim() && role;

  return (
    <>
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Importação de Dados do Servidor</p>
        <p className="text-xs text-gray-500">Busque automaticamente via SIGAA ou preencha manualmente.</p>
      </div>

      {!sigaaFetched && (
        <button
          type="button"
          onClick={onFetchSigaa}
          disabled={sigaaLoading}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all hover:border-[#15622f] hover:bg-[#f8faf9] disabled:opacity-60"
          style={{ borderColor: "#d1e8d9", background: "#f8faf9" }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #0f4a23, #15622f)" }}>
            {sigaaLoading ? <Loader2 size={18} className="animate-spin text-white" /> : <Database size={18} className="text-white" />}
          </div>
          <div className="text-left flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-800">Buscar Dados no SIGAA</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#fef3c7", color: "#92400e" }}>
                <Zap size={10} className="fill-amber-500 text-amber-500" /> Rápido
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Importa SIAPE, nome, cargo e disciplinas automaticamente</p>
          </div>
        </button>
      )}

      {sigaaFetched && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs" style={{ background: "#f0faf4", borderColor: "#bbf7d0", color: "#166534" }}>
          <CheckCircle2 size={14} className="shrink-0" />
          <span>Dados importados com sucesso do SIGAA</span>
          <button type="button" onClick={onClearSigaa} className="ml-auto underline text-xs">
            Limpar
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 shrink-0">ou</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={() => setManualMode((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all hover:bg-gray-50 text-sm font-semibold text-gray-700"
        style={{ borderColor: manualMode ? "#15622f" : "#e5e7eb", background: manualMode ? "#f8faf9" : "white" }}
      >
        <span>Preencher Dados Manualmente</span>
        <ChevronDown size={15} className={`transition-transform ${manualMode ? "rotate-180" : ""}`} />
      </button>

      {(manualMode || sigaaFetched) && (
        <div className="space-y-4">
          <FieldInput label="Nome Completo" type="text" value={name} onChange={setName} placeholder="Nome completo do servidor" icon={User} />
          <FieldInput label="SIAPE" type="text" value={siape} onChange={setSiape} placeholder="0000000" icon={Hash} />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Cargo / Função</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                disabled={loadingOptions}
                className="w-full pl-3 pr-8 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none appearance-none cursor-pointer disabled:opacity-50"
                style={{ borderColor: "#e5e7eb", color: role ? "#111827" : "#9ca3af" }}
              >
                <option value="">{loadingOptions ? "Carregando cargos..." : "Selecione um cargo..."}</option>
                {roleOptions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <OutlineBtn onClick={onBack}><ArrowLeft size={14} /> Voltar</OutlineBtn>
        <GreenBtn type="button" onClick={onNext} disabled={!step2Valid}>Continuar</GreenBtn>
      </div>
    </>
  );
}
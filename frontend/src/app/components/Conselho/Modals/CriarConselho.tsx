import { useState } from "react";
import { ClipboardList, X, Tag, UserCheck } from "lucide-react";
import { turmasDisponiveis } from "../../../data/conselhoData";

interface CriarConselhoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CriarConselho({
  isOpen,
  onClose,
  onConfirm,
}: CriarConselhoProps) {
  const [fNome, setFNome] = useState("");
  const [fTurmas, setFTurmas] = useState<string[]>([
    "TDS - 1ª Fase",
    "TDS - 2ª Fase",
  ]);
  const [fTurmaInput, setFTurmaInput] = useState("");
  const [fTurmaOpen, setFTurmaOpen] = useState(false);

  if (!isOpen) return null;

  const removeTurma = (t: string) =>
    setFTurmas((prev) => prev.filter((x) => x !== t));

  const addTurma = (t: string) => {
    if (!fTurmas.includes(t)) setFTurmas((prev) => [...prev, t]);
    setFTurmaInput("");
    setFTurmaOpen(false);
  };

  const turmasSugeridas = turmasDisponiveis.filter(
    (t) =>
      !fTurmas.includes(t) &&
      t.toLowerCase().includes(fTurmaInput.toLowerCase())
  );

  const cursoMap: Record<string, { curso: string; coordenador: string }> = {
    TDS: {
      curso: "Técnico em Desenvolvimento de Sistemas",
      coordenador: "Prof. Ricardo Alves",
    },
    Mecatrônica: {
      curso: "Técnico em Mecatrônica",
      coordenador: "Profa. Camila Torres",
    },
    Administração: {
      curso: "Técnico em Administração",
      coordenador: "Prof. Henrique Lopes",
    },
    Informática: {
      curso: "Técnico em Informática para Internet",
      coordenador: "Profa. Sandra Melo",
    },
  };

  const cursosPresentes = Array.from(
    new Set(
      fTurmas
        .map((t) => {
          const match = Object.keys(cursoMap).find((k) => t.startsWith(k));
          return match ?? null;
        })
        .filter(Boolean)
    )
  ) as string[];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full flex flex-col bg-card rounded-2xl shadow-2xl"
        style={{ maxWidth: "520px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 rounded-t-2xl flex items-center justify-between shrink-0"
          style={{
            background:
              "linear-gradient(135deg, #0b3d1e 0%, #15622f 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <ClipboardList size={18} color="white" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/60">
                Conselho de Classe · Novo Conselho
              </p>
              <h2 className="text-sm font-bold text-white">
                Criar novo conselho de classe
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Campo: Nome de Identificação */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Nome de Identificação <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-muted-foreground mb-1.5">
              Use um nome fácil para identificar este conselho depois, ex:
              "Intermediário TDS 2026.1"
            </p>
            <input
              type="text"
              value={fNome}
              onChange={(e) => setFNome(e.target.value)}
              placeholder="Ex: Conselho Intermediário — TDS 2026.1"
              className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
            />
          </div>

          {/* Campo: Turmas Vinculadas */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Turma(s) Vinculada(s) <span className="text-red-500">*</span>
              <span className="font-normal text-muted-foreground ml-1">
                (suporta múltiplas turmas)
              </span>
            </label>
            <div
              className="min-h-11 flex flex-wrap gap-1.5 px-3 py-2 rounded-lg border border-border bg-[#f7f8fa] cursor-text transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
              onClick={() => setFTurmaOpen(true)}
            >
              {fTurmas.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: "var(--secondary)",
                    color: "var(--primary)",
                  }}
                >
                  {t}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTurma(t);
                    }}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={fTurmaInput}
                onChange={(e) => {
                  setFTurmaInput(e.target.value);
                  setFTurmaOpen(true);
                }}
                onFocus={() => setFTurmaOpen(true)}
                placeholder={fTurmas.length === 0 ? "Buscar turma..." : ""}
                className="flex-1 min-w-25 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
            {fTurmaOpen && turmasSugeridas.length > 0 && (
              <div className="mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10 relative">
                {turmasSugeridas.slice(0, 6).map((t) => (
                  <button
                    key={t}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addTurma(t);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#f7f8fa] transition-colors border-b border-border last:border-0 flex items-center gap-2"
                  >
                    <Tag size={11} className="text-muted-foreground shrink-0" />
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Coordenadores Convocados */}
          {fTurmas.length > 0 && (
            <div className="rounded-xl border border-[#d1fae5] bg-[#f0fdf4] px-4 py-3.5 space-y-2.5">
              <div className="flex items-center gap-2 mb-1">
                <UserCheck size={13} style={{ color: "var(--primary)" }} />
                <span className="text-xs font-bold text-foreground">
                  Coordenador(es) de Curso Convocados
                </span>
              </div>
              {cursosPresentes.map((k) => {
                const info = cursoMap[k];
                return (
                  <div
                    key={k}
                    className="flex items-center justify-between bg-white rounded-lg border border-[#bbf7d0] px-3 py-2.5"
                  >
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {info.coordenador}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {info.curso}
                      </p>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "#dcfce7",
                        color: "#15803d",
                        border: "1px solid #86efac",
                      }}
                    >
                      Convocado
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t border-border flex gap-2 shrink-0 rounded-b-2xl"
          style={{ background: "#fafbfc" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!fNome || fTurmas.length === 0}
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="flex-1 py-2.5 text-sm font-bold rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(135deg, #0f4a23 0%, #15622f 100%)",
              boxShadow: "0 4px 12px rgba(15,74,35,0.25)",
            }}
          >
            Criar e visualizar conselho
          </button>
        </div>
      </div>
    </div>
  );
}
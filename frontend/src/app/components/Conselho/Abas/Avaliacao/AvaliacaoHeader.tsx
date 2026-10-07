import { CheckCircle, AlertTriangle } from "lucide-react";
import type { Aluno, AlunoEval } from "../../../../types/conselho";

interface AvaliacaoHeaderProps {
  current: Aluno;
  currentEval: AlunoEval;
}

export function AvaliacaoHeader({ current, currentEval }: AvaliacaoHeaderProps) {
  return (
    <div
      className="rounded-xl border px-5 py-4 flex items-center justify-between"
      style={{
        background: currentEval.risco ? "linear-gradient(135deg,#fff7ed 0%,#fff3e0 100%)" : "var(--card)",
        borderColor: currentEval.risco ? "#f97316" : "var(--border)",
        boxShadow: currentEval.risco ? "0 0 0 1px rgba(249,115,22,0.12)" : undefined,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: "var(--primary)", color: "white" }}
        >
          {current.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-base font-bold text-foreground leading-tight">{current.nome}</p>
            {current.atencao && (
              <span className="text-xs bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                Atenção Pedagógica Ativa
              </span>
            )}
            {currentEval.risco && (
              <span className="text-xs bg-orange-100 text-orange-800 border border-orange-300 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <AlertTriangle size={10} /> Risco de Evasão
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "monospace" }}>
            Matrícula: {current.matricula}&ensp;·&ensp;{current.turma}
          </p>
        </div>
      </div>
      {currentEval.saved && (
        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 shrink-0">
          <CheckCircle size={11} /> Parecer salvo
        </span>
      )}
    </div>
  );
}
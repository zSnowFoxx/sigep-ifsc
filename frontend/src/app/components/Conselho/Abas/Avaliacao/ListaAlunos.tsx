import React from "react";
import { ChevronDown, ChevronRight, CheckCircle, AlertTriangle } from "lucide-react";
import type { Aluno, AlunoEval, Disciplina, TurmaData } from "../../../../types/conselho";

interface ListaAlunosProps {
  turmas: TurmaData[];
  totalAlunos: number;
  avaliacoes: Record<string, AlunoEval>;
  openTurmas: Record<number, boolean>;
  setOpenTurmas: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  selectedAluno: string;
  setSelectedAluno: (matricula: string) => void;
  disciplinasData: Record<string, Disciplina[]>;
}

export function ListaAlunos({
  turmas,
  totalAlunos,
  avaliacoes,
  openTurmas,
  setOpenTurmas,
  selectedAluno,
  setSelectedAluno,
  disciplinasData,
}: ListaAlunosProps) {
  const renderAlunoItem = (a: Aluno, turmaId: number) => {
    const ev = avaliacoes[a.matricula];
    const isSelected = selectedAluno === a.matricula;
    const discsA = disciplinasData[a.matricula] ?? [];
    const temNotas = discsA.length > 0;
    const acad = {
      mediaSistema: temNotas ? discsA.reduce((s, d) => s + d.nota, 0) / discsA.length : 0,
      presentes: discsA.reduce((s, d) => s + d.presentes, 0),
      chTotal: discsA.reduce((s, d) => s + d.ch, 0),
    };
    const freq = temNotas ? Math.round((acad.presentes / acad.chTotal) * 100) : 0;

    const gradePill =
      acad.mediaSistema >= 7.1
        ? { bg: "#dcfce7", text: "#15803d", label: `Média ${acad.mediaSistema.toFixed(1)}` }
        : acad.mediaSistema >= 6.0
        ? { bg: "#ffedd5", text: "#c2410c", label: `Média ${acad.mediaSistema.toFixed(1)}` }
        : { bg: "#fee2e2", text: "#b91c1c", label: `Média ${acad.mediaSistema.toFixed(1)}` };

    const freqPill =
      freq >= 80
        ? { bg: "#dcfce7", text: "#15803d", label: `${freq}% presença` }
        : freq >= 75
        ? { bg: "#ffedd5", text: "#c2410c", label: `${freq}% presença` }
        : { bg: "#fee2e2", text: "#b91c1c", label: `${freq}% presença` };

    return (
      <button
        key={`${turmaId}-${a.matricula}`}
        onClick={() => setSelectedAluno(a.matricula)}
        className="w-full text-left px-4 py-3 border-b border-border transition-colors"
        style={{
          background: isSelected ? "var(--secondary)" : "transparent",
          borderLeft: isSelected ? "3px solid var(--primary)" : "3px solid transparent",
        }}
        onMouseEnter={(e) => {
          if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(21,98,47,0.04)";
        }}
        onMouseLeave={(e) => {
          if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background: isSelected ? "var(--primary)" : "#d1d5db",
              color: isSelected ? "white" : "#374151",
            }}
          >
            {a.nome
              .split(" ")
              .filter((n) => n.length > 1)
              .slice(0, 2)
              .map((n) => n[0])
              .join("")}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold truncate text-foreground leading-tight">{a.nome}</p>
              <div className="flex items-center gap-1 shrink-0">
                {ev?.saved && <CheckCircle size={12} style={{ color: "var(--primary)" }} />}
                {ev?.risco && <AlertTriangle size={12} className="text-orange-500" />}
                {isSelected && <ChevronRight size={12} className="text-muted-foreground" />}
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {temNotas ? (
                <>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: gradePill.bg, color: gradePill.text }}>
                    {gradePill.label}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: freqPill.bg, color: freqPill.text }}>
                    {freqPill.label}
                  </span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground italic">Sem notas registradas</span>
              )}
            </div>

            {a.atencao && (
              <div className="mt-1.5">
                <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                  Atenção Ativa
                </span>
              </div>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="shrink-0 border-r border-border flex flex-col overflow-hidden bg-[#f7f8fa]" style={{ width: "308px" }}>
      <div className="px-4 py-3.5 border-b border-border bg-card shrink-0">
        <h2 className="text-sm font-semibold text-foreground">Discentes por Turma</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {Object.values(avaliacoes).filter((e) => e.saved).length} de {totalAlunos} pareceres salvos
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {turmas.map((turma, i) => {
          const aberta = !!openTurmas[turma.id];
          return (
            <div key={turma.id}>
              <button
                onClick={() => setOpenTurmas((prev) => ({ ...prev, [turma.id]: !prev[turma.id] }))}
                className="w-full flex items-center gap-2 px-4 py-3 border-b border-border bg-card hover:bg-[#f0f2f5] transition-colors"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? "" : "bg-muted-foreground/30"}`}
                  style={i === 0 ? { background: "var(--primary)" } : undefined}
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className={`text-sm font-bold truncate ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}>{turma.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {turma.alunosList.length} alunos · {turma.alunosList.filter((a) => avaliacoes[a.matricula]?.saved).length} salvos
                  </p>
                </div>
                {aberta ? <ChevronDown size={14} className="text-muted-foreground shrink-0" /> : <ChevronRight size={14} className="text-muted-foreground shrink-0" />}
              </button>

              {aberta && <div>{turma.alunosList.map((a) => renderAlunoItem(a, turma.id))}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

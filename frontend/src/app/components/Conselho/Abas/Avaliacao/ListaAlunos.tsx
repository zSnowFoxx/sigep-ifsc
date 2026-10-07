import React from "react";
import { ChevronDown, ChevronRight, CheckCircle, AlertTriangle } from "lucide-react";
import type { Aluno, AlunoEval, Disciplina } from "../../../../types/conselho";

interface ListaAlunosProps {
  alunos: Aluno[];
  alunosTurmaB: Aluno[];
  avaliacoes: Record<string, AlunoEval>;
  groupAOpen: boolean;
  setGroupAOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupBOpen: boolean;
  setGroupBOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAluno: string;
  setSelectedAluno: (matricula: string) => void;
  disciplinasData: Record<string, Disciplina[]>;
  defaultDisciplinas: Disciplina[];
}

export function ListaAlunos({
  alunos,
  alunosTurmaB,
  avaliacoes,
  groupAOpen,
  setGroupAOpen,
  groupBOpen,
  setGroupBOpen,
  selectedAluno,
  setSelectedAluno,
  disciplinasData,
  defaultDisciplinas,
}: ListaAlunosProps) {
  const renderAlunoItem = (a: Aluno) => {
    const ev = avaliacoes[a.matricula];
    const isSelected = selectedAluno === a.matricula;
    const discsA = disciplinasData[a.matricula] ?? defaultDisciplinas;
    const acad = {
      mediaSistema: discsA.reduce((s, d) => s + d.nota, 0) / discsA.length,
      presentes: discsA.reduce((s, d) => s + d.presentes, 0),
      chTotal: discsA.reduce((s, d) => s + d.ch, 0),
    };
    const freq = Math.round((acad.presentes / acad.chTotal) * 100);

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
        key={a.matricula}
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
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: gradePill.bg, color: gradePill.text }}>
                {gradePill.label}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: freqPill.bg, color: freqPill.text }}>
                {freqPill.label}
              </span>
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
          {Object.values(avaliacoes).filter((e) => e.saved).length} de {alunos.length + alunosTurmaB.length} pareceres salvos
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Grupo A */}
        <div>
          <button
            onClick={() => setGroupAOpen((v) => !v)}
            className="w-full flex items-center gap-2 px-4 py-3 border-b border-border bg-card hover:bg-[#f0f2f5] transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--primary)" }} />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-foreground truncate">TDS - 2ª Fase</p>
              <p className="text-xs text-muted-foreground">
                {alunos.length} alunos · {alunos.filter((a) => avaliacoes[a.matricula]?.saved).length} salvos
              </p>
            </div>
            {groupAOpen ? <ChevronDown size={14} className="text-muted-foreground shrink-0" /> : <ChevronRight size={14} className="text-muted-foreground shrink-0" />}
          </button>

          {groupAOpen && (
            <div>
              {[...alunos]
                .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
                .map(renderAlunoItem)}
            </div>
          )}
        </div>

        {/* Grupo B */}
        <div>
          <button
            onClick={() => setGroupBOpen((v) => !v)}
            className="w-full flex items-center gap-2 px-4 py-3 border-b border-border bg-card hover:bg-[#f0f2f5] transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 shrink-0" />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-muted-foreground truncate">Mecatrônica - 3ª Fase</p>
              <p className="text-xs text-muted-foreground">
                {alunosTurmaB.length} alunos · {alunosTurmaB.filter((a) => avaliacoes[a.matricula]?.saved).length} salvos
              </p>
            </div>
            {groupBOpen ? <ChevronDown size={14} className="text-muted-foreground shrink-0" /> : <ChevronRight size={14} className="text-muted-foreground shrink-0" />}
          </button>

          {groupBOpen && (
            <div>
              {[...alunosTurmaB]
                .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
                .map(renderAlunoItem)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
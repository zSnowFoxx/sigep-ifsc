import React from "react";
import { ChevronDown } from "lucide-react";
import type { Disciplina } from "../../../../types/conselho";
import { PainelDisciplinas } from "./PainelDisciplinas";

interface AvaliacaoDesempenhoProps {
  selectedAluno: string;
  disciplinasData: Record<string, Disciplina[]>;
  defaultDisciplinas: Disciplina[];
  selectedDisc: Record<string, number>;
  setSelectedDisc: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  retificadas: Record<string, string>;
  setRetificadas: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setAbonomat: React.Dispatch<React.SetStateAction<string | null>>;
  setAbonoText: React.Dispatch<React.SetStateAction<string>>;
}

export function AvaliacaoDesempenho({
  selectedAluno,
  disciplinasData,
  defaultDisciplinas,
  selectedDisc,
  setSelectedDisc,
  retificadas,
  setRetificadas,
  setAbonomat,
  setAbonoText,
}: AvaliacaoDesempenhoProps) {
  const discs = disciplinasData[selectedAluno] ?? defaultDisciplinas;
  const discIdx = selectedDisc[selectedAluno] ?? 0;
  const disc = discs[discIdx] ?? discs[0];

  const globalMedia = discs.reduce((s, d) => s + d.nota, 0) / discs.length;
  const globalCH = discs.reduce((s, d) => s + d.ch, 0);
  const globalPres = discs.reduce((s, d) => s + d.presentes, 0);
  const globalFreq = Math.round((globalPres / globalCH) * 100);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
        <div className="w-1 h-4 rounded-full shrink-0" style={{ background: "var(--primary)" }} />
        <h3 className="text-sm font-bold text-foreground">Desempenho Acadêmico e Gestão por Disciplina</h3>
        <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">SIGAA · 2026.1</span>
      </div>

      {/* Banner Read-Only Global */}
      <div className="px-4 py-2 border-b border-border flex items-center gap-4 flex-wrap" style={{ background: "#f7f8fa" }}>
        <div className="flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground shrink-0">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-xs text-muted-foreground">Média Global Acumulada:</span>
          <span
            className="text-xs font-bold"
            style={{ color: globalMedia < 6 ? "#dc2626" : globalMedia < 7 ? "#d97706" : "#15803d" }}
          >
            {globalMedia.toFixed(1)}
          </span>
        </div>
        <div className="w-px h-3 bg-border shrink-0" />
        <div className="flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground shrink-0">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-xs text-muted-foreground">Frequência Global Acumulada:</span>
          <span
            className="text-xs font-bold"
            style={{ color: globalFreq < 75 ? "#dc2626" : globalFreq < 80 ? "#d97706" : "#15803d" }}
          >
            {globalFreq}%
          </span>
        </div>
        <span className="text-xs text-muted-foreground/70 ml-auto hidden sm:block">
          Cálculo automático projetado a partir das disciplinas matriculadas
        </span>
      </div>

      {/* Seletor de Disciplina */}
      <div className="px-4 py-2.5 border-b border-border">
        <label className="block text-xs font-semibold text-foreground mb-1.5">
          Selecione a Disciplina para Retificação:
        </label>
        <div className="relative">
          <select
            value={discIdx}
            onChange={(e) => setSelectedDisc((prev) => ({ ...prev, [selectedAluno]: Number(e.target.value) }))}
            className="w-full appearance-none text-sm font-medium pl-3 pr-8 py-2 rounded-lg border border-border bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
            style={{ color: "var(--foreground)" }}
          >
            {discs.map((d, i) => (
              <option key={i} value={i}>
                {d.nome} ({d.ch}h) — {d.professor}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Editor de Disciplina (PainelDisciplinas) */}
      <PainelDisciplinas
        disc={disc}
        selectedAluno={selectedAluno}
        retificadas={retificadas}
        setRetificadas={setRetificadas}
        setAbonomat={setAbonomat}
        setAbonoText={setAbonoText}
      />
    </div>
  );
}
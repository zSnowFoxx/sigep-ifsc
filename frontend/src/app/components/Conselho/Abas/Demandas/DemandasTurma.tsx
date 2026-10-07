import { Users, UserCheck } from "lucide-react";
import type { TurmaData } from "../../../../types/conselho";

interface DemandasTurmaProps {
  turmasData: TurmaData[];
  activeTurmaIdx: number;
  setActiveTurmaIdx: (idx: number) => void;
  currentTurmaD: TurmaData;
}

export function DemandasTurma({
  turmasData,
  activeTurmaIdx,
  setActiveTurmaIdx,
  currentTurmaD,
}: DemandasTurmaProps) {
  return (
    <div className="bg-card rounded-xl border border-border px-5 py-3.5 flex items-center gap-4 flex-wrap">
      {turmasData.length > 1 ? (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Turma:</span>
          <select
            value={activeTurmaIdx}
            onChange={(e) => setActiveTurmaIdx(Number(e.target.value))}
            className="text-sm font-semibold border border-border rounded-lg px-3 py-1.5 bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer"
            style={{ color: "var(--primary)" }}
          >
            {turmasData.map((t, i) => (
              <option key={i} value={i}>{t.nome}</option>
            ))}
          </select>
        </div>
      ) : (
        <span className="text-sm font-semibold" style={{ color: "var(--primary)" }}>{currentTurmaD.nome}</span>
      )}
      <div className="h-4 w-px bg-border shrink-0" />
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users size={12} className="shrink-0" />
        {currentTurmaD.alunosList.length} alunos
      </span>
      <div className="h-4 w-px bg-border shrink-0" />
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <UserCheck size={12} className="shrink-0" />
        Coord.: <span className="font-semibold text-foreground ml-0.5">{currentTurmaD.coord}</span>
      </span>
      <span className="ml-auto text-xs text-muted-foreground">{currentTurmaD.semestre}</span>
    </div>
  );
}
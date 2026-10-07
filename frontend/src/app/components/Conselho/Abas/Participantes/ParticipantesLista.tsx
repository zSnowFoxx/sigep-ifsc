import { Users, CheckCircle, Circle } from "lucide-react";
import type { Professor } from "../../../../types/conselho";

interface ParticipantesListaProps {
  professores: Professor[];
  onTogglePresenca: (index: number) => void;
}

export function ParticipantesLista({
  professores,
  onTogglePresenca,
}: ParticipantesListaProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <Users size={14} style={{ color: "var(--primary)" }} />
        <h2 className="text-sm font-semibold text-foreground">Lista de Participantes</h2>
        <p className="text-xs text-muted-foreground ml-auto">Clique para alternar presença</p>
      </div>
      <div className="divide-y divide-border">
        {professores.map((p, i) => {
          const isPresent = p.presente;
          const initials = p.nome
            .split(" ")
            .filter((n) => n.length > 2)
            .slice(0, 2)
            .map((n) => n[0])
            .join("");

          return (
            <div
              key={p.usuarioId}
              className="flex items-center gap-4 px-5 py-3.5 cursor-pointer hover:bg-[#f7f8fa] transition-colors"
              onClick={() => onTogglePresenca(i)}
            >
              <div className="shrink-0">
                {isPresent ? (
                  <CheckCircle size={18} style={{ color: "var(--primary)" }} />
                ) : (
                  <Circle size={18} className="text-muted-foreground/30" />
                )}
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: isPresent ? "var(--secondary)" : "var(--muted)",
                  color: isPresent ? "var(--primary)" : "var(--muted-foreground)",
                }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${isPresent ? "text-foreground" : "text-muted-foreground"}`}>
                  {p.nome}
                </p>
                <p className="text-xs text-muted-foreground">
                  {[p.cargo, p.disciplina !== "—" ? p.disciplina : ""].filter(Boolean).join(" · ")}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
                  isPresent
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-[#f7f8fa] text-muted-foreground border-border"
                }`}
              >
                {isPresent ? "Presente" : "Ausente"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
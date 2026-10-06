import React from "react";
import { Users, CheckCircle, Circle } from "lucide-react";
import type { Professor } from "../../../types/conselho";

interface ConselhoParticipantesProps {
  professores: Professor[];
  presenteToggle: Record<number, boolean>;
  setPresenteToggle: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

export default function ConselhoParticipantes({
  professores,
  presenteToggle,
  setPresenteToggle,
}: ConselhoParticipantesProps) {
  // Calculamos a contagem de presentes diretamente dentro do componente
  const presentCount = Object.values(presenteToggle).filter(Boolean).length;

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-5">

            {/* Summary bar */}
            <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
            <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Confirmados presentes</p>
                <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${(presentCount / professores.length) * 100}%`, background: "var(--primary)" }}
                    />
                </div>
                <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>
                    {presentCount}/{professores.length}
                </span>
                </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-center px-2">
                <p className="text-2xl font-bold text-emerald-600">{presentCount}</p>
                <p className="text-xs text-muted-foreground">Presentes</p>
            </div>
            <div className="text-center px-2">
                <p className="text-2xl font-bold text-muted-foreground/60">{professores.length - presentCount}</p>
                <p className="text-xs text-muted-foreground">Ausentes</p>
            </div>
            </div>

            {/* List */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                <Users size={14} style={{ color: "var(--primary)" }} />
                <h2 className="text-sm font-semibold text-foreground">Lista de Participantes</h2>
                <p className="text-xs text-muted-foreground ml-auto">Clique para alternar presença</p>
            </div>
            <div className="divide-y divide-border">
                {professores.map((p, i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 px-5 py-3.5 cursor-pointer hover:bg-[#f7f8fa] transition-colors"
                    onClick={() => setPresenteToggle((prev) => ({ ...prev, [i]: !prev[i] }))}
                >
                    <div className="shrink-0">
                    {presenteToggle[i]
                        ? <CheckCircle size={18} style={{ color: "var(--primary)" }} />
                        : <Circle size={18} className="text-muted-foreground/30" />}
                    </div>
                    <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                        background: presenteToggle[i] ? "var(--secondary)" : "var(--muted)",
                        color:      presenteToggle[i] ? "var(--primary)"   : "var(--muted-foreground)",
                    }}
                    >
                    {p.nome.split(" ").filter((n) => n.length > 2).slice(0, 2).map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${presenteToggle[i] ? "text-foreground" : "text-muted-foreground"}`}>
                        {p.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">{p.cargo}{p.disciplina !== "—" ? ` · ${p.disciplina}` : ""}</p>
                    </div>
                    <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
                        presenteToggle[i]
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-[#f7f8fa] text-muted-foreground border-border"
                    }`}
                    >
                    {presenteToggle[i] ? "Presente" : "Ausente"}
                    </span>
                </div>
                ))}
            </div>
            </div>

            {/* Footer note */}
            <p className="text-xs text-muted-foreground text-center pb-2">
            A lista de presença será registrada automaticamente na ata oficial ao concluir o conselho.
            </p>
        </div>
        </div>
  );
}
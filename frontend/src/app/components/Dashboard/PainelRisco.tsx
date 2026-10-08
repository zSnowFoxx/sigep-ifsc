import { AlertTriangle, UserCheck, ExternalLink } from "lucide-react";
import type { UserSession } from "../../types/auth";
import type { StudentRisk, NivelRisco } from "../../types/dashboard";
import { riscoConfig } from "../../data/dashData";
import {
  TableContainer,
  Th,
  Td,
  TRow,
  EmptyState,
} from "../ui/TablePrimitives";

interface PainelRiscoProps {
  filteredStudents: StudentRisk[];
  totalRiskStudents: number;
  selectedPeriod: string;
  onEncaminhar: (matricula: string) => void;
  loggedUser?: UserSession | null;
}

export default function PainelRisco({
  filteredStudents,
  totalRiskStudents,
  selectedPeriod,
  onEncaminhar,
  loggedUser = null,
}: PainelRiscoProps) {

  const isServidor = loggedUser?.role === "Servidor Geral";
  // const isProfessor = loggedUser?.role === "Professor";
  // const isNAE = loggedUser?.role === "Equipe Pedagógica/NAE";
  // const isCoordenador = loggedUser?.role === "Coordenador de Curso";

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Header do Card */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            <h2 className="text-sm font-semibold text-foreground">
              Painel de Monitoramento de Risco Acadêmico
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filteredStudents.length} aluno{filteredStudents.length !== 1 ? "s" : ""} em situação de alerta — período {selectedPeriod}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Médio
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />Alto
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Crítico
          </span>
        </div>
      </div>

      {/* Tabela Padronizada com Primitivos */}
      <TableContainer>
        <thead>
          <tr>
            {isServidor ? (
              // IF: Se for servidor
              ["Matrícula", "Nome do Aluno", "Turma", "Média Parcial", "% Infrequência", "Fatores de Alerta", "Nível de Risco"].map((col, idx) => (
                <Th key={col} className={idx === 6 ? "text-right" : ""}>
                  {col}
                </Th>
              ))
            ) : (
              // ELSE: Se não for servidor
              ["Matrícula", "Nome do Aluno", "Turma", "Média Parcial", "% Infrequência", "Fatores de Alerta", "Nível de Risco", "Ações"].map((col, idx) => (
                <Th key={col} className={idx === 7 ? "text-right" : ""}>
                  {col}
                </Th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length === 0 ? (
            <EmptyState colSpan={8} message="Nenhum aluno encontrado para os filtros selecionados." />
          ) : (
            filteredStudents.map((s, i) => {
              const risco = s.risco as NivelRisco;
              const cfg = riscoConfig[risco] ?? {
                rowClass: "",
                badgeClass: "bg-gray-100 text-gray-800",
                label: risco || "Desconhecido",
              };

              const mediaVal = s.media ?? 0;
              const freqVal = s.infrequencia ?? 0;

              // --- Lógica do Indicador de Média ---
              // Vermelho: < 6 | Amarelo: <= 7 | Normal: > 7
              let mediaColorClass = "text-foreground";
              let mediaIcon = null;

              if (typeof mediaVal === "number") {
                if (mediaVal < 6) {
                  mediaColorClass = "text-red-600";
                  mediaIcon = <span className="ml-1.5 text-xs text-red-500" title="Abaixo de 6 (Atenção Crítica)">▼</span>;
                } else if (mediaVal < 7) {
                  mediaColorClass = "text-amber-500";
                  mediaIcon = <span className="ml-1.5 text-xs text-amber-500" title="Abaixo ou igual a 7 (Atenção)">▼</span>;
                }
              }

              // --- Lógica do Indicador de Frequência ---
              // Vermelho: < 20 | Amarelo: < 15 (se a prioridade for o valor mais crítico primeiro: < 15 vermelho e < 20 amarelo)
              let freqColorClass = "text-foreground";
              let freqIcon = null;

              if (typeof freqVal === "number") {
                if (freqVal > 15 && freqVal < 20) {
                  freqColorClass = "text-amber-500";
                  freqIcon = <span className="ml-1.5 text-xs text-amber-500" title="Abaixo de 15%">▼</span>;
                } else if (freqVal >= 20) {
                  freqColorClass = "text-red-600";
                  freqIcon = <span className="ml-1.5 text-xs text-red-500" title="Abaixo de 20%">▼</span>;
                }
              }

              const fatoresList = Array.isArray(s.fatores) ? s.fatores : [];

              return (
                <TRow key={s.matricula || i} className={cfg.rowClass}>
                  <Td className="font-mono text-xs text-muted-foreground font-medium">
                    {s.matricula}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: "var(--secondary)", color: "var(--primary)" }}
                      >
                        {s.nome ? s.nome.split(" ").map((n) => n[0]).slice(0, 2).join("") : "AL"}
                      </div>
                      <span className="text-sm font-medium text-foreground">{s.nome}</span>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-xs bg-[#f0f2f5] text-foreground px-2 py-1 rounded-md font-medium">
                      {s.turma || "Sem Turma"}
                    </span>
                  </Td>
                  <Td>
                    <span
                      className={`text-sm font-bold ${mediaColorClass}`}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {typeof mediaVal === "number" ? mediaVal.toFixed(1) : "N/A"}
                    </span>
                    {mediaIcon}
                  </Td>
                  <Td>
                    <span
                      className={`text-sm font-bold ${freqColorClass}`}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {typeof freqVal === "number" ? `${freqVal}%` : "N/A"}
                    </span>
                    {freqIcon}
                  </Td>
                  <Td className="max-w-55">
                    <div className="flex flex-wrap gap-1">
                      {fatoresList.map((f, j) => (
                        <span
                          key={j}
                          className="text-xs bg-orange-50 text-orange-800 border border-orange-200 px-2 py-0.5 rounded-full"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </Td>
                  <Td>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badgeClass}`}>
                      {cfg.label}
                    </span>
                  </Td>
                  {!isServidor && (
                    <Td className="text-right">
                      <button
                        onClick={() => onEncaminhar(s.matricula)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 hover:opacity-90 active:scale-95"
                        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                      >
                        <UserCheck size={12} />
                        Encaminhar
                      </button>
                    </Td>
                  )}
                </TRow>
              );
            })
          )}
        </tbody>
      </TableContainer>

      {/* Footer do Card */}
      <div className="px-5 py-3 bg-[#f7f8fa] border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Exibindo {filteredStudents.length} de {totalRiskStudents} alunos em alerta
        </p>
        <button className="text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: "var(--primary)" }}>
          Ver todos os alunos <ExternalLink size={11} />
        </button>
      </div>
    </div>
  );
}
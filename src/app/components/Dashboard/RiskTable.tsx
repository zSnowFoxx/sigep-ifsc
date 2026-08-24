import { AlertTriangle, UserCheck, ExternalLink } from "lucide-react";
import type { StudentRisk, NivelRisco } from "../../types/dashboard";
import { riscoConfig } from "../../data/mockData";

interface RiskTableProps {
  filteredStudents: StudentRisk[];
  totalRiskStudents: number;
  selectedPeriod: string;
  onStartAttendance: (student: { matricula: string; nome: string; turma: string }) => void;
}

export default function RiskTable({
  filteredStudents,
  totalRiskStudents,
  selectedPeriod,
  onStartAttendance,
}: RiskTableProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            <h2 className="text-sm font-semibold text-foreground">
              Painel de Monitoramento de Risco Acadêmico
            </h2>
            <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-medium">
              RF06
            </span>
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f7f8fa] border-b border-border">
              {["Matrícula", "Nome do Aluno", "Turma", "Média Parcial", "% Infrequência", "Fatores de Alerta", "Nível de Risco", "Ações"].map((col) => (
                <th
                  key={col}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  Nenhum aluno encontrado para os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s, i) => {
                const risco = s.risco as NivelRisco;
                const cfg = riscoConfig[risco];
                const mediaAlert = s.media < 6;
                const freqAlert = s.infrequencia >= 25;
                return (
                  <tr
                    key={i}
                    className={`border-b border-border last:border-0 transition-colors duration-100 ${cfg.rowClass}`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-medium"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--muted-foreground)" }}
                      >
                        {s.matricula}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: "var(--secondary)", color: "var(--primary)" }}
                        >
                          {s.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <span className="text-sm font-medium text-foreground">{s.nome}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-[#f0f2f5] text-foreground px-2 py-1 rounded-md font-medium">
                        {s.turma}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-bold ${mediaAlert ? "text-red-600" : "text-foreground"}`}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {s.media.toFixed(1)}
                      </span>
                      {mediaAlert && (
                        <span className="ml-1.5 text-xs text-red-400" title="Abaixo da média mínima">▼</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-bold ${freqAlert ? "text-red-600" : "text-foreground"}`}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {s.infrequencia}%
                      </span>
                      {freqAlert && (
                        <span className="ml-1.5 text-xs text-red-400" title="Acima do limite LDB">▲</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-55">
                      <div className="flex flex-wrap gap-1">
                        {s.fatores.map((f, j) => (
                          <span
                            key={j}
                            className="text-xs bg-orange-50 text-orange-800 border border-orange-200 px-2 py-0.5 rounded-full"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badgeClass}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onStartAttendance({ matricula: s.matricula, nome: s.nome, turma: s.turma })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 hover:opacity-90 active:scale-95"
                        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                      >
                        <UserCheck size={12} />
                        Iniciar Atendimento
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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
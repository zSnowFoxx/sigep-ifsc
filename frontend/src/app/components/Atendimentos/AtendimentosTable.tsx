import { Search, Clock, HeartHandshake, ExternalLink } from "lucide-react";
import type { AtendimentoItem } from "../../types/atendimentos";
import { motivoIcons, motivoColors } from "../../data/atendimentosData";

interface AtendimentosTableProps {
  filtered: AtendimentoItem[];
  totalAtendimentos: number;
  onViewRelato: (atendimento: AtendimentoItem) => void;
}

export default function AtendimentosTable({
  filtered,
  totalAtendimentos,
  onViewRelato,
}: AtendimentosTableProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-6 my-5 bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f7f8fa] border-b border-border">
                {[
                  "Data / Hora",
                  "Aluno",
                  "Turma",
                  "Servidor Responsável",
                  "Motivo Principal",
                  "Ações",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={20} className="text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">
                        Nenhum atendimento encontrado.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((a) => {
                  const MotivoIcon = motivoIcons[a.motivo] ?? HeartHandshake;
                  const colors = motivoColors[a.motivo] ?? motivoColors["Outro"];
                  return (
                    <tr
                      key={a.id}
                      className="border-b border-border last:border-0 hover:bg-[#f7f8fa] transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground">
                            {a.data}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={10} />
                            {a.hora}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{
                              background: "var(--secondary)",
                              color: "var(--primary)",
                            }}
                          >
                            {a.aluno
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {a.aluno}
                            </p>
                            <p
                              className="text-xs text-muted-foreground"
                              style={{ fontFamily: "monospace", fontSize: "11px" }}
                            >
                              {a.matricula}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-[#f0f2f5] text-foreground px-2 py-1 rounded-md font-medium whitespace-nowrap">
                          {a.turma}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{
                              background: "var(--muted)",
                              color: "var(--muted-foreground)",
                            }}
                          >
                            {a.servidor
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground whitespace-nowrap">
                              {a.servidor}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {a.cargo}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap"
                          style={{
                            background: colors.bg,
                            color: colors.text,
                            borderColor: colors.border,
                          }}
                        >
                          <MotivoIcon size={11} />
                          {a.motivo}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onViewRelato(a)}
                          className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:underline"
                          style={{ color: "var(--primary)" }}
                        >
                          Ver Relato Completo
                          <ExternalLink size={11} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 bg-[#f7f8fa] border-t border-border">
            <p className="text-xs text-muted-foreground">
              Exibindo {filtered.length} de {totalAtendimentos} registros — período
              2026.1
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
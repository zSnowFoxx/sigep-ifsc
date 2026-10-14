import { BarChart2, ExternalLink, Search } from "lucide-react";
import type { Aluno, TurmaData } from "../../../types/conselho";

interface ConselhoVisualizacaoProps {
  alunos: Aluno[];
  turmasData: TurmaData[] | any[];
  vizSearch: string;
  setVizSearch: (value: string) => void;
  vizTurmaFilter: string;
  setVizTurmaFilter: (value: string) => void;
  getDisciplinas: (matricula: string, turma: string) => any[];
  computeMedia: (disciplinas: any[]) => number;
  computeInfreq: (disciplinas: any[]) => number;
  emailFromNome: (nome: string) => string;
  setVizAlunoDetail: (aluno: {
    matricula: string;
    nome: string;
    turma: string;
    atencao: boolean;
    risco: boolean;
  }) => void;
}

export default function ConselhoVisualizacao({
  alunos,
  turmasData,
  vizSearch,
  setVizSearch,
  vizTurmaFilter,
  setVizTurmaFilter,
  getDisciplinas,
  computeMedia,
  computeInfreq,
  emailFromNome,
  setVizAlunoDetail,
}: ConselhoVisualizacaoProps) {
  // Se o aluno tiver `a.turmaId` e você precisa buscar o nome em turmasData:
const allStudents = [
  ...alunos.map((a) => ({
    ...a,
    risco: a.risco ?? false,
    turma: a.turma ?? "",
  })),
].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  const vizFiltered = allStudents.filter((a) => {
    const matchSearch =
      !vizSearch ||
      a.nome.toLowerCase().includes(vizSearch.toLowerCase()) ||
      a.matricula.includes(vizSearch);
    const matchTurma = !vizTurmaFilter || a.turma === vizTurmaFilter;
    return matchSearch && matchTurma;
  });

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BarChart2 size={15} style={{ color: "var(--primary)" }} />
              Visualização de Alunos
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 ml-5">
              Alunos cadastrados na(s) turma(s) correspondente(s) e a extensão de seus detalhes.
            </p>
          </div>
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                value={vizSearch}
                onChange={(e) => setVizSearch(e.target.value)}
                placeholder="Buscar aluno ou matrícula..."
                className="pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-card outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all w-72"
              />
            </div>
            <select
              value={vizTurmaFilter}
              onChange={(e) => setVizTurmaFilter(e.target.value)}
              className="text-sm px-3 py-2 rounded-lg border border-border bg-card outline-none focus:border-primary cursor-pointer text-foreground"
            >
              <option value="">Todas as turmas</option>
              {turmasData.map((t: any) => (
                <option key={t.nome} value={t.nome}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f7f8fa] border-b border-border">
                  {["Matrícula", "Nome", "Turma", "Média Geral", "Infrequência", ""].map(
                    (col, i) => (
                      <th
                        key={i}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {vizFiltered.map((a) => {
                  const discs = getDisciplinas(a.matricula, a.turma);
                  const media = computeMedia(discs);
                  const infreq = computeInfreq(discs);
                  const mediaColor =
                    media < 6
                      ? "text-red-600"
                      : media < 7
                      ? "text-amber-600"
                      : "text-emerald-600";
                  const mediaBg =
                    media < 6
                      ? "bg-red-50 border-red-200"
                      : media < 7
                      ? "bg-amber-50 border-amber-200"
                      : "bg-emerald-50 border-emerald-200";
                  const infreqColor =
                    infreq > 20
                      ? "text-red-600"
                      : infreq > 15
                      ? "text-amber-600"
                      : "text-emerald-600";
                  const infreqBg =
                    infreq > 20
                      ? "bg-red-50 border-red-200"
                      : infreq > 15
                      ? "bg-amber-50 border-amber-200"
                      : "bg-emerald-50 border-emerald-200";

                  return (
                    <tr
                      key={a.matricula}
                      className="border-b border-border last:border-0 hover:bg-[#f7f8fa] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-muted-foreground">
                          {a.matricula}
                        </span>
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
                            {a.nome
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground leading-tight">
                              {a.nome}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {emailFromNome(a.nome)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border"
                          style={{
                            background: "var(--secondary)",
                            color: "var(--primary)",
                            borderColor: "var(--accent)",
                          }}
                        >
                          {a.turma}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${mediaBg} ${mediaColor}`}
                        >
                          {media.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${infreqBg} ${infreqColor}`}
                        >
                          {infreq.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            setVizAlunoDetail({
                              matricula: a.matricula,
                              nome: a.nome,
                              turma: a.turma,
                              atencao: a.atencao,
                              risco: a.risco,
                            })
                          }
                          className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:underline whitespace-nowrap"
                          style={{ color: "var(--primary)" }}
                        >
                          Ver detalhes <ExternalLink size={11} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 bg-[#f7f8fa] border-t border-border">
            <p className="text-xs text-muted-foreground">
              {vizFiltered.length} aluno{vizFiltered.length !== 1 ? "s" : ""}{" "}
              {vizTurmaFilter || vizSearch ? "filtrados" : "no total"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
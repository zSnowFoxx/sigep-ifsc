import { X, Plus } from "lucide-react";
import type { VizAlunoDetail } from "../../../types/conselho";

interface ModalVizualizacaoProps {
  aluno: VizAlunoDetail;
  onClose: () => void;
  getDisciplinas: (matricula: string, turma: string) => any[];
  computeMedia: (disciplinas: any[]) => number;
  computeInfreq: (disciplinas: any[]) => number;
  emailFromNome: (nome: string) => string;
  onAddRegistro?: (matricula: string, nome: string) => void;
}

export default function ModalVizualizacao({
  aluno,
  onClose,
  getDisciplinas,
  computeMedia,
  computeInfreq,
  emailFromNome,
  onAddRegistro,
}: ModalVizualizacaoProps) {
  const discs = getDisciplinas(aluno.matricula, aluno.turma);
  const media = computeMedia(discs);
  const infreq = computeInfreq(discs);

  const mediaColor =
    media < 6 ? "text-red-600" : media < 7 ? "text-amber-600" : "text-emerald-600";
  const infreqColor =
    infreq > 20 ? "text-red-600" : infreq > 15 ? "text-amber-600" : "text-emerald-600";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style={{ background: "var(--secondary)", color: "var(--primary)" }}
            >
              {aluno.nome
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-foreground">{aluno.nome}</h2>
                {aluno.risco && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                    Risco acadêmico
                  </span>
                )}
                {aluno.atencao && !aluno.risco && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Requer atenção
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {aluno.matricula} · {aluno.turma} · {emailFromNome(aluno.nome)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#f7f8fa] rounded-xl border border-border px-4 py-3 text-center">
              <p className={`text-xl font-bold ${mediaColor}`}>{media.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Média Geral</p>
            </div>
            <div className="bg-[#f7f8fa] rounded-xl border border-border px-4 py-3 text-center">
              <p className={`text-xl font-bold ${infreqColor}`}>{infreq.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Índice de Infrequência
              </p>
            </div>
            <div className="bg-[#f7f8fa] rounded-xl border border-border px-4 py-3 text-center">
              <p className="text-xl font-bold text-foreground">{discs.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Disciplinas</p>
            </div>
          </div>

          {/* Disciplinas table */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Desempenho por Disciplina
            </p>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-border">
                      {["Disciplina", "Professor(a)", "Média", "Infrequência"].map(
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
                    {discs.map((d: any, i: number) => {
                      const dInfreq = d.ch ? ((d.faltasNaoJust ?? d.faltas ?? 0) / d.ch) * 100 : 0;
                      const dColor =
                        d.nota < 6
                          ? "text-red-600"
                          : d.nota < 7
                          ? "text-amber-600"
                          : "text-emerald-600";
                      const dBg =
                        d.nota < 6
                          ? "bg-red-50 border-red-200"
                          : d.nota < 7
                          ? "bg-amber-50 border-amber-200"
                          : "bg-emerald-50 border-emerald-200";
                      const fColor =
                        dInfreq > 20
                          ? "text-red-600"
                          : dInfreq > 15
                          ? "text-amber-600"
                          : "text-emerald-600";
                      const fBg =
                        dInfreq > 20
                          ? "bg-red-50 border-red-200"
                          : dInfreq > 15
                          ? "bg-amber-50 border-amber-200"
                          : "bg-emerald-50 border-emerald-200";
                      return (
                        <tr
                          key={i}
                          className="border-b border-border last:border-0 hover:bg-[#f7f8fa] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-foreground">
                              {d.nome}
                            </p>
                            <p className="text-xs text-muted-foreground">{d.ch}h</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-muted-foreground">
                              {d.professor}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${dBg} ${dColor}`}
                            >
                              {Number(d.nota || 0).toFixed(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${fBg} ${fColor}`}
                            >
                              {dInfreq.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl transition-all hover:bg-muted"
          >
            Voltar
          </button>
          {onAddRegistro && (
            <button
              onClick={() => onAddRegistro(aluno.matricula, aluno.nome)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "var(--primary)" }}
            >
              <Plus size={14} /> Adicionar Registro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
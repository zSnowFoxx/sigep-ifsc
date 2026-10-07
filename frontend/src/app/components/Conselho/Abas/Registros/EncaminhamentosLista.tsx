import { useMemo } from "react";
import { Send, Plus, ExternalLink, Link2 } from "lucide-react";
import type { EncItemData, TurmaData } from "../../../../types/conselho";

interface EncaminhamentosListaProps {
  encList: EncItemData[];
  turmasData: TurmaData[];
  setNovoEncOpen: (open: boolean) => void;
  openEncDetail: (enc: EncItemData) => void;
}

export function EncaminhamentosLista({
  encList,
  turmasData,
  setNovoEncOpen,
  openEncDetail,
}: EncaminhamentosListaProps) {
  const filteredEncs = useMemo(() => {
    return encList.filter((e) => turmasData.some((t) => t.nome === e.turma));
  }, [encList, turmasData]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Send size={14} style={{ color: "var(--primary)" }} />
            Encaminhamentos Individuais
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 ml-5">
            Encaminhamentos ativos vinculados a estudantes das turmas deste conselho.
          </p>
        </div>
        <button
          onClick={() => setNovoEncOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-[#e8f0eb] active:scale-[0.98]"
          style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
        >
          <Plus size={13} />Novo Encaminhamento
        </button>
      </div>

      {filteredEncs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
          <Send size={20} className="mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            Nenhum encaminhamento encontrado para as turmas.
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f7f8fa] border-b border-border">
                  {["Título", "Categoria", "Estudante", "Status", ""].map((col, i) => (
                    <th key={i} className={`px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap${i === 4 ? " w-40" : ""}`}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEncs.map((e) => (
                  <tr key={e.id} className="border-b border-border last:border-0 hover:bg-[#f7f8fa] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground">{e.titulo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border" style={{ background: "var(--secondary)", color: "var(--primary)", borderColor: "var(--accent)" }}>
                        {e.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
                          {e.aluno.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{e.aluno}</p>
                          <p className="text-xs text-muted-foreground" style={{ fontFamily: "monospace", fontSize: "11px" }}>{e.matricula}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {e.status === "pendente" && <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Pendente</span>}
                      {e.status === "em-andamento" && <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Em andamento</span>}
                      {e.status === "finalizado" && <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Finalizado</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 justify-end">
                        <button onClick={() => openEncDetail(e)} className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:underline whitespace-nowrap" style={{ color: "var(--primary)" }}>
                          Ver detalhes <ExternalLink size={11} />
                        </button>
                        <span className="text-border select-none">|</span>
                        <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                          <Link2 size={11} />Relacionar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 bg-[#f7f8fa] border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{filteredEncs.length} encaminhamento{filteredEncs.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      )}
    </div>
  );
}
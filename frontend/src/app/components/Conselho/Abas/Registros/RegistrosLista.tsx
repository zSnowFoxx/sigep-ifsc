import { BookOpen, Plus, ExternalLink } from "lucide-react";
import type { RegistroDocente } from "../../../../types/conselho";

interface RegistrosListaProps {
  registros: RegistroDocente[];
  setNovoRegOpen: (open: boolean) => void;
}

export function RegistrosLista({ registros, setNovoRegOpen }: RegistrosListaProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <BookOpen size={15} style={{ color: "var(--primary)" }} />
            Registros Docentes
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 ml-5">
            Ocorrências e situações relatadas pelos docentes sobre estudantes das turmas.
          </p>
        </div>
        <button
          onClick={() => setNovoRegOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: "var(--primary)" }}
        >
          <Plus size={13} />Novo Registro
        </button>
      </div>

      {registros.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
          <BookOpen size={22} className="mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">Nenhum registro docente criado.</p>
          <p className="text-xs text-muted-foreground mt-0.5">Clique em "Novo Registro" para criar o primeiro.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f7f8fa] border-b border-border">
                  {["Título / Resumo", "Categoria", "Estudante", "Data", ""].map((col, i) => (
                    <th key={i} className={`px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap${i === 4 ? " w-32" : ""}`}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registros.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-[#f7f8fa] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground">{r.titulo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border" style={{ background: "var(--secondary)", color: "var(--primary)", borderColor: "var(--accent)" }}>
                        {r.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
                          {r.aluno.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{r.aluno}</p>
                          <p className="text-xs text-muted-foreground" style={{ fontFamily: "monospace", fontSize: "11px" }}>{r.matricula}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-semibold text-foreground">{r.data}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:underline whitespace-nowrap" style={{ color: "var(--primary)" }}>
                        Ver detalhes <ExternalLink size={11} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 bg-[#f7f8fa] border-t border-border">
            <p className="text-xs text-muted-foreground">{registros.length} registro{registros.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      )}
    </div>
  );
}
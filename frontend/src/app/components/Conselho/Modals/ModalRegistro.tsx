import { X, Calendar, Users, BookOpen } from "lucide-react";
import { CATEGORIAS_REGISTRO } from "../../../data/conselhoData";
import type { Aluno, Disciplina, EncItemData } from "../../../types/conselho";
import type { ServidorRef } from "../../../services/conselhoService";

interface ModalRegistroProps {
  setNovoRegOpen: (open: boolean) => void;
  alunos: Aluno[];
  servidores: ServidorRef[];
  disciplinasData: Record<string, Disciplina[]>;
  nrMatricula: string;
  setNrMatricula: (matricula: string) => void;
  nrDocenteId: number | null;
  setNrDocenteId: (id: number | null) => void;
  nrTitulo: string;
  setNrTitulo: (titulo: string) => void;
  nrCategoria: string;
  setNrCategoria: (categoria: string) => void;
  nrDescricao: string;
  setNrDescricao: (descricao: string) => void;
  nrEncOpcao: "novo" | "existente" | null;
  setNrEncOpcao: (opcao: "novo" | "existente" | null) => void;
  nrEncId: number | null;
  setNrEncId: (id: number | null) => void;
  encList: EncItemData[];
  salvando: boolean;
  submitNovoRegistro: () => void;
}

export default function ModalRegistro({
  setNovoRegOpen,
  alunos,
  servidores,
  disciplinasData,
  nrMatricula,
  setNrMatricula,
  nrDocenteId,
  setNrDocenteId,
  nrTitulo,
  setNrTitulo,
  nrCategoria,
  setNrCategoria,
  nrDescricao,
  setNrDescricao,
  nrEncOpcao,
  setNrEncOpcao,
  nrEncId,
  setNrEncId,
  encList,
  salvando,
  submitNovoRegistro,
}: ModalRegistroProps) {
  const nrTurma = alunos.find((a) => a.matricula === nrMatricula)?.turma ?? "";
  const todayFmt = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setNovoRegOpen(false)}>
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Registros e Encaminhamentos · Novo Registro</p>
            <h2 className="text-base font-bold text-foreground mt-0.5">Novo Registro Docente</h2>
          </div>
          <button onClick={() => setNovoRegOpen(false)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Row: Aluno + Docente */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Estudante <span className="text-red-500">*</span></label>
              <select
                value={nrMatricula}
                onChange={(e) => setNrMatricula(e.target.value)}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer"
              >
                <option value="">— Selecione —</option>
                {alunos.map((a) => (
                  <option key={a.matricula} value={a.matricula}>{a.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Docente relatante <span className="text-red-500">*</span></label>
              <select
                value={nrDocenteId ?? ""}
                onChange={(e) => setNrDocenteId(e.target.value ? Number(e.target.value) : null)}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer"
              >
                <option value="">— Selecione —</option>
                {servidores.map((s) => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: Data + Turma (auto) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Data do registro</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
                <Calendar size={13} />
                {todayFmt}
                <span className="ml-auto text-xs">(automática)</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Turma do estudante</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
                <Users size={13} />
                {nrTurma || <span className="italic">Selecionada automaticamente</span>}
              </div>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Título e Categoria */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Título / Resumo <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={nrTitulo}
              onChange={(e) => setNrTitulo(e.target.value)}
              placeholder="Resumo breve do problema..."
              className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary placeholder:text-muted-foreground transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Categoria <span className="text-red-500">*</span></label>
            <select
              value={nrCategoria}
              onChange={(e) => setNrCategoria(e.target.value)}
              className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer"
            >
              <option value="">— Selecione —</option>
              {CATEGORIAS_REGISTRO.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Registro Docente <span className="text-red-500">*</span></label>
            <p className="text-xs text-muted-foreground mb-1.5">Descrição do problema que foi relatado pelo aluno.</p>
            <textarea
              rows={4}
              value={nrDescricao}
              onChange={(e) => setNrDescricao(e.target.value)}
              placeholder="Descreva detalhadamente a situação observada ou relatada..."
              className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground transition-all"
            />
          </div>

          {/* Disciplinas */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Disciplinas</label>
            {!nrMatricula ? (
              <p className="text-xs text-muted-foreground italic px-3 py-2.5 rounded-lg border border-dashed border-border">Selecione um estudante para carregar as disciplinas.</p>
            ) : (disciplinasData[nrMatricula] ?? []).length === 0 ? (
              <p className="text-xs text-muted-foreground italic px-3 py-2.5 rounded-lg border border-dashed border-border">
                Nenhuma nota ou frequência registrada para este estudante.
              </p>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-border">
                      <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Disciplina</th>
                      <th className="text-center px-3 py-2 font-semibold text-muted-foreground">Nota</th>
                      <th className="text-center px-3 py-2 font-semibold text-muted-foreground">Freq. %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disciplinasData[nrMatricula].map((d, i) => {
                      const pct = Math.round((d.presentes / d.ch) * 100);
                      const riskNota = d.nota < 6;
                      const riskFreq = pct < 75;
                      return (
                        <tr key={i} className={`border-b border-border last:border-0 ${(riskNota || riskFreq) ? "bg-red-50/40" : ""}`}>
                          <td className="px-3 py-2 font-medium text-foreground">{d.nome}</td>
                          <td className="px-3 py-2 text-center">
                            <span className={`font-semibold ${riskNota ? "text-red-600" : "text-foreground"}`}>{d.nota.toFixed(1)}{riskNota && " ⚠"}</span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className={`font-semibold ${riskFreq ? "text-red-600" : "text-foreground"}`}>{pct}%{riskFreq && " ⚠"}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Encaminhamento */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Encaminhamento</label>
            <div className="space-y-2">
              {(["novo", "existente"] as const).map((opcao) => (
                <label key={opcao} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${nrEncOpcao === opcao ? "border-primary bg-[#e8f0eb]" : "border-border bg-[#f7f8fa] hover:border-primary/40"}`}>
                  <input type="radio" name="encOpcao" value={opcao} checked={nrEncOpcao === opcao} onChange={() => { setNrEncOpcao(opcao); setNrEncId(null); }} className="mt-0.5 accent-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{opcao === "novo" ? "Criar novo encaminhamento" : "Atrelar a encaminhamento existente"}</p>
                    {nrEncOpcao === opcao && (
                      opcao === "novo" ? (
                        <p className="text-xs text-muted-foreground mt-1">Será criado um novo encaminhamento a partir deste registro.</p>
                      ) : (() => {
                        const existing = encList.filter((e) => e.matricula === nrMatricula);
                        return existing.length === 0 ? (
                          <p className="text-xs text-muted-foreground mt-1 italic">Nenhum encaminhamento encontrado para o aluno.</p>
                        ) : (
                          <div className="mt-2 space-y-1.5">
                            {existing.map((e) => (
                              <label key={e.id} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-xs transition-all ${nrEncId === e.id ? "border-primary bg-white" : "border-border bg-white hover:border-primary/40"}`}>
                                <input type="radio" name="encId" checked={nrEncId === e.id} onChange={() => setNrEncId(e.id)} className="accent-primary" />
                                <span className="font-medium text-foreground">{e.titulo}</span>
                                <span className="ml-auto text-muted-foreground">{e.evolucoes[0]?.data}</span>
                              </label>
                            ))}
                            {nrEncId !== null && <p className="text-xs text-muted-foreground px-1">Este registro será adicionado ao encaminhamento selecionado.</p>}
                          </div>
                        );
                      })()
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
          <button onClick={() => setNovoRegOpen(false)} className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl transition-all hover:bg-muted">
            Cancelar
          </button>
          <button
            onClick={submitNovoRegistro}
            disabled={!nrMatricula || nrDocenteId === null || !nrTitulo.trim() || !nrCategoria || !nrDescricao.trim() || salvando}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--primary)" }}
          >
            <BookOpen size={14} />{salvando ? "Salvando..." : "Criar Registro"}
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { X, Calendar, Users, BookOpen, Send } from "lucide-react";
import { alunos, alunosTurmaB, turmasData, disciplinasData, defaultDisciplinas, CATEGORIAS_REGISTRO, SERVIDORES_OPTIONS as servidores } from "../../../data/conselhoData";
import type { EncItemData } from "../../../types/conselho";

interface ModalRegistroProps {
  // Props Modal Novo Registro
  novoRegOpen: boolean;
  setNovoRegOpen: (open: boolean) => void;
  nrAluno: string;
  selectNrAluno: (nome: string) => void;
  nrDocente: string;
  setNrDocente: (docente: string) => void;
  todayFmt: string;
  nrTurma: string;
  nrTitulo: string;
  setNrTitulo: (titulo: string) => void;
  nrCategoria: string;
  setNrCategoria: (categoria: string) => void;
  nrDescricao: string;
  setNrDescricao: (descricao: string) => void;
  nrMatricula: string;
  nrDiscManual: Record<string, { nota?: string; freq?: string }>;
  setNrDiscManual: React.Dispatch<React.SetStateAction<Record<string, { nota: string; freq: string }>>>;
  nrEncOpcao: "novo" | "existente" | null;
  setNrEncOpcao: (opcao: "novo" | "existente" | null) => void;
  nrEncId: number | null;
  setNrEncId: (id: number | null) => void;
  encList: EncItemData[];
  submitNovoRegistro: () => void;

  // Props Modal Novo Encaminhamento
  novoEncOpen: boolean;
  setNovoEncOpen: (open: boolean) => void;
  neAluno: string;
  selectNeAluno: (nome: string) => void;
  neTurma: string;
  neTitulo: string;
  setNeTitulo: (titulo: string) => void;
  neCategoria: string;
  setNeCategoria: (categoria: string) => void;
  neServidor: string;
  setNeServidor: (servidor: string) => void;
  neDescricao: string;
  setNeDescricao: (descricao: string) => void;
  submitNovoEnc: () => void;
}

export default function ModalRegistro({
  novoRegOpen,
  setNovoRegOpen,
  nrAluno,
  selectNrAluno,
  nrDocente,
  setNrDocente,
  todayFmt,
  nrTurma,
  nrTitulo,
  setNrTitulo,
  nrCategoria,
  setNrCategoria,
  nrDescricao,
  setNrDescricao,
  nrMatricula,
  nrDiscManual,
  setNrDiscManual,
  nrEncOpcao,
  setNrEncOpcao,
  nrEncId,
  setNrEncId,
  encList,
  submitNovoRegistro,
  novoEncOpen,
  setNovoEncOpen,
  neAluno,
  selectNeAluno,
  neTurma,
  neTitulo,
  setNeTitulo,
  neCategoria,
  setNeCategoria,
  neServidor,
  setNeServidor,
  neDescricao,
  setNeDescricao,
  submitNovoEnc,
}: ModalRegistroProps) {

  const alunosComTurma  = [
    ...alunos.map((a) => ({ ...a, turma: turmasData[0].nome })),
    ...alunosTurmaB.map((a) => ({ ...a, risco: false as boolean, turma: turmasData[1].nome })),
  ];

  return (
    <>
      {/* ── Modal: Novo Registro Docente ────────────────────────────────────── */}
      {novoRegOpen && (
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
                    value={nrAluno}
                    onChange={(e) => selectNrAluno(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="">— Selecione —</option>
                    {alunosComTurma.map((a) => (
                      <option key={a.matricula} value={a.nome}>{a.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Docente relatante <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={nrDocente}
                    onChange={(e) => setNrDocente(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary placeholder:text-muted-foreground transition-all"
                  />
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
                ) : (() => {
                  const knownDiscs = disciplinasData[nrMatricula] ?? defaultDisciplinas;
                  const hasData = !!disciplinasData[nrMatricula];
                  return (
                    <div className="rounded-xl border border-border overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-[#f7f8fa] border-b border-border">
                            <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Disciplina</th>
                            <th className="text-center px-3 py-2 font-semibold text-muted-foreground">Nota</th>
                            <th className="text-center px-3 py-2 font-semibold text-muted-foreground">Freq. %</th>
                            {!hasData && <th className="px-3 py-2 w-20" />}
                          </tr>
                        </thead>
                        <tbody>
                          {knownDiscs.map((d) => {
                            const pct = hasData ? Math.round((d.presentes / (d.presentes + d.faltasJust + d.faltasNaoJust)) * 100) : null;
                            const riskNota = hasData && d.nota < 6;
                            const riskFreq = pct !== null && pct < 75;
                            const manualNota = nrDiscManual[d.nome]?.nota ?? "";
                            const manualFreq = nrDiscManual[d.nome]?.freq ?? "";
                            return (
                              <tr key={d.nome} className={`border-b border-border last:border-0 ${(riskNota || riskFreq) ? "bg-red-50/40" : ""}`}>
                                <td className="px-3 py-2 font-medium text-foreground">{d.nome}</td>
                                <td className="px-3 py-2 text-center">
                                  {hasData ? (
                                    <span className={`font-semibold ${riskNota ? "text-red-600" : "text-foreground"}`}>{d.nota.toFixed(1)}{riskNota && " ⚠"}</span>
                                  ) : (
                                    <input type="number" step="0.1" min="0" max="10" value={manualNota} onChange={(ev) => setNrDiscManual((p) => ({ ...p, [d.nome]: { ...p[d.nome], nota: ev.target.value, freq: p[d.nome]?.freq ?? "" } }))} placeholder="—" className="w-14 text-center text-xs px-1 py-1 rounded border border-border bg-white outline-none focus:border-primary" />
                                  )}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {hasData ? (
                                    <span className={`font-semibold ${riskFreq ? "text-red-600" : "text-foreground"}`}>{pct}%{riskFreq && " ⚠"}</span>
                                  ) : (
                                    <input type="number" step="1" min="0" max="100" value={manualFreq} onChange={(ev) => setNrDiscManual((p) => ({ ...p, [d.nome]: { ...p[d.nome], freq: ev.target.value, nota: p[d.nome]?.nota ?? "" } }))} placeholder="—" className="w-14 text-center text-xs px-1 py-1 rounded border border-border bg-white outline-none focus:border-primary" />
                                  )}
                                </td>
                                {!hasData && (
                                  <td className="px-3 py-2">
                                    <button
                                      onClick={() => setNrDiscManual((p) => ({ ...p, [d.nome]: { nota: p[d.nome]?.nota ?? "", freq: p[d.nome]?.freq ?? "" } }))}
                                      className="text-xs text-amber-600 hover:text-amber-800 font-semibold border border-amber-200 px-1.5 py-0.5 rounded transition-colors"
                                    >
                                      + Risco
                                    </button>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {!hasData && <p className="text-xs text-muted-foreground px-3 py-2 border-t border-border">Notas e frequências inseridas manualmente — nenhum registro no sistema para este aluno.</p>}
                    </div>
                  );
                })()}
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
                                    <span className="ml-auto text-muted-foreground">{e.data}</span>
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
                disabled={!nrAluno || !nrTitulo || !nrCategoria || !nrDescricao}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "var(--primary)" }}
              >
                <BookOpen size={14} />Criar Registro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Novo Encaminhamento ──────────────────────────────────────── */}
      {novoEncOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setNovoEncOpen(false)}>
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Encaminhamentos · Novo</p>
                <h2 className="text-base font-bold text-foreground mt-0.5">Novo Encaminhamento</h2>
              </div>
              <button onClick={() => setNovoEncOpen(false)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Estudante <span className="text-red-500">*</span></label>
                  <select value={neAluno} onChange={(e) => selectNeAluno(e.target.value)} className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer">
                    <option value="">— Selecione —</option>
                    {alunosComTurma.map((a) => <option key={a.matricula} value={a.nome}>{a.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Turma</label>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
                    {neTurma || <span className="italic">Automática</span>}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Título <span className="text-red-500">*</span></label>
                <input type="text" value={neTitulo} onChange={(e) => setNeTitulo(e.target.value)} placeholder="Título do encaminhamento..." className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary placeholder:text-muted-foreground transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Categoria <span className="text-red-500">*</span></label>
                <select value={neCategoria} onChange={(e) => setNeCategoria(e.target.value)} className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer">
                  <option value="">— Selecione —</option>
                  {CATEGORIAS_REGISTRO.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Servidor responsável</label>
                <select value={neServidor} onChange={(e) => setNeServidor(e.target.value)} className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer">
                  {servidores.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Descrição</label>
                <textarea rows={3} value={neDescricao} onChange={(e) => setNeDescricao(e.target.value)} placeholder="Descreva o contexto e o objetivo do encaminhamento..." className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground transition-all" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setNovoEncOpen(false)} className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl transition-all hover:bg-muted">Cancelar</button>
              <button
                onClick={submitNovoEnc}
                disabled={!neAluno || !neTitulo || !neCategoria}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "var(--primary)" }}
              >
                <Send size={13} />Criar Encaminhamento
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
import { useState } from "react";
import { ClipboardList, Pencil, Plus, Trash2, CheckCircle2 } from "lucide-react";
import type { TurmaData, TurmaForm } from "../../../../types/conselho";
import { AdicionarDemanda } from "./AdicionarDemanda";

interface DemandasPautasProps {
  currentTurmaD: TurmaData;
  activeTurmaIdx: number;
  isInter: boolean;
  editFields: Set<string>;
  setEditFields: (fields: Set<string>) => void;
  toggleEditField: (field: string) => void;
  form: TurmaForm;
  updateForm: (fields: Partial<TurmaForm>) => void;
  allPontos: string[];
  togglePonto: (item: string) => void;
  allDific: string[];
  toggleDific: (item: string) => void;
  removeDemanda: (id: number) => void;
  addDemanda?: () => void;
}

export function DemandasPautas({
  currentTurmaD,
  activeTurmaIdx,
  isInter,
  editFields,
  setEditFields,
  toggleEditField,
  form,
  updateForm,
  allPontos,
  togglePonto,
  allDific,
  toggleDific,
  removeDemanda,
  addDemanda,
}: DemandasPautasProps) {
  const [newPontoText, setNewPontoText] = useState("");
  const [newDificText, setNewDificText] = useState("");

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <ClipboardList size={14} style={{ color: "var(--primary)" }} />
        <h2 className="text-sm font-semibold text-foreground">Pauta Coletiva da Turma</h2>
        <span className="ml-auto text-xs font-medium text-muted-foreground">
          {currentTurmaD.nome} · {currentTurmaD.semestre}
        </span>
      </div>

      <div className="p-6 space-y-0 divide-y divide-border">
        {/* ── Representantes ── */}
        <div className="pb-7">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Representante(s) da Turma</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Aluno(s) que representaram a turma no conselho.
              </p>
            </div>
            {!isInter && (
              <button
                onClick={() => toggleEditField("representantes")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0"
              >
                <Pencil size={11} />
                {editFields.has("representantes") ? "Cancelar" : "Editar"}
              </button>
            )}
          </div>
          {isInter || editFields.has("representantes") ? (
            <>
              <input
                type="text"
                list={`alunos-list-${activeTurmaIdx}`}
                value={form.representantes}
                onChange={(e) => updateForm({ representantes: e.target.value })}
                placeholder="Digite o nome do(s) representante(s)..."
                className="w-full text-sm px-4 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
              />
              <datalist id={`alunos-list-${activeTurmaIdx}`}>
                {currentTurmaD.alunosList.map((a) => (
                  <option key={a.matricula} value={a.nome} />
                ))}
              </datalist>
              <p className="text-xs text-muted-foreground mt-1.5">
                Sugestões: selecione da lista ou escreva livremente.
              </p>
            </>
          ) : (
            <p className="text-sm text-foreground leading-relaxed">
              {form.representantes || <span className="text-muted-foreground italic">Não informado</span>}
            </p>
          )}
        </div>

        {/* ── Síntese do diagnóstico ── */}
        <div className="py-7">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Síntese do Diagnóstico da Turma</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Insira aqui um resumo detalhado sobre as informações coletadas no questionário da turma.
              </p>
            </div>
            {!isInter && (
              <button
                onClick={() => toggleEditField("sintese")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0 ml-4"
              >
                <Pencil size={11} />
                {editFields.has("sintese") ? "Cancelar" : "Editar"}
              </button>
            )}
          </div>
          {isInter || editFields.has("sintese") ? (
            <>
              <textarea
                rows={7}
                value={form.sintese}
                onChange={(e) => updateForm({ sintese: e.target.value })}
                placeholder="Descreva a percepção coletiva dos professores sobre a turma: engajamento, clima pedagógico, progressos e desafios gerais observados no período..."
                className="w-full text-sm px-4 py-3 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground leading-relaxed transition-all"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">{form.sintese.length} caracteres</p>
            </>
          ) : (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {form.sintese || <span className="text-muted-foreground italic">Não preenchido</span>}
            </p>
          )}
        </div>

        {/* ── Pontos positivos ── */}
        <div className="py-7">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Pontos Positivos</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Selecione os aspectos positivos observados na turma.
              </p>
            </div>
            {!isInter && (
              <button
                onClick={() => toggleEditField("pontos")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0 ml-4"
              >
                <Pencil size={11} />
                {editFields.has("pontos") ? "Cancelar" : "Editar"}
              </button>
            )}
          </div>
          {isInter || editFields.has("pontos") ? (
            <>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {allPontos.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] cursor-pointer hover:border-primary/40 transition-all select-none"
                  >
                    <input
                      type="checkbox"
                      checked={form.pontosPositivos.includes(item)}
                      onChange={() => togglePonto(item)}
                      className="accent-primary w-3.5 h-3.5 shrink-0"
                    />
                    <span className="text-sm text-foreground leading-snug">{item}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPontoText}
                  onChange={(e) => setNewPontoText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newPontoText.trim()) {
                        updateForm({
                          customPontos: [...form.customPontos, newPontoText.trim()],
                          pontosPositivos: [...form.pontosPositivos, newPontoText.trim()],
                        });
                        setNewPontoText("");
                      }
                    }
                  }}
                  placeholder="Adicionar ponto personalizado..."
                  className="flex-1 text-sm px-3 py-2 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
                />
                <button
                  onClick={() => {
                    if (newPontoText.trim()) {
                      updateForm({
                        customPontos: [...form.customPontos, newPontoText.trim()],
                        pontosPositivos: [...form.pontosPositivos, newPontoText.trim()],
                      });
                      setNewPontoText("");
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 text-white"
                  style={{ background: "var(--primary)" }}
                >
                  <Plus size={13} />
                  Adicionar
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {form.pontosPositivos.length > 0 ? (
                form.pontosPositivos.map((item) => (
                  <span
                    key={item}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground italic">Nenhum ponto selecionado</span>
              )}
            </div>
          )}
        </div>

        {/* ── Dificuldades apontadas ── */}
        <div className="py-7">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Dificuldades Apontadas</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Selecione as dificuldades identificadas na turma.
              </p>
            </div>
            {!isInter && (
              <button
                onClick={() => toggleEditField("dific")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0 ml-4"
              >
                <Pencil size={11} />
                {editFields.has("dific") ? "Cancelar" : "Editar"}
              </button>
            )}
          </div>
          {isInter || editFields.has("dific") ? (
            <>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {allDific.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] cursor-pointer hover:border-amber-400/60 transition-all select-none"
                  >
                    <input
                      type="checkbox"
                      checked={form.dificuldades.includes(item)}
                      onChange={() => toggleDific(item)}
                      className="accent-amber-500 w-3.5 h-3.5 shrink-0"
                    />
                    <span className="text-sm text-foreground leading-snug">{item}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDificText}
                  onChange={(e) => setNewDificText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newDificText.trim()) {
                        updateForm({
                          customDificuldades: [...form.customDificuldades, newDificText.trim()],
                          dificuldades: [...form.dificuldades, newDificText.trim()],
                        });
                        setNewDificText("");
                      }
                    }
                  }}
                  placeholder="Adicionar dificuldade personalizada..."
                  className="flex-1 text-sm px-3 py-2 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
                />
                <button
                  onClick={() => {
                    if (newDificText.trim()) {
                      updateForm({
                        customDificuldades: [...form.customDificuldades, newDificText.trim()],
                        dificuldades: [...form.dificuldades, newDificText.trim()],
                      });
                      setNewDificText("");
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 text-white"
                  style={{ background: "var(--primary)" }}
                >
                  <Plus size={13} />
                  Adicionar
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {form.dificuldades.length > 0 ? (
                form.dificuldades.map((item) => (
                  <span
                    key={item}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground italic">Nenhuma dificuldade selecionada</span>
              )}
            </div>
          )}
        </div>

        {/* ── Demandas gerais da turma ── */}
        <div className="py-7">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Demandas Gerais da Turma</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Demandas e situações trazidas pela turma ao colegiado.
              </p>
            </div>
            {!isInter && (
              <button
                onClick={() => toggleEditField("demandas")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0 ml-4"
              >
                <Pencil size={11} />
                {editFields.has("demandas") ? "Cancelar" : "Editar"}
              </button>
            )}
          </div>

          {/* Table */}
          {form.demandas.length > 0 ? (
            <div className="rounded-xl border border-border overflow-hidden mb-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f7f8fa] border-b border-border">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                      Situação
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground w-36">
                      Gravidade
                    </th>
                    {(isInter || editFields.has("demandas")) && <th className="px-4 py-2.5 w-28" />}
                  </tr>
                </thead>
                <tbody>
                  {form.demandas.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-border last:border-0 hover:bg-[#fafbfc] transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-foreground">{d.situacao}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            d.gravidade === "critica"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : d.gravidade === "urgente"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-[#f7f8fa] text-muted-foreground border border-border"
                          }`}
                        >
                          {d.gravidade === "critica"
                            ? "Crítica"
                            : d.gravidade === "urgente"
                            ? "Urgente"
                            : "Não urgente"}
                        </span>
                      </td>
                      {(isInter || editFields.has("demandas")) && (
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg border border-border hover:border-primary/30">
                              + Encaminhamento
                            </button>
                            <button
                              onClick={() => removeDemanda(d.id)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-border border-dashed px-5 py-8 text-center mb-3">
              <p className="text-sm text-muted-foreground">Nenhuma demanda registrada.</p>
            </div>
          )}

          {/* Add demand form */}
          {(isInter || editFields.has("demandas")) && (
            <AdicionarDemanda addDemanda={addDemanda} />
          )}
        </div>

        {/* ── Registros e observações gerais ── */}
        <div className="pt-7">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Registros e Observações Gerais</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Informações extras e observações sobre outros assuntos tratados.
              </p>
            </div>
            {!isInter && (
              <button
                onClick={() => toggleEditField("registros")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0 ml-4"
              >
                <Pencil size={11} />
                {editFields.has("registros") ? "Cancelar" : "Editar"}
              </button>
            )}
          </div>
          {isInter || editFields.has("registros") ? (
            <textarea
              rows={5}
              value={form.registros}
              onChange={(e) => updateForm({ registros: e.target.value })}
              placeholder="Observações adicionais, outros assuntos abordados, recados gerais... (opcional)"
              className="w-full text-sm px-4 py-3 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground leading-relaxed transition-all"
            />
          ) : (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {form.registros || (
                <span className="text-muted-foreground italic">Nenhuma observação adicional</span>
              )}
            </p>
          )}

          {/* Final mode: Salvar alterações button */}
          {!isInter && (
            <div className="flex justify-end mt-6 pt-4 border-t border-border">
              <button
                onClick={() => setEditFields(new Set())}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "var(--primary)" }}
              >
                <CheckCircle2 size={14} />
                Salvar alterações
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
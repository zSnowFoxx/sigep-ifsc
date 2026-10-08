import {
  X,
  User,
  CalendarClock,
  Sparkles,
  GraduationCap,
  MessageSquare,
  CheckCircle2,
  Lock,
  Send,
} from "lucide-react";

import type { Encaminhamento } from "../../types/encaminhamentos";
import { tipoConfig, categoriaColors } from "../../data/encaminhamentosData";

interface EncaminhamentosCardProps {
  selected: Encaminhamento | null;
  onClose: () => void;
  novoRelato: string;
  setNovoRelato: (value: string) => void;
  savedRelato: boolean;
  setSavedRelato: (value: boolean) => void;
  saveRelato: () => void;
  finalizando: boolean;
  setFinalizando: (value: boolean) => void;
  parecerFinal: string;
  setParecerFinal: (value: string) => void;
  finalizar: () => void;
  salvando?: boolean;
  erro?: string;
}

export default function EncaminhamentosCard({
  selected,
  onClose,
  novoRelato,
  setNovoRelato,
  savedRelato,
  setSavedRelato,
  saveRelato,
  finalizando,
  setFinalizando,
  parecerFinal,
  setParecerFinal,
  finalizar,
  salvando = false,
  erro = "",
}: EncaminhamentosCardProps) {
  if (!selected) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-xl mx-4 flex flex-col overflow-hidden"
        style={{ maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 shrink-0" style={{ background: "var(--primary)" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-white/60 mb-0.5">
                Encaminhamento #{selected.id} · {selected.turma}
              </p>
              <h2 className="text-sm font-bold text-white">
                Histórico de Evolução — {selected.aluno}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: (
                      categoriaColors[selected.categoria] ?? { bg: "#f8fafc" }
                    ).bg,
                    color: (
                      categoriaColors[selected.categoria] ?? { text: "#475569" }
                    ).text,
                  }}
                >
                  {selected.categoria}
                </span>
                <span className="text-xs text-white/60 flex items-center gap-1">
                  <User size={10} /> {selected.responsavel}
                </span>
                {selected.prazo && (
                  <span className="text-xs text-white/60 flex items-center gap-1">
                    <CalendarClock size={10} /> {selected.prazo}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors shrink-0 mt-0.5"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Linha do Tempo
          </p>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-5">
              {selected.evolucoes.map((ev, i) => {
                const tcfg = tipoConfig[ev.tipo];
                return (
                  <div key={i} className="flex gap-4 relative">
                    <div
                      className={`w-6 h-6 rounded-full ${tcfg.dot} flex items-center justify-center shrink-0 z-10 ring-2 ring-card`}
                    >
                      {ev.tipo === "criacao" && <Sparkles size={10} color="white" />}
                      {ev.tipo === "triagem" && <GraduationCap size={10} color="white" />}
                      {ev.tipo === "relato" && <MessageSquare size={10} color="white" />}
                      {ev.tipo === "conclusao" && <CheckCircle2 size={10} color="white" />}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold text-foreground">
                          {ev.data}
                        </span>
                        <span
                          className="text-xs font-semibold px-1.5 py-0 rounded"
                          style={{
                            background: tcfg.dot
                              .replace("bg-", "#")
                              .replace("-500", ""),
                            color: tcfg.color,
                            opacity: 0.85,
                          }}
                        >
                          {tcfg.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          por {ev.autor}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed bg-[#f7f8fa] rounded-lg px-3 py-2 border border-border">
                        {ev.texto}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add new relato */}
          {selected.status !== "concluido" && (
            <div className="mt-6 pt-5 border-t border-border space-y-3">
              <label className="block text-xs font-semibold text-foreground">
                Adicionar Novo Relato de Evolução / Acompanhamento
              </label>
              <textarea
                rows={4}
                value={novoRelato}
                onChange={(e) => {
                  setNovoRelato(e.target.value);
                  setSavedRelato(false);
                }}
                placeholder="Descreva o progresso, intervenções realizadas, contatos estabelecidos ou observações relevantes para este encaminhamento..."
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground leading-relaxed transition-all"
              />
              {savedRelato && (
                <div
                  className="flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  <CheckCircle2 size={13} /> Relato registrado com sucesso.
                </div>
              )}
            </div>
          )}

          {/* Parecer de desfecho */}
          {finalizando && (
            <div className="mt-4 rounded-xl border border-amber-300 overflow-hidden">
              <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
                <Lock size={12} className="text-amber-600" />
                <span className="text-xs font-bold text-amber-800">
                  Parecer de Desfecho Obrigatório (RN07)
                </span>
              </div>
              <div className="p-3 bg-amber-50/50">
                <textarea
                  rows={4}
                  value={parecerFinal}
                  onChange={(e) => setParecerFinal(e.target.value)}
                  placeholder="Descreva o resultado final deste encaminhamento: objetivos alcançados, situação atual do aluno e recomendações futuras..."
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-amber-300 bg-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 resize-none placeholder:text-muted-foreground leading-relaxed"
                />
                <p className="text-xs text-amber-700 mt-1.5">
                  Este parecer ficará registrado permanentemente e não poderá ser editado após a conclusão.
                </p>
              </div>
            </div>
          )}

          {erro && (
            <p className="mt-4 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {erro}
            </p>
          )}
        </div>

        {/* Modal Footer */}
        {selected.status !== "concluido" && (
          <div className="px-6 py-4 border-t border-border bg-[#f7f8fa] flex items-center gap-2 shrink-0">
            <button
              onClick={saveRelato}
              disabled={salvando || !novoRelato.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              style={{ background: "var(--primary)" }}
            >
              <Send size={13} />
              Salvar Nova Evolução
            </button>

            {!finalizando ? (
              <button
                onClick={() => setFinalizando(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-lg border border-amber-400 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors ml-auto"
              >
                <CheckCircle2 size={13} />
                Finalizar Encaminhamento
              </button>
            ) : (
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setFinalizando(false)}
                  disabled={salvando}
                  className="px-3 py-2.5 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={finalizar}
                  disabled={salvando || !parecerFinal.trim()}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 size={13} />
                  Confirmar Conclusão
                </button>
              </div>
            )}
          </div>
        )}

        {selected.status === "concluido" && (
          <div className="px-6 py-4 border-t border-border bg-emerald-50 shrink-0">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-800 mb-1">
                  Encaminhamento Concluído — Parecer de Desfecho
                </p>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  {selected.parecer}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
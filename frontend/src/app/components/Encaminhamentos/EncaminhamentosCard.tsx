import { useState } from "react";
import {
  X,
  User,
  Sparkles,
  GraduationCap,
  MessageSquare,
  CheckCircle2,
  Lock,
  Send,
  UserCog,
  Calendar,
  Pencil,
  Check,
} from "lucide-react";

import type { Encaminhamento } from "../../types/encaminhamentos";
import type { ServidorRef } from "../../services/conselhoService";
import { tipoConfig, categoriaColors } from "../../data/encaminhamentosData";
import { atualizarMetaEncaminhamento } from "../../services/encaminhamentosService";

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

  // Lista dinâmica de servidores buscada diretamente do servidor backend
  servidores?: ServidorRef[];
  onMetaSalvaSuccess?: () => void;
}

const toISODate = (ddmmyyyy: string): string => {
  if (!ddmmyyyy) return "";
  if (ddmmyyyy.includes("-")) return ddmmyyyy;
  const parts = ddmmyyyy.split("/");
  if (parts.length !== 3) return "";
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

const toBRDate = (isoDate: string): string => {
  if (!isoDate) return "";
  if (isoDate.includes("/")) return isoDate;
  const parts = isoDate.split("-");
  if (parts.length !== 3) return "";
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

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
  servidores = [],
  onMetaSalvaSuccess,
}: EncaminhamentosCardProps) {
  const [editingMeta, setEditingMeta] = useState(false);
  const [editResponsavelNome, setEditResponsavelNome] = useState("");
  const [editPrazoIso, setEditPrazoIso] = useState("");
  const [salvandoMeta, setSalvandoMeta] = useState(false);
  const [savedMeta, setSavedMeta] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [erroMeta, setErroMeta] = useState("");

  if (!selected) return null;

  const startEditMeta = () => {
    setEditResponsavelNome(selected.responsavel ?? "");
    setEditPrazoIso(toISODate(selected.prazo ?? ""));
    setEditingMeta(true);
    setSavedMeta(false);
    setShowSuggestions(false);
    setErroMeta("");
  };

  const handleSaveMeta = async () => {
    if (!selected || !editResponsavelNome.trim()) return;
    setSalvandoMeta(true);
    setErroMeta("");

    try {
      const hoje = new Date().toLocaleDateString("pt-BR");
      const prazoBR = toBRDate(editPrazoIso);

      // Localiza o servidor selecionado pelo nome para pegar seu ID
      const servidorObj = servidores.find(
        (s) => s.nome.toLowerCase() === editResponsavelNome.trim().toLowerCase()
      );

      const servidorId = servidorObj ? servidorObj.id : null;

      const changed: string[] = [];
      if (editResponsavelNome.trim() !== selected.responsavel) {
        changed.push(
          selected.responsavel
            ? `Responsável alterado de "${selected.responsavel}" para "${editResponsavelNome.trim()}"`
            : `Responsável atribuído: "${editResponsavelNome.trim()}"`
        );
      }
      if (prazoBR !== (selected.prazo ?? "")) {
        changed.push(
          prazoBR
            ? selected.prazo
              ? `Prazo alterado de ${selected.prazo} para ${prazoBR}`
              : `Prazo definido: ${prazoBR}`
            : "Prazo removido"
        );
      }

      const relatoHistorico = changed.length > 0 ? changed.join(". ") + "." : undefined;

      // Chama o backend para persistir no banco de dados
      await atualizarMetaEncaminhamento(
        selected.id,
        servidorId,
        editPrazoIso || null,
        relatoHistorico
      );

      // Atualiza o estado local para reflexão imediata na UI
      selected.responsavel = editResponsavelNome.trim();
      selected.prazo = prazoBR || undefined;
      if (relatoHistorico && selected.evolucoes) {
        selected.evolucoes.push({
          data: hoje,
          autor: "Servidor (Equipe Pedagógica)",
          texto: relatoHistorico,
          tipo: "triagem",
        });
      }

      setEditingMeta(false);
      setSavedMeta(true);
      setShowSuggestions(false);
      if (onMetaSalvaSuccess) onMetaSalvaSuccess();
      setTimeout(() => setSavedMeta(false), 2500);
    } catch (err: unknown) {
      setErroMeta(err instanceof Error ? err.message : "Erro ao atualizar dados.");
    } finally {
      setSalvandoMeta(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-xl mx-4 flex flex-col overflow-hidden border border-border"
        style={{ maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0" style={{ background: "var(--primary)" }}>
          <div className="px-6 pt-4 pb-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-white/60 mb-0.5 font-mono">
                Encaminhamento #{selected.id} · {selected.turma}
              </p>
              <h2 className="text-sm font-bold text-white">
                Histórico de Evolução — {selected.aluno}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors shrink-0 mt-0.5"
            >
              <X size={18} />
            </button>
          </div>

          {/* Strip Editável de Responsável e Prazo */}
          <div className="mx-6 mb-4 rounded-xl overflow-hidden border border-white/15">
            {!editingMeta ? (
              <div className="flex items-center gap-0 bg-white/10">
                {/* Responsável */}
                <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <UserCog size={13} color="white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-white/50 uppercase tracking-wide font-semibold leading-none mb-0.5">
                      Responsável
                    </p>
                    <p className="text-sm font-semibold text-white leading-tight truncate">
                      {selected.responsavel || (
                        <span className="text-white/40 italic font-normal">
                          Não atribuído
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="w-px h-10 bg-white/15 shrink-0" />

                {/* Prazo */}
                <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <Calendar size={13} color="white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-white/50 uppercase tracking-wide font-semibold leading-none mb-0.5">
                      Prazo
                    </p>
                    <p className="text-sm font-semibold text-white leading-tight truncate">
                      {selected.prazo || (
                        <span className="text-white/40 italic font-normal">
                          Sem prazo definido
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {selected.status !== "concluido" && (
                  <>
                    <div className="w-px h-10 bg-white/15 shrink-0" />
                    <button
                      onClick={startEditMeta}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0 h-full"
                      title="Editar responsável e prazo"
                    >
                      <Pencil size={12} />
                      Editar
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* Formulário de Edição Conectado ao Backend */
              <div className="bg-white/95 p-4 space-y-3">
                <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Pencil size={11} /> Editar Atribuição e Prazo
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {/* Autocomplete de Servidores vindo do Backend */}
                  <div className="relative">
                    <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                      <UserCog size={11} /> Servidor Responsável
                    </label>
                    <input
                      type="text"
                      value={editResponsavelNome}
                      onChange={(e) => {
                        setEditResponsavelNome(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 150)
                      }
                      placeholder="Buscar servidor no sistema..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-(--primary)/10 placeholder:text-gray-400 text-gray-800 transition-all"
                      autoComplete="off"
                    />
                    {showSuggestions && (() => {
                      const q = editResponsavelNome.toLowerCase();
                      const matches = servidores.filter(
                        (s) =>
                          s.nome.toLowerCase().includes(q) &&
                          s.nome !== editResponsavelNome
                      );
                      return matches.length > 0 ? (
                        <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-44 overflow-y-auto divide-y divide-gray-100">
                          {matches.map((s) => (
                            <li key={s.id}>
                              <button
                                type="button"
                                onMouseDown={() => {
                                  setEditResponsavelNome(s.nome);
                                  setShowSuggestions(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#f0fdf4] hover:text-primary transition-colors flex items-center gap-2"
                              >
                                <User size={11} className="text-gray-400 shrink-0" />
                                {s.nome}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null;
                    })()}
                  </div>

                  {/* Input Date para Prazo */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                      <Calendar size={11} /> Prazo de Conclusão
                    </label>
                    <input
                      type="date"
                      value={editPrazoIso}
                      onChange={(e) => setEditPrazoIso(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-(--primary)/10 text-gray-700 transition-all"
                    />
                    {editPrazoIso && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {toBRDate(editPrazoIso)}
                      </p>
                    )}
                  </div>
                </div>

                {erroMeta && (
                  <p className="text-xs text-red-600 font-semibold">{erroMeta}</p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleSaveMeta}
                    disabled={salvandoMeta || !editResponsavelNome.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "var(--primary)" }}
                  >
                    <Check size={12} />
                    {salvandoMeta ? "Salvando..." : "Salvar"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingMeta(false);
                      setShowSuggestions(false);
                    }}
                    disabled={salvandoMeta}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        

        {/* Linha do Tempo */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Badge da Categoria */}
          <div className="mb-4 pb-3 border-b border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Motivo do Encaminhamento
            </span>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full border shadow-2xs"
              style={{
                background: (
                  categoriaColors[selected.categoria] ?? { bg: "#f8fafc" }
                ).bg,
                color: (
                  categoriaColors[selected.categoria] ?? { text: "#475569" }
                ).text,
                borderColor: `${(categoriaColors[selected.categoria] ?? { text: "#475569" }).text}35`,
              }}
            >
              {selected.categoria}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Linha do Tempo
            </p>
            {savedMeta && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full animate-pulse">
                <Check size={11} /> Atribuição atualizada no banco
              </span>
            )}
          </div>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-5">
              {selected.evolucoes.map((ev, i) => {
                const tcfg = tipoConfig[ev.tipo] ?? {
                  dot: "bg-gray-400",
                  color: "#475569",
                  label: ev.tipo,
                };
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

          {/* Adicionar Relato */}
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

        {/* Rodapé */}
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
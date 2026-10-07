import { useEffect, useState } from "react";
import {
  X,
  Clock,
  CheckCircle2,
  CircleDot,
  AlertTriangle,
  User,
  ArrowRight,
  Send,
  CalendarClock,
  Search,
  ChevronDown,
  Filter,
  MessageSquare,
  GraduationCap,
  Layers,
  Flag,
  ChevronRight,
  Lock,
  Sparkles,
} from "lucide-react";

import { encaminhamentosService } from "../services/encaminhamentosService";
import type { Encaminhamento, Status } from "../types/encaminhamentos";

const colConfig: Record<Status, { label: string; icon: React.ElementType; color: string; bg: string; headerBg: string }> = {
  pendente: {
    label: "Pendentes / Triagem",
    icon: Clock,
    color: "#b45309",
    bg: "#fffbeb",
    headerBg: "#fef3c7",
  },
  andamento: {
    label: "Em Acompanhamento",
    icon: CircleDot,
    color: "#1d4ed8",
    bg: "#eff6ff",
    headerBg: "#dbeafe",
  },
  concluido: {
    label: "Concluídos",
    icon: CheckCircle2,
    color: "#15803d",
    bg: "#f0fdf4",
    headerBg: "#dcfce7",
  },
};

const tipoConfig = {
  criacao: { color: "var(--primary)", label: "Criação", dot: "bg-green-600" },
  triagem: { color: "#7c3aed", label: "Triagem", dot: "bg-purple-500" },
  relato: { color: "#2563eb", label: "Relato", dot: "bg-blue-500" },
  conclusao: { color: "#15803d", label: "Conclusão", dot: "bg-emerald-500" },
};

const categoriaColors: Record<string, { bg: string; text: string }> = {
  "Apoio Pedagógico": { bg: "#eff6ff", text: "#1d4ed8" },
  "Assistência Estudantil": { bg: "#f0fdf4", text: "#15803d" },
  "Monitoria / Nivelamento": { bg: "#fdf4ff", text: "#7e22ce" },
  "Acompanhamento Psicológico": { bg: "#fff7ed", text: "#c2410c" },
};

export default function Encaminhamentos() {
  const [cards, setCards] = useState<Encaminhamento[]>([]);
  const [selected, setSelected] = useState<Encaminhamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadCards = async () => {
    try {
      setCards(await encaminhamentosService.getAll());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar encaminhamentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCards(); }, []);

  // Filter toolbar state
  const [filterSearch,    setFilterSearch]    = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterSetor,     setFilterSetor]     = useState("");
  const [filterOrigem,    setFilterOrigem]    = useState("");
  const [filterUrgentes,  setFilterUrgentes]  = useState(false);

  const categorias  = [...new Set(cards.map((c) => c.categoria))];
  const setores     = [...new Set(cards.map((c) => c.responsavel))];
  const origens     = [...new Set(cards.map((c) => c.origem))];

  const matchesFilter = (card: Encaminhamento) => {
    const q = filterSearch.toLowerCase();
    if (filterSearch && !card.aluno.toLowerCase().includes(q) && !card.matricula.includes(q) && !String(card.id).includes(q)) return false;
    if (filterCategoria && card.categoria !== filterCategoria) return false;
    if (filterSetor     && card.responsavel !== filterSetor)   return false;
    if (filterOrigem    && card.origem !== filterOrigem)       return false;
    if (filterUrgentes  && !card.urgente)                      return false;
    return true;
  };
  const anyFilter = filterSearch || filterCategoria || filterSetor || filterOrigem || filterUrgentes;
  const [novoRelato, setNovoRelato] = useState("");
  const [parecerFinal, setParecerFinal] = useState("");
  const [finalizando, setFinalizando] = useState(false);
  const [savedRelato, setSavedRelato] = useState(false);

  const openModal = async (card: Encaminhamento) => {
    setSelected(card);
    setNovoRelato("");
    setParecerFinal(card.parecer);
    setFinalizando(false);
    setSavedRelato(false);
    setError("");
    try {
      const evolucoes = await encaminhamentosService.getEvolucoes(card.id);
      setSelected((cur) => (cur?.id === card.id ? { ...card, evolucoes } : cur));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar o histórico.");
    }
  };

  const closeModal = () => { setSelected(null); setFinalizando(false); };

  // Registra a entrada na linha do tempo e recarrega os cards e o histórico do selecionado.
  const refreshSelected = async (id: number) => {
    await loadCards();
    const evolucoes = await encaminhamentosService.getEvolucoes(id);
    setSelected((cur) => (cur?.id === id ? { ...cur, evolucoes } : cur));
  };

  const saveRelato = async () => {
    if (!novoRelato.trim() || !selected || saving) return;
    setSaving(true);
    try {
      const autorId = await encaminhamentosService.getAutorId();
      await encaminhamentosService.addAcompanhamento(selected.id, "relato", novoRelato.trim(), autorId);
      // O primeiro relato de um encaminhamento pendente move o card para "Em Acompanhamento".
      let status = selected.status;
      if (status === "pendente") {
        await encaminhamentosService.updateStatus(selected.id, "andamento");
        status = "andamento";
      }
      setSelected((cur) => (cur ? { ...cur, status } : cur));
      await refreshSelected(selected.id);
      setNovoRelato("");
      setSavedRelato(true);
      setTimeout(() => setSavedRelato(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar o relato.");
    } finally {
      setSaving(false);
    }
  };

  const finalizar = async () => {
    if (!parecerFinal.trim() || !selected || saving) return;
    setSaving(true);
    try {
      const autorId = await encaminhamentosService.getAutorId();
      await encaminhamentosService.addAcompanhamento(selected.id, "conclusao", parecerFinal.trim(), autorId);
      await encaminhamentosService.updateStatus(selected.id, "concluido");
      await loadCards();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao finalizar o encaminhamento.");
    } finally {
      setSaving(false);
    }
  };

  const byStatus = (s: Status) => cards.filter((c) => c.status === s);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">

      {/* Module Header */}
      <div className="bg-card border-b border-border px-6 py-4 shrink-0">
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers size={16} style={{ color: "var(--primary)" }} />
              <h1 className="text-base font-bold text-foreground">
                Monitoramento de Encaminhamentos Pedagógicos
              </h1>
              <span className="text-xs bg-[#e8f0eb] text-[#15622f] border border-[#c3dbc9] px-2 py-0.5 rounded-full font-semibold">
                RN07
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Ciclo de vida das ações pedagógicas — triagem, acompanhamento e desfecho
            </p>
          </div>

          {/* Status summary badges */}
          <div className="flex items-center gap-2 shrink-0">
            {(["pendente", "andamento", "concluido"] as Status[]).map((s) => {
              const cfg = colConfig[s];
              const Icon = cfg.icon;
              return (
                <div
                  key={s}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold"
                  style={{ background: cfg.bg, borderColor: cfg.headerBg, color: cfg.color }}
                >
                  <Icon size={13} />
                  {cfg.label.split(" /")[0].split(" ")[0]}:&nbsp;
                  <span className="font-bold">{byStatus(s).length}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card border-b border-border px-6 py-3 shrink-0">
        <div className="flex items-center gap-3">

          {/* Search */}
          <div className="relative flex-1 min-w-0 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              placeholder="Buscar por aluno, matrícula ou protocolo (#)..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
            />
            {filterSearch && (
              <button onClick={() => setFilterSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={12} />
              </button>
            )}
          </div>

          <Filter size={13} className="text-muted-foreground shrink-0" />

          {/* Dropdowns */}
          {[
            { label: "Categoria",          value: filterCategoria, set: setFilterCategoria, opts: categorias  },
            { label: "Setor Responsável",  value: filterSetor,     set: setFilterSetor,     opts: setores     },
            { label: "Origem",             value: filterOrigem,    set: setFilterOrigem,    opts: origens     },
          ].map((f) => (
            <div key={f.label} className="relative shrink-0">
              <select
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className="appearance-none pl-3 pr-7 py-2 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer transition-all"
                style={{ color: f.value ? "var(--foreground)" : "var(--muted-foreground)", minWidth: "140px" }}
              >
                <option value="">{f.label} (Todos)</option>
                {f.opts.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          ))}

          {/* Urgentes toggle chip */}
          <button
            onClick={() => setFilterUrgentes((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all shrink-0 ml-auto"
            style={{
              borderColor:  filterUrgentes ? "#f97316" : "var(--border)",
              background:   filterUrgentes ? "#fff7ed" : "var(--card)",
              color:        filterUrgentes ? "#c2410c"  : "var(--muted-foreground)",
              boxShadow:    filterUrgentes ? "0 0 0 3px rgba(249,115,22,0.12)" : undefined,
            }}
          >
            <AlertTriangle size={12} className={filterUrgentes ? "text-orange-500" : "text-muted-foreground/50"} />
            Somente Urgentes / Vencendo
          </button>

          {/* Clear all */}
          {anyFilter && (
            <button
              onClick={() => { setFilterSearch(""); setFilterCategoria(""); setFilterSetor(""); setFilterOrigem(""); setFilterUrgentes(false); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 flex items-center gap-1"
            >
              <X size={11} /> Limpar
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-3 px-3 py-2 text-xs rounded-lg bg-red-50 border border-red-200 text-red-700 shrink-0">
          {error}
        </div>
      )}
      {loading && <p className="px-6 pt-3 text-xs text-muted-foreground shrink-0">Carregando encaminhamentos...</p>}

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full gap-4 px-6 py-5 min-w-[900px]">
          {(["pendente", "andamento", "concluido"] as Status[]).map((status) => {
            const cfg = colConfig[status];
            const ColIcon = cfg.icon;
            const colCards = byStatus(status).filter(matchesFilter);
            return (
              <div key={status} className="flex-1 flex flex-col min-h-0 min-w-[280px]">

                {/* Column Header */}
                <div
                  className="flex items-center justify-between px-4 py-2.5 rounded-t-xl border border-b-0"
                  style={{ background: cfg.headerBg, borderColor: cfg.headerBg }}
                >
                  <div className="flex items-center gap-2">
                    <ColIcon size={14} style={{ color: cfg.color }} />
                    <span className="text-xs font-bold" style={{ color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: cfg.color, color: "white" }}
                  >
                    {colCards.length}
                  </span>
                </div>

                {/* Cards List */}
                <div
                  className="flex-1 overflow-y-auto rounded-b-xl border p-3 space-y-3"
                  style={{ background: "#f7f8fa", borderColor: "var(--border)" }}
                >
                  {colCards.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 gap-2 opacity-40">
                      <ColIcon size={22} style={{ color: cfg.color }} />
                      <p className="text-xs text-muted-foreground">Nenhum encaminhamento</p>
                    </div>
                  )}
                  {colCards.map((card) => {
                    const catColors = categoriaColors[card.categoria] ?? { bg: "#f8fafc", text: "#475569" };
                    return (
                      <button
                        key={card.id}
                        onClick={() => openModal(card)}
                        className="w-full text-left bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 overflow-hidden group"
                      >
                        {/* Card accent strip */}
                        <div
                          className="h-1 w-full"
                          style={{
                            background: card.urgente
                              ? "#ef4444"
                              : status === "andamento"
                              ? "#3b82f6"
                              : status === "concluido"
                              ? "#22c55e"
                              : "#f59e0b",
                          }}
                        />
                        <div className="p-3.5 space-y-2.5">
                          {/* Header row */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                style={{ background: "var(--secondary)", color: "var(--primary)" }}
                              >
                                {card.aluno.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-foreground leading-tight">{card.aluno}</p>
                                <p className="text-xs text-muted-foreground" style={{ fontFamily: "monospace", fontSize: "10px" }}>
                                  #{card.id} · {card.turma}
                                </p>
                              </div>
                            </div>
                            {card.urgente && (
                              <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1 shrink-0">
                                <Flag size={9} /> Urgente
                              </span>
                            )}
                            {status === "andamento" && !card.urgente && (
                              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                                No Prazo
                              </span>
                            )}
                            {status === "concluido" && (
                              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1 shrink-0">
                                <CheckCircle2 size={9} /> Finalizado
                              </span>
                            )}
                          </div>

                          {/* Categoria */}
                          <span
                            className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: catColors.bg, color: catColors.text }}
                          >
                            {card.categoria}
                          </span>

                          {/* Meta rows */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <ArrowRight size={10} className="shrink-0" />
                              <span className="truncate">{card.origem}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <User size={10} className="shrink-0" />
                              <span className="truncate">{card.responsavel}</span>
                            </div>
                            {card.prazo && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <CalendarClock size={10} className="shrink-0" />
                                <span>Prazo: {card.prazo}</span>
                              </div>
                            )}
                            {card.ultimoRelato && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MessageSquare size={10} className="shrink-0" />
                                <span>Último relato: {card.ultimoRelato}</span>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-1 border-t border-border">
                            <span className="text-xs text-muted-foreground">
                              {card.totalEvolucoes} entrada{card.totalEvolucoes !== 1 ? "s" : ""}
                            </span>
                            <span className="text-xs font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--primary)" }}>
                              Ver histórico <ChevronRight size={11} />
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Backdrop */}
      {selected && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] flex items-center justify-center"
          onClick={closeModal}
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
                        background: (categoriaColors[selected.categoria] ?? { bg: "#f8fafc" }).bg,
                        color: (categoriaColors[selected.categoria] ?? { text: "#475569" }).text,
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
                  onClick={closeModal}
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
                        <div className={`w-6 h-6 rounded-full ${tcfg.dot} flex items-center justify-center shrink-0 z-10 ring-2 ring-card`}>
                          {ev.tipo === "criacao" && <Sparkles size={10} color="white" />}
                          {ev.tipo === "triagem" && <GraduationCap size={10} color="white" />}
                          {ev.tipo === "relato" && <MessageSquare size={10} color="white" />}
                          {ev.tipo === "conclusao" && <CheckCircle2 size={10} color="white" />}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-bold text-foreground">{ev.data}</span>
                            <span
                              className="text-xs font-semibold px-1.5 py-0 rounded"
                              style={{ background: tcfg.dot.replace("bg-", "#").replace("-500", ""), color: tcfg.color, opacity: 0.85 }}
                            >
                              {tcfg.label}
                            </span>
                            <span className="text-xs text-muted-foreground">por {ev.autor}</span>
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
                    onChange={(e) => { setNovoRelato(e.target.value); setSavedRelato(false); }}
                    placeholder="Descreva o progresso, intervenções realizadas, contatos estabelecidos ou observações relevantes para este encaminhamento..."
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground leading-relaxed transition-all"
                  />
                  {savedRelato && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--primary)" }}>
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
            </div>

            {/* Modal Footer */}
            {selected.status !== "concluido" && (
              <div className="px-6 py-4 border-t border-border bg-[#f7f8fa] flex items-center gap-2 shrink-0">
                <button
                  onClick={saveRelato}
                  disabled={!novoRelato.trim() || saving}
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
                      className="px-3 py-2.5 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={finalizar}
                      disabled={!parecerFinal.trim() || saving}
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
                    <p className="text-xs font-bold text-emerald-800 mb-1">Encaminhamento Concluído — Parecer de Desfecho</p>
                    <p className="text-xs text-emerald-700 leading-relaxed">{selected.parecer}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

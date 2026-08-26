import { useState } from "react";
import {
  X,
  Clock,
  CheckCircle2,
  CircleDot,
  AlertTriangle,
  User,
  ArrowRight,
  Plus,
  Send,
  CalendarClock,
  Search,
  ChevronDown,
  Filter,
  MessageSquare,
  GraduationCap,
  Layers,
  Flag,
  MoreHorizontal,
  ChevronRight,
  Lock,
  Sparkles,
} from "lucide-react";

type Status = "pendente" | "andamento" | "concluido";

interface Evolucao {
  data: string;
  autor: string;
  texto: string;
  tipo: "criacao" | "triagem" | "relato" | "conclusao";
}

interface Encaminhamento {
  id: number;
  aluno: string;
  matricula: string;
  turma: string;
  origem: string;
  categoria: string;
  responsavel: string;
  prazo?: string;
  ultimoRelato?: string;
  urgente: boolean;
  status: Status;
  parecer: string;
  evolucoes: Evolucao[];
}

const initialCards: Encaminhamento[] = [
  {
    id: 1042,
    aluno: "João Silva",
    matricula: "202110806528",
    turma: "TDS - 2ª Fase",
    origem: "Conselho Intermediário",
    categoria: "Apoio Pedagógico",
    responsavel: "Coordenação TDS",
    prazo: "05/07/2026",
    urgente: true,
    status: "pendente",
    parecer: "",
    evolucoes: [
      { data: "25/06/2026", autor: "Prof. Marcos", texto: "Criado automaticamente via Deliberação do Conselho de Classe Intermediário.", tipo: "criacao" },
      { data: "26/06/2026", autor: "Coord. Pedagógica", texto: "Triagem realizada. Atribuído para Coordenação Pedagógica TDS.", tipo: "triagem" },
    ],
  },
  {
    id: 1039,
    aluno: "Carlos Souza",
    matricula: "202310804422",
    turma: "Mecatrônica - 4ª Fase",
    origem: "Painel de Risco (RF06)",
    categoria: "Assistência Estudantil",
    responsavel: "Serviço Social",
    prazo: "10/07/2026",
    urgente: true,
    status: "pendente",
    parecer: "",
    evolucoes: [
      { data: "23/06/2026", autor: "Sistema SIGEP", texto: "Encaminhamento gerado automaticamente a partir de alerta de risco iminente de evasão no Painel RF06.", tipo: "criacao" },
    ],
  },
  {
    id: 1035,
    aluno: "Ana Beatriz Ferreira",
    matricula: "202110801345",
    turma: "TDS - 3ª Fase",
    origem: "Atendimento NAE",
    categoria: "Acompanhamento Psicológico",
    responsavel: "Setor de Psicologia",
    prazo: "15/07/2026",
    urgente: false,
    status: "pendente",
    parecer: "",
    evolucoes: [
      { data: "20/06/2026", autor: "Ana Costa (Pedagoga)", texto: "Aluna encaminhada para acompanhamento psicológico após atendimento NAE de acolhimento.", tipo: "criacao" },
    ],
  },
  {
    id: 1028,
    aluno: "Maria Oliveira",
    matricula: "202210809911",
    turma: "TDS - 1ª Fase",
    origem: "Atendimento Voluntário NAE",
    categoria: "Assistência Estudantil",
    responsavel: "Setor de Psicologia",
    prazo: "12/07/2026",
    ultimoRelato: "22/06",
    urgente: false,
    status: "andamento",
    parecer: "",
    evolucoes: [
      { data: "15/06/2026", autor: "Carlos Lima (Psicólogo)", texto: "Aluna buscou o NAE espontaneamente relatando dificuldades emocionais. Encaminhada ao acompanhamento psicológico contínuo.", tipo: "criacao" },
      { data: "18/06/2026", autor: "Profa. Renata Dias", texto: "Triagem confirmada. Prioridade média. Atribuído ao Setor de Psicologia.", tipo: "triagem" },
      { data: "22/06/2026", autor: "Carlos Lima (Psicólogo)", texto: "Segunda sessão realizada. Aluna demonstra melhora na gestão emocional. Técnicas de respiração e organização de rotina apresentadas. Próxima sessão em 29/06.", tipo: "relato" },
    ],
  },
  {
    id: 1021,
    aluno: "Fernanda Costa",
    matricula: "202310807654",
    turma: "Administração - 1ª Fase",
    origem: "Conselho de Classe",
    categoria: "Monitoria / Nivelamento",
    responsavel: "Dept. Acadêmico",
    prazo: "30/06/2026",
    ultimoRelato: "20/06",
    urgente: false,
    status: "andamento",
    parecer: "",
    evolucoes: [
      { data: "10/06/2026", autor: "Prof. Ricardo Alves", texto: "Encaminhada para monitoria em Matemática Aplicada após desempenho abaixo da média no 1º bimestre.", tipo: "criacao" },
      { data: "12/06/2026", autor: "Coord. Pedagógica", texto: "Aluna incluída no grupo de monitoria às segundas e quartas, 17h.", tipo: "triagem" },
      { data: "20/06/2026", autor: "Monitor Técnico", texto: "Frequência regular nas sessões. Aluna apresentando melhora progressiva em cálculo proporcional.", tipo: "relato" },
    ],
  },
  {
    id: 1015,
    aluno: "Lucas Santos",
    matricula: "202110809302",
    turma: "TDS - 4ª Fase",
    origem: "Pré-Conselho",
    categoria: "Monitoria / Nivelamento",
    responsavel: "Prof. Alberto",
    urgente: false,
    status: "concluido",
    parecer: "Aluno concluiu o ciclo de monitoria com desempenho satisfatório. Média recuperada para 6.8. Nenhum acompanhamento adicional necessário no momento.",
    evolucoes: [
      { data: "01/06/2026", autor: "Prof. Alberto", texto: "Encaminhamento originado em reunião de pré-conselho. Aluno com dificuldades em Banco de Dados.", tipo: "criacao" },
      { data: "03/06/2026", autor: "Coord. Pedagógica", texto: "Triagem concluída. Atribuído ao Prof. Alberto para monitoria individualizada.", tipo: "triagem" },
      { data: "14/06/2026", autor: "Prof. Alberto", texto: "4 sessões realizadas. Aluno demonstra evolução significativa nos conceitos de normalização.", tipo: "relato" },
      { data: "22/06/2026", autor: "Prof. Alberto", texto: "Encaminhamento concluído. Aluno aprovado no módulo prático. Parecer de desfecho registrado.", tipo: "conclusao" },
    ],
  },
  {
    id: 1008,
    aluno: "Rafael Rocha",
    matricula: "202110809002",
    turma: "TDS - 3ª Fase",
    origem: "Atendimento NAE",
    categoria: "Apoio Pedagógico",
    responsavel: "Coord. Pedagógica",
    urgente: false,
    status: "concluido",
    parecer: "Questão de indisciplina mediada com sucesso. Acordo formalizado entre aluno e professor. Situação regularizada sem ocorrências subsequentes.",
    evolucoes: [
      { data: "28/05/2026", autor: "Profa. Camila Torres", texto: "Aluno encaminhado após conflito com professor em sala de aula.", tipo: "criacao" },
      { data: "29/05/2026", autor: "Coord. Pedagógica", texto: "Mediação realizada. Aluno e professor reunidos para diálogo.", tipo: "triagem" },
      { data: "10/06/2026", autor: "Coord. Pedagógica", texto: "Encerrado após período de observação sem novas ocorrências.", tipo: "conclusao" },
    ],
  },
];

const colConfig: Record<Status, { label: string; icon: React.ElementType; color: string; bg: string; headerBg: string; count: number }> = {
  pendente: {
    label: "Pendentes / Triagem",
    icon: Clock,
    color: "#b45309",
    bg: "#fffbeb",
    headerBg: "#fef3c7",
    count: 8,
  },
  andamento: {
    label: "Em Acompanhamento",
    icon: CircleDot,
    color: "#1d4ed8",
    bg: "#eff6ff",
    headerBg: "#dbeafe",
    count: 15,
  },
  concluido: {
    label: "Concluídos",
    icon: CheckCircle2,
    color: "#15803d",
    bg: "#f0fdf4",
    headerBg: "#dcfce7",
    count: 34,
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
  const [cards, setCards] = useState<Encaminhamento[]>(initialCards);
  const [selected, setSelected] = useState<Encaminhamento | null>(null);

  // Filter toolbar state
  const [filterSearch,    setFilterSearch]    = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterSetor,     setFilterSetor]     = useState("");
  const [filterOrigem,    setFilterOrigem]    = useState("");
  const [filterUrgentes,  setFilterUrgentes]  = useState(false);

  const categorias  = [...new Set(initialCards.map((c) => c.categoria))];
  const setores     = [...new Set(initialCards.map((c) => c.responsavel))];
  const origens     = [...new Set(initialCards.map((c) => c.origem))];

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

  const openModal = (card: Encaminhamento) => {
    setSelected(card);
    setNovoRelato("");
    setParecerFinal(card.parecer);
    setFinalizando(false);
    setSavedRelato(false);
  };

  const saveRelato = () => {
    if (!novoRelato.trim() || !selected) return;
    const hoje = new Date().toLocaleDateString("pt-BR");
    const updated = cards.map((c) =>
      c.id === selected.id
        ? {
            ...c,
            ultimoRelato: hoje.slice(0, 5),
            evolucoes: [
              ...c.evolucoes,
              { data: hoje, autor: "Servidor (Equipe Pedagógica)", texto: novoRelato, tipo: "relato" as const },
            ],
          }
        : c
    );
    setCards(updated);
    setSelected(updated.find((c) => c.id === selected.id) ?? null);
    setNovoRelato("");
    setSavedRelato(true);
    setTimeout(() => setSavedRelato(false), 2500);
  };

  const finalizar = () => {
    if (!parecerFinal.trim() || !selected) return;
    const hoje = new Date().toLocaleDateString("pt-BR");
    const updated = cards.map((c) =>
      c.id === selected.id
        ? {
            ...c,
            status: "concluido" as Status,
            parecer: parecerFinal,
            evolucoes: [
              ...c.evolucoes,
              { data: hoje, autor: "Servidor (Equipe Pedagógica)", texto: `Encaminhamento finalizado. Parecer: ${parecerFinal}`, tipo: "conclusao" as const },
            ],
          }
        : c
    );
    setCards(updated);
    setSelected(null);
    setFinalizando(false);
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
                  <span className="font-bold">{byStatus(s).length > 0 ? byStatus(s).length : cfg.count - byStatus(s).length + byStatus(s).length}</span>
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
                              {card.evolucoes.length} entrada{card.evolucoes.length !== 1 ? "s" : ""}
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
          onClick={() => { setSelected(null); setFinalizando(false); }}
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
                  onClick={() => { setSelected(null); setFinalizando(false); }}
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
                  disabled={!novoRelato.trim()}
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
                      disabled={!parecerFinal.trim()}
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

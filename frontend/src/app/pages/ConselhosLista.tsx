import { useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  Play,
  FileText,
  Clock,
  CalendarDays,
  Users,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Filter,
  Calendar,
  SkipForward,
  Download,
  CircleDot,
  X,
  Tag,
  ToggleLeft,
  ToggleRight,
  ClipboardList,
  UserCheck,
  Pencil,
} from "lucide-react";

interface Props {
  onEnterConselho: (tipo: "intermediario" | "final") => void;
}

const reunioesAbertas = [
  {
    id: 1,
    titulo:
      "Conselho de Classe Intermediário — Curso Técnico em Desenvolvimento de Sistemas",
    etapa: "Intermediário",
    curso: "Técnico Integrado",
    status: "em_andamento",
    criadoEm: "24/06",
    docentes: 9,
    rascunho: true,
    turmas: ["TDS - 2ª Fase", "Mecatrônica - 3ª Fase"],
    progresso: 20,
  },
  {
    id: 2,
    titulo: "Pré-Conselho — Mecatrônica 4ª Fase",
    etapa: "Pré-Conselho",
    curso: "Técnico Integrado",
    status: "agendado",
    data: "02/07/2026",
    hora: "14:00",
    docentes: 11,
    rascunho: false,
    turmas: ["Mecatrônica - 4ª Fase"],
    progresso: 0,
  },
  {
    id: 3,
    titulo: "Conselho Final — Administração 1ª e 2ª Fase",
    etapa: "Final",
    curso: "Técnico Integrado",
    status: "agendado",
    data: "10/07/2026",
    hora: "09:00",
    docentes: 14,
    rascunho: false,
    turmas: [
      "Administração - 1ª Fase",
      "Administração - 2ª Fase",
    ],
    progresso: 0,
  },
  {
    id: 4,
    titulo: "Pré-Conselho — Informática para Internet 3ª Fase",
    etapa: "Pré-Conselho",
    curso: "Técnico Integrado",
    status: "agendado",
    data: "08/07/2026",
    hora: "14:00",
    docentes: 9,
    rascunho: false,
    turmas: ["Informática - 3ª Fase"],
    progresso: 0,
  },
];

const reunioesRealizadas = [
  {
    id: 10,
    titulo:
      "Conselho Intermediário — Técnico em Administração 3ª e 4ª Fase",
    etapa: "Intermediário",
    curso: "Técnico Integrado",
    data: "10/06/2026",
    docentes: 13,
    ata: "Ata_Adm_3_4_Intermediario_2026.pdf",
  },
  {
    id: 11,
    titulo: "Pré-Conselho — Mecatrônica 2ª Fase",
    etapa: "Pré-Conselho",
    curso: "Técnico Integrado",
    data: "03/06/2026",
    docentes: 10,
    ata: "Ata_Meca_2_PreConselho_2026.pdf",
  },
  {
    id: 12,
    titulo: "Conselho Final — TDS 3ª e 4ª Fase",
    etapa: "Final",
    curso: "Técnico Integrado",
    data: "28/05/2026",
    docentes: 15,
    ata: "Ata_TDS_3_4_Final_2026.pdf",
  },
  {
    id: 13,
    titulo:
      "Conselho Intermediário — Informática para Internet 1ª Fase",
    etapa: "Intermediário",
    curso: "Técnico Integrado",
    data: "20/05/2026",
    docentes: 8,
    ata: "Ata_Info_1_Intermediario_2026.pdf",
  },
];

const etapaColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "Pré-Conselho": {
    bg: "#f0f9ff",
    text: "#0369a1",
    border: "#bae6fd",
  },
  Intermediário: {
    bg: "#fdf4ff",
    text: "#7e22ce",
    border: "#e9d5ff",
  },
  Final: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
};

const turmasDisponiveis = [
  "TDS - 1ª Fase",
  "TDS - 2ª Fase",
  "TDS - 3ª Fase",
  "TDS - 4ª Fase",
  "Mecatrônica - 1ª Fase",
  "Mecatrônica - 2ª Fase",
  "Mecatrônica - 3ª Fase",
  "Mecatrônica - 4ª Fase",
  "Administração - 1ª Fase",
  "Administração - 2ª Fase",
  "Informática - 1ª Fase",
  "Informática - 2ª Fase",
  "Informática - 3ª Fase",
];

const conselhosOrigem = [
  "Pré-Conselho - TDS 1ª e 2ª Fase (Concluído em 10/05)",
  "Pré-Conselho - Mecatrônica 4ª Fase (Concluído em 03/06)",
  "Conselho Intermediário - Administração 3ª e 4ª Fase (Concluído em 10/06)",
];

export default function ConselhosLista({
  onEnterConselho,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    "abertas" | "historico"
  >("abertas");
  const [search, setSearch] = useState("");
  const [filterCurso, setFilterCurso] = useState("");
  const [filterEtapa, setFilterEtapa] = useState("");

  // Drawer state — criar conselho
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fNome, setFNome] = useState("");
  const [fEtapa, setFEtapa] = useState("");
  const [fTurmas, setFTurmas] = useState<string[]>([
    "TDS - 1ª Fase",
    "TDS - 2ª Fase",
  ]);
  const [fTurmaInput, setFTurmaInput] = useState("");
  const [fTurmaOpen, setFTurmaOpen] = useState(false);
  const [fData, setFData] = useState("");
  const [fHora, setFHora] = useState("");
  const [fImportarPautas, setFImportarPautas] = useState(true);
  const [fOrigem, setFOrigem] = useState(conselhosOrigem[0]);
  const [fSaved, setFSaved] = useState(false);

  // Agendar conselho final modal
  type ReuniaoBrief = { id: number; titulo: string; turmas: string[]; criadoEm?: string; data?: string };
  const [agendarFinalFor, setAgendarFinalFor] = useState<ReuniaoBrief | null>(null);
  const [afNomeEdit, setAfNomeEdit] = useState(false);
  const [afNome, setAfNome] = useState("");
  const [afTurmasEdit, setAfTurmasEdit] = useState(false);
  const [afTurmas, setAfTurmas] = useState<string[]>([]);
  const [afTurmaInput, setAfTurmaInput] = useState("");
  const [afTurmaOpen, setAfTurmaOpen] = useState(false);
  const [afData, setAfData] = useState("");
  const [afHora, setAfHora] = useState("");
  const [afPartBusca, setAfPartBusca] = useState("");
  const [afPartOpen, setAfPartOpen] = useState(false);

  // Tracks which intermediários were promoted to final
  const [promotedIds, setPromotedIds] = useState<Set<number>>(new Set());
  const [promotedFinais, setPromotedFinais] = useState<typeof reunioesAbertas>([]);

  const removeTurma = (t: string) =>
    setFTurmas((prev) => prev.filter((x) => x !== t));
  const addTurma = (t: string) => {
    if (!fTurmas.includes(t))
      setFTurmas((prev) => [...prev, t]);
    setFTurmaInput("");
    setFTurmaOpen(false);
  };
  const turmasSugeridas = turmasDisponiveis.filter(
    (t) =>
      !fTurmas.includes(t) &&
      t.toLowerCase().includes(fTurmaInput.toLowerCase()),
  );
  // Participant management
  interface Participante {
    id: number;
    nome: string;
    label: string;
    tipo: "importado" | "manual";
  }
  const defaultParticipantes: Participante[] = [
    {
      id: 1,
      nome: "Prof. Alberto",
      label: "TDS 1ª - Importado",
      tipo: "importado",
    },
    {
      id: 2,
      nome: "Prof. Marcos",
      label: "TDS 2ª - Importado",
      tipo: "importado",
    },
    {
      id: 3,
      nome: "Prof. Roberto",
      label: "Convidado - Manual",
      tipo: "manual",
    },
    {
      id: 4,
      nome: "Tec. Claudia",
      label: "Equipe NAE - Manual",
      tipo: "manual",
    },
  ];
  const servidoresCatalogo = [
    "Prof. Ana Costa",
    "Prof. Ricardo Alves",
    "Profa. Camila Torres",
    "Prof. Henrique Lopes",
    "Profa. Sandra Melo",
    "Prof. Fábio Carvalho",
    "Profa. Juliana Neves",
    "Profa. Renata Dias",
    "Carlos Lima (Psicólogo)",
  ];
  const [fParticipantes, setFParticipantes] = useState<
    Participante[]
  >(defaultParticipantes);
  const [fPartBusca, setFPartBusca] = useState("");
  const [fPartOpen, setFPartOpen] = useState(false);
  const nextPartId = { current: 10 };
  // Participants for "agendar final" modal (separate list)
  const [afParticipantes, setAfParticipantes] = useState<Participante[]>(defaultParticipantes);

  const removeParticipante = (id: number) =>
    setFParticipantes((prev) =>
      prev.filter((p) => p.id !== id),
    );
  const addParticipante = (nome: string) => {
    if (fParticipantes.some((p) => p.nome === nome)) return;
    setFParticipantes((prev) => [
      ...prev,
      { id: nextPartId.current++, nome, label: "Convidado - Manual", tipo: "manual" },
    ]);
    setFPartBusca("");
    setFPartOpen(false);
  };
  const removeAfParticipante = (id: number) =>
    setAfParticipantes((prev) => prev.filter((p) => p.id !== id));
  const addAfParticipante = (nome: string) => {
    if (afParticipantes.some((p) => p.nome === nome)) return;
    setAfParticipantes((prev) => [
      ...prev,
      { id: nextPartId.current++, nome, label: "Convidado - Manual", tipo: "manual" },
    ]);
    setAfPartBusca("");
    setAfPartOpen(false);
  };
  const partSugeridos = servidoresCatalogo.filter(
    (s) =>
      !fParticipantes.some((p) => p.nome === s) &&
      s.toLowerCase().includes(fPartBusca.toLowerCase()),
  );
  const afPartSugeridos = servidoresCatalogo.filter(
    (s) =>
      !afParticipantes.some((p) => p.nome === s) &&
      s.toLowerCase().includes(afPartBusca.toLowerCase()),
  );

  const openDrawer = (origem?: string) => {
    setFSaved(false);
    setFParticipantes(defaultParticipantes);
    setFPartBusca("");
    if (origem) {
      setFImportarPautas(true);
      setFOrigem(origem);
    }
    setDrawerOpen(true);
  };
  const closeDrawer = () => setDrawerOpen(false);

  const openAgendarFinal = (r: ReuniaoBrief) => {
    setAgendarFinalFor(r);
    setAfNome(r.titulo.replace("Intermediário", "Final").replace("Conselho de Classe Intermediário", "Conselho Final"));
    setAfTurmas([...r.turmas]);
    setAfData("");
    setAfHora("");
    setAfNomeEdit(false);
    setAfTurmasEdit(false);
    setAfTurmaInput("");
    setAfTurmaOpen(false);
    setAfPartBusca("");
    setAfPartOpen(false);
    setAfParticipantes(defaultParticipantes);
  };
  const closeAgendarFinal = () => setAgendarFinalFor(null);

  const confirmarAgendarFinal = () => {
    if (!agendarFinalFor) return;
    const novoFinal = {
      id: agendarFinalFor.id + 1000,
      titulo: afNome,
      etapa: "Final" as const,
      curso: "Técnico Integrado",
      status: "agendado" as const,
      data: afData,
      hora: afHora,
      docentes: afParticipantes.length,
      rascunho: false,
      turmas: afTurmas,
      progresso: 0,
    };
    setPromotedFinais((prev) => [...prev, novoFinal]);
    setPromotedIds((prev) => new Set([...prev, agendarFinalFor.id]));
    closeAgendarFinal();
  };

  const afTurmasSugeridas = turmasDisponiveis.filter(
    (t) => !afTurmas.includes(t) && t.toLowerCase().includes(afTurmaInput.toLowerCase()),
  );

  const filteredAbertas = reunioesAbertas.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.titulo.toLowerCase().includes(q) ||
      r.turmas.some((t) => t.toLowerCase().includes(q));
    const matchEtapa = !filterEtapa || r.etapa === filterEtapa;
    return matchSearch && matchEtapa;
  });

  const filteredInter = filteredAbertas.filter(
    (r) => r.etapa === "Intermediário" && !promotedIds.has(r.id),
  );
  const filteredFinais = [
    ...filteredAbertas.filter((r) => r.etapa === "Final"),
    ...promotedFinais.filter((r) => {
      const q = search.toLowerCase();
      return (!search || r.titulo.toLowerCase().includes(q) || r.turmas.some((t) => t.toLowerCase().includes(q)));
    }),
  ];

  const filteredHistorico = reunioesRealizadas.filter((r) => {
    const q = search.toLowerCase();
    return !search || r.titulo.toLowerCase().includes(q);
  });

  return (
    <div
      className="flex flex-col h-full bg-background overflow-x-hidden"
      style={{ width: "100%" }}
    >
      {/* Page Header */}
      <div className="bg-card border-b border-border px-6 py-4 shrink-0">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen
                size={16}
                style={{ color: "var(--primary)" }}
              />
              <h1 className="text-base font-bold text-foreground">
                Gestão de Conselhos de Classe
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Agende, retome ou consulte as atas das reuniões
              colegiadas
            </p>
          </div>
          <button
            onClick={() => openDrawer()}
            className="flex items-center self-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] shrink-0"
            style={{ background: "var(--primary)" }}
          >
            <Plus size={15} />
            Criar novo Conselho
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card border-b border-border px-6 py-3 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Buscar por nome da turma ou conselho..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
            />
          </div>

          <Filter
            size={13}
            className="text-muted-foreground shrink-0"
          />

          {[
            {
              label: "Filtrar por Curso",
              value: filterCurso,
              set: setFilterCurso,
              opts: ["Técnico Integrado", "Ensino Superior"],
            },
            {
              label: "Etapa Regulamentar",
              value: filterEtapa,
              set: setFilterEtapa,
              opts: ["Intermediário", "Final"],
            },
          ].map((f) => (
            <div key={f.label} className="relative">
              <select
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className="appearance-none pl-3 pr-7 py-2 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer transition-all min-w-[150px]"
                style={{
                  color: f.value
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                }}
              >
                <option value="">{f.label}</option>
                {f.opts.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>
          ))}

          {(filterCurso || filterEtapa) && (
            <button
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                setFilterCurso("");
                setFilterEtapa("");
              }}
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border px-6 shrink-0">
        <div className="flex gap-0">
          {[
            {
              id: "abertas",
              label: `Conselhos Abertos`,
              count: reunioesAbertas.length,
            },
            {
              id: "historico",
              label: "Histórico de Realizados",
              count: reunioesRealizadas.length,
            },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as "abertas" | "historico",
                  )
                }
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all"
                style={{
                  borderColor: active
                    ? "var(--primary)"
                    : "transparent",
                  color: active
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                }}
              >
                {tab.label}
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: active
                      ? "var(--primary)"
                      : "var(--muted)",
                    color: active
                      ? "white"
                      : "var(--muted-foreground)",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* ── Tab A: Em Aberto ────────────────────────────────────────── */}
        {activeTab === "abertas" && (
          <div className="space-y-8">
            {/* ── Categoria: Conselhos Intermediários ── */}
            {(filterEtapa === "" ||
              filterEtapa === "Intermediário") && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-1 h-4 rounded-full shrink-0"
                    style={{ background: "#7c3aed" }}
                  />
                  <h2 className="text-xs font-black uppercase tracking-widest text-foreground">
                    Conselhos Intermediários
                  </h2>
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "#fdf4ff",
                      color: "#7c3aed",
                      border: "1px solid #e9d5ff",
                    }}
                  >
                    {filteredInter.length}
                  </span>
                </div>

                {filteredInter.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-center bg-card rounded-xl border border-dashed border-border">
                    <p className="text-sm text-muted-foreground">
                      Nenhum conselho intermediário encontrado.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredInter.map((r) => (
                      <div
                        key={r.id}
                        className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow duration-200"
                        style={{
                          borderLeft: "4px solid #7c3aed",
                        }}
                      >
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              {/* Badge row */}
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <span
                                  className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                                  style={{
                                    background: "#fdf4ff",
                                    color: "#7e22ce",
                                    borderColor: "#e9d5ff",
                                  }}
                                >
                                  Intermediário
                                </span>
                                {r.status === "em_andamento" ? (
                                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1.5">
                                    <CircleDot
                                      size={10}
                                      className="animate-pulse"
                                    />
                                    Em Andamento · Rascunho
                                    Salvo
                                  </span>
                                ) : (
                                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                                    <CalendarDays size={10} />{" "}
                                    Agendado
                                  </span>
                                )}
                              </div>

                              {/* Title */}
                              <h2 className="text-sm font-bold text-foreground leading-snug mb-2">
                                {r.titulo}
                              </h2>

                              {/* Turmas */}
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {r.turmas.map((t) => (
                                  <span
                                    key={t}
                                    className="text-xs bg-[#f0f2f5] text-foreground px-2 py-0.5 rounded-md font-medium"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>

                              {/* Meta */}
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock size={11} /> Criado em{" "}
                                {r.criadoEm ?? r.data}
                              </span>
                            </div>

                            {/* Action buttons */}
                            <div className="shrink-0 flex items-center gap-2">
                              <button
                                onClick={() => openAgendarFinal(r)}
                                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-[#e8f0eb] active:scale-[0.98]"
                                style={{
                                  borderColor: "var(--primary)",
                                  color: "var(--primary)",
                                }}
                              >
                                <CalendarDays size={13} />
                                Agendar conselho final
                              </button>
                              <button
                                onClick={() => onEnterConselho("intermediario")}
                                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                                style={{
                                  background: "var(--primary)",
                                }}
                              >
                                Visualizar e editar dados
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Categoria: Conselhos Finais ── */}
            {(filterEtapa === "" ||
              filterEtapa === "Final") && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-1 h-4 rounded-full shrink-0"
                    style={{ background: "#c2410c" }}
                  />
                  <h2 className="text-xs font-black uppercase tracking-widest text-foreground">
                    Conselhos Finais
                  </h2>
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "#fff7ed",
                      color: "#c2410c",
                      border: "1px solid #fed7aa",
                    }}
                  >
                    {filteredFinais.length}
                  </span>
                </div>

                {filteredFinais.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-center bg-card rounded-xl border border-dashed border-border">
                    <p className="text-sm text-muted-foreground">
                      Nenhum conselho final encontrado.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredFinais.map((r) => {
                      const isAndamento =
                        r.status === "em_andamento";
                      const etapaCfg =
                        etapaColors[r.etapa] ??
                        etapaColors["Intermediário"];
                      return (
                        <div
                          key={r.id}
                          className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow duration-200"
                          style={{
                            borderLeft: isAndamento
                              ? "4px solid #f97316"
                              : "4px solid #c2410c",
                          }}
                        >
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                {/* Badge row */}
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  <span
                                    className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                                    style={{
                                      background: etapaCfg.bg,
                                      color: etapaCfg.text,
                                      borderColor:
                                        etapaCfg.border,
                                    }}
                                  >
                                    {r.etapa}
                                  </span>
                                  {isAndamento ? (
                                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1.5">
                                      <CircleDot
                                        size={10}
                                        className="animate-pulse"
                                      />
                                      Em Andamento · Rascunho
                                      Salvo
                                    </span>
                                  ) : (
                                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                                      <CalendarDays size={10} />{" "}
                                      Agendado
                                    </span>
                                  )}
                                </div>

                                {/* Title */}
                                <h2 className="text-sm font-bold text-foreground leading-snug mb-2">
                                  {r.titulo}
                                </h2>

                                {/* Turmas */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {r.turmas.map((t) => (
                                    <span
                                      key={t}
                                      className="text-xs bg-[#f0f2f5] text-foreground px-2 py-0.5 rounded-md font-medium"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>

                                {/* Meta row */}
                                <div className="flex items-center gap-4 flex-wrap">
                                  {isAndamento ? (
                                    <>
                                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock size={11} />{" "}
                                        Criado em {r.criadoEm}
                                      </span>
                                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Users size={11} />{" "}
                                        {r.docentes} docentes
                                        convocados
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                                          <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                              width: `${r.progresso}%`,
                                              background:
                                                "var(--primary)",
                                            }}
                                          />
                                        </div>
                                        <span
                                          className="text-xs font-semibold"
                                          style={{
                                            color:
                                              "var(--primary)",
                                          }}
                                        >
                                          {r.progresso}%
                                          concluído
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar size={11} />{" "}
                                        Data: {r.data} às{" "}
                                        {r.hora}
                                      </span>
                                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Users size={11} />{" "}
                                        {r.docentes} docentes
                                        convocados
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Action button */}
                              <div className="shrink-0 flex flex-col gap-2 items-end">
                                {isAndamento ? (
                                  <button
                                    onClick={() => onEnterConselho("final")}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                                    style={{
                                      background:
                                        "var(--primary)",
                                    }}
                                  >
                                    <Play
                                      size={13}
                                      fill="white"
                                    />
                                    Retomar Realização
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => onEnterConselho("final")}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-[#e8f0eb] active:scale-[0.98] border-2"
                                    style={{
                                      borderColor:
                                        "var(--primary)",
                                      color: "var(--primary)",
                                    }}
                                  >
                                    <ArrowRight size={13} />
                                    Iniciar Conselho
                                  </button>
                                )}
                                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                                  <FileText size={11} /> Ver
                                  detalhes
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Progress footer strip */}
                          {isAndamento && (
                            <div className="h-1 w-full bg-muted">
                              <div
                                className="h-full transition-all"
                                style={{
                                  width: `${r.progresso}%`,
                                  background: "var(--primary)",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Global empty state when filters hide everything */}
            {filteredInter.length === 0 &&
              filteredFinais.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <Search
                    size={24}
                    className="text-muted-foreground/30"
                  />
                  <p className="text-sm text-muted-foreground">
                    Nenhum conselho encontrado com os filtros
                    selecionados.
                  </p>
                </div>
              )}
          </div>
        )}

        {/* ── Tab B: Histórico ────────────────────────────────────────── */}
        {activeTab === "historico" && (
          <div className="space-y-3">
            {filteredHistorico.map((r) => {
              const etapaCfg =
                etapaColors[r.etapa] ??
                etapaColors["Intermediário"];
              return (
                <div
                  key={r.id}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-sm transition-shadow"
                  style={{ borderLeft: "4px solid #22c55e" }}
                >
                  <div className="p-4 flex items-center gap-4">
                    {/* Done icon */}
                    <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                      <CheckCircle2
                        size={16}
                        className="text-emerald-600"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                          style={{
                            background: etapaCfg.bg,
                            color: etapaCfg.text,
                            borderColor: etapaCfg.border,
                          }}
                        >
                          {r.etapa}
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Concluído
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground truncate">
                        {r.titulo}
                      </p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={10} /> {r.data}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users size={10} /> {r.docentes}{" "}
                          docentes
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <FileText size={10} /> {r.ata}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                        <Download size={12} />
                        Baixar Ata (PDF)
                      </button>
                      {r.etapa !== "Final" && (
                        <button
                          onClick={() =>
                            openDrawer(
                              `${r.titulo} (Concluído em ${r.data})`,
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
                          style={{
                            background: "var(--primary)",
                          }}
                        >
                          <SkipForward size={12} />
                          Agendar Próximo Passo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Criar Novo Conselho — Modal ──────────────────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeDrawer}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full flex flex-col bg-card rounded-2xl shadow-2xl"
            style={{ maxWidth: "520px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 py-4 rounded-t-2xl flex items-center justify-between shrink-0"
              style={{ background: "linear-gradient(135deg, #0b3d1e 0%, #15622f 100%)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <ClipboardList size={18} color="white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white/60">
                    Conselho de Classe · Novo Conselho
                  </p>
                  <h2 className="text-sm font-bold text-white">
                    Criar novo conselho de classe
                  </h2>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Campo: Nome de Identificação */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nome de Identificação <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-1.5">
                  Use um nome fácil para identificar este conselho depois, ex: "Intermediário TDS 2026.1"
                </p>
                <input
                  type="text"
                  value={fNome}
                  onChange={(e) => setFNome(e.target.value)}
                  placeholder="Ex: Conselho Intermediário — TDS 2026.1"
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
                />
              </div>

              {/* Campo: Turmas Vinculadas */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Turma(s) Vinculada(s) <span className="text-red-500">*</span>
                  <span className="font-normal text-muted-foreground ml-1">(suporta múltiplas turmas)</span>
                </label>
                <div
                  className="min-h-[44px] flex flex-wrap gap-1.5 px-3 py-2 rounded-lg border border-border bg-[#f7f8fa] cursor-text transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
                  onClick={() => setFTurmaOpen(true)}
                >
                  {fTurmas.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "var(--secondary)", color: "var(--primary)" }}
                    >
                      {t}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeTurma(t); }}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={fTurmaInput}
                    onChange={(e) => { setFTurmaInput(e.target.value); setFTurmaOpen(true); }}
                    onFocus={() => setFTurmaOpen(true)}
                    placeholder={fTurmas.length === 0 ? "Buscar turma..." : ""}
                    className="flex-1 min-w-[100px] text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                  />
                </div>
                {fTurmaOpen && turmasSugeridas.length > 0 && (
                  <div className="mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10 relative">
                    {turmasSugeridas.slice(0, 6).map((t) => (
                      <button
                        key={t}
                        onMouseDown={(e) => { e.preventDefault(); addTurma(t); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#f7f8fa] transition-colors border-b border-border last:border-0 flex items-center gap-2"
                      >
                        <Tag size={11} className="text-muted-foreground shrink-0" />
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Coordenador de Curso convocado — aparece ao selecionar turma */}
              {fTurmas.length > 0 && (() => {
                const cursoMap: Record<string, { curso: string; coordenador: string }> = {
                  "TDS":          { curso: "Técnico em Desenvolvimento de Sistemas", coordenador: "Prof. Ricardo Alves" },
                  "Mecatrônica":  { curso: "Técnico em Mecatrônica",                coordenador: "Profa. Camila Torres" },
                  "Administração":{ curso: "Técnico em Administração",              coordenador: "Prof. Henrique Lopes" },
                  "Informática":  { curso: "Técnico em Informática para Internet",  coordenador: "Profa. Sandra Melo"   },
                };
                const cursosPresentes = Array.from(
                  new Set(
                    fTurmas.map((t) => {
                      const match = Object.keys(cursoMap).find((k) => t.startsWith(k));
                      return match ?? null;
                    }).filter(Boolean)
                  )
                ) as string[];

                return (
                  <div className="rounded-xl border border-[#d1fae5] bg-[#f0fdf4] px-4 py-3.5 space-y-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <UserCheck size={13} style={{ color: "var(--primary)" }} />
                      <span className="text-xs font-bold text-foreground">Coordenador(es) de Curso Convocados</span>
                    </div>
                    {cursosPresentes.map((k) => {
                      const info = cursoMap[k];
                      return (
                        <div key={k} className="flex items-center justify-between bg-white rounded-lg border border-[#bbf7d0] px-3 py-2.5">
                          <div>
                            <p className="text-xs font-bold text-foreground">{info.coordenador}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{info.curso}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac" }}>
                            Convocado
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 border-t border-border flex gap-2 shrink-0 rounded-b-2xl"
              style={{ background: "#fafbfc" }}
            >
              <button
                onClick={closeDrawer}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                disabled={!fNome || fTurmas.length === 0}
                onClick={() => { closeDrawer(); onEnterConselho("intermediario"); }}
                className="flex-1 py-2.5 text-sm font-bold rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #0f4a23 0%, #15622f 100%)",
                  boxShadow: "0 4px 12px rgba(15,74,35,0.25)",
                }}
              >
                Criar e visualizar conselho
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Agendar Conselho Final — Modal ──────────────────────────────── */}
      {agendarFinalFor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeAgendarFinal}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full flex flex-col bg-card rounded-2xl shadow-2xl"
            style={{ maxWidth: "560px", maxHeight: "92vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 py-4 rounded-t-2xl flex items-center justify-between shrink-0"
              style={{ background: "linear-gradient(135deg, #0b3d1e 0%, #15622f 100%)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <CalendarDays size={18} color="white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white/60">
                    Conselho de Classe · Agendar Etapa Final
                  </p>
                  <h2 className="text-sm font-bold text-white">
                    Agendar conselho final
                  </h2>
                </div>
              </div>
              <button
                onClick={closeAgendarFinal}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 min-h-0">

              {/* ── Dados herdados do Intermediário ── */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-2.5 bg-[#f7f8fa] border-b border-border">
                  <p className="text-xs font-bold text-foreground">Dados do conselho intermediário de origem</p>
                </div>

                {/* Nome */}
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Nome de Identificação</p>
                      {afNomeEdit ? (
                        <input
                          autoFocus
                          type="text"
                          value={afNome}
                          onChange={(e) => setAfNome(e.target.value)}
                          onBlur={() => setAfNomeEdit(false)}
                          className="w-full text-sm px-2 py-1.5 rounded-lg border border-primary bg-white outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-foreground truncate">{afNome}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setAfNomeEdit((v) => !v)}
                      className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-[#f0f9f4] transition-all"
                      title="Editar nome"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                </div>

                {/* Turmas */}
                <div className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Turmas Vinculadas</p>
                      {afTurmasEdit ? (
                        <div>
                          <div
                            className="min-h-[38px] flex flex-wrap gap-1.5 px-3 py-1.5 rounded-lg border border-primary bg-white cursor-text focus-within:ring-2 focus-within:ring-primary/10 transition-all"
                            onClick={() => setAfTurmaOpen(true)}
                          >
                            {afTurmas.map((t) => (
                              <span key={t} className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
                                {t}
                                <button onClick={(e) => { e.stopPropagation(); setAfTurmas((p) => p.filter((x) => x !== t)); }} className="hover:text-red-500 transition-colors">
                                  <X size={9} />
                                </button>
                              </span>
                            ))}
                            <input
                              type="text"
                              value={afTurmaInput}
                              onChange={(e) => { setAfTurmaInput(e.target.value); setAfTurmaOpen(true); }}
                              onFocus={() => setAfTurmaOpen(true)}
                              placeholder={afTurmas.length === 0 ? "Buscar turma..." : ""}
                              className="flex-1 min-w-[80px] text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                            />
                          </div>
                          {afTurmaOpen && afTurmasSugeridas.length > 0 && (
                            <div className="mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10 relative">
                              {afTurmasSugeridas.slice(0, 5).map((t) => (
                                <button
                                  key={t}
                                  onMouseDown={(e) => { e.preventDefault(); setAfTurmas((p) => [...p, t]); setAfTurmaInput(""); setAfTurmaOpen(false); }}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#f7f8fa] transition-colors border-b border-border last:border-0 flex items-center gap-2"
                                >
                                  <Tag size={11} className="text-muted-foreground shrink-0" /> {t}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {afTurmas.map((t) => (
                            <span key={t} className="text-xs bg-[#f0f2f5] text-foreground px-2 py-0.5 rounded-md font-medium">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setAfTurmasEdit((v) => !v)}
                      className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-[#f0f9f4] transition-all mt-5"
                      title="Editar turmas"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Data e Horário ── */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Data do Conselho Final <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CalendarDays size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="date"
                      value={afData}
                      onChange={(e) => setAfData(e.target.value)}
                      className="w-full text-sm pl-9 pr-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-foreground transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Horário <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="time"
                      value={afHora}
                      onChange={(e) => setAfHora(e.target.value)}
                      className="w-full text-sm pl-9 pr-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-foreground transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* ── Participantes ── */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between" style={{ background: "#f7f8fa" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full shrink-0" style={{ background: "var(--primary)" }} />
                    <span className="text-xs font-bold text-foreground">Participantes Convocados</span>
                  </div>
                  <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--primary)", color: "white" }}>
                    {afParticipantes.length}
                  </span>
                </div>
                <div className="px-4 py-3 space-y-3 bg-card">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Professores das turmas vinculadas foram importados automaticamente. Adicione ou remova conforme necessário.
                  </p>
                  {/* Search & add */}
                  <div className="relative">
                    <UserCheck size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={afPartBusca}
                      onChange={(e) => { setAfPartBusca(e.target.value); setAfPartOpen(true); }}
                      onFocus={() => setAfPartOpen(true)}
                      placeholder="Buscar servidor por nome..."
                      className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
                    />
                    {afPartOpen && afPartSugeridos.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10">
                        {afPartSugeridos.slice(0, 5).map((s) => (
                          <button
                            key={s}
                            onMouseDown={(e) => { e.preventDefault(); addAfParticipante(s); }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-[#f7f8fa] border-b border-border last:border-0 flex items-center gap-2 transition-colors"
                          >
                            <UserCheck size={11} className="text-muted-foreground shrink-0" /> {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Tags */}
                  <div className="min-h-[52px] flex flex-wrap gap-1.5 p-3 rounded-lg border border-border bg-[#f7f8fa]" onClick={() => setAfPartOpen(false)}>
                    {afParticipantes.map((p) => (
                      <span
                        key={p.id}
                        className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border"
                        style={p.tipo === "importado"
                          ? { background: "var(--secondary)", color: "var(--primary)", borderColor: "var(--accent)" }
                          : { background: "#fdf4ff", color: "#7e22ce", borderColor: "#e9d5ff" }}
                      >
                        {p.nome}
                        <button onClick={() => removeAfParticipante(p.id)} className="hover:opacity-60 transition-opacity ml-0.5">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    {afParticipantes.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">Nenhum participante adicionado.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex gap-2 shrink-0 rounded-b-2xl" style={{ background: "#fafbfc" }}>
              <button
                onClick={closeAgendarFinal}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                disabled={!afData || !afHora}
                onClick={confirmarAgendarFinal}
                className="flex-1 py-2.5 text-sm font-bold rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #0f4a23 0%, #15622f 100%)",
                  boxShadow: "0 4px 12px rgba(15,74,35,0.25)",
                }}
              >
                Agendar e convocar participantes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
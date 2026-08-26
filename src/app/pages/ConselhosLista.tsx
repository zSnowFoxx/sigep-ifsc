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
} from "lucide-react";

interface Props {
  onEnterConselho: () => void;
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
  const [filterStatus, setFilterStatus] = useState("");

  // Drawer state
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

  const removeParticipante = (id: number) =>
    setFParticipantes((prev) =>
      prev.filter((p) => p.id !== id),
    );
  const addParticipante = (nome: string) => {
    if (fParticipantes.some((p) => p.nome === nome)) return;
    setFParticipantes((prev) => [
      ...prev,
      {
        id: nextPartId.current++,
        nome,
        label: "Convidado - Manual",
        tipo: "manual",
      },
    ]);
    setFPartBusca("");
    setFPartOpen(false);
  };
  const partSugeridos = servidoresCatalogo.filter(
    (s) =>
      !fParticipantes.some((p) => p.nome === s) &&
      s.toLowerCase().includes(fPartBusca.toLowerCase()),
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

  const filteredAbertas = reunioesAbertas.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.titulo.toLowerCase().includes(q) ||
      r.turmas.some((t) => t.toLowerCase().includes(q));
    const matchEtapa = !filterEtapa || r.etapa === filterEtapa;
    const matchStatus =
      !filterStatus || r.status === filterStatus;
    return matchSearch && matchEtapa && matchStatus;
  });

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
                size={15}
                style={{ color: "var(--primary)" }}
              />
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--primary)" }}
              >
                Conselhos de Classe
              </span>
            </div>
            <h1 className="text-base font-bold text-foreground">
              Gestão de Conselhos de Classe
            </h1>
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
            Agendar Novo Conselho
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
              opts: ["Pré-Conselho", "Intermediário", "Final"],
            },
            {
              label: "Status",
              value: filterStatus,
              set: setFilterStatus,
              opts: ["agendado", "em_andamento"],
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
                    {o === "agendado"
                      ? "Agendados"
                      : o === "em_andamento"
                        ? "Em Andamento"
                        : o}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>
          ))}

          {(filterCurso || filterEtapa || filterStatus) && (
            <button
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                setFilterCurso("");
                setFilterEtapa("");
                setFilterStatus("");
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
              label: `Reuniões em Aberto`,
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
          <div className="space-y-4">
            {filteredAbertas.length === 0 && (
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
            {filteredAbertas.map((r) => {
              const isAndamento = r.status === "em_andamento";
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
                      : "4px solid var(--border)",
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
                              borderColor: etapaCfg.border,
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
                              Em Andamento · Rascunho Salvo
                            </span>
                          ) : (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                              <CalendarDays size={10} />
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
                                <Clock size={11} /> Criado em{" "}
                                {r.criadoEm}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Users size={11} /> {r.docentes}{" "}
                                docentes convocados
                              </span>
                              {/* Progress */}
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
                                    color: "var(--primary)",
                                  }}
                                >
                                  {r.progresso}% concluído
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar size={11} /> Data:{" "}
                                {r.data} às {r.hora}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Users size={11} /> {r.docentes}{" "}
                                docentes convocados
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action button */}
                      <div className="shrink-0 flex flex-col gap-2 items-end">
                        {isAndamento ? (
                          <button
                            onClick={onEnterConselho}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                            style={{
                              background: "var(--primary)",
                            }}
                          >
                            <Play size={13} fill="white" />
                            Retomar Realização
                          </button>
                        ) : (
                          <button
                            onClick={onEnterConselho}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-[#e8f0eb] active:scale-[0.98] border-2"
                            style={{
                              borderColor: "var(--primary)",
                              color: "var(--primary)",
                            }}
                          >
                            <ArrowRight size={13} />
                            Iniciar Conselho
                          </button>
                        )}
                        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                          <FileText size={11} /> Ver detalhes
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress footer strip for in-progress cards */}
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

      {/* ── Backdrop — fixed overlay, off-canvas by default ────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          style={{ backdropFilter: "blur(1px)" }}
          onClick={closeDrawer}
        />
      )}

      {/* ── Slide-in Drawer (480px) — fixed off-canvas overlay ──────────── */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-out"
        style={{
          width: "480px",
          transform: drawerOpen
            ? "translateX(0)"
            : "translateX(100%)",
        }}
      >
        {/* Drawer Header */}
        <div
          className="px-6 py-4 flex items-start justify-between shrink-0 border-b border-border"
          style={{ background: "var(--primary)" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList size={14} color="white" />
              <p className="text-xs font-medium text-white/60">
                Conselhos de Classe · Novo Agendamento
              </p>
            </div>
            <h2 className="text-sm font-bold text-white">
              Agendar Novo Conselho de Classe
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors mt-0.5 shrink-0"
          >
            <X size={15} color="white" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {fSaved ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "var(--secondary)" }}
              >
                <CheckCircle2
                  size={28}
                  style={{ color: "var(--primary)" }}
                />
              </div>
              <p className="text-sm font-bold text-foreground">
                Conselho agendado com sucesso!
              </p>
              <p className="text-xs text-muted-foreground">
                Os docentes serão notificados automaticamente.
              </p>
            </div>
          ) : (
            <>
              {/* Field 1 — Nome */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Nome de Identificação do Conselho{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fNome}
                  onChange={(e) => setFNome(e.target.value)}
                  placeholder="Ex: Conselho Intermediário TDS 2026.1"
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
                />
              </div>

              {/* Field 2 — Etapa */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Etapa Regulamentar{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <ClipboardList
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <select
                    value={fEtapa}
                    onChange={(e) => setFEtapa(e.target.value)}
                    className="w-full appearance-none text-sm pl-9 pr-8 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                    style={{
                      color: fEtapa
                        ? "var(--foreground)"
                        : "var(--muted-foreground)",
                    }}
                  >
                    <option value="">
                      Selecione a etapa...
                    </option>
                    <option>Pré-Conselho</option>
                    <option>Conselho Intermediário</option>
                    <option>Conselho Final</option>
                  </select>
                  <ChevronDown
                    size={13}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>
              </div>

              {/* Field 3 — Turmas multi-select */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Turmas Vinculadas
                  <span className="font-normal text-muted-foreground ml-1">
                    (suporta múltiplas turmas)
                  </span>
                </label>
                {/* Tag box */}
                <div
                  className="min-h-[44px] flex flex-wrap gap-1.5 px-3 py-2 rounded-lg border border-border bg-[#f7f8fa] cursor-text transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
                  onClick={() => setFTurmaOpen(true)}
                >
                  {fTurmas.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: "var(--secondary)",
                        color: "var(--primary)",
                      }}
                    >
                      {t}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTurma(t);
                        }}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={fTurmaInput}
                    onChange={(e) => {
                      setFTurmaInput(e.target.value);
                      setFTurmaOpen(true);
                    }}
                    onFocus={() => setFTurmaOpen(true)}
                    placeholder={
                      fTurmas.length === 0
                        ? "Buscar turma..."
                        : ""
                    }
                    className="flex-1 min-w-[100px] text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                  />
                </div>
                {/* Suggestions dropdown */}
                {fTurmaOpen && turmasSugeridas.length > 0 && (
                  <div className="mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10 relative">
                    {turmasSugeridas.slice(0, 6).map((t) => (
                      <button
                        key={t}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addTurma(t);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#f7f8fa] transition-colors border-b border-border last:border-0 flex items-center gap-2"
                      >
                        <Tag
                          size={11}
                          className="text-muted-foreground shrink-0"
                        />
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Field 4 — Data & Hora */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Data da Reunião{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="date"
                      value={fData}
                      onChange={(e) => setFData(e.target.value)}
                      className="w-full text-sm pl-9 pr-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-foreground transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Horário{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="time"
                      value={fHora}
                      onChange={(e) => setFHora(e.target.value)}
                      className="w-full text-sm pl-9 pr-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-foreground transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Smart Inheritance Module */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div
                  className="px-4 py-3 border-b border-border flex items-center gap-2"
                  style={{ background: "#f7f8fa" }}
                >
                  <div className="w-1 h-4 rounded-full bg-[#7c3aed] shrink-0" />
                  <span className="text-xs font-bold text-foreground">
                    Herança de Etapa Anterior
                  </span>
                </div>
                <div className="px-4 py-4 space-y-3 bg-[#fafafa]">
                  {/* Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Importar pautas e pendências da etapa
                        anterior?
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Encaminhamentos abertos e observações
                        serão carregados automaticamente
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setFImportarPautas((v) => !v)
                      }
                      className="shrink-0 ml-3"
                      title={
                        fImportarPautas ? "Desativar" : "Ativar"
                      }
                    >
                      {fImportarPautas ? (
                        <ToggleRight
                          size={32}
                          style={{ color: "var(--primary)" }}
                        />
                      ) : (
                        <ToggleLeft
                          size={32}
                          className="text-muted-foreground/40"
                        />
                      )}
                    </button>
                  </div>

                  {/* Conditional origin selector */}
                  {fImportarPautas && (
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Selecione o conselho de origem:
                      </label>
                      <div className="relative">
                        <ClipboardList
                          size={13}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <select
                          value={fOrigem}
                          onChange={(e) =>
                            setFOrigem(e.target.value)
                          }
                          className="w-full appearance-none text-sm pl-9 pr-8 py-2.5 rounded-lg border border-border bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all text-foreground"
                        >
                          {conselhosOrigem.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={13}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gerenciamento de Participantes */}
              <div className="rounded-xl border border-border overflow-hidden">
                {/* Section header */}
                <div
                  className="px-4 py-3 border-b border-border flex items-center justify-between"
                  style={{ background: "#f7f8fa" }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1 h-4 rounded-full shrink-0"
                      style={{ background: "var(--primary)" }}
                    />
                    <span className="text-xs font-bold text-foreground">
                      Gerenciamento de Participantes
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: "var(--primary)",
                      color: "white",
                    }}
                  >
                    {fParticipantes.length}
                  </span>
                </div>

                <div className="px-4 py-3 space-y-3 bg-card">
                  {/* Instruction text */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Os professores das disciplinas das turmas
                    selecionadas foram importados
                    automaticamente. Você pode remover
                    participantes automáticos ou adicionar novos
                    servidores manualmente.
                  </p>

                  {/* Search & add input */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Adicionar Participantes (Servidores)
                    </label>
                    <div className="relative">
                      <UserCheck
                        size={13}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type="text"
                        value={fPartBusca}
                        onChange={(e) => {
                          setFPartBusca(e.target.value);
                          setFPartOpen(true);
                        }}
                        onFocus={() => setFPartOpen(true)}
                        placeholder="Buscar servidor por nome ou SIAPE..."
                        className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
                      />
                      {fPartOpen &&
                        partSugeridos.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10">
                            {partSugeridos
                              .slice(0, 5)
                              .map((s) => (
                                <button
                                  key={s}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    addParticipante(s);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#f7f8fa] border-b border-border last:border-0 flex items-center gap-2 transition-colors"
                                >
                                  <UserCheck
                                    size={11}
                                    className="text-muted-foreground shrink-0"
                                  />
                                  {s}
                                </button>
                              ))}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Participant tag box */}
                  <div
                    className="min-h-[60px] flex flex-wrap gap-1.5 p-3 rounded-lg border border-border bg-[#f7f8fa]"
                    onClick={() => setFPartOpen(false)}
                  >
                    {fParticipantes.map((p) => (
                      <span
                        key={p.id}
                        className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border"
                        style={
                          p.tipo === "importado"
                            ? {
                                background: "var(--secondary)",
                                color: "var(--primary)",
                                borderColor: "var(--accent)",
                              }
                            : {
                                background: "#fdf4ff",
                                color: "#7e22ce",
                                borderColor: "#e9d5ff",
                              }
                        }
                      >
                        {p.nome}
                        <span className="font-normal opacity-70 mx-0.5">
                          ({p.label})
                        </span>
                        <button
                          onClick={() =>
                            removeParticipante(p.id)
                          }
                          className="hover:opacity-60 transition-opacity ml-0.5"
                          title="Remover"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    {fParticipantes.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">
                        Nenhum participante adicionado.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {!fSaved && (
          <div className="px-6 py-4 border-t border-border bg-card flex gap-2 shrink-0">
            <button
              onClick={closeDrawer}
              className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              disabled={
                !fNome ||
                !fEtapa ||
                fTurmas.length === 0 ||
                !fData ||
                !fHora
              }
              onClick={() => setFSaved(true)}
              className="flex-1 py-2.5 text-sm font-bold rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--primary)" }}
            >
              Agendar e Convocá-los
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
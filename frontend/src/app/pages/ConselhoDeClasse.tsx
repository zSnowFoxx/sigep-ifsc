import { useState, useRef } from "react";
import {
  Users,
  ClipboardList,
  GraduationCap,
  CheckCircle,
  Circle,
  ChevronRight,
  AlertTriangle,
  Download,
  Calendar,
  MapPin,
  Clock,
  Save,
  ChevronDown,
  UserCheck,
  FileText,
  CheckCircle2,
  Send,
  Pencil,
  Plus,
  Trash2,
  X,
  Eye,
  Link2,
  BookOpen,
  ExternalLink,
  Sparkles,
  MessageSquare,
  Lock,
  CalendarClock,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const professores = [
  { nome: "Prof. Ricardo Alves",   disciplina: "Algoritmos e Programação",   cargo: "Professor",            presente: true  },
  { nome: "Profa. Camila Torres",  disciplina: "Matemática Aplicada",         cargo: "Professora",           presente: true  },
  { nome: "Prof. Henrique Lopes",  disciplina: "Inglês Técnico",              cargo: "Professor",            presente: true  },
  { nome: "Profa. Sandra Melo",    disciplina: "Comunicação e Expressão",     cargo: "Professora",           presente: false },
  { nome: "Prof. Fábio Carvalho",  disciplina: "Banco de Dados",              cargo: "Professor",            presente: true  },
  { nome: "Profa. Juliana Neves",  disciplina: "Programação Web",             cargo: "Professora",           presente: true  },
  { nome: "Profa. Renata Dias",    disciplina: "—",                           cargo: "Coord. Pedagógica",    presente: true  },
  { nome: "Carlos Lima",           disciplina: "—",                           cargo: "Psicólogo / NAE",      presente: false },
  { nome: "Ana Costa",             disciplina: "—",                           cargo: "Pedagoga",             presente: true  },
];

const alunos = [
  { matricula: "202110806528", nome: "João Silva",           atencao: true,  risco: true  },
  { matricula: "202210809911", nome: "Maria Oliveira",       atencao: true,  risco: false },
  { matricula: "202310804422", nome: "Carlos Souza",         atencao: true,  risco: true  },
  { matricula: "202110801345", nome: "Ana Beatriz Ferreira", atencao: false, risco: false },
  { matricula: "202210812788", nome: "Lucas Mendes",         atencao: true,  risco: true  },
  { matricula: "202310807654", nome: "Fernanda Costa",       atencao: true,  risco: false },
  { matricula: "202110809002", nome: "Rafael Rocha",         atencao: false, risco: false },
  { matricula: "202210806731", nome: "Isabela Martins",      atencao: false, risco: false },
  { matricula: "202310805519", nome: "Diego Pereira",        atencao: false, risco: false },
  { matricula: "202110803347", nome: "Letícia Barbosa",      atencao: false, risco: false },
  { matricula: "202210808820", nome: "Bruno Nascimento",     atencao: false, risco: false },
  { matricula: "202310801198", nome: "Tatiane Lima",         atencao: false, risco: false },
];

const encaminhamentos = [
  "— Selecione —",
  "Encaminhar ao NAE / Pedagogia",
  "Encaminhar para Assistência Estudantil",
  "Agendar Atendimento Psicológico",
  "Nivelamento / Monitoria",
  "Orientação de Carreira",
  "Mediação de Conflito",
];

const alunosTurmaB = [
  { matricula: "202210870011", nome: "Amanda Silveira",     atencao: false },
  { matricula: "202310871234", nome: "Breno Cavalcante",    atencao: true  },
  { matricula: "202110872005", nome: "Cristina Duarte",     atencao: false },
  { matricula: "202210873418", nome: "Eduardo Teixeira",    atencao: false },
  { matricula: "202310874622", nome: "Gabriela Pinheiro",   atencao: true  },
  { matricula: "202110875839", nome: "Henrique Azevedo",    atencao: false },
  { matricula: "202210876044", nome: "Larissa Guimarães",   atencao: false },
  { matricula: "202310877251", nome: "Matheus Fonseca",     atencao: false },
  { matricula: "202110878467", nome: "Natália Cardoso",     atencao: false },
  { matricula: "202210879683", nome: "Otávio Ribeiro",      atencao: true  },
];

const servidores = [
  "— Selecione —",
  "Coord. Pedagógica — Profa. Renata Dias",
  "NAE — Psic. Carlos Lima",
  "Assistência Estudantil — Sra. Paula Andrade",
  "Monitoria — Dept. Técnico",
  "Direção de Ensino",
];

const CATEGORIAS_REGISTRO = [
  "Dificuldade de aprendizagem",
  "Baixa frequência",
  "Comportamento em sala",
  "Questões socioeconômicas",
  "Saúde / Bem-estar",
  "Relacionamento interpessoal",
  "Desempenho acadêmico",
  "Outros",
];

// ─── Turma catalogue ─────────────────────────────────────────────────────────

const turmasData = [
  { nome: "TDS - 2ª Fase",         alunosList: alunos,       coord: "Profa. Renata Dias",   semestre: "2026.1" },
  { nome: "Mecatrônica - 3ª Fase", alunosList: alunosTurmaB, coord: "Prof. Eduardo Santos", semestre: "2026.1" },
];

const PONTOS_PRESET = [
  "Facilidade de aprendizagem",
  "Boa didática dos professores",
  "Bom relacionamento entre os alunos",
  "Alta participação nas aulas",
  "Progressos visíveis no período",
  "Boa infraestrutura da sala",
];

const DIFIC_PRESET = [
  "Baixa participação nas aulas",
  "Conteúdo muito difícil",
  "Falta de material didático",
  "Alta taxa de faltas",
  "Dificuldades socioeconômicas",
  "Problemas de relacionamento entre alunos",
  "Dificuldades com atividades avaliativas",
];

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId = 1 | 2 | 3 | 4;

interface EncItemData {
  id: number;
  titulo: string;
  categoria: string;
  aluno: string;
  matricula: string;
  turma: string;
  status: "pendente" | "em-andamento" | "finalizado";
  data: string;
  servidor: string;
  descricao: string;
}

interface AlunoEval {
  risco: boolean;
  obs: string;
  encaminhamento: string;
  acao: string;
  servidor: string;
  saved: boolean;
}

interface Props {
  onNavigate?: (page: number) => void;
  onBack?: () => void;
  mode?: "intermediario" | "final";
}

// ─── Mock encaminhamentos (shared with Encaminhamentos page) ─────────────────

const mockEncaminhamentos: EncItemData[] = [
  { id: 100, titulo: "Apoio pedagógico — João Silva",        categoria: "Dificuldade de aprendizagem", aluno: "João Silva",       matricula: "202110806528", turma: "TDS - 2ª Fase",         status: "em-andamento", data: "10/05/2026", servidor: "Coord. Pedagógica — Profa. Renata Dias", descricao: "Aluno com dificuldades contínuas em Algoritmos e Banco de Dados." },
  { id: 101, titulo: "Acompanhamento — Lucas Mendes",        categoria: "Baixa frequência",            aluno: "Lucas Mendes",     matricula: "202210812788",  turma: "TDS - 2ª Fase",         status: "pendente",     data: "15/05/2026", servidor: "NAE — Psic. Carlos Lima",               descricao: "Frequência abaixo do mínimo exigido por questões de saúde." },
  { id: 102, titulo: "Atendimento NAE — Breno Cavalcante",   categoria: "Saúde / Bem-estar",           aluno: "Breno Cavalcante", matricula: "202310871234",  turma: "Mecatrônica - 3ª Fase", status: "pendente",     data: "20/05/2026", servidor: "NAE — Psic. Carlos Lima",               descricao: "Aluno relatou problemas de saúde mental impactando desempenho." },
  { id: 103, titulo: "Reforço — Maria Oliveira",             categoria: "Desempenho acadêmico",        aluno: "Maria Oliveira",   matricula: "202210809911",  turma: "TDS - 2ª Fase",         status: "finalizado",   data: "28/04/2026", servidor: "Monitoria — Dept. Técnico",             descricao: "Aluna com alta frequência mas notas abaixo da média." },
];

// ─── Enc detail modal constants ──────────────────────────────────────────────

const encCategoriaCores: Record<string, { bg: string; text: string }> = {
  "Dificuldade de aprendizagem": { bg: "#eff6ff", text: "#1d4ed8" },
  "Baixa frequência":            { bg: "#fffbeb", text: "#b45309" },
  "Saúde / Bem-estar":           { bg: "#fff7ed", text: "#c2410c" },
  "Desempenho acadêmico":        { bg: "#fdf4ff", text: "#7e22ce" },
  "Comportamento em sala":       { bg: "#fef2f2", text: "#dc2626" },
  "Questões socioeconômicas":    { bg: "#f0fdf4", text: "#15803d" },
  "Relacionamento interpessoal": { bg: "#f0f9ff", text: "#0369a1" },
  "Outros":                      { bg: "#f8fafc", text: "#475569" },
};

const encTipoConf = {
  criacao:  { color: "var(--primary)", label: "Criação",   dot: "bg-green-600" },
  triagem:  { color: "#7c3aed",        label: "Triagem",   dot: "bg-purple-500" },
  relato:   { color: "#2563eb",        label: "Relato",    dot: "bg-blue-500" },
  conclusao:{ color: "#15803d",        label: "Conclusão", dot: "bg-emerald-500" },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ConselhoDeClasse({ onNavigate, onBack, mode = "final" }: Props) {
  const isInter = mode === "intermediario";
  const [activeTab, setActiveTab] = useState<TabId>(isInter ? 2 : 4);

  // Tab 1 — Participantes
  const [presenteToggle, setPresenteToggle] = useState<Record<number, boolean>>(
    Object.fromEntries(professores.map((p, i) => [i, p.presente]))
  );

  // Tab 2 — Demandas Gerais (per-turma structured form)
  interface DemandaItem { id: number; situacao: string; gravidade: "nao-urgente" | "urgente" | "critica" }
  interface TurmaForm {
    representantes: string;
    sintese: string;
    pontosPositivos: string[];
    customPontos: string[];
    dificuldades: string[];
    customDificuldades: string[];
    demandas: DemandaItem[];
    registros: string;
  }
  const emptyForm = (): TurmaForm => ({
    representantes: "", sintese: "",
    pontosPositivos: [], customPontos: [],
    dificuldades: [], customDificuldades: [],
    demandas: [], registros: "",
  });
  const [turmaForms, setTurmaForms] = useState<TurmaForm[]>([emptyForm(), emptyForm()]);
  const [activeTurmaIdx, setActiveTurmaIdx] = useState(0);
  const [demandaOpen, setDemandaOpen] = useState(false);
  const [demandaSit, setDemandaSit] = useState("");
  const [demandaGrav, setDemandaGrav] = useState<"nao-urgente" | "urgente" | "critica">("nao-urgente");
  const [newPontoText, setNewPontoText] = useState("");
  const [newDificText, setNewDificText] = useState("");
  const [editFields, setEditFields] = useState<Set<string>>(new Set());

  // Tab 3 — Avaliação
  const [groupAOpen, setGroupAOpen] = useState(true);
  const [groupBOpen, setGroupBOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<string>(alunos[0].matricula);
  const [avaliacoes, setAvaliacoes] = useState<Record<string, AlunoEval>>(
    Object.fromEntries(
      [...alunos, ...alunosTurmaB.map((a) => ({ ...a, risco: false }))].map((a) => [
        a.matricula,
        { risco: a.risco, obs: "", encaminhamento: "", acao: "", servidor: "", saved: false },
      ])
    )
  );

  const updateEval = (mat: string, field: keyof AlunoEval, value: string | boolean) => {
    setAvaliacoes((prev) => ({ ...prev, [mat]: { ...prev[mat], [field]: value, saved: false } }));
  };

  const saveEval = (mat: string) => {
    setAvaliacoes((prev) => ({ ...prev, [mat]: { ...prev[mat], saved: true } }));
  };

  // Tab 2 helpers
  const updateForm = (patch: Partial<TurmaForm>) =>
    setTurmaForms((prev) => prev.map((f, i) => i === activeTurmaIdx ? { ...f, ...patch } : f));
  const togglePonto = (item: string) => {
    const cur = turmaForms[activeTurmaIdx].pontosPositivos;
    updateForm({ pontosPositivos: cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item] });
  };
  const toggleDific = (item: string) => {
    const cur = turmaForms[activeTurmaIdx].dificuldades;
    updateForm({ dificuldades: cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item] });
  };
  const addDemanda = () => {
    if (!demandaSit.trim()) return;
    updateForm({ demandas: [...turmaForms[activeTurmaIdx].demandas, { id: demandaIdRef.current++, situacao: demandaSit.trim(), gravidade: demandaGrav }] });
    setDemandaSit(""); setDemandaGrav("nao-urgente"); setDemandaOpen(false);
  };
  const removeDemanda = (id: number) =>
    updateForm({ demandas: turmaForms[activeTurmaIdx].demandas.filter((d) => d.id !== id) });
  const toggleEditField = (field: string) =>
    setEditFields((prev) => { const n = new Set(prev); n.has(field) ? n.delete(field) : n.add(field); return n; });

  // Tab 3 helpers
  const selectNrAluno = (nome: string) => {
    setNrAluno(nome);
    const found = [...alunos.map((a) => ({ ...a, turma: turmasData[0].nome })), ...alunosTurmaB.map((a) => ({ ...a, risco: false, turma: turmasData[1].nome }))].find((a) => a.nome === nome);
    if (found) { setNrMatricula(found.matricula); setNrTurma(found.turma); }
    else { setNrMatricula(""); setNrTurma(""); }
  };
  const selectNeAluno = (nome: string) => {
    setNeAluno(nome);
    const found = [...alunos.map((a) => ({ ...a, turma: turmasData[0].nome })), ...alunosTurmaB.map((a) => ({ ...a, risco: false, turma: turmasData[1].nome }))].find((a) => a.nome === nome);
    if (found) { setNeMatricula(found.matricula); setNeTurma(found.turma); }
    else { setNeMatricula(""); setNeTurma(""); }
  };
  const todayFmt = new Date().toLocaleDateString("pt-BR");
  const submitNovoRegistro = () => {
    if (!nrAluno || !nrTitulo || !nrCategoria || !nrDescricao) return;
    const newReg: RegistroDocente = { id: registroIdRef.current++, titulo: nrTitulo, categoria: nrCategoria, aluno: nrAluno, matricula: nrMatricula, turma: nrTurma, docente: nrDocente, data: todayFmt, descricao: nrDescricao, encOpcao: nrEncOpcao, encId: nrEncId };
    setRegistros((prev) => [...prev, newReg]);
    if (nrEncOpcao === "novo") setEncList((prev) => [...prev, { id: encItemIdRef.current++, titulo: `Encaminhamento — ${nrAluno}`, categoria: nrCategoria, aluno: nrAluno, matricula: nrMatricula, turma: nrTurma, status: "pendente", data: todayFmt, servidor: "", descricao: nrDescricao }]);
    setNrAluno(""); setNrMatricula(""); setNrTurma(""); setNrDocente("Prof. Ricardo Alves"); setNrTitulo(""); setNrCategoria(""); setNrDescricao(""); setNrEncOpcao(null); setNrEncId(null); setNrDiscManual({}); setNovoRegOpen(false);
  };
  const submitNovoEnc = () => {
    if (!neAluno || !neTitulo || !neCategoria) return;
    const newId = encItemIdRef.current++;
    const newEnc: EncItemData = { id: newId, titulo: neTitulo, categoria: neCategoria, aluno: neAluno, matricula: neMatricula, turma: neTurma, status: "pendente", data: todayFmt, servidor: neServidor, descricao: neDescricao };
    setEncList((prev) => [...prev, newEnc]);
    setEncEvolucoes((prev) => ({ ...prev, [newId]: [{ data: todayFmt, autor: neServidor || "Sistema", texto: neDescricao, tipo: "criacao" as const }] }));
    setNeAluno(""); setNeMatricula(""); setNeTurma(""); setNeTitulo(""); setNeCategoria(""); setNeDescricao(""); setNeServidor(""); setNovoEncOpen(false);
  };

  const openEncDetail = (enc: EncItemData) => {
    setSelectedEnc(enc);
    setEncNovoRelato("");
    setEncSavedRelato(false);
    setEncFinalizando(false);
    setEncParecerFinal("");
  };
  const closeEncDetail = () => { setSelectedEnc(null); setEncFinalizando(false); };
  const saveEncRelato = () => {
    if (!selectedEnc || !encNovoRelato.trim()) return;
    const ev: EncEvolucao = { data: todayFmt, autor: "Prof. Ricardo Alves", texto: encNovoRelato.trim(), tipo: "relato" };
    setEncEvolucoes((prev) => ({ ...prev, [selectedEnc.id]: [...(prev[selectedEnc.id] ?? []), ev] }));
    setEncNovoRelato("");
    setEncSavedRelato(true);
  };
  const finalizarEncDetail = () => {
    if (!selectedEnc || !encParecerFinal.trim()) return;
    const ev: EncEvolucao = { data: todayFmt, autor: "Prof. Ricardo Alves", texto: encParecerFinal.trim(), tipo: "conclusao" };
    setEncEvolucoes((prev) => ({ ...prev, [selectedEnc.id]: [...(prev[selectedEnc.id] ?? []), ev] }));
    setEncList((prev) => prev.map((e) => e.id === selectedEnc.id ? { ...e, status: "finalizado" } : e));
    setSelectedEnc((prev) => prev ? { ...prev, status: "finalizado" } : null);
    setEncFinalizando(false);
    setEncParecerFinal("");
  };


  // Discipline data per student
  const disciplinasData: Record<string, { nome: string; professor: string; ch: number; nota: number; presentes: number; faltasJust: number; faltasNaoJust: number }[]> = {
    "202110806528": [
      { nome: "Algoritmos e Programação", professor: "Prof. Ricardo Alves",  ch: 80, nota: 4.8, presentes: 56, faltasJust: 0,  faltasNaoJust: 24 },
      { nome: "Banco de Dados",           professor: "Prof. Fábio Carvalho",  ch: 60, nota: 5.8, presentes: 52, faltasJust: 4,  faltasNaoJust: 4  },
      { nome: "Programação Web",          professor: "Prof. Marcos",           ch: 80, nota: 5.4, presentes: 60, faltasJust: 4,  faltasNaoJust: 16 },
      { nome: "Matemática Aplicada",      professor: "Profa. Camila Torres",   ch: 60, nota: 5.0, presentes: 54, faltasJust: 0,  faltasNaoJust: 6  },
      { nome: "Inglês Técnico",           professor: "Prof. Henrique Lopes",   ch: 40, nota: 6.5, presentes: 36, faltasJust: 0,  faltasNaoJust: 4  },
    ],
    "202210809911": [
      { nome: "Algoritmos e Programação", professor: "Prof. Ricardo Alves",  ch: 80, nota: 7.0, presentes: 52, faltasJust: 8,  faltasNaoJust: 20 },
      { nome: "Banco de Dados",           professor: "Prof. Fábio Carvalho",  ch: 60, nota: 7.8, presentes: 44, faltasJust: 4,  faltasNaoJust: 12 },
      { nome: "Programação Web",          professor: "Prof. Marcos",           ch: 80, nota: 7.5, presentes: 60, faltasJust: 0,  faltasNaoJust: 20 },
      { nome: "Matemática Aplicada",      professor: "Profa. Camila Torres",   ch: 60, nota: 8.2, presentes: 48, faltasJust: 0,  faltasNaoJust: 12 },
    ],
  };
  const defaultDisciplinas = [
    { nome: "Algoritmos e Programação", professor: "Prof. Ricardo Alves",  ch: 80, nota: 7.0, presentes: 68, faltasJust: 4, faltasNaoJust: 8 },
    { nome: "Programação Web",          professor: "Prof. Marcos",           ch: 80, nota: 7.2, presentes: 70, faltasJust: 2, faltasNaoJust: 8 },
    { nome: "Matemática Aplicada",      professor: "Profa. Camila Torres",   ch: 60, nota: 6.8, presentes: 52, faltasJust: 0, faltasNaoJust: 8 },
  ];

  // Discipline selector — keyed by student matricula
  const [selectedDisc, setSelectedDisc] = useState<Record<string, number>>({});
  // Retificada overrides — keyed by "matricula|disciplina"
  const [retificadas, setRetificadas] = useState<Record<string, string>>({});
  // Abono modal
  const [abonomat, setAbonomat] = useState<string | null>(null);
  const [abonoText, setAbonoText] = useState("");

  // Per-student encaminhamentos list
  interface Enc { id: number; categoria: string; descricao: string; servidor: string }
  const [encAtivos, setEncAtivos] = useState<Record<string, Enc[]>>({});
  const [encModalOpen, setEncModalOpen] = useState(false);
  const [encForm, setEncForm] = useState({ categoria: "", descricao: "", servidor: "" });
  const encNextId    = useRef(1);
  const demandaIdRef = useRef(1);

  // Tab 3 — Registros e Encaminhamentos
  interface RegistroDocente {
    id: number; titulo: string; categoria: string;
    aluno: string; matricula: string; turma: string;
    docente: string; data: string; descricao: string;
    encOpcao: "novo" | "existente" | null; encId: number | null;
  }
  const [registros, setRegistros] = useState<RegistroDocente[]>([]);
  const [novoRegOpen, setNovoRegOpen] = useState(false);
  const [nrAluno, setNrAluno] = useState("");
  const [nrMatricula, setNrMatricula] = useState("");
  const [nrTurma, setNrTurma] = useState("");
  const [nrDocente, setNrDocente] = useState("Prof. Ricardo Alves");
  const [nrTitulo, setNrTitulo] = useState("");
  const [nrCategoria, setNrCategoria] = useState("");
  const [nrDescricao, setNrDescricao] = useState("");
  const [nrEncOpcao, setNrEncOpcao] = useState<"novo" | "existente" | null>(null);
  const [nrEncId, setNrEncId] = useState<number | null>(null);
  const [nrDiscManual, setNrDiscManual] = useState<Record<string, { nota: string; freq: string }>>({});
  const registroIdRef = useRef(1);
  const [novoEncOpen, setNovoEncOpen] = useState(false);
  const [neAluno, setNeAluno] = useState("");
  const [neMatricula, setNeMatricula] = useState("");
  const [neTurma, setNeTurma] = useState("");
  const [neTitulo, setNeTitulo] = useState("");
  const [neCategoria, setNeCategoria] = useState("");
  const [neDescricao, setNeDescricao] = useState("");
  const [neServidor, setNeServidor] = useState("");
  const [encList, setEncList] = useState<EncItemData[]>(mockEncaminhamentos);
  const encItemIdRef = useRef(200);

  // Enc detail modal state
  const [selectedEnc, setSelectedEnc] = useState<EncItemData | null>(null);
  const [encNovoRelato, setEncNovoRelato] = useState("");
  const [encSavedRelato, setEncSavedRelato] = useState(false);
  const [encFinalizando, setEncFinalizando] = useState(false);
  const [encParecerFinal, setEncParecerFinal] = useState("");
  type EncEvolucao = { data: string; autor: string; texto: string; tipo: "criacao" | "triagem" | "relato" | "conclusao" };
  const [encEvolucoes, setEncEvolucoes] = useState<Record<number, EncEvolucao[]>>(
    Object.fromEntries(mockEncaminhamentos.map((e) => [e.id, [{ data: e.data, autor: e.servidor || "Sistema", texto: e.descricao, tipo: "criacao" as const }]]))
  );

  const totalAlunos  = alunos.length + alunosTurmaB.length;
  const savedCount   = Object.values(avaliacoes).filter((e) => e.saved).length;
  const presentCount = Object.values(presenteToggle).filter(Boolean).length;
  const current      = [...alunos, ...alunosTurmaB.map((a) => ({ ...a, risco: false }))].find((a) => a.matricula === selectedAluno)!;
  const currentEval = avaliacoes[selectedAluno];

  // Tab 2 computed shortcuts
  const form           = turmaForms[activeTurmaIdx];
  const currentTurmaD  = turmasData[activeTurmaIdx];
  const allPontos      = [...PONTOS_PRESET, ...form.customPontos];
  const allDific       = [...DIFIC_PRESET, ...form.customDificuldades];
  const tab2HasContent  = turmaForms.some((f) => f.sintese || f.representantes || f.demandas.length > 0 || f.pontosPositivos.length > 0);
  const filteredEncs    = encList.filter((e) => turmasData.some((t) => t.nome === e.turma));
  const alunosComTurma  = [
    ...alunos.map((a) => ({ ...a, turma: turmasData[0].nome })),
    ...alunosTurmaB.map((a) => ({ ...a, risco: false as boolean, turma: turmasData[1].nome })),
  ];

  // Dynamic tab list based on mode
  type TabDef = { id: TabId; label: string; icon: React.ElementType; short: string; displayNum: number };
  const visibleTabs: TabDef[] = isInter
    ? [
        { id: 2, label: "Demandas Gerais",              icon: ClipboardList, short: "Demandas",      displayNum: 1 },
        { id: 3, label: "Registros e Encaminhamentos",  icon: FileText,      short: "Registros",     displayNum: 2 },
      ]
    : [
        { id: 1, label: "Participantes do Conselho",    icon: Users,         short: "Participantes",  displayNum: 1 },
        { id: 2, label: "Demandas Gerais",              icon: ClipboardList, short: "Demandas",       displayNum: 2 },
        { id: 3, label: "Registros e Encaminhamentos",  icon: FileText,      short: "Registros",      displayNum: 3 },
        { id: 4, label: "Avaliação Discente",           icon: GraduationCap, short: "Avaliação",      displayNum: 4 },
      ];

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">

      {/* ── Top Header Bar ─────────────────────────────────────────────────── */}
      <div
        className="shrink-0 px-6 pt-4 pb-0"
        style={{
          background: "var(--card)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Row 0 — back navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80 group"
            style={{ color: "var(--primary)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Sair para Central de Conselhos
          </button>

          {/* Right-side actions */}
          <div className="flex items-center gap-2">
            {isInter ? (
              <>
                {/* Importar Planilha — outline */}
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-[#e8f0eb] active:scale-[0.98]"
                  style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                >
                  <Download size={14} />
                  Importar Planilha
                </button>
                {/* Salvar alterações — solid green */}
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "var(--primary)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Salvar alterações
                </button>
              </>
            ) : (
              <>
                {/* Salvar Sessão — ghost outline */}
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-[#e8f0eb] active:scale-[0.98]"
                  style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Salvar Sessão
                </button>
                {/* Encerrar — solid green */}
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "var(--primary)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Encerrar Conselho e Emitir Ata
                </button>
                {/* Progress chip */}
                <div className="text-right pl-2 border-l border-border ml-1">
                  <p className="text-xs text-muted-foreground leading-none mb-1">Pareceres</p>
                  <p className="text-sm font-bold leading-none" style={{ color: "var(--primary)" }}>
                    {savedCount} / {totalAlunos}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Row 1 — title + metadata */}
        <div className="pb-4">
          <h1 className="text-base font-bold text-foreground leading-snug mb-1.5">
            Conselho de Classe Intermediário — Curso Técnico em Desenvolvimento de Sistemas
          </h1>
          <div className="flex items-center gap-5 flex-wrap">
            {isInter ? (
              <>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users size={12} className="shrink-0" />
                  {alunos.length + alunosTurmaB.length} alunos
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <UserCheck size={12} className="shrink-0" />
                  Coord.: <span className="font-semibold text-foreground ml-0.5">Profa. Renata Dias</span>
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar size={12} className="shrink-0" />
                  25/06/2026
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={12} className="shrink-0" />
                  14h00
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users size={12} className="shrink-0" />
                  {presentCount} de {professores.length} participantes presentes
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── Sub-header Tab Navigation ─────────────────────────────────────── */}
        <nav className="flex items-end gap-0 -mb-px">
          {visibleTabs.map((tab) => {
            const Icon    = tab.icon;
            const active  = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold transition-all duration-150 rounded-t-lg border border-b-0 mr-1 group"
                style={{
                  background:   active ? "var(--background)" : "transparent",
                  color:        active ? "var(--primary)"    : "var(--muted-foreground)",
                  borderColor:  active ? "var(--border)"     : "transparent",
                  borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
                  fontWeight:   active ? 700 : 500,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(21,98,47,0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                {/* Number badge */}
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: active ? "var(--primary)" : "var(--muted)",
                    color:      active ? "white"          : "var(--muted-foreground)",
                  }}
                >
                  {tab.displayNum}
                </span>

                <Icon size={15} className="shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>

                {/* Completion badges */}
                {tab.id === 1 && (
                  <span
                    className="ml-1 text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: active ? "white" : "var(--muted)",
                      color:      active ? "var(--primary)" : "var(--muted-foreground)",
                    }}
                  >
                    {presentCount}/{professores.length}
                  </span>
                )}
                {tab.id === 4 && savedCount > 0 && (
                  <span
                    className="ml-1 text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: active ? "white" : "var(--muted)",
                      color:      active ? "var(--primary)" : "var(--muted-foreground)",
                    }}
                  >
                    {savedCount}/{totalAlunos}
                  </span>
                )}
                {tab.id === 2 && tab2HasContent && (
                  <CheckCircle2 size={13} style={{ color: active ? "var(--primary)" : "#22c55e" }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-hidden">

        {/* ── TAB 1: Participantes ─────────────────────────────────────────── */}
        {activeTab === 1 && (
          <div className="h-full overflow-y-auto px-6 py-6">
            <div className="max-w-3xl mx-auto space-y-5">

              {/* Summary bar */}
              <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Confirmados presentes</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${(presentCount / professores.length) * 100}%`, background: "var(--primary)" }}
                      />
                    </div>
                    <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>
                      {presentCount}/{professores.length}
                    </span>
                  </div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="text-center px-2">
                  <p className="text-2xl font-bold text-emerald-600">{presentCount}</p>
                  <p className="text-xs text-muted-foreground">Presentes</p>
                </div>
                <div className="text-center px-2">
                  <p className="text-2xl font-bold text-muted-foreground/60">{professores.length - presentCount}</p>
                  <p className="text-xs text-muted-foreground">Ausentes</p>
                </div>
              </div>

              {/* List */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                  <Users size={14} style={{ color: "var(--primary)" }} />
                  <h2 className="text-sm font-semibold text-foreground">Lista de Participantes</h2>
                  <p className="text-xs text-muted-foreground ml-auto">Clique para alternar presença</p>
                </div>
                <div className="divide-y divide-border">
                  {professores.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-5 py-3.5 cursor-pointer hover:bg-[#f7f8fa] transition-colors"
                      onClick={() => setPresenteToggle((prev) => ({ ...prev, [i]: !prev[i] }))}
                    >
                      <div className="shrink-0">
                        {presenteToggle[i]
                          ? <CheckCircle size={18} style={{ color: "var(--primary)" }} />
                          : <Circle size={18} className="text-muted-foreground/30" />}
                      </div>
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: presenteToggle[i] ? "var(--secondary)" : "var(--muted)",
                          color:      presenteToggle[i] ? "var(--primary)"   : "var(--muted-foreground)",
                        }}
                      >
                        {p.nome.split(" ").filter((n) => n.length > 2).slice(0, 2).map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${presenteToggle[i] ? "text-foreground" : "text-muted-foreground"}`}>
                          {p.nome}
                        </p>
                        <p className="text-xs text-muted-foreground">{p.cargo}{p.disciplina !== "—" ? ` · ${p.disciplina}` : ""}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
                          presenteToggle[i]
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-[#f7f8fa] text-muted-foreground border-border"
                        }`}
                      >
                        {presenteToggle[i] ? "Presente" : "Ausente"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer note */}
              <p className="text-xs text-muted-foreground text-center pb-2">
                A lista de presença será registrada automaticamente na ata oficial ao concluir o conselho.
              </p>
            </div>
          </div>
        )}

        {/* ── TAB 2: Demandas Gerais ────────────────────────────────────────── */}
        {activeTab === 2 && (
          <div className="h-full overflow-y-auto">
            <div className="px-6 py-6 space-y-4">

              {/* Turma selector bar */}
              <div className="bg-card rounded-xl border border-border px-5 py-3.5 flex items-center gap-4 flex-wrap">
                {turmasData.length > 1 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">Turma:</span>
                    <select
                      value={activeTurmaIdx}
                      onChange={(e) => setActiveTurmaIdx(Number(e.target.value))}
                      className="text-sm font-semibold border border-border rounded-lg px-3 py-1.5 bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer"
                      style={{ color: "var(--primary)" }}
                    >
                      {turmasData.map((t, i) => (
                        <option key={i} value={i}>{t.nome}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="text-sm font-semibold" style={{ color: "var(--primary)" }}>{currentTurmaD.nome}</span>
                )}
                <div className="h-4 w-px bg-border shrink-0" />
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users size={12} className="shrink-0" />
                  {currentTurmaD.alunosList.length} alunos
                </span>
                <div className="h-4 w-px bg-border shrink-0" />
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <UserCheck size={12} className="shrink-0" />
                  Coord.: <span className="font-semibold text-foreground ml-0.5">{currentTurmaD.coord}</span>
                </span>
                <span className="ml-auto text-xs text-muted-foreground">{currentTurmaD.semestre}</span>
              </div>

              {/* Pauta Coletiva card */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                  <ClipboardList size={14} style={{ color: "var(--primary)" }} />
                  <h2 className="text-sm font-semibold text-foreground">Pauta Coletiva da Turma</h2>
                  <span className="ml-auto text-xs font-medium text-muted-foreground">{currentTurmaD.nome} · {currentTurmaD.semestre}</span>
                </div>

                <div className="p-6 space-y-0 divide-y divide-border">

                  {/* ── Representantes ── */}
                  <div className="pb-7">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Representante(s) da Turma</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Aluno(s) que representaram a turma no conselho.</p>
                      </div>
                      {!isInter && (
                        <button onClick={() => toggleEditField("representantes")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0">
                          <Pencil size={11} />{editFields.has("representantes") ? "Cancelar" : "Editar"}
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
                        <p className="text-xs text-muted-foreground mt-1.5">Sugestões: selecione da lista ou escreva livremente.</p>
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
                        <p className="text-xs text-muted-foreground mt-0.5">Insira aqui um resumo detalhado sobre as informações coletadas no questionário da turma.</p>
                      </div>
                      {!isInter && (
                        <button onClick={() => toggleEditField("sintese")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0 ml-4">
                          <Pencil size={11} />{editFields.has("sintese") ? "Cancelar" : "Editar"}
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
                        <p className="text-xs text-muted-foreground mt-0.5">Selecione os aspectos positivos observados na turma.</p>
                      </div>
                      {!isInter && (
                        <button onClick={() => toggleEditField("pontos")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0 ml-4">
                          <Pencil size={11} />{editFields.has("pontos") ? "Cancelar" : "Editar"}
                        </button>
                      )}
                    </div>
                    {isInter || editFields.has("pontos") ? (
                      <>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {allPontos.map((item) => (
                            <label key={item} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] cursor-pointer hover:border-primary/40 transition-all select-none">
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
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newPontoText.trim()) { updateForm({ customPontos: [...form.customPontos, newPontoText.trim()], pontosPositivos: [...form.pontosPositivos, newPontoText.trim()] }); setNewPontoText(""); } } }}
                            placeholder="Adicionar ponto personalizado..."
                            className="flex-1 text-sm px-3 py-2 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
                          />
                          <button
                            onClick={() => { if (newPontoText.trim()) { updateForm({ customPontos: [...form.customPontos, newPontoText.trim()], pontosPositivos: [...form.pontosPositivos, newPontoText.trim()] }); setNewPontoText(""); } }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 text-white"
                            style={{ background: "var(--primary)" }}
                          >
                            <Plus size={13} />Adicionar
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {form.pontosPositivos.length > 0 ? form.pontosPositivos.map((item) => (
                          <span key={item} className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{item}</span>
                        )) : <span className="text-sm text-muted-foreground italic">Nenhum ponto selecionado</span>}
                      </div>
                    )}
                  </div>

                  {/* ── Dificuldades apontadas ── */}
                  <div className="py-7">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Dificuldades Apontadas</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Selecione as dificuldades identificadas na turma.</p>
                      </div>
                      {!isInter && (
                        <button onClick={() => toggleEditField("dific")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0 ml-4">
                          <Pencil size={11} />{editFields.has("dific") ? "Cancelar" : "Editar"}
                        </button>
                      )}
                    </div>
                    {isInter || editFields.has("dific") ? (
                      <>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {allDific.map((item) => (
                            <label key={item} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] cursor-pointer hover:border-amber-400/60 transition-all select-none">
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
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newDificText.trim()) { updateForm({ customDificuldades: [...form.customDificuldades, newDificText.trim()], dificuldades: [...form.dificuldades, newDificText.trim()] }); setNewDificText(""); } } }}
                            placeholder="Adicionar dificuldade personalizada..."
                            className="flex-1 text-sm px-3 py-2 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
                          />
                          <button
                            onClick={() => { if (newDificText.trim()) { updateForm({ customDificuldades: [...form.customDificuldades, newDificText.trim()], dificuldades: [...form.dificuldades, newDificText.trim()] }); setNewDificText(""); } }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 text-white"
                            style={{ background: "var(--primary)" }}
                          >
                            <Plus size={13} />Adicionar
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {form.dificuldades.length > 0 ? form.dificuldades.map((item) => (
                          <span key={item} className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{item}</span>
                        )) : <span className="text-sm text-muted-foreground italic">Nenhuma dificuldade selecionada</span>}
                      </div>
                    )}
                  </div>

                  {/* ── Demandas gerais da turma ── */}
                  <div className="py-7">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Demandas Gerais da Turma</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Demandas e situações trazidas pela turma ao colegiado.</p>
                      </div>
                      {!isInter && (
                        <button onClick={() => toggleEditField("demandas")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0 ml-4">
                          <Pencil size={11} />{editFields.has("demandas") ? "Cancelar" : "Editar"}
                        </button>
                      )}
                    </div>

                    {/* Table */}
                    {form.demandas.length > 0 ? (
                      <div className="rounded-xl border border-border overflow-hidden mb-3">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-[#f7f8fa] border-b border-border">
                              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Situação</th>
                              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground w-36">Gravidade</th>
                              {(isInter || editFields.has("demandas")) && (
                                <th className="px-4 py-2.5 w-28" />
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {form.demandas.map((d) => (
                              <tr key={d.id} className="border-b border-border last:border-0 hover:bg-[#fafbfc] transition-colors">
                                <td className="px-4 py-3 text-sm text-foreground">{d.situacao}</td>
                                <td className="px-4 py-3">
                                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                    d.gravidade === "critica"     ? "bg-red-50 text-red-700 border border-red-200" :
                                    d.gravidade === "urgente"     ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                                                    "bg-[#f7f8fa] text-muted-foreground border border-border"
                                  }`}>
                                    {d.gravidade === "critica" ? "Crítica" : d.gravidade === "urgente" ? "Urgente" : "Não urgente"}
                                  </span>
                                </td>
                                {(isInter || editFields.has("demandas")) && (
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2 justify-end">
                                      <button className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg border border-border hover:border-primary/30">
                                        + Encaminhamento
                                      </button>
                                      <button onClick={() => removeDemanda(d.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all">
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
                      demandaOpen ? (
                        <div className="bg-[#f7f8fa] rounded-xl border border-border p-4 space-y-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-foreground">Nova demanda</span>
                            <button onClick={() => { setDemandaOpen(false); setDemandaSit(""); setDemandaGrav("nao-urgente"); }} className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
                              <X size={13} />
                            </button>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Situação</label>
                            <textarea
                              rows={2}
                              value={demandaSit}
                              onChange={(e) => setDemandaSit(e.target.value)}
                              placeholder="Descreva a situação ou demanda..."
                              className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Gravidade</label>
                            <select
                              value={demandaGrav}
                              onChange={(e) => setDemandaGrav(e.target.value as "nao-urgente" | "urgente" | "critica")}
                              className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-white outline-none focus:border-primary cursor-pointer"
                            >
                              <option value="nao-urgente">Não urgente</option>
                              <option value="urgente">Urgente</option>
                              <option value="critica">Crítica</option>
                            </select>
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button onClick={() => { setDemandaOpen(false); setDemandaSit(""); setDemandaGrav("nao-urgente"); }} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg transition-all">
                              Cancelar
                            </button>
                            <button onClick={addDemanda} disabled={!demandaSit.trim()} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40" style={{ background: "var(--primary)" }}>
                              <Plus size={13} />Adicionar demanda
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setDemandaOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-2 border-dashed transition-all hover:bg-[#f7f8fa] active:scale-[0.98]" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
                          <Plus size={14} />Adicionar demanda
                        </button>
                      )
                    )}
                  </div>

                  {/* ── Registros e observações gerais ── */}
                  <div className="pt-7">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Registros e Observações Gerais</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Informações extras e observações sobre outros assuntos tratados.</p>
                      </div>
                      {!isInter && (
                        <button onClick={() => toggleEditField("registros")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0 ml-4">
                          <Pencil size={11} />{editFields.has("registros") ? "Cancelar" : "Editar"}
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
                        {form.registros || <span className="text-muted-foreground italic">Nenhuma observação adicional</span>}
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

            </div>
          </div>
        )}

        {/* ── TAB 3: Registros e Encaminhamentos ──────────────────────────── */}
        {activeTab === 3 && (
          <div className="h-full overflow-y-auto">
            <div className="px-6 py-6 space-y-8">

              {/* ── Seção 1: Registros Docentes ── */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <BookOpen size={15} style={{ color: "var(--primary)" }} />
                      Registros Docentes
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5 ml-5">Ocorrências e situações relatadas pelos docentes sobre estudantes das turmas.</p>
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

              {/* ── Seção 2: Encaminhamentos Individuais ── */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Send size={14} style={{ color: "var(--primary)" }} />
                      Encaminhamentos Individuais
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5 ml-5">Encaminhamentos ativos vinculados a estudantes das turmas deste conselho.</p>
                  </div>
                  <button
                    onClick={() => setNovoEncOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-[#e8f0eb] active:scale-[0.98]"
                    style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                  >
                    <Plus size={13} />Novo Encaminhamento
                  </button>
                </div>

                {filteredEncs.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
                    <Send size={20} className="mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-sm font-medium text-muted-foreground">Nenhum encaminhamento encontrado para as turmas.</p>
                  </div>
                ) : (
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#f7f8fa] border-b border-border">
                            {["Título", "Categoria", "Estudante", "Status", ""].map((col, i) => (
                              <th key={i} className={`px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap${i === 4 ? " w-40" : ""}`}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEncs.map((e) => (
                            <tr key={e.id} className="border-b border-border last:border-0 hover:bg-[#f7f8fa] transition-colors">
                              <td className="px-4 py-3">
                                <span className="text-sm font-medium text-foreground">{e.titulo}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border" style={{ background: "var(--secondary)", color: "var(--primary)", borderColor: "var(--accent)" }}>
                                  {e.categoria}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
                                    {e.aluno.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{e.aluno}</p>
                                    <p className="text-xs text-muted-foreground" style={{ fontFamily: "monospace", fontSize: "11px" }}>{e.matricula}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {e.status === "pendente"     && <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Pendente</span>}
                                {e.status === "em-andamento" && <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Em andamento</span>}
                                {e.status === "finalizado"   && <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Finalizado</span>}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3 justify-end">
                                  <button onClick={() => openEncDetail(e)} className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:underline whitespace-nowrap" style={{ color: "var(--primary)" }}>
                                    Ver detalhes <ExternalLink size={11} />
                                  </button>
                                  <span className="text-border select-none">|</span>
                                  <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                                    <Link2 size={11} />Relacionar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-2.5 bg-[#f7f8fa] border-t border-border flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{filteredEncs.length} encaminhamento{filteredEncs.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ── TAB 4: Avaliação Discente ────────────────────────────────────── */}
        {activeTab === 4 && (
          <div className="flex h-full min-h-0 overflow-hidden">

            {/* Student list sidebar — accordion groups */}
            <div className="shrink-0 border-r border-border flex flex-col overflow-hidden bg-[#f7f8fa]" style={{ width: "308px" }}>

              {/* Sidebar header */}
              <div className="px-4 py-3.5 border-b border-border bg-card shrink-0">
                <h2 className="text-sm font-semibold text-foreground">Discentes por Turma</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {Object.values(avaliacoes).filter((e) => e.saved).length} de {alunos.length + alunosTurmaB.length} pareceres salvos
                </p>
              </div>

              <div className="flex-1 overflow-y-auto">

                {/* ── Group A — expanded (active) ────────────────────────── */}
                <div>
                  <button
                    onClick={() => setGroupAOpen((v) => !v)}
                    className="w-full flex items-center gap-2 px-4 py-3 border-b border-border bg-card hover:bg-[#f0f2f5] transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--primary)" }} />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-bold text-foreground truncate">TDS - 2ª Fase</p>
                      <p className="text-xs text-muted-foreground">
                        {alunos.length} alunos · {alunos.filter((a) => avaliacoes[a.matricula]?.saved).length} salvos
                      </p>
                    </div>
                    {groupAOpen
                      ? <ChevronDown size={14} className="text-muted-foreground shrink-0" />
                      : <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                    }
                  </button>

                  {groupAOpen && (
                    <div>
                      {[...alunos]
                        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
                        .map((a) => {
                          const ev         = avaliacoes[a.matricula];
                          const isSelected = selectedAluno === a.matricula;
                          const discsA     = disciplinasData[a.matricula] ?? defaultDisciplinas;
                          const acad       = { mediaSistema: discsA.reduce((s, d) => s + d.nota, 0) / discsA.length, presentes: discsA.reduce((s, d) => s + d.presentes, 0), chTotal: discsA.reduce((s, d) => s + d.ch, 0) };
                          const freq       = Math.round((acad.presentes / acad.chTotal) * 100);

                          const gradePill = acad.mediaSistema >= 7.1
                            ? { bg: "#dcfce7", text: "#15803d", label: `Média ${acad.mediaSistema.toFixed(1)}` }
                            : acad.mediaSistema >= 6.0
                            ? { bg: "#ffedd5", text: "#c2410c", label: `Média ${acad.mediaSistema.toFixed(1)}` }
                            : { bg: "#fee2e2", text: "#b91c1c", label: `Média ${acad.mediaSistema.toFixed(1)}` };

                          const freqPill = freq >= 80
                            ? { bg: "#dcfce7", text: "#15803d", label: `${freq}% presença` }
                            : freq >= 75
                            ? { bg: "#ffedd5", text: "#c2410c", label: `${freq}% presença` }
                            : { bg: "#fee2e2", text: "#b91c1c", label: `${freq}% presença` };

                          return (
                            <button
                              key={a.matricula}
                              onClick={() => setSelectedAluno(a.matricula)}
                              className="w-full text-left px-4 py-3 border-b border-border transition-colors"
                              style={{
                                background: isSelected ? "var(--secondary)" : "transparent",
                                borderLeft: isSelected ? "3px solid var(--primary)" : "3px solid transparent",
                              }}
                              onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(21,98,47,0.04)"; }}
                              onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                            >
                              <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div
                                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                                  style={{
                                    background: isSelected ? "var(--primary)" : "#d1d5db",
                                    color:      isSelected ? "white"          : "#374151",
                                  }}
                                >
                                  {a.nome.split(" ").filter((n) => n.length > 1).slice(0, 2).map((n) => n[0]).join("")}
                                </div>

                                <div className="min-w-0 flex-1">
                                  {/* Name row */}
                                  <div className="flex items-center gap-1.5">
                                    <p className="text-sm font-semibold truncate text-foreground leading-tight">{a.nome}</p>
                                    <div className="flex items-center gap-1 shrink-0">
                                      {ev.saved   && <CheckCircle   size={12} style={{ color: "var(--primary)" }} />}
                                      {ev.risco   && <AlertTriangle size={12} className="text-orange-500" />}
                                      {isSelected && <ChevronRight  size={12} className="text-muted-foreground" />}
                                    </div>
                                  </div>

                                  {/* Metric pills */}
                                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                    <span
                                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                      style={{ background: gradePill.bg, color: gradePill.text }}
                                    >
                                      {gradePill.label}
                                    </span>
                                    <span
                                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                      style={{ background: freqPill.bg, color: freqPill.text }}
                                    >
                                      {freqPill.label}
                                    </span>
                                  </div>

                                  {/* Atenção badge */}
                                  {a.atencao && (
                                    <div className="mt-1.5">
                                      <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                                        Atenção Ativa
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* ── Group B — collapsed ────────────────────────────────── */}
                <div>
                  <button
                    onClick={() => setGroupBOpen((v) => !v)}
                    className="w-full flex items-center gap-2 px-4 py-3 border-b border-border bg-card hover:bg-[#f0f2f5] transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 shrink-0" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-bold text-muted-foreground truncate">Mecatrônica - 3ª Fase</p>
                      <p className="text-xs text-muted-foreground">
                        {alunosTurmaB.length} alunos · {alunosTurmaB.filter((a) => avaliacoes[a.matricula]?.saved).length} salvos
                      </p>
                    </div>
                    {groupBOpen
                      ? <ChevronDown  size={14} className="text-muted-foreground shrink-0" />
                      : <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                    }
                  </button>

                  {groupBOpen && (
                    <div>
                      {[...alunosTurmaB]
                        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
                        .map((a) => {
                          const ev         = avaliacoes[a.matricula];
                          const isSelected = selectedAluno === a.matricula;
                          const discsA     = disciplinasData[a.matricula] ?? defaultDisciplinas;
                          const acad       = { mediaSistema: discsA.reduce((s, d) => s + d.nota, 0) / discsA.length, presentes: discsA.reduce((s, d) => s + d.presentes, 0), chTotal: discsA.reduce((s, d) => s + d.ch, 0) };
                          const freq       = Math.round((acad.presentes / acad.chTotal) * 100);

                          const gradePill = acad.mediaSistema >= 7.1
                            ? { bg: "#dcfce7", text: "#15803d", label: `Média ${acad.mediaSistema.toFixed(1)}` }
                            : acad.mediaSistema >= 6.0
                            ? { bg: "#ffedd5", text: "#c2410c", label: `Média ${acad.mediaSistema.toFixed(1)}` }
                            : { bg: "#fee2e2", text: "#b91c1c", label: `Média ${acad.mediaSistema.toFixed(1)}` };

                          const freqPill = freq >= 80
                            ? { bg: "#dcfce7", text: "#15803d", label: `${freq}% presença` }
                            : freq >= 75
                            ? { bg: "#ffedd5", text: "#c2410c", label: `${freq}% presença` }
                            : { bg: "#fee2e2", text: "#b91c1c", label: `${freq}% presença` };

                          return (
                            <button
                              key={a.matricula}
                              onClick={() => setSelectedAluno(a.matricula)}
                              className="w-full text-left px-4 py-3 border-b border-border transition-colors"
                              style={{
                                background: isSelected ? "var(--secondary)" : "transparent",
                                borderLeft: isSelected ? "3px solid var(--primary)" : "3px solid transparent",
                              }}
                              onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(21,98,47,0.04)"; }}
                              onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                                  style={{
                                    background: isSelected ? "var(--primary)" : "#d1d5db",
                                    color:      isSelected ? "white"          : "#374151",
                                  }}
                                >
                                  {a.nome.split(" ").filter((n) => n.length > 1).slice(0, 2).map((n) => n[0]).join("")}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <p className="text-sm font-semibold truncate text-foreground leading-tight">{a.nome}</p>
                                    <div className="flex items-center gap-1 shrink-0">
                                      {ev?.saved  && <CheckCircle   size={12} style={{ color: "var(--primary)" }} />}
                                      {isSelected && <ChevronRight  size={12} className="text-muted-foreground" />}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: gradePill.bg, color: gradePill.text }}>
                                      {gradePill.label}
                                    </span>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: freqPill.bg, color: freqPill.text }}>
                                      {freqPill.label}
                                    </span>
                                  </div>
                                  {a.atencao && (
                                    <div className="mt-1.5">
                                      <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                                        Atenção Ativa
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Eval panel */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

              {/* ── 1. Student identity header (absolute top) ──────────── */}
              <div
                className="rounded-xl border px-5 py-4 flex items-center justify-between"
                style={{
                  background:  currentEval.risco ? "linear-gradient(135deg,#fff7ed 0%,#fff3e0 100%)" : "var(--card)",
                  borderColor: currentEval.risco ? "#f97316" : "var(--border)",
                  boxShadow:   currentEval.risco ? "0 0 0 1px rgba(249,115,22,0.12)" : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    {current.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-base font-bold text-foreground leading-tight">{current.nome}</p>
                      {current.atencao && (
                        <span className="text-xs bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                          Atenção Pedagógica Ativa
                        </span>
                      )}
                      {currentEval.risco && (
                        <span className="text-xs bg-orange-100 text-orange-800 border border-orange-300 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <AlertTriangle size={10} /> Risco de Evasão
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "monospace" }}>
                      Matrícula: {current.matricula}&ensp;·&ensp;{"TDS - 2ª Fase"}
                    </p>
                  </div>
                </div>
                {currentEval.saved && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 shrink-0">
                    <CheckCircle size={11} /> Parecer salvo
                  </span>
                )}
              </div>

              {/* ── 2. Desempenho Acadêmico e Gestão por Disciplina ──────── */}
              {(() => {
                const discs    = disciplinasData[selectedAluno] ?? defaultDisciplinas;
                const discIdx  = selectedDisc[selectedAluno] ?? 0;
                const disc     = discs[discIdx] ?? discs[0];
                const retKey   = `${selectedAluno}|${disc.nome}`;
                const retVal   = retificadas[retKey] ?? "";
                const retNum   = parseFloat(retVal);
                const retOk    = retVal !== "" && !isNaN(retNum) && retNum >= 0 && retNum <= 10;

                // Global averages across all disciplines
                const globalMedia = discs.reduce((s, d) => s + d.nota, 0) / discs.length;
                const globalCH    = discs.reduce((s, d) => s + d.ch, 0);
                const globalPres  = discs.reduce((s, d) => s + d.presentes, 0);
                const globalFreq  = Math.round((globalPres / globalCH) * 100);

                // Active discipline frequency
                const chTotal     = disc.ch;
                const pctPres     = Math.round((disc.presentes  / chTotal) * 100);
                const pctJust     = Math.round((disc.faltasJust / chTotal) * 100);
                const pctNaoJust  = Math.round((disc.faltasNaoJust / chTotal) * 100);
                const freqDisc    = Math.round((disc.presentes  / chTotal) * 100);
                const ldbAlert    = (disc.faltasJust + disc.faltasNaoJust) / chTotal > 0.25;

                return (
                  <div className="bg-card rounded-xl border border-border overflow-hidden">

                    {/* Card header */}
                    <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
                      <div className="w-1 h-4 rounded-full shrink-0" style={{ background: "var(--primary)" }} />
                      <h3 className="text-sm font-bold text-foreground">Desempenho Acadêmico e Gestão por Disciplina</h3>
                      <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">SIGAA · 2026.1</span>
                    </div>

                    {/* ── Top Layer: Global read-only banner ─────────────── */}
                    <div className="px-4 py-2 border-b border-border flex items-center gap-4 flex-wrap" style={{ background: "#f7f8fa" }}>
                      <div className="flex items-center gap-1.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground shrink-0"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        <span className="text-xs text-muted-foreground">Média Global Acumulada:</span>
                        <span
                          className="text-xs font-bold"
                          style={{ color: globalMedia < 6 ? "#dc2626" : globalMedia < 7 ? "#d97706" : "#15803d" }}
                        >
                          {globalMedia.toFixed(1)}
                        </span>
                      </div>
                      <div className="w-px h-3 bg-border shrink-0" />
                      <div className="flex items-center gap-1.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground shrink-0"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        <span className="text-xs text-muted-foreground">Frequência Global Acumulada:</span>
                        <span
                          className="text-xs font-bold"
                          style={{ color: globalFreq < 75 ? "#dc2626" : globalFreq < 80 ? "#d97706" : "#15803d" }}
                        >
                          {globalFreq}%
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground/70 ml-auto hidden sm:block">
                        Cálculo automático projetado a partir das disciplinas matriculadas
                      </span>
                    </div>

                    {/* ── Middle Layer: Discipline selector ──────────────── */}
                    <div className="px-4 py-2.5 border-b border-border">
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Selecione a Disciplina para Retificação:
                      </label>
                      <div className="relative">
                        <select
                          value={discIdx}
                          onChange={(e) =>
                            setSelectedDisc((prev) => ({ ...prev, [selectedAluno]: Number(e.target.value) }))
                          }
                          className="w-full appearance-none text-sm font-medium pl-3 pr-8 py-2 rounded-lg border border-border bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                          style={{ color: "var(--foreground)" }}
                        >
                          {discs.map((d, i) => (
                            <option key={i} value={i}>
                              {d.nome} ({d.ch}h) — {d.professor}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    {/* ── Bottom Layer: 2-column discipline editor ────────── */}
                    <div className="grid grid-cols-2 divide-x divide-border" style={{ minHeight: "140px" }}>

                      {/* Left — Grades */}
                      <div className="px-4 py-3 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notas</p>

                        {/* Nota bruta */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">Nota Bruta SIGAA:</span>
                          <span
                            className="text-lg font-bold"
                            style={{
                              color: disc.nota < 6 ? "#dc2626" : disc.nota < 7 ? "#d97706" : "#15803d",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {disc.nota.toFixed(1)}
                          </span>
                        </div>

                        {/* Editable override */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Média Retificada em Conselho:</p>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0" max="10" step="0.1"
                              value={retVal}
                              onChange={(e) => setRetificadas((prev) => ({ ...prev, [retKey]: e.target.value }))}
                              placeholder={disc.nota.toFixed(1)}
                              className="w-20 text-xl font-bold px-2 py-1 rounded-lg border-2 outline-none transition-all placeholder:text-muted-foreground/30 bg-white"
                              style={{
                                borderColor: retOk ? "var(--primary)" : "var(--border)",
                                color:       retOk ? "var(--primary)" : "var(--foreground)",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            />
                            {retOk && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                                Retificado
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right — Attendance */}
                      <div className="px-4 py-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Frequência</p>
                          {ldbAlert && (
                            <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                              LDB
                            </span>
                          )}
                        </div>

                        {/* Segmented bar */}
                        <div>
                          <div className="flex h-5 rounded-md overflow-hidden border border-border gap-px bg-border mb-1.5">
                            <div
                              className="flex items-center justify-center text-xs font-bold text-white"
                              style={{ width: `${pctPres}%`, background: "#15803d" }}
                              title={`${disc.presentes}h presentes`}
                            >
                              {pctPres > 15 && `${disc.presentes}h`}
                            </div>
                            {disc.faltasJust > 0 && (
                              <div
                                style={{ width: `${pctJust}%`, background: "#d97706" }}
                                title={`${disc.faltasJust}h justificadas`}
                              />
                            )}
                            {disc.faltasNaoJust > 0 && (
                              <div
                                style={{ width: `${pctNaoJust}%`, background: "#dc2626" }}
                                title={`${disc.faltasNaoJust}h não justificadas`}
                              />
                            )}
                          </div>

                          {/* Compact legend */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {[
                              { color: "#15803d", v: `${disc.presentes}h Pres.` },
                              { color: "#d97706", v: `${disc.faltasJust}h Just.` },
                              { color: "#dc2626", v: `${disc.faltasNaoJust}h Falta` },
                            ].map((s, i) => (
                              <span key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.color }} />
                                {s.v}
                              </span>
                            ))}
                            <span className="text-xs font-semibold ml-auto" style={{ color: freqDisc < 75 ? "#dc2626" : freqDisc < 80 ? "#d97706" : "#15803d" }}>
                              {freqDisc}%
                            </span>
                          </div>
                        </div>

                        {/* Abono button */}
                        <button
                          onClick={() => { setAbonomat(selectedAluno); setAbonoText(""); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:opacity-90 active:scale-[0.98] mt-1"
                          style={{ borderColor: "var(--primary)", color: "var(--primary)", background: "var(--secondary)" }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                          Abonar Faltas / Justificar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Abono modal */}
              {abonomat && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
                  onClick={() => setAbonomat(null)}
                >
                  <div
                    className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between" style={{ background: "var(--primary)" }}>
                      <div>
                        <p className="text-xs text-white/60">Registro de Abono</p>
                        <h3 className="text-sm font-bold text-white">Abonar Faltas / Inserir Justificativa</h3>
                        <p className="text-xs text-white/60 mt-0.5" style={{ fontFamily: "monospace" }}>
                          {[...alunos, ...alunosTurmaB].find((a) => a.matricula === abonomat)?.nome} · {abonomat}
                        </p>
                      </div>
                      <button onClick={() => setAbonomat(null)} className="text-white/60 hover:text-white transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                    <div className="px-5 py-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">Quantidade de horas a abonar</label>
                          <input
                            type="number" min="1" placeholder="Ex: 8"
                            className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">Tipo de justificativa</label>
                          <select className="w-full appearance-none text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer">
                            <option>Atestado Médico</option>
                            <option>Luto</option>
                            <option>Serviço Militar</option>
                            <option>Representação Discente</option>
                            <option>Decisão do Conselho</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">Observações / Fundamentação</label>
                        <textarea
                          rows={4}
                          value={abonoText}
                          onChange={(e) => setAbonoText(e.target.value)}
                          placeholder="Descreva a justificativa e o embasamento legal ou pedagógico para o abono das faltas..."
                          className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground leading-relaxed"
                        />
                      </div>
                    </div>
                    <div className="px-5 py-3.5 border-t border-border flex gap-2 justify-end bg-[#f7f8fa]">
                      <button onClick={() => setAbonomat(null)} className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
                        Cancelar
                      </button>
                      <button
                        onClick={() => setAbonomat(null)}
                        className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "var(--primary)" }}
                      >
                        Confirmar Abono
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 3. Parecer Qualitativo e Deliberações ──────────────────── */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Section header */}
                <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-[#7c3aed]" />
                  <h3 className="text-sm font-bold text-foreground">Parecer Qualitativo e Deliberações</h3>
                  <span className="ml-auto text-xs text-muted-foreground">Registrado pelo Colegiado</span>
                </div>

                <div className="px-5 py-4 space-y-5">

                  {/* Risk toggle */}
                  <div
                    className="flex items-center justify-between p-4 rounded-xl border transition-all"
                    style={{
                      borderColor: currentEval.risco ? "#f97316" : "var(--border)",
                      background:  currentEval.risco ? "#fff7ed" : "#f7f8fa",
                      boxShadow:   currentEval.risco ? "0 0 0 3px rgba(249,115,22,0.1)" : undefined,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className={`mt-0.5 shrink-0 ${currentEval.risco ? "text-orange-500" : "text-muted-foreground/40"}`} />
                      <div>
                        <p className={`text-sm font-semibold ${currentEval.risco ? "text-orange-800" : "text-foreground"}`}>
                          Sinalizar Risco Iminente de Evasão Escolar
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Ativa alerta prioritário no painel de monitoramento (RF06)
                        </p>
                      </div>
                    </div>
                    <button
                      role="switch"
                      aria-checked={currentEval.risco}
                      onClick={() => updateEval(current.matricula, "risco", !currentEval.risco)}
                      className="relative w-11 h-6 rounded-full transition-all duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                      style={{ background: currentEval.risco ? "#f97316" : "#d1d5db" }}
                    >
                      <span
                        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200"
                        style={{ transform: currentEval.risco ? "translateX(20px)" : "translateX(0)" }}
                      />
                    </button>
                  </div>

                  {/* Observations */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Observações Pedagógicas e Parecer do Colegiado
                    </label>
                    <textarea
                      rows={5}
                      value={currentEval.obs}
                      onChange={(e) => updateEval(current.matricula, "obs", e.target.value)}
                      placeholder="Registre o parecer coletivo dos professores sobre este aluno: desempenho, comportamento, evolução, dificuldades específicas, fatores externos observados..."
                      className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground leading-relaxed transition-all"
                    />
                    <p className="text-xs text-muted-foreground text-right mt-1">{currentEval.obs.length} caracteres</p>
                  </div>

                  {/* Encaminhamentos Ativos */}
                  <div className="rounded-xl border border-border overflow-hidden">
                    {/* Card header */}
                    <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-[#f7f8fa]">
                      <div className="flex items-center gap-2">
                        <Send size={13} style={{ color: "var(--primary)" }} />
                        <span className="text-xs font-bold text-foreground">Encaminhamentos Ativos do Discente</span>
                        {(encAtivos[current.matricula]?.length ?? 0) > 0 && (
                          <span
                            className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: "var(--primary)", color: "white" }}
                          >
                            {encAtivos[current.matricula].length}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tag list / empty state */}
                    <div className="px-4 py-3 bg-card min-h-[52px]">
                      {(encAtivos[current.matricula]?.length ?? 0) === 0 ? (
                        <p className="text-xs text-muted-foreground italic">Nenhum encaminhamento cadastrado</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {encAtivos[current.matricula].map((enc) => {
                            const catColors: Record<string, { bg: string; text: string; border: string }> = {
                              "Encaminhar ao NAE / Pedagogia":         { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
                              "Encaminhar para Assistência Estudantil": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
                              "Agendar Atendimento Psicológico":        { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
                              "Nivelamento / Monitoria":                { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
                              "Orientação de Carreira":                 { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd" },
                              "Mediação de Conflito":                   { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
                            };
                            const col = catColors[enc.categoria] ?? { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" };
                            return (
                              <div
                                key={enc.id}
                                className="flex items-start gap-2 px-3 py-2 rounded-lg border text-xs"
                                style={{ background: col.bg, borderColor: col.border }}
                              >
                                <div className="min-w-0">
                                  <p className="font-semibold leading-tight" style={{ color: col.text }}>{enc.categoria}</p>
                                  {enc.descricao && (
                                    <p className="text-muted-foreground mt-0.5 leading-snug">{enc.descricao}</p>
                                  )}
                                  {enc.servidor && (
                                    <p className="mt-0.5 leading-tight" style={{ color: col.text, opacity: 0.7 }}>
                                      → {enc.servidor}
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() =>
                                    setEncAtivos((prev) => ({
                                      ...prev,
                                      [current.matricula]: prev[current.matricula].filter((e) => e.id !== enc.id),
                                    }))
                                  }
                                  className="shrink-0 mt-0.5 text-muted-foreground hover:text-red-500 transition-colors"
                                  title="Remover"
                                >
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Add button */}
                    <div className="px-4 py-2.5 border-t border-border bg-[#f7f8fa]">
                      <button
                        onClick={() => { setEncForm({ categoria: "", descricao: "", servidor: "" }); setEncModalOpen(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{ background: "var(--primary)", color: "white" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Novo Encaminhamento
                      </button>
                    </div>
                  </div>

                  {/* Encaminhamento creation modal */}
                  {encModalOpen && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center"
                      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
                      onClick={() => setEncModalOpen(false)}
                    >
                      <div
                        className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Modal header */}
                        <div className="px-5 py-4 border-b border-border flex items-center justify-between" style={{ background: "var(--primary)" }}>
                          <div>
                            <p className="text-xs text-white/60">Conselho de Classe · {current.nome}</p>
                            <h3 className="text-sm font-bold text-white mt-0.5">Novo Encaminhamento</h3>
                          </div>
                          <button onClick={() => setEncModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </div>

                        {/* Modal body */}
                        <div className="px-5 py-4 space-y-4">

                          {/* Categoria */}
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              Categoria Proposta <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <FileText size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <select
                                value={encForm.categoria}
                                onChange={(e) => setEncForm((f) => ({ ...f, categoria: e.target.value }))}
                                className="w-full appearance-none text-sm pl-9 pr-8 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                                style={{ color: encForm.categoria ? "var(--foreground)" : "var(--muted-foreground)" }}
                              >
                                <option value="">Selecione a categoria...</option>
                                {encaminhamentos.slice(1).map((o) => (
                                  <option key={o} value={o}>{o}</option>
                                ))}
                              </select>
                              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            </div>
                          </div>

                          {/* Descrição */}
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              Descrição da Ação <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              rows={4}
                              value={encForm.descricao}
                              onChange={(e) => setEncForm((f) => ({ ...f, descricao: e.target.value }))}
                              placeholder="Descreva a ação pedagógica proposta, os objetivos esperados e o prazo sugerido..."
                              className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground leading-relaxed transition-all"
                            />
                          </div>

                          {/* Servidor */}
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              Servidor Responsável
                              <span className="font-normal text-muted-foreground ml-1">(vinculado ao perfil SIAPE)</span>
                            </label>
                            <div className="relative">
                              <UserCheck size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <select
                                value={encForm.servidor}
                                onChange={(e) => setEncForm((f) => ({ ...f, servidor: e.target.value }))}
                                className="w-full appearance-none text-sm pl-9 pr-8 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                                style={{ color: encForm.servidor ? "var(--foreground)" : "var(--muted-foreground)" }}
                              >
                                <option value="">Selecione o servidor...</option>
                                {servidores.slice(1).map((o) => (
                                  <option key={o} value={o}>{o}</option>
                                ))}
                              </select>
                              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* Modal footer */}
                        <div className="px-5 py-3.5 border-t border-border bg-[#f7f8fa] flex gap-2 justify-end">
                          <button
                            onClick={() => setEncModalOpen(false)}
                            className="px-4 py-2 text-sm font-semibold rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            disabled={!encForm.categoria || !encForm.descricao}
                            onClick={() => {
                              const novo = { id: encNextId.current++, ...encForm };
                              setEncAtivos((prev) => ({
                                ...prev,
                                [current.matricula]: [...(prev[current.matricula] ?? []), novo],
                              }));
                              setEncModalOpen(false);
                            }}
                            className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ background: "var(--primary)" }}
                          >
                            Salvar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      {currentEval.saved ? "Parecer registrado com sucesso." : "Preencha os campos e salve o parecer."}
                    </p>
                    <div className="flex gap-2">
                      {currentEval.saved && (
                        <button
                          onClick={() => {
                            const allAlunos = [...alunos, ...alunosTurmaB];
                            const idx = allAlunos.findIndex((a) => a.matricula === current.matricula);
                            if (idx < allAlunos.length - 1) setSelectedAluno(allAlunos[idx + 1].matricula);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-border text-foreground hover:bg-muted transition-colors"
                        >
                          Próximo aluno <ChevronRight size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => saveEval(current.matricula)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "var(--primary)" }}
                      >
                        <Save size={13} />
                        Salvar Parecer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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

      {/* ── Modal: Detalhes do Encaminhamento ──────────────────────────────── */}
      {selectedEnc && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center"
          onClick={closeEncDetail}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl w-full max-w-xl mx-4 flex flex-col overflow-hidden"
            style={{ maxHeight: "88vh" }}
            onClick={(ev) => ev.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 shrink-0" style={{ background: "var(--primary)" }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-white/60 mb-0.5">
                    Encaminhamento #{selectedEnc.id} · {selectedEnc.turma}
                  </p>
                  <h2 className="text-sm font-bold text-white">
                    Histórico de Evolução — {selectedEnc.aluno}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: (encCategoriaCores[selectedEnc.categoria] ?? { bg: "#f8fafc" }).bg,
                        color: (encCategoriaCores[selectedEnc.categoria] ?? { text: "#475569" }).text,
                      }}
                    >
                      {selectedEnc.categoria}
                    </span>
                    {selectedEnc.servidor && (
                      <span className="text-xs text-white/60 flex items-center gap-1">
                        <UserCheck size={10} /> {selectedEnc.servidor}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={closeEncDetail} className="text-white/60 hover:text-white transition-colors shrink-0 mt-0.5">
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
                <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-5">
                  {(encEvolucoes[selectedEnc.id] ?? []).map((ev, i) => {
                    const tcfg = encTipoConf[ev.tipo];
                    return (
                      <div key={i} className="flex gap-4 relative">
                        <div className={`w-6 h-6 rounded-full ${tcfg.dot} flex items-center justify-center shrink-0 z-10 ring-2 ring-card`}>
                          {ev.tipo === "criacao"   && <Sparkles      size={10} color="white" />}
                          {ev.tipo === "triagem"   && <GraduationCap size={10} color="white" />}
                          {ev.tipo === "relato"    && <MessageSquare size={10} color="white" />}
                          {ev.tipo === "conclusao" && <CheckCircle2  size={10} color="white" />}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-bold text-foreground">{ev.data}</span>
                            <span className="text-xs font-semibold px-1.5 py-0 rounded" style={{ color: tcfg.color, background: "#f0f4f8" }}>
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

              {/* Add relato */}
              {selectedEnc.status !== "finalizado" && (
                <div className="mt-6 pt-5 border-t border-border space-y-3">
                  <label className="block text-xs font-semibold text-foreground">
                    Adicionar Novo Relato de Evolução / Acompanhamento
                  </label>
                  <textarea
                    rows={4}
                    value={encNovoRelato}
                    onChange={(ev) => { setEncNovoRelato(ev.target.value); setEncSavedRelato(false); }}
                    placeholder="Descreva o progresso, intervenções realizadas, contatos estabelecidos ou observações relevantes..."
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground leading-relaxed transition-all"
                  />
                  {encSavedRelato && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--primary)" }}>
                      <CheckCircle2 size={13} /> Relato registrado com sucesso.
                    </div>
                  )}
                </div>
              )}

              {/* Parecer de desfecho */}
              {encFinalizando && (
                <div className="mt-4 rounded-xl border border-amber-300 overflow-hidden">
                  <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
                    <Lock size={12} className="text-amber-600" />
                    <span className="text-xs font-bold text-amber-800">Parecer de Desfecho Obrigatório</span>
                  </div>
                  <div className="p-3 bg-amber-50/50">
                    <textarea
                      rows={4}
                      value={encParecerFinal}
                      onChange={(ev) => setEncParecerFinal(ev.target.value)}
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

            {/* Footer — active */}
            {selectedEnc.status !== "finalizado" && (
              <div className="px-6 py-4 border-t border-border bg-[#f7f8fa] flex items-center gap-2 shrink-0">
                <button
                  onClick={saveEncRelato}
                  disabled={!encNovoRelato.trim()}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                  style={{ background: "var(--primary)" }}
                >
                  <Send size={13} /> Salvar Nova Evolução
                </button>
                {!encFinalizando ? (
                  <button
                    onClick={() => setEncFinalizando(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-lg border border-amber-400 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors ml-auto"
                  >
                    <CheckCircle2 size={13} /> Finalizar Encaminhamento
                  </button>
                ) : (
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => setEncFinalizando(false)}
                      className="px-3 py-2.5 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={finalizarEncDetail}
                      disabled={!encParecerFinal.trim()}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 size={13} /> Confirmar Conclusão
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Footer — concluido */}
            {selectedEnc.status === "finalizado" && (
              <div className="px-6 py-4 border-t border-border bg-emerald-50 shrink-0">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-800 mb-1">Encaminhamento Concluído</p>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      {(encEvolucoes[selectedEnc.id] ?? []).find((ev) => ev.tipo === "conclusao")?.texto ?? "Encaminhamento finalizado."}
                    </p>
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

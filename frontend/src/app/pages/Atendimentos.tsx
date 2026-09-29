import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  X,
  ChevronDown,
  ExternalLink,
  User,
  Calendar,
  FileText,
  AlertCircle,
  Clock,
  Filter,
  Lock,
  CheckCircle,
  HeartHandshake,
  Brain,
  Home,
  Zap,
  BookOpen,
} from "lucide-react";

const motivoIcons: Record<string, React.ElementType> = {
  "Dificuldade de Aprendizagem": BookOpen,
  "Questões Emocionais": Brain,
  "Indisciplina": Zap,
  "Fatores Familiares": Home,
  "Outro": HeartHandshake,
};

const motivoColors: Record<string, { bg: string; text: string; border: string }> = {
  "Dificuldade de Aprendizagem": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "Questões Emocionais": { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
  "Indisciplina": { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  "Fatores Familiares": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  "Outro": { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" },
};

const atendimentos = [
  {
    id: 1,
    data: "25/06/2026",
    hora: "14h30",
    aluno: "João Silva",
    matricula: "202110806528",
    turma: "TDS - 2ª Fase",
    servidor: "Ana Costa",
    cargo: "Pedagoga",
    motivo: "Dificuldade de Aprendizagem",
    contato: "Encaminhado pelo Conselho de Classe",
    relato: "Aluno apresenta dificuldades persistentes em Algoritmos e Programação. Relata desmotivação e dificuldade de concentração durante as aulas. Foi orientado sobre estratégias de estudo e encaminhado para monitoria. Próximo retorno agendado para 09/07/2026.",
  },
  {
    id: 2,
    data: "24/06/2026",
    hora: "10h00",
    aluno: "Maria Oliveira",
    matricula: "202210809911",
    turma: "TDS - 1ª Fase",
    servidor: "Carlos Lima",
    cargo: "Psicólogo",
    motivo: "Questões Emocionais",
    contato: "Busca Ativa pelo NAE",
    relato: "Aluna apresenta sinais de ansiedade relacionados ao desempenho acadêmico e pressão familiar. Sessão de escuta ativa realizada. Foram trabalhadas técnicas de manejo de ansiedade. Encaminhamento para acompanhamento psicológico contínuo recomendado.",
  },
  {
    id: 3,
    data: "23/06/2026",
    hora: "09h15",
    aluno: "Carlos Souza",
    matricula: "202310804422",
    turma: "Mecatrônica - 4ª Fase",
    servidor: "Ana Costa",
    cargo: "Pedagoga",
    motivo: "Fatores Familiares",
    contato: "Demanda Espontânea",
    relato: "Aluno relatou situação de instabilidade financeira familiar afetando sua permanência no curso. Encaminhado ao Serviço de Assistência Estudantil para análise de benefícios disponíveis. Acompanhamento pedagógico mantido.",
  },
  {
    id: 4,
    data: "20/06/2026",
    hora: "11h45",
    aluno: "Lucas Mendes",
    matricula: "202210812788",
    turma: "Mecatrônica - 2ª Fase",
    servidor: "Rafael Souza",
    cargo: "Assistente Social",
    motivo: "Indisciplina",
    contato: "Encaminhado pela Coordenação",
    relato: "Registro de ocorrência de comportamento inadequado em sala de aula. Aluno ouvido individualmente. Mediação com professor responsável realizada. Termo de compromisso firmado. Monitoramento previsto pelas próximas 4 semanas.",
  },
  {
    id: 5,
    data: "18/06/2026",
    hora: "16h00",
    aluno: "Fernanda Costa",
    matricula: "202310807654",
    turma: "Administração - 1ª Fase",
    servidor: "Carlos Lima",
    cargo: "Psicólogo",
    motivo: "Questões Emocionais",
    contato: "Indicação por Professor",
    relato: "Aluna em luto por perda familiar recente. Atendimento de acolhimento realizado. Flexibilização de prazos solicitada junto à Coordenação Pedagógica. Retorno agendado para avaliar evolução.",
  },
];

const alunosSugestoes = [
  { matricula: "202110806528", nome: "João Silva", turma: "TDS - 2ª Fase" },
  { matricula: "202210809911", nome: "Maria Oliveira", turma: "TDS - 1ª Fase" },
  { matricula: "202310804422", nome: "Carlos Souza", turma: "Mecatrônica - 4ª Fase" },
  { matricula: "202110801345", nome: "Ana Beatriz Ferreira", turma: "TDS - 3ª Fase" },
  { matricula: "202210812788", nome: "Lucas Mendes", turma: "Mecatrônica - 2ª Fase" },
  { matricula: "202310807654", nome: "Fernanda Costa", turma: "Administração - 1ª Fase" },
];

const motivoOptions = [
  "Dificuldade de Aprendizagem",
  "Questões Emocionais",
  "Indisciplina",
  "Fatores Familiares",
  "Outro",
];

const contatoOptions = [
  "Encaminhado pelo Conselho de Classe",
  "Encaminhado pelo Professor",
  "Busca Ativa pelo NAE",
  "Demanda Espontânea",
  "Encaminhado pela Coordenação",
  "Encaminhado pela Direção",
];

const servidoresOptions = [
  "Ana Costa (Pedagoga)",
  "Carlos Lima (Psicólogo)",
  "Rafael Souza (Assistente Social)",
  "Juliana Neves (Orientadora Educacional)",
];

interface ViewModal {
  atendimento: (typeof atendimentos)[number] | null;
}

export interface InitialStudent {
  matricula: string;
  nome: string;
  turma: string;
}

interface Props {
  initialStudent?: InitialStudent | null;
  onClearInitialStudent?: () => void;
}

export default function Atendimentos({ initialStudent, onClearInitialStudent }: Props) {
  const [search, setSearch] = useState("");
  const [filterMotivo, setFilterMotivo] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewModal, setViewModal] = useState<ViewModal>({ atendimento: null });

  // Form state
  const [fAlunoBusca, setFAlunoBusca] = useState("");
  const [fAlunoSelecionado, setFAlunoSelecionado] = useState<(typeof alunosSugestoes)[number] | null>(null);
  const [fData, setFData] = useState("2026-06-25");
  const [fMotivo, setFMotivo] = useState("");
  const [fContato, setFContato] = useState("");
  const [fRelato, setFRelato] = useState("");
  const [fServidor, setFServidor] = useState("");
  const [fSaved, setFSaved] = useState(false);
  const [showSugestoes, setShowSugestoes] = useState(false);

  // Open drawer pre-filled when coming from Dashboard "Iniciar Atendimento"
  useEffect(() => {
    if (!initialStudent) return;
    setFAlunoSelecionado({
      matricula: initialStudent.matricula,
      nome: initialStudent.nome,
      turma: initialStudent.turma,
    });
    setFContato("Encaminhado pelo Conselho de Classe");
    setFMotivo("Dificuldade de Aprendizagem");
    setFRelato("");
    setFServidor("");
    setFSaved(false);
    setDrawerOpen(true);
    onClearInitialStudent?.();
  }, [initialStudent]); // eslint-disable-line react-hooks/exhaustive-deps

  const sugestoesFiltradas = alunosSugestoes.filter(
    (a) =>
      fAlunoBusca.length > 0 &&
      (a.nome.toLowerCase().includes(fAlunoBusca.toLowerCase()) ||
        a.matricula.includes(fAlunoBusca))
  );

  const filtered = atendimentos.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search || a.aluno.toLowerCase().includes(q) || a.matricula.includes(q);
    const matchMotivo = !filterMotivo || a.motivo === filterMotivo;
    return matchSearch && matchMotivo;
  });

  const resetForm = () => {
    setFAlunoBusca("");
    setFAlunoSelecionado(null);
    setFData("2026-06-25");
    setFMotivo("");
    setFContato("");
    setFRelato("");
    setFServidor("");
    setFSaved(false);
  };

  const handleSave = () => {
    if (!fAlunoSelecionado || !fMotivo || !fRelato) return;
    setFSaved(true);
    setTimeout(() => {
      setDrawerOpen(false);
      resetForm();
    }, 1800);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">

      {/* Module Header */}
      <div className="bg-card border-b border-border px-6 py-4 shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HeartHandshake size={16} style={{ color: "var(--primary)" }} />
              <h1 className="text-base font-bold text-foreground">
                Atendimentos e Acompanhamento Individual (NAE)
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Registro de intervenções pedagógicas, psicológicas e sociais
            </p>
          </div>
          <button
            onClick={() => { setDrawerOpen(true); setFSaved(false); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 shrink-0"
            style={{ background: "var(--primary)" }}
          >
            <Plus size={15} />
            Registrar Novo Atendimento
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-card border-b border-border px-6 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar aluno atendido por nome ou matrícula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter size={13} className="text-muted-foreground" />
            <div className="relative">
              <select
                value={filterMotivo}
                onChange={(e) => setFilterMotivo(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all min-w-[220px]"
                style={{ color: filterMotivo ? "var(--foreground)" : "var(--muted-foreground)" }}
              >
                <option value="">Motivo do Atendimento</option>
                {motivoOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            {filterMotivo && (
              <button
                onClick={() => setFilterMotivo("")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <X size={11} /> Limpar
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
              {(search || filterMotivo) ? " encontrados" : " recentes"}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-6 my-5 bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f7f8fa] border-b border-border">
                  {["Data / Hora", "Aluno", "Turma", "Servidor Responsável", "Motivo Principal", "Ações"].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={20} className="text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">Nenhum atendimento encontrado.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((a, i) => {
                    const MotivoIcon = motivoIcons[a.motivo] ?? HeartHandshake;
                    const colors = motivoColors[a.motivo] ?? motivoColors["Outro"];
                    return (
                      <tr
                        key={a.id}
                        className="border-b border-border last:border-0 hover:bg-[#f7f8fa] transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">{a.data}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock size={10} />{a.hora}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{ background: "var(--secondary)", color: "var(--primary)" }}
                            >
                              {a.aluno.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{a.aluno}</p>
                              <p className="text-xs text-muted-foreground" style={{ fontFamily: "monospace", fontSize: "11px" }}>
                                {a.matricula}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-[#f0f2f5] text-foreground px-2 py-1 rounded-md font-medium whitespace-nowrap">
                            {a.turma}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                            >
                              {a.servidor.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground whitespace-nowrap">{a.servidor}</p>
                              <p className="text-xs text-muted-foreground">{a.cargo}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap"
                            style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
                          >
                            <MotivoIcon size={11} />
                            {a.motivo}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setViewModal({ atendimento: a })}
                            className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:underline"
                            style={{ color: "var(--primary)" }}
                          >
                            Ver Relato Completo
                            <ExternalLink size={11} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-4 py-3 bg-[#f7f8fa] border-t border-border">
              <p className="text-xs text-muted-foreground">
                Exibindo {filtered.length} de {atendimentos.length} registros — período 2026.1
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Overlay backdrop */}
      {drawerOpen && (
        <div
          className="absolute inset-0 z-30 bg-black/30 backdrop-blur-[1px]"
          onClick={() => { setDrawerOpen(false); resetForm(); }}
        />
      )}

      {/* Slide-in Drawer */}
      <div
        className="absolute top-0 right-0 h-full z-40 flex flex-col bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-out"
        style={{
          width: "440px",
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Drawer Header */}
        <div
          className="px-5 py-4 border-b border-border flex items-start justify-between shrink-0"
          style={{ background: "var(--primary)" }}
        >
          <div>
            <p className="text-xs font-medium text-white/60 mb-0.5">NAE · Novo Registro</p>
            <h2 className="text-sm font-bold text-white">Registrar Novo Atendimento</h2>
            <p className="text-xs text-white/60 mt-0.5 flex items-center gap-1">
              <Lock size={10} />
              Sigiloso — restrito à equipe pedagógica
            </p>
          </div>
          <button
            onClick={() => { setDrawerOpen(false); resetForm(); }}
            className="text-white/60 hover:text-white transition-colors mt-0.5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

          {fSaved ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "var(--secondary)" }}
              >
                <CheckCircle size={28} style={{ color: "var(--primary)" }} />
              </div>
              <p className="text-sm font-bold text-foreground">Atendimento registrado!</p>
              <p className="text-xs text-muted-foreground">O registro foi salvo com sucesso no sistema.</p>
            </div>
          ) : (
            <>
              {/* Student search */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Discente Atendido <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Digite a matrícula ou nome do discente..."
                    value={fAlunoSelecionado ? `${fAlunoSelecionado.nome} (${fAlunoSelecionado.matricula})` : fAlunoBusca}
                    onChange={(e) => {
                      if (fAlunoSelecionado) {
                        setFAlunoSelecionado(null);
                      }
                      setFAlunoBusca(e.target.value);
                      setShowSugestoes(true);
                    }}
                    onFocus={() => setShowSugestoes(true)}
                    className="w-full pl-9 pr-8 py-2.5 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
                  />
                  {fAlunoSelecionado && (
                    <button
                      onClick={() => { setFAlunoSelecionado(null); setFAlunoBusca(""); }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={12} />
                    </button>
                  )}
                  {showSugestoes && sugestoesFiltradas.length > 0 && !fAlunoSelecionado && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                      {sugestoesFiltradas.map((s) => (
                        <button
                          key={s.matricula}
                          className="w-full text-left px-3 py-2.5 hover:bg-[#f7f8fa] transition-colors border-b border-border last:border-0"
                          onClick={() => { setFAlunoSelecionado(s); setFAlunoBusca(""); setShowSugestoes(false); }}
                        >
                          <p className="text-sm font-medium text-foreground">{s.nome}</p>
                          <p className="text-xs text-muted-foreground">{s.matricula} · {s.turma}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {fAlunoSelecionado && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs" style={{ color: "var(--primary)" }}>
                    <CheckCircle size={11} />
                    {fAlunoSelecionado.turma}
                  </div>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Data do Atendimento <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={fData}
                    onChange={(e) => setFData(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-foreground transition-all"
                  />
                </div>
              </div>

              {/* Servidor */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Servidor Responsável <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={fServidor}
                    onChange={(e) => setFServidor(e.target.value)}
                    className="w-full appearance-none pl-9 pr-8 py-2.5 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                    style={{ color: fServidor ? "var(--foreground)" : "var(--muted-foreground)" }}
                  >
                    <option value="">Selecione o servidor...</option>
                    {servidoresOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Motivo */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Motivo do Atendimento / Queixa Inicial <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <AlertCircle size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={fMotivo}
                    onChange={(e) => setFMotivo(e.target.value)}
                    className="w-full appearance-none pl-9 pr-8 py-2.5 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                    style={{ color: fMotivo ? "var(--foreground)" : "var(--muted-foreground)" }}
                  >
                    <option value="">Selecione o motivo...</option>
                    {motivoOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Contato */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Motivo do Contato
                </label>
                <div className="relative">
                  <FileText size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={fContato}
                    onChange={(e) => setFContato(e.target.value)}
                    className="w-full appearance-none pl-9 pr-8 py-2.5 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                    style={{ color: fContato ? "var(--foreground)" : "var(--muted-foreground)" }}
                  >
                    <option value="">Ex: Encaminhado pelo Conselho, Busca Ativa...</option>
                    {contatoOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Relato */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Lock size={11} className="text-muted-foreground" />
                  Relato Detalhado do Atendimento
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div
                  className="rounded-lg border overflow-hidden transition-all"
                  style={{
                    borderColor: fRelato ? "var(--primary)" : "var(--border)",
                    boxShadow: fRelato ? "0 0 0 2px rgba(21,98,47,0.08)" : undefined,
                  }}
                >
                  <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 flex items-center gap-1.5">
                    <Lock size={10} className="text-amber-600" />
                    <span className="text-xs text-amber-700 font-medium">
                      Sigiloso — Restrito à Equipe Pedagógica
                    </span>
                  </div>
                  <textarea
                    rows={7}
                    value={fRelato}
                    onChange={(e) => setFRelato(e.target.value)}
                    placeholder="Descreva detalhadamente o conteúdo do atendimento: contexto apresentado pelo aluno, intervenções realizadas, encaminhamentos sugeridos e próximos passos..."
                    className="w-full px-3 py-2.5 text-sm bg-[#f7f8fa] outline-none resize-none placeholder:text-muted-foreground leading-relaxed"
                  />
                  <div className="px-3 py-1.5 bg-[#f7f8fa] border-t border-border flex justify-end">
                    <span className="text-xs text-muted-foreground">{fRelato.length} caracteres</span>
                  </div>
                </div>
              </div>

              {/* Required hint */}
              {(!fAlunoSelecionado || !fMotivo || !fRelato) && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-red-500">*</span> Campos obrigatórios
                </p>
              )}
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {!fSaved && (
          <div className="px-5 py-4 border-t border-border bg-card flex gap-2 shrink-0">
            <button
              onClick={() => { setDrawerOpen(false); resetForm(); }}
              className="flex-1 py-2.5 text-sm font-semibold rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!fAlunoSelecionado || !fMotivo || !fRelato}
              className="flex-1 py-2.5 text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              style={{ background: "var(--primary)" }}
            >
              Salvar Registro
            </button>
          </div>
        )}
      </div>

      {/* View Relato Modal */}
      {viewModal.atendimento && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
          onClick={() => setViewModal({ atendimento: null })}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const a = viewModal.atendimento!;
              const MotivoIcon = motivoIcons[a.motivo] ?? HeartHandshake;
              const colors = motivoColors[a.motivo] ?? motivoColors["Outro"];
              return (
                <>
                  <div className="px-6 py-4 border-b border-border flex items-start justify-between" style={{ background: "var(--primary)" }}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border"
                          style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
                        >
                          <MotivoIcon size={10} />
                          {a.motivo}
                        </span>
                      </div>
                      <p className="text-base font-bold text-white">{a.aluno}</p>
                      <p className="text-xs text-white/60 mt-0.5" style={{ fontFamily: "monospace" }}>
                        {a.matricula} · {a.turma}
                      </p>
                    </div>
                    <button onClick={() => setViewModal({ atendimento: null })} className="text-white/60 hover:text-white transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="px-6 py-5 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Data", value: `${a.data} · ${a.hora}`, icon: Calendar },
                        { label: "Servidor", value: `${a.servidor}`, icon: User },
                        { label: "Contato", value: a.contato, icon: FileText },
                      ].map((m, i) => (
                        <div key={i} className="bg-[#f7f8fa] rounded-lg p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <m.icon size={11} className="text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{m.label}</p>
                          </div>
                          <p className="text-xs font-semibold text-foreground leading-snug">{m.value}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Lock size={11} className="text-amber-600" />
                        <p className="text-xs font-semibold text-foreground">Relato Detalhado</p>
                        <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-medium ml-auto">
                          Sigiloso
                        </span>
                      </div>
                      <div className="bg-[#f7f8fa] rounded-lg p-4 text-sm text-foreground leading-relaxed border border-border">
                        {a.relato}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 border-t border-border flex justify-end">
                    <button
                      onClick={() => setViewModal({ atendimento: null })}
                      className="px-4 py-2 text-sm font-semibold rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

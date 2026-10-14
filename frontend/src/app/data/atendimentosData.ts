import { useState, useEffect } from "react";
import { BookOpen, Brain, Zap, Home, HeartHandshake } from "lucide-react";
import type { AtendimentoItem, AlunoSugestao, InitialStudent, ViewModal } from "../types/atendimentos";

export interface AtendimentosDataProps {
  initialStudent?: InitialStudent | null;
  onClearInitialStudent?: () => void;
}

export const motivoIcons: Record<string, React.ElementType> = {
  "Dificuldade de Aprendizagem": BookOpen,
  "Questões Emocionais": Brain,
  Indisciplina: Zap,
  "Fatores Familiares": Home,
  Outro: HeartHandshake,
};

export const motivoColors: Record<string, { bg: string; text: string; border: string }> = {
  "Dificuldade de Aprendizagem": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "Questões Emocionais": { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
  Indisciplina: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  "Fatores Familiares": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  Outro: { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" },
};

export const atendimentos: AtendimentoItem[] = [
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
    relato:
      "Aluno apresenta dificuldades persistentes em Algoritmos e Programação. Relata desmotivação e dificuldade de concentração durante as aulas. Foi orientado sobre estratégias de estudo e encaminhado para monitoria. Próximo retorno agendado para 09/07/2026.",
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
    relato:
      "Aluna apresenta sinais de ansiedade relacionados ao desempenho acadêmico e pressão familiar. Sessão de escuta ativa realizada. Foram trabalhadas técnicas de manejo de ansiedade. Encaminhamento para acompanhamento psicológico contínuo recomendado.",
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
    relato:
      "Aluno relatou situação de instabilidade financeira familiar afetando sua permanência no curso. Encaminhado ao Serviço de Assistência Estudantil para análise de benefícios disponíveis. Acompanhamento pedagógico mantido.",
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
    relato:
      "Registro de ocorrência de comportamento inadequado em sala de aula. Aluno ouvido individualmente. Mediação com professor responsável realizada. Termo de compromisso firmado. Monitoramento previsto pelas próximas 4 semanas.",
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
    relato:
      "Aluna em luto por perda familiar recente. Atendimento de acolhimento realizado. Flexibilização de prazos solicitada junto à Coordenação Pedagógica. Retorno agendado para avaliar evolução.",
  },
];

export const alunosSugestoes: AlunoSugestao[] = [
  { matricula: "202110806528", nome: "João Silva", turma: "TDS - 2ª Fase" },
  { matricula: "202210809911", nome: "Maria Oliveira", turma: "TDS - 1ª Fase" },
  { matricula: "202310804422", nome: "Carlos Souza", turma: "Mecatrônica - 4ª Fase" },
  { matricula: "202110801345", nome: "Ana Beatriz Ferreira", turma: "TDS - 3ª Fase" },
  { matricula: "202210812788", nome: "Lucas Mendes", turma: "Mecatrônica - 2ª Fase" },
  { matricula: "202310807654", nome: "Fernanda Costa", turma: "Administração - 1ª Fase" },
];

export const motivoOptions = [
  "Dificuldade de Aprendizagem",
  "Questões Emocionais",
  "Indisciplina",
  "Fatores Familiares",
  "Outro",
];

export const contatoOptions = [
  "Encaminhado pelo Conselho de Classe",
  "Encaminhado pelo Professor",
  "Busca Ativa pelo NAE",
  "Demanda Espontânea",
  "Encaminhado pela Coordenação",
  "Encaminhado pela Direção",
];

export const servidoresOptions = [
  "Ana Costa (Pedagoga)",
  "Carlos Lima (Psicólogo)",
  "Rafael Souza (Assistente Social)",
  "Juliana Neves (Orientadora Educacional)",
];

export function atendimentosData({
  initialStudent,
  onClearInitialStudent,
}: AtendimentosDataProps) {
  const [atendimentosList, _setAtendimentosList] =
    useState<AtendimentoItem[]>(atendimentos);
  const [search, setSearch] = useState("");
  const [filterMotivo, setFilterMotivo] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewModal, setViewModal] = useState<ViewModal>({ atendimento: null });

  // Estados do formulário
  const [fAlunoBusca, setFAlunoBusca] = useState("");
  const [fAlunoSelecionado, setFAlunoSelecionado] = useState<AlunoSugestao | null>(null);
  const [fData, setFData] = useState("2026-06-25");
  const [fMotivo, setFMotivo] = useState("");
  const [fContato, setFContato] = useState("");
  const [fRelato, setFRelato] = useState("");
  const [fServidor, setFServidor] = useState("");
  const [fSaved, setFSaved] = useState(false);
  const [showSugestoes, setShowSugestoes] = useState(false);

  // Preenche e abre modal se vier do Dashboard ("Iniciar Atendimento")
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
  }, [initialStudent, onClearInitialStudent]);

  const sugestoesFiltradas = alunosSugestoes.filter(
    (a) =>
      fAlunoBusca.length > 0 &&
      (a.nome.toLowerCase().includes(fAlunoBusca.toLowerCase()) ||
        a.matricula.includes(fAlunoBusca))
  );

  const filtered = atendimentosList.filter((a) => {
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

  return {
    search,
    setSearch,
    filterMotivo,
    setFilterMotivo,
    drawerOpen,
    setDrawerOpen,
    viewModal,
    setViewModal,
    fAlunoBusca,
    setFAlunoBusca,
    fAlunoSelecionado,
    setFAlunoSelecionado,
    fData,
    setFData,
    fMotivo,
    setFMotivo,
    fContato,
    setFContato,
    fRelato,
    setFRelato,
    fServidor,
    setFServidor,
    fSaved,
    setFSaved,
    showSugestoes,
    setShowSugestoes,
    sugestoesFiltradas,
    filtered,
    totalAtendimentos: atendimentosList.length,
    resetForm,
    handleSave,
  };
}
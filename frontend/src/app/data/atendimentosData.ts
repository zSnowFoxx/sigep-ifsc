import { useState, useEffect, useCallback } from "react";
import { BookOpen, Brain, Zap, Home, HeartHandshake } from "lucide-react";
import type {
  AtendimentoItem,
  AlunoSugestao,
  InitialStudent,
  ServidorOpcao,
  ViewModal,
} from "../types/atendimentos";
import { carregarAtendimentos, criarAtendimento } from "../services/atendimentosService";

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

const pad = (n: number) => String(n).padStart(2, "0");
const hojeISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export function atendimentosData({
  initialStudent,
  onClearInitialStudent,
}: AtendimentosDataProps) {
  const [atendimentosList, setAtendimentosList] = useState<AtendimentoItem[]>([]);
  const [alunos, setAlunos] = useState<AlunoSugestao[]>([]);
  const [servidoresOptions, setServidoresOptions] = useState<ServidorOpcao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [search, setSearch] = useState("");
  const [filterMotivo, setFilterMotivo] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewModal, setViewModal] = useState<ViewModal>({ atendimento: null });

  // Estados do formulário
  const [fAlunoBusca, setFAlunoBusca] = useState("");
  const [fAlunoSelecionado, setFAlunoSelecionado] = useState<AlunoSugestao | null>(null);
  const [fData, setFData] = useState(hojeISO);
  const [fMotivo, setFMotivo] = useState("");
  const [fContato, setFContato] = useState("");
  const [fRelato, setFRelato] = useState("");
  const [fServidor, setFServidor] = useState("");
  const [fSaved, setFSaved] = useState(false);
  const [showSugestoes, setShowSugestoes] = useState(false);

  const load = useCallback(async () => {
    try {
      const dados = await carregarAtendimentos();
      setAtendimentosList(dados.atendimentos);
      setAlunos(dados.alunos);
      setServidoresOptions(dados.servidores);
      setErro("");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar os atendimentos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Preenche e abre modal se vier do Dashboard ("Iniciar Atendimento"), depois que a lista de alunos carregou.
  useEffect(() => {
    if (!initialStudent || loading) return;
    const aluno = alunos.find((a) => a.matricula === initialStudent.matricula);
    if (aluno) {
      setFAlunoSelecionado(aluno);
    } else {
      setErro(`Aluno ${initialStudent.nome} não encontrado no sistema.`);
    }
    setFContato("Encaminhado pelo Conselho de Classe");
    setFMotivo("Dificuldade de Aprendizagem");
    setFRelato("");
    setFServidor("");
    setFSaved(false);
    setDrawerOpen(true);
    onClearInitialStudent?.();
  }, [initialStudent, loading, alunos, onClearInitialStudent]);

  const sugestoesFiltradas = alunos.filter(
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
    setFData(hojeISO());
    setFMotivo("");
    setFContato("");
    setFRelato("");
    setFServidor("");
    setFSaved(false);
  };

  const handleSave = async () => {
    if (!fAlunoSelecionado || !fMotivo || !fRelato || salvando) return;
    setSalvando(true);
    try {
      await criarAtendimento({
        alunoId: fAlunoSelecionado.id,
        servidorId: fServidor ? Number(fServidor) : null,
        data: fData,
        motivo: fMotivo,
        contato: fContato,
        relato: fRelato,
      });
      setErro("");
      setFSaved(true);
      await load();
      setTimeout(() => {
        setDrawerOpen(false);
        resetForm();
      }, 1800);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar o atendimento.");
    } finally {
      setSalvando(false);
    }
  };

  return {
    loading,
    erro,
    setErro,
    salvando,
    servidoresOptions,
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

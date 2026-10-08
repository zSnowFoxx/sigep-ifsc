import { useEffect, useRef, useState } from "react";
import { Users, ClipboardList, GraduationCap, FileText } from "lucide-react";

import type {
  AlunoEval,
  EncItemData,
  GravidadeDemanda,
  Professor,
  RegistroDocente,
  TabDef,
  TabId,
  TurmaForm,
} from "../types/conselho";
import {
  adicionarAcompanhamento,
  carregarConselho,
  conselhosService,
  criarEncaminhamento,
  criarEncaminhamentoNovo,
  criarRegistro,
  finalizarEncaminhamento,
  salvarDeliberacao,
  salvarDemanda,
  salvarPresencas,
  toTurmaForm,
  turmaFormVazio,
  type DadosConselho,
} from "../services/conselhoService";

interface ConselhoDataProps {
  conselhoId: number;
  mode?: "intermediario" | "final";
  onBack?: () => void;
}

export const PONTOS_PRESET = [
  "Facilidade de aprendizagem",
  "Boa didática dos professores",
  "Bom relacionamento entre os alunos",
  "Alta participação nas aulas",
  "Progressos visíveis no período",
  "Boa infraestrutura da sala",
] as const;

export const DIFIC_PRESET = [
  "Baixa participação nas aulas",
  "Conteúdo muito difícil",
  "Falta de material didático",
  "Alta taxa de faltas",
  "Dificuldades socioeconômicas",
  "Problemas de relacionamento entre alunos",
  "Dificuldades com atividades avaliativas",
] as const;

export const CATEGORIAS_REGISTRO = [
  "Dificuldade de aprendizagem",
  "Baixa frequência",
  "Comportamento em sala",
  "Questões socioeconômicas",
  "Saúde / Bem-estar",
  "Relacionamento interpessoal",
  "Desempenho acadêmico",
  "Outros",
] as const;

export const etapaColors: Record<
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

export function conselhoData({ conselhoId, mode = "final", onBack }: ConselhoDataProps) {
  const isInter = mode === "intermediario";
  const [activeTab, setActiveTab] = useState<TabId>(isInter ? 2 : 4);

  const [dados, setDados] = useState<DadosConselho | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Tab 1 — Participantes
  const [participantes, setParticipantes] = useState<Professor[]>([]);

  // Tab 2 — Demandas Gerais
  const [turmaForms, setTurmaForms] = useState<TurmaForm[]>([]);
  const [turmasComDemanda, setTurmasComDemanda] = useState<Set<number>>(new Set());
  const [activeTurmaIdx, setActiveTurmaIdx] = useState(0);
  const [editFields, setEditFields] = useState<Set<string>>(new Set());
  const demandaIdRef = useRef(-1);

  // Tab 4 — Avaliação
  const [openTurmas, setOpenTurmas] = useState<Record<number, boolean>>({});
  const [selectedAluno, setSelectedAluno] = useState("");
  const [avaliacoes, setAvaliacoes] = useState<Record<string, AlunoEval>>({});
  const [deliberacaoIds, setDeliberacaoIds] = useState<Record<string, number>>({});
  const [selectedDisc, setSelectedDisc] = useState<Record<string, number>>({});
  const [retificadas, setRetificadas] = useState<Record<string, string>>({});
  const [abonomat, setAbonomat] = useState<string | null>(null);
  const [abonoText, setAbonoText] = useState("");

  // Tab 3 — Registros e Encaminhamentos
  const [registros, setRegistros] = useState<RegistroDocente[]>([]);
  const [encList, setEncList] = useState<EncItemData[]>([]);
  const [novoRegOpen, setNovoRegOpen] = useState(false);
  const [nrMatricula, setNrMatricula] = useState("");
  const [nrDocenteId, setNrDocenteId] = useState<number | null>(null);
  const [nrTitulo, setNrTitulo] = useState("");
  const [nrCategoria, setNrCategoria] = useState("");
  const [nrDescricao, setNrDescricao] = useState("");
  const [nrEncOpcao, setNrEncOpcao] = useState<"novo" | "existente" | null>(null);
  const [nrEncId, setNrEncId] = useState<number | null>(null);
  const [novoEncOpen, setNovoEncOpen] = useState(false);
  const [neMatricula, setNeMatricula] = useState("");
  const [neTitulo, setNeTitulo] = useState("");
  const [neCategoria, setNeCategoria] = useState("");
  const [neDescricao, setNeDescricao] = useState("");
  const [neServidorId, setNeServidorId] = useState("");

  // Enc detail modal state
  const [selectedEnc, setSelectedEnc] = useState<EncItemData | null>(null);
  const [encNovoRelato, setEncNovoRelato] = useState("");
  const [encSavedRelato, setEncSavedRelato] = useState(false);
  const [encFinalizando, setEncFinalizando] = useState(false);
  const [encParecerFinal, setEncParecerFinal] = useState("");

  useEffect(() => {
    let ativo = true;
    carregarConselho(conselhoId)
      .then((d) => {
        if (!ativo) return;
        const deliberacaoPorAluno = new Map(d.deliberacoes.map((x) => [x.aluno_id, x]));
        setDados(d);
        setParticipantes(d.participantes);
        setTurmaForms(d.turmas.map((t) => toTurmaForm(d.demandas.find((x) => x.turma_id === t.id), t.alunosList)));
        setTurmasComDemanda(new Set(d.demandas.map((x) => x.turma_id)));
        setOpenTurmas(d.turmas[0] ? { [d.turmas[0].id]: true } : {});
        setSelectedAluno((d.turmas[0]?.alunosList[0] ?? d.alunos[0])?.matricula ?? "");
        setAvaliacoes(
          Object.fromEntries(
            d.alunos.map((a) => {
              const deliberacao = deliberacaoPorAluno.get(a.id);
              return [
                a.matricula,
                { risco: a.risco ?? false, obs: deliberacao?.alteracoes_realizadas ?? "", encaminhamento: "", acao: "", servidor: "", saved: !!deliberacao },
              ];
            })
          )
        );
        setDeliberacaoIds(
          Object.fromEntries(d.alunos.flatMap((a) => {
            const deliberacao = deliberacaoPorAluno.get(a.id);
            return deliberacao ? [[a.matricula, deliberacao.id]] : [];
          }))
        );
        setRegistros(d.registros);
        setEncList(d.encaminhamentos);
        setNrDocenteId(d.usuarioLogadoId);
      })
      .catch((err) => ativo && setErro(err instanceof Error ? err.message : "Erro ao carregar o conselho."))
      .finally(() => ativo && setLoading(false));
    return () => {
      ativo = false;
    };
  }, [conselhoId]);

  // Executa uma gravação mostrando o estado de "salvando" e a mensagem de erro
  const executar = async (acao: () => Promise<void>) => {
    setSalvando(true);
    setErro("");
    try {
      await acao();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  };

  const recarregarListas = async () => {
    const d = await carregarConselho(conselhoId);
    setRegistros(d.registros);
    setEncList(d.encaminhamentos);
    setSelectedEnc((prev) => (prev ? d.encaminhamentos.find((e) => e.id === prev.id) ?? prev : null));
  };

  const alunoPorMatricula = (matricula: string) => dados?.alunos.find((a) => a.matricula === matricula);

  // ── Tab 1 Helpers ──
  const togglePresenca = (index: number) => {
    const anteriores = participantes;
    const novos = participantes.map((p, i) => (i === index ? { ...p, presente: !p.presente } : p));
    setParticipantes(novos);
    salvarPresencas(conselhoId, novos).catch((err) => {
      setParticipantes(anteriores);
      setErro(err instanceof Error ? err.message : "Erro ao salvar a presença.");
    });
  };

  // ── Tab 2 Helpers ──
  const updateForm = (patch: Partial<TurmaForm>) =>
    setTurmaForms((prev) => prev.map((f, i) => (i === activeTurmaIdx ? { ...f, ...patch } : f)));

  const togglePonto = (item: string) => {
    const cur = turmaForms[activeTurmaIdx].pontosPositivos;
    updateForm({ pontosPositivos: cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item] });
  };

  const toggleDific = (item: string) => {
    const cur = turmaForms[activeTurmaIdx].dificuldades;
    updateForm({ dificuldades: cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item] });
  };

  const addDemanda = (situacao: string, gravidade: GravidadeDemanda) => {
    if (!situacao.trim()) return;
    updateForm({
      demandas: [...turmaForms[activeTurmaIdx].demandas, { id: demandaIdRef.current--, situacao: situacao.trim(), gravidade }],
    });
  };

  const removeDemanda = (id: number) =>
    updateForm({ demandas: turmaForms[activeTurmaIdx].demandas.filter((d) => d.id !== id) });

  const toggleEditField = (field: string) =>
    setEditFields((prev) => { const n = new Set(prev); if (n.has(field)) n.delete(field); else n.add(field); return n; });

  const salvarDemandas = async (indices: number[]) => {
    if (!dados) return;
    for (const i of indices) {
      const turma = dados.turmas[i];
      const existe = turmasComDemanda.has(turma.id);
      if (!existe && turmaFormVazio(turmaForms[i])) continue;
      const salva = await salvarDemanda(conselhoId, turma, turmaForms[i], existe);
      setTurmasComDemanda((prev) => new Set(prev).add(turma.id));
      setTurmaForms((prev) => prev.map((f, j) => (j === i ? toTurmaForm(salva, turma.alunosList) : f)));
    }
  };

  const salvarEVoltar = () =>
    executar(async () => {
      if (!dados) return;
      await salvarDemandas(dados.turmas.map((_, i) => i));
      onBack?.();
    });

  const encerrar = () => {
    if (!window.confirm("Encerrar este conselho? Ele passará para o histórico de realizados.")) return;
    executar(async () => {
      if (!dados) return;
      await salvarDemandas(dados.turmas.map((_, i) => i));
      await conselhosService.update(conselhoId, { status: "encerrado" });
      onBack?.();
    });
  };

  // ── Tab 3 Helpers ──
  const resetNovoRegistro = () => {
    setNrMatricula("");
    setNrDocenteId(dados?.usuarioLogadoId ?? null);
    setNrTitulo("");
    setNrCategoria("");
    setNrDescricao("");
    setNrEncOpcao(null);
    setNrEncId(null);
    setNovoRegOpen(false);
  };

  const submitNovoRegistro = () => {
    const aluno = alunoPorMatricula(nrMatricula);
    if (!aluno || nrDocenteId === null || !nrTitulo.trim() || !nrCategoria || !nrDescricao.trim()) return;
    executar(async () => {
      let encaminhamentoId = nrEncOpcao === "existente" ? nrEncId : null;
      if (nrEncOpcao === "novo") {
        encaminhamentoId = await criarEncaminhamento({
          conselhoId,
          alunoId: aluno.id,
          titulo: `Encaminhamento — ${aluno.nome}`,
          categoria: nrCategoria,
          servidorResponsavelId: null,
          descricao: nrDescricao,
          autorId: dados?.usuarioLogadoId ?? 0,
        });
      }
      await criarRegistro(conselhoId, {
        alunoId: aluno.id,
        docenteId: nrDocenteId,
        titulo: nrTitulo.trim(),
        categoria: nrCategoria,
        registro: nrDescricao.trim(),
        encaminhamentoId,
      });
      await recarregarListas();
      resetNovoRegistro();
    });
  };

  const submitNovoEnc = () => {
    const aluno = alunoPorMatricula(neMatricula);
    if (!aluno || !neTitulo.trim() || !neCategoria) return;
    executar(async () => {
      await criarEncaminhamento({
        conselhoId,
        alunoId: aluno.id,
        titulo: neTitulo.trim(),
        categoria: neCategoria,
        servidorResponsavelId: neServidorId ? Number(neServidorId) : null,
        descricao: neDescricao,
        autorId: dados?.usuarioLogadoId ?? 0,
      });
      await recarregarListas();
      setNeMatricula(""); setNeTitulo(""); setNeCategoria(""); setNeDescricao(""); setNeServidorId(""); setNovoEncOpen(false);
    });
  };

  const submitNovoEncaminhamento = () => {
    const aluno = alunoPorMatricula(neMatricula);
    if (!aluno || !neTitulo.trim() || !neCategoria) return;
    executar(async () => {
      await criarEncaminhamentoNovo({
        alunoId: aluno.id,
        titulo: neTitulo.trim(),
        categoria: neCategoria,
        servidorResponsavelId: neServidorId ? Number(neServidorId) : null,
        descricao: neDescricao,
        autorId: dados?.usuarioLogadoId ?? 0,
      });
      setNeMatricula(""); setNeTitulo(""); setNeCategoria(""); setNeDescricao(""); setNeServidorId(""); setNovoEncOpen(false);
    });
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
    executar(async () => {
      await adicionarAcompanhamento(selectedEnc.id, dados?.usuarioLogadoId ?? 0, "relato", encNovoRelato.trim());
      await recarregarListas();
      setEncNovoRelato("");
      setEncSavedRelato(true);
    });
  };

  const finalizarEncDetail = () => {
    if (!selectedEnc || !encParecerFinal.trim()) return;
    executar(async () => {
      await finalizarEncaminhamento(selectedEnc.id, dados?.usuarioLogadoId ?? 0, encParecerFinal.trim());
      await recarregarListas();
      setEncFinalizando(false);
      setEncParecerFinal("");
    });
  };

  // ── Tab 4 Helpers ──
  const updateEval = (mat: string, field: keyof AlunoEval, value: string | boolean) => {
    setAvaliacoes((prev) => ({ ...prev, [mat]: { ...prev[mat], [field]: value, saved: false } }));
  };

  const saveEval = (mat: string) => {
    const aluno = alunoPorMatricula(mat);
    const texto = avaliacoes[mat]?.obs.trim();
    if (!aluno) return;
    if (!texto) {
      setErro("Escreva o parecer do colegiado antes de salvar.");
      return;
    }
    executar(async () => {
      const salva = await salvarDeliberacao(conselhoId, aluno.id, texto, deliberacaoIds[mat]);
      setDeliberacaoIds((prev) => ({ ...prev, [mat]: salva.id }));
      setAvaliacoes((prev) => ({ ...prev, [mat]: { ...prev[mat], saved: true } }));
    });
  };

  // Valores Computados
  const form = turmaForms[activeTurmaIdx];
  const currentTurmaD = dados?.turmas[activeTurmaIdx];
  const allPontos = form ? [...PONTOS_PRESET, ...form.customPontos] : [];
  const allDific = form ? [...DIFIC_PRESET, ...form.customDificuldades] : [];
  const tab2HasContent = turmaForms.some((f) => f.sintese || f.representantes || f.demandas.length > 0 || f.pontosPositivos.length > 0);
  const totalAlunos = dados?.alunos.length ?? 0;
  const savedCount = Object.values(avaliacoes).filter((e) => e.saved).length;
  const presentCount = participantes.filter((p) => p.presente).length;

  const visibleTabs: TabDef[] = isInter
    ? [
        { id: 2, label: "Demandas Gerais", icon: ClipboardList, short: "Demandas", displayNum: 1 },
        { id: 3, label: "Registros e Encaminhamentos", icon: FileText, short: "Registros", displayNum: 2 },
      ]
    : [
        { id: 1, label: "Participantes do Conselho", icon: Users, short: "Participantes", displayNum: 1 },
        { id: 2, label: "Demandas Gerais", icon: ClipboardList, short: "Demandas", displayNum: 2 },
        { id: 3, label: "Registros e Encaminhamentos", icon: FileText, short: "Registros", displayNum: 3 },
        { id: 4, label: "Avaliação Discente", icon: GraduationCap, short: "Avaliação", displayNum: 4 },
      ];

  return {
    // Estados base
    isInter,
    activeTab,
    setActiveTab,
    dados,
    loading,
    erro,
    setErro,
    salvando,
    executar,

    // Tab 1
    participantes,
    togglePresenca,

    // Tab 2
    turmaForms,
    activeTurmaIdx,
    setActiveTurmaIdx,
    editFields,
    toggleEditField,
    form,
    currentTurmaD,
    allPontos,
    togglePonto,
    allDific,
    toggleDific,
    removeDemanda,
    addDemanda,
    salvarDemandas,
    updateForm,

    // Tab 3
    registros,
    encList,
    novoRegOpen,
    setNovoRegOpen,
    novoEncOpen,
    setNovoEncOpen,
    nrMatricula,
    setNrMatricula,
    nrDocenteId,
    setNrDocenteId,
    nrTitulo,
    setNrTitulo,
    nrCategoria,
    setNrCategoria,
    nrDescricao,
    setNrDescricao,
    nrEncOpcao,
    setNrEncOpcao,
    nrEncId,
    setNrEncId,
    submitNovoRegistro,
    neMatricula,
    setNeMatricula,
    neTitulo,
    setNeTitulo,
    neCategoria,
    setNeCategoria,
    neServidorId,
    setNeServidorId,
    neDescricao,
    setNeDescricao,
    submitNovoEnc,
    selectedEnc,
    openEncDetail,
    closeEncDetail,
    encNovoRelato,
    setEncNovoRelato,
    encSavedRelato,
    setEncSavedRelato,
    saveEncRelato,
    encFinalizando,
    setEncFinalizando,
    encParecerFinal,
    setEncParecerFinal,
    finalizarEncDetail,

    // Tab 4
    openTurmas,
    setOpenTurmas,
    selectedAluno,
    setSelectedAluno,
    avaliacoes,
    selectedDisc,
    setSelectedDisc,
    retificadas,
    setRetificadas,
    abonomat,
    setAbonomat,
    abonoText,
    setAbonoText,
    updateEval,
    saveEval,

    // Ações globais
    salvarEVoltar,
    encerrar,
    submitNovoEncaminhamento,

    // Dados computados
    totalAlunos,
    savedCount,
    presentCount,
    tab2HasContent,
    visibleTabs,
  };
}


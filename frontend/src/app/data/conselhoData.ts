import { useEffect, useRef, useState } from "react";
import { Users, ClipboardList, GraduationCap, FileText, BarChart2 } from "lucide-react";

import type {
  AlunoEval,
  Disciplina,
  EncItemData,
  GravidadeDemanda,
  Professor,
  RegistroDocente,
  TabDef,
  TabId,
  TurmaForm,
  VizAlunoDetail,
} from "../types/conselho";
import {
  baixarAta,
  carregarConselho,
  conselhosService,
  criarEncaminhamento,
  criarEncaminhamentoNovo,
  criarRegistro,
  finalizarEncaminhamento,
  removerAbono,
  removerRetificacao,
  salvarAbono,
  salvarRetificacao,
  salvarDeliberacao,
  salvarDemanda,
  salvarPresencas,
  toTurmaForm,
  turmaFormVazio,
  type DadosConselho,
} from "../services/conselhoService";
import { registrarRelato } from "../services/encaminhamentosService";

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

// Intervalo da atualização em tempo real (o backend roda na Vercel, sem WebSocket).
const INTERVALO_ATUALIZACAO_MS = 5_000;

// Valores gravados no servidor: comparados com o estado local para saber o que o usuário está editando.
const formsDoServidor = (d: DadosConselho) =>
  d.turmas.map((t) => toTurmaForm(d.demandas.find((x) => x.turma_id === t.id), t.alunosList));

const pareceresDoServidor = (d: DadosConselho): Record<string, string> => {
  const deliberacaoPorAluno = new Map(d.deliberacoes.map((x) => [x.aluno_id, x]));
  return Object.fromEntries(d.alunos.map((a) => [a.matricula, deliberacaoPorAluno.get(a.id)?.alteracoes_realizadas ?? ""]));
};

const deliberacaoIdsDoServidor = (d: DadosConselho): Record<string, number> => {
  const deliberacaoPorAluno = new Map(d.deliberacoes.map((x) => [x.aluno_id, x]));
  return Object.fromEntries(d.alunos.flatMap((a) => {
    const deliberacao = deliberacaoPorAluno.get(a.id);
    return deliberacao ? [[a.matricula, deliberacao.id]] : [];
  }));
};

const retificadasDoServidor = (d: DadosConselho): Record<string, string> => {
  const retificadaPorNota = new Map(d.retificacoes.map((r) => [r.nota_frequencia_id, String(r.media_retificada)]));
  return Object.fromEntries(
    Object.entries(d.disciplinas).flatMap(([mat, discs]) =>
      discs.flatMap((x) => {
        const media = retificadaPorNota.get(x.notaId);
        return media === undefined ? [] : [[`${mat}|${x.nome}`, media]];
      })
    )
  );
};

export function useConselhoData({ conselhoId, mode = "final", onBack }: ConselhoDataProps) {
  const isInter = mode === "intermediario";
  const [activeTab, setActiveTab] = useState<TabId>(isInter ? 0 : 4);

  const [dados, setDados] = useState<DadosConselho | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Tab 0 — Visualização das Turmas
  const [vizTabLabel, setVizTabLabel] = useState("");
  const [vizSearch, setVizSearch] = useState("");
  const [vizTurmaFilter, setVizTurmaFilter] = useState("");
  const [vizAlunoDetail, setVizAlunoDetail] = useState<VizAlunoDetail | null>(null);

  // Tab 1 — Participantes
  const [participantes, setParticipantes] = useState<Professor[]>([]);

  // Tab 2 — Demandas Gerais
  const [turmaForms, setTurmaForms] = useState<TurmaForm[]>([]);
  const [turmasComDemanda, setTurmasComDemanda] = useState<Set<number>>(new Set());
  const [activeTurmaIdx, setActiveTurmaIdx] = useState(0);
  const [editFields, setEditFields] = useState<Set<string>>(new Set());
  const demandaIdRef = useRef(-1);
  // Último formulário gravado de cada turma (JSON), para não sobrescrever o que está em edição.
  const demandasSalvasRef = useRef<string[]>([]);

  // Tab 4 — Avaliação
  const [openTurmas, setOpenTurmas] = useState<Record<number, boolean>>({});
  const [selectedAluno, setSelectedAluno] = useState("");
  const [avaliacoes, setAvaliacoes] = useState<Record<string, AlunoEval>>({});
  const [deliberacaoIds, setDeliberacaoIds] = useState<Record<string, number>>({});
  // Último parecer gravado de cada aluno (matrícula), pelo mesmo motivo.
  const pareceresSalvosRef = useRef<Record<string, string>>({});
  const [selectedDisc, setSelectedDisc] = useState<Record<string, number>>({});
  const [retificadas, setRetificadas] = useState<Record<string, string>>({});
  // Último valor gravado de cada retificação ("matricula|disciplina"), para não regravar sem mudança.
  const retificadasSalvasRef = useRef<Record<string, string>>({});
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
        setDados(d);
        setParticipantes(d.participantes);
        setVizTabLabel(d.turmas.length > 1 ? "Visualização das Turmas" : "Visualização da Turma");
        const formsIniciais = formsDoServidor(d);
        demandasSalvasRef.current = formsIniciais.map((f) => JSON.stringify(f));
        setTurmaForms(formsIniciais);
        setTurmasComDemanda(new Set(d.demandas.map((x) => x.turma_id)));
        setOpenTurmas(d.turmas[0] ? { [d.turmas[0].id]: true } : {});
        setSelectedAluno((d.turmas[0]?.alunosList[0] ?? d.alunos[0])?.matricula ?? "");
        const pareceres = pareceresDoServidor(d);
        const ids = deliberacaoIdsDoServidor(d);
        pareceresSalvosRef.current = pareceres;
        setAvaliacoes(
          Object.fromEntries(
            d.alunos.map((a) => [
              a.matricula,
              { risco: a.risco ?? false, obs: pareceres[a.matricula], encaminhamento: "", acao: "", servidor: "", saved: a.matricula in ids },
            ])
          )
        );
        setDeliberacaoIds(ids);
        const retificadasIniciais = retificadasDoServidor(d);
        retificadasSalvasRef.current = retificadasIniciais;
        setRetificadas(retificadasIniciais);
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

  // Conta as gravações locais (no início e no fim de cada uma): uma atualização que começou antes
  // de uma gravação terminar pode trazer dados de antes dela, e é descartada.
  const versaoRef = useRef(0);
  const gravar = async <T>(acao: () => Promise<T>): Promise<T> => {
    versaoRef.current++;
    try {
      return await acao();
    } finally {
      versaoRef.current++;
    }
  };

  // Executa uma gravação mostrando o estado de "salvando" e a mensagem de erro
  const executar = (acao: () => Promise<void>) =>
    gravar(async () => {
      setSalvando(true);
      setErro("");
      try {
        await acao();
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro ao salvar.");
      } finally {
        setSalvando(false);
      }
    });

  // ── Atualização em tempo real: traz o que os outros participantes gravaram ──
  // O que o usuário está editando (formulário de demandas, parecer, média retificada) é preservado.
  const aplicarAtualizacao = (d: DadosConselho) => {
    if (dados?.conselho.status !== "encerrado" && d.conselho.status === "encerrado") {
      window.alert("Este conselho foi encerrado por outro participante.");
      onBack?.();
      return;
    }

    setDados(d);
    setParticipantes(d.participantes);
    setRegistros(d.registros);
    setEncList(d.encaminhamentos);
    setSelectedEnc((prev) => (prev ? d.encaminhamentos.find((e) => e.id === prev.id) ?? prev : null));

    const forms = formsDoServidor(d);
    const formsSalvos = demandasSalvasRef.current;
    setTurmaForms((prev) => forms.map((f, i) => (prev[i] && JSON.stringify(prev[i]) !== formsSalvos[i] ? prev[i] : f)));
    demandasSalvasRef.current = forms.map((f) => JSON.stringify(f));
    setTurmasComDemanda(new Set(d.demandas.map((x) => x.turma_id)));

    const pareceres = pareceresDoServidor(d);
    const pareceresSalvos = pareceresSalvosRef.current;
    const ids = deliberacaoIdsDoServidor(d);
    setAvaliacoes((prev) =>
      Object.fromEntries(
        d.alunos.map((a) => {
          const local = prev[a.matricula];
          if (local && local.obs.trim() !== (pareceresSalvos[a.matricula] ?? "")) return [a.matricula, local];
          const base = local ?? { risco: a.risco ?? false, encaminhamento: "", acao: "", servidor: "" };
          return [a.matricula, { ...base, obs: pareceres[a.matricula], saved: a.matricula in ids }];
        })
      )
    );
    pareceresSalvosRef.current = pareceres;
    setDeliberacaoIds(ids);

    const retificadasServidor = retificadasDoServidor(d);
    const retificadasSalvas = retificadasSalvasRef.current;
    setRetificadas((prev) => {
      const chaves = new Set([...Object.keys(prev), ...Object.keys(retificadasServidor)]);
      return Object.fromEntries(
        [...chaves].flatMap((chave) => {
          const local = prev[chave] ?? "";
          const valor = local.trim() !== (retificadasSalvas[chave] ?? "") ? local : retificadasServidor[chave] ?? "";
          return valor === "" ? [] : [[chave, valor]];
        })
      );
    });
    retificadasSalvasRef.current = retificadasServidor;
  };

  const atualizandoRef = useRef(false);
  const montadoRef = useRef(true);
  const atualizar = async () => {
    if (!dados || salvando || atualizandoRef.current || document.hidden) return;
    atualizandoRef.current = true;
    const versao = versaoRef.current;
    try {
      const d = await carregarConselho(conselhoId, dados.referencias);
      if (montadoRef.current && versao === versaoRef.current) aplicarAtualizacao(d);
    } catch {
      // Falha momentânea de rede: tenta de novo no próximo ciclo.
    } finally {
      atualizandoRef.current = false;
    }
  };

  // O intervalo chama sempre a versão mais recente de atualizar (com o estado atual).
  const atualizarRef = useRef(atualizar);
  useEffect(() => {
    atualizarRef.current = atualizar;
  });

  useEffect(() => {
    montadoRef.current = true;
    if (loading) return;
    const intervalo = setInterval(() => atualizarRef.current(), INTERVALO_ATUALIZACAO_MS);
    // Ao voltar para a aba do navegador, atualiza na hora em vez de esperar o próximo ciclo.
    const aoVoltarParaAba = () => {
      if (!document.hidden) atualizarRef.current();
    };
    document.addEventListener("visibilitychange", aoVoltarParaAba);
    return () => {
      montadoRef.current = false;
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", aoVoltarParaAba);
    };
  }, [loading]);

  const recarregarListas = async () => {
    const d = await carregarConselho(conselhoId, dados?.referencias);
    setRegistros(d.registros);
    setEncList(d.encaminhamentos);
    setSelectedEnc((prev) => (prev ? d.encaminhamentos.find((e) => e.id === prev.id) ?? prev : null));
  };

  // ── Tab 0 Helpers ──
  const getDisciplinas = (matricula: string, _turma: string) => {
    if (dados?.disciplinas && dados.disciplinas[matricula]) {
      return dados.disciplinas[matricula];
    }
    return [];
  };

  const computeMedia = (discs: any[]) => {
    if (!discs || discs.length === 0) return 0;
    const soma = discs.reduce((acc, d) => acc + (Number(d.nota) || 0), 0);
    return soma / discs.length;
  };

  const computeInfreq = (discs: any[]) => {
    if (!discs || discs.length === 0) return 0;
    const totalCh = discs.reduce((acc, d) => acc + (Number(d.ch) || 0), 0);
    const totalFaltas = discs.reduce((acc, d) => acc + (Number(d.faltasNaoJust ?? d.faltas) || 0), 0);
    return totalCh ? (totalFaltas / totalCh) * 100 : 0;
  };

  const emailFromNome = (nome: string) => {
    if (!nome) return "";
    const parts = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    return `${parts[0]}.${parts[parts.length - 1]}@aluno.ifsc.edu.br`;
  };

  // ── Abono de faltas: os erros sobem para o modal, que os mostra sem fechar ──
  const recarregarDisciplinas = async () => {
    const d = await carregarConselho(conselhoId, dados?.referencias);
    setDados((prev) => (prev ? { ...prev, disciplinas: d.disciplinas } : d));
  };

  const confirmarAbono = (notaFrequenciaId: number, horas: number, tipo: string) =>
    gravar(async () => {
      await salvarAbono(conselhoId, {
        notaFrequenciaId,
        horas,
        tipo,
        fundamentacao: abonoText,
      });
      await recarregarDisciplinas();
    });

  const excluirAbono = (abonoId: number) =>
    gravar(async () => {
      await removerAbono(conselhoId, abonoId);
      await recarregarDisciplinas();
    });

  // ── Média retificada: salva ao sair do campo; campo vazio remove a retificação ──
  const salvarRetificada = (matricula: string, disc: Disciplina) => {
    const chave = `${matricula}|${disc.nome}`;
    const valor = (retificadas[chave] ?? "").trim();
    if (valor === (retificadasSalvasRef.current[chave] ?? "")) return;

    const media = Number(valor);
    if (valor !== "" && (!Number.isFinite(media) || media < 0 || media > 10)) {
      setErro("A média retificada deve ser um número entre 0 e 10.");
      return;
    }

    executar(async () => {
      if (valor === "") {
        await removerRetificacao(conselhoId, disc.notaId);
      } else {
        await salvarRetificacao(conselhoId, disc.notaId, media);
      }
      retificadasSalvasRef.current = { ...retificadasSalvasRef.current, [chave]: valor };
    });
  };

  const alunoPorMatricula = (matricula: string) => dados?.alunos.find((a) => a.matricula === matricula);

  // ── Tab 1 Helpers ──
  const togglePresenca = (index: number) => {
    const anteriores = participantes;
    const novos = participantes.map((p, i) => (i === index ? { ...p, presente: !p.presente } : p));
    setParticipantes(novos);
    gravar(() => salvarPresencas(conselhoId, novos)).catch((err) => {
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
      const salvo = toTurmaForm(salva, turma.alunosList);
      demandasSalvasRef.current = demandasSalvasRef.current.map((s, j) => (j === i ? JSON.stringify(salvo) : s));
      setTurmasComDemanda((prev) => new Set(prev).add(turma.id));
      setTurmaForms((prev) => prev.map((f, j) => (j === i ? salvo : f)));
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
      // A ata só é emitida após o encerramento, então o download vem depois do update.
      await baixarAta(conselhoId);
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
      await registrarRelato(selectedEnc, encNovoRelato.trim());
      await recarregarListas();
      setEncNovoRelato("");
      setEncSavedRelato(true);
    });
  };

  const finalizarEncDetail = () => {
    if (!selectedEnc || !encParecerFinal.trim()) return;
    executar(async () => {
      await finalizarEncaminhamento(selectedEnc.id, encParecerFinal.trim());
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
      pareceresSalvosRef.current = { ...pareceresSalvosRef.current, [mat]: salva.alteracoes_realizadas ?? texto };
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
        { id: 0, label: vizTabLabel, icon: BarChart2, short: "Visualização", displayNum: 1 },
        { id: 2, label: "Demandas Gerais", icon: ClipboardList, short: "Demandas", displayNum: 2 },
        { id: 3, label: "Registros e Encaminhamentos", icon: FileText, short: "Registros", displayNum: 3 },
      ]
    : [
        { id: 0, label: "Visualização", icon: BarChart2, short: "Visualização", displayNum: 1 },
        { id: 1, label: "Participantes", icon: Users, short: "Participantes", displayNum: 2 },
        { id: 2, label: "Demandas Gerais", icon: ClipboardList, short: "Demandas", displayNum: 3 },
        { id: 3, label: "Registros e Encaminhamentos", icon: FileText, short: "Registros", displayNum: 4 },
        { id: 4, label: "Avaliação Discente", icon: GraduationCap, short: "Avaliação", displayNum: 5 },
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

    // Tab 0
    vizSearch,
    setVizSearch,
    vizTurmaFilter,
    setVizTurmaFilter,
    getDisciplinas,
    computeMedia,
    computeInfreq,
    emailFromNome,
    vizAlunoDetail,
    setVizAlunoDetail,

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
    confirmarAbono,
    excluirAbono,
    salvarRetificada,
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


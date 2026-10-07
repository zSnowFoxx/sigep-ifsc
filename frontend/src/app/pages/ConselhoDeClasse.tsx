import { useEffect, useRef, useState } from "react";
import {
  Users,
  ClipboardList,
  GraduationCap,
  FileText
} from "lucide-react";

// Importação de componentes
import ConselhoParticipantes from "../components/Conselho/Abas/ConselhoParticipantes";
import ConselhoDemandas from "../components/Conselho/Abas/ConselhoDemandas";
import ConselhosRegistros from "../components/Conselho/Abas/ConselhoRegistros";
import ConselhoAvaliacao from "../components/Conselho/Abas/ConselhoAvaliacao";
import ConselhoHeader from "../components/Conselho/Abas/ConselhoHeader";

// Importação de Modals
import ModalRegistro from "../components/Conselho/Modals/ModalRegistro";
import ModalEncaminhamento from "../components/Conselho/Modals/ModalEncaminhamento";
import EncaminhamentosCard from "../components/Encaminhamentos/EncaminhamentosCard";

import type {
  AlunoEval,
  ConselhoDeClasseProps,
  EncItemData,
  GravidadeDemanda,
  Professor,
  RegistroDocente,
  TabDef,
  TabId,
  TurmaForm,
} from "../types/conselho";
import { PONTOS_PRESET, DIFIC_PRESET } from "../data/conselhoData";
import {
  adicionarAcompanhamento,
  carregarConselho,
  conselhosService,
  criarEncaminhamento,
  criarRegistro,
  finalizarEncaminhamento,
  salvarDeliberacao,
  salvarDemanda,
  salvarPresencas,
  toTurmaForm,
  turmaFormVazio,
  type DadosConselho,
} from "../services/conselhoService";

// ─── Component ───────────────────────────────────────────────────────────────

export default function ConselhoDeClasse({ conselhoId, onBack, mode = "final" }: ConselhoDeClasseProps) {
  const isInter = mode === "intermediario";
  const [activeTab, setActiveTab] = useState<TabId>(isInter ? 2 : 4);

  const [dados, setDados] = useState<DadosConselho | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Tab 1 — Participantes
  const [participantes, setParticipantes] = useState<Professor[]>([]);

  // Tab 2 — Demandas Gerais (formulário por turma)
  const [turmaForms, setTurmaForms] = useState<TurmaForm[]>([]);
  const [turmasComDemanda, setTurmasComDemanda] = useState<Set<number>>(new Set());
  const [activeTurmaIdx, setActiveTurmaIdx] = useState(0);
  const [editFields, setEditFields] = useState<Set<string>>(new Set());
  // Ids provisórios (negativos) para demandas ainda não salvas.
  const demandaIdRef = useRef(-1);

  // Tab 4 — Avaliação
  const [openTurmas, setOpenTurmas] = useState<Record<number, boolean>>({});
  const [selectedAluno, setSelectedAluno] = useState("");
  const [avaliacoes, setAvaliacoes] = useState<Record<string, AlunoEval>>({});
  const [deliberacaoIds, setDeliberacaoIds] = useState<Record<string, number>>({});
  const [selectedDisc, setSelectedDisc] = useState<Record<string, number>>({});
  // Retificadas e abono não têm onde ser gravados no banco: valem só enquanto a tela está aberta.
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

  // Executa uma gravação mostrando o estado de "salvando" e a mensagem de erro, se houver.
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

  // Registros e encaminhamentos mudam juntos (criar registro pode criar encaminhamento).
  const recarregarListas = async () => {
    const d = await carregarConselho(conselhoId);
    setRegistros(d.registros);
    setEncList(d.encaminhamentos);
    setSelectedEnc((prev) => (prev ? d.encaminhamentos.find((e) => e.id === prev.id) ?? prev : null));
  };

  if (loading || !dados) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className={`text-sm ${erro ? "font-semibold text-red-600" : "text-muted-foreground"}`}>
          {erro || "Carregando conselho..."}
        </p>
        {erro && (
          <button onClick={onBack} className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
            Voltar para a Central de Conselhos
          </button>
        )}
      </div>
    );
  }

  const { conselho, turmas, alunos } = dados;
  const autorId = dados.usuarioLogadoId;
  const alunoPorMatricula = (matricula: string) => alunos.find((a) => a.matricula === matricula);

  // ── Tab 1 helpers ──
  const togglePresenca = (index: number) => {
    const anteriores = participantes;
    const novos = participantes.map((p, i) => (i === index ? { ...p, presente: !p.presente } : p));
    setParticipantes(novos);
    salvarPresencas(conselhoId, novos).catch((err) => {
      setParticipantes(anteriores);
      setErro(err instanceof Error ? err.message : "Erro ao salvar a presença.");
    });
  };

  // ── Tab 2 helpers ──
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

  // Turmas sem nada preenchido e ainda sem registro no banco não são gravadas.
  const salvarDemandas = async (indices: number[]) => {
    for (const i of indices) {
      const turma = turmas[i];
      const existe = turmasComDemanda.has(turma.id);
      if (!existe && turmaFormVazio(turmaForms[i])) continue;
      const salva = await salvarDemanda(conselhoId, turma, turmaForms[i], existe);
      setTurmasComDemanda((prev) => new Set(prev).add(turma.id));
      setTurmaForms((prev) => prev.map((f, j) => (j === i ? toTurmaForm(salva, turma.alunosList) : f)));
    }
  };
  const todasAsTurmas = turmas.map((_, i) => i);

  const salvarEVoltar = () =>
    executar(async () => {
      await salvarDemandas(todasAsTurmas);
      onBack?.();
    });

  const encerrar = () => {
    if (!window.confirm("Encerrar este conselho? Ele passará para o histórico de realizados.")) return;
    executar(async () => {
      await salvarDemandas(todasAsTurmas);
      await conselhosService.update(conselhoId, { status: "encerrado" });
      onBack?.();
    });
  };

  // ── Tab 3 helpers ──
  const resetNovoRegistro = () => {
    setNrMatricula(""); setNrDocenteId(autorId); setNrTitulo(""); setNrCategoria(""); setNrDescricao("");
    setNrEncOpcao(null); setNrEncId(null); setNovoRegOpen(false);
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
          autorId,
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
        autorId,
      });
      await recarregarListas();
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
      await adicionarAcompanhamento(selectedEnc.id, autorId, "relato", encNovoRelato.trim());
      await recarregarListas();
      setEncNovoRelato("");
      setEncSavedRelato(true);
    });
  };
  const finalizarEncDetail = () => {
    if (!selectedEnc || !encParecerFinal.trim()) return;
    executar(async () => {
      await finalizarEncaminhamento(selectedEnc.id, autorId, encParecerFinal.trim());
      await recarregarListas();
      setEncFinalizando(false);
      setEncParecerFinal("");
    });
  };

  // ── Tab 4 helpers ──
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

  const totalAlunos  = alunos.length;
  const savedCount   = Object.values(avaliacoes).filter((e) => e.saved).length;
  const presentCount = participantes.filter((p) => p.presente).length;

  // Tab 2 computed shortcuts
  const form           = turmaForms[activeTurmaIdx];
  const currentTurmaD  = turmas[activeTurmaIdx];
  const allPontos      = form ? [...PONTOS_PRESET, ...form.customPontos] : [];
  const allDific       = form ? [...DIFIC_PRESET, ...form.customDificuldades] : [];
  const tab2HasContent = turmaForms.some((f) => f.sintese || f.representantes || f.demandas.length > 0 || f.pontosPositivos.length > 0);

  // Dynamic tab list based on mode
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
      <ConselhoHeader
        onBack={onBack}
        onSalvar={salvarEVoltar}
        onEncerrar={encerrar}
        salvando={salvando}
        isInter={isInter}
        titulo={conselho.nome}
        dataRealizacao={conselho.data_realizacao}
        coordenadores={dados.coordenadores}
        savedCount={savedCount}
        totalAlunos={totalAlunos}
        presentCount={presentCount}
        totalParticipantes={participantes.length}
        visibleTabs={visibleTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tab2HasContent={tab2HasContent}
      />

      {erro && (
        <div className="shrink-0 px-6 py-2.5 bg-red-50 border-b border-red-200 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold text-red-700">{erro}</p>
          <button onClick={() => setErro("")} className="text-xs text-red-700 hover:underline shrink-0">
            Fechar
          </button>
        </div>
      )}

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-hidden">

        {/* ── TAB 1: Participantes ─────────────────────────────────────────── */}
        {activeTab === 1 && (
          <ConselhoParticipantes
            professores={participantes}
            onTogglePresenca={togglePresenca}
          />
        )}

        {/* ── TAB 2: Demandas Gerais ────────────────────────────────────────── */}
        {activeTab === 2 && (
          currentTurmaD && form ? (
            <ConselhoDemandas
              turmasData={turmas}
              activeTurmaIdx={activeTurmaIdx}
              setActiveTurmaIdx={setActiveTurmaIdx}
              currentTurmaD={currentTurmaD}
              isInter={isInter}
              editFields={editFields}
              toggleEditField={toggleEditField}
              form={form}
              updateForm={updateForm}
              allPontos={allPontos}
              togglePonto={togglePonto}
              allDific={allDific}
              toggleDific={toggleDific}
              removeDemanda={removeDemanda}
              addDemanda={addDemanda}
              salvando={salvando}
              onSalvar={() =>
                executar(async () => {
                  await salvarDemandas([activeTurmaIdx]);
                  setEditFields(new Set());
                })
              }
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-16">Este conselho não tem turmas vinculadas.</p>
          )
        )}

        {/* ── TAB 3: Registros e Encaminhamentos ──────────────────────────── */}
        {activeTab === 3 && (
          <ConselhosRegistros
            registros={registros}
            encList={encList}
            turmasData={turmas}
            setNovoRegOpen={setNovoRegOpen}
            setNovoEncOpen={setNovoEncOpen}
            openEncDetail={openEncDetail}
          />
        )}

        {/* ── TAB 4: Avaliação Discente ────────────────────────────────────── */}
        {activeTab === 4 && (
          <ConselhoAvaliacao
            avaliacoes={avaliacoes}
            turmas={turmas}
            alunos={alunos}
            openTurmas={openTurmas}
            setOpenTurmas={setOpenTurmas}
            selectedAluno={selectedAluno}
            setSelectedAluno={setSelectedAluno}
            disciplinasData={dados.disciplinas}
            selectedDisc={selectedDisc}
            setSelectedDisc={setSelectedDisc}
            retificadas={retificadas}
            setRetificadas={setRetificadas}
            abonomat={abonomat}
            setAbonomat={setAbonomat}
            abonoText={abonoText}
            setAbonoText={setAbonoText}
            updateEval={updateEval}
            saveEval={saveEval}
            salvando={salvando}
          />
        )}
      </div>

      {/* ── Modal: Novo Registro Docente ────────────────────────────────────── */}
      {novoRegOpen && (
        <ModalRegistro
          setNovoRegOpen={setNovoRegOpen}
          alunos={alunos}
          servidores={dados.servidores}
          disciplinasData={dados.disciplinas}
          nrMatricula={nrMatricula}
          setNrMatricula={setNrMatricula}
          nrDocenteId={nrDocenteId}
          setNrDocenteId={setNrDocenteId}
          nrTitulo={nrTitulo}
          setNrTitulo={setNrTitulo}
          nrCategoria={nrCategoria}
          setNrCategoria={setNrCategoria}
          nrDescricao={nrDescricao}
          setNrDescricao={setNrDescricao}
          nrEncOpcao={nrEncOpcao}
          setNrEncOpcao={setNrEncOpcao}
          nrEncId={nrEncId}
          setNrEncId={setNrEncId}
          encList={encList}
          salvando={salvando}
          submitNovoRegistro={submitNovoRegistro}
        />
      )}

      {/* ── Modal: Novo Encaminhamento ──────────────────────────────────────── */}
      {novoEncOpen && (
        <ModalEncaminhamento
          setNovoEncOpen={setNovoEncOpen}
          alunos={alunos}
          servidores={dados.servidores}
          neMatricula={neMatricula}
          setNeMatricula={setNeMatricula}
          neTitulo={neTitulo}
          setNeTitulo={setNeTitulo}
          neCategoria={neCategoria}
          setNeCategoria={setNeCategoria}
          neServidorId={neServidorId}
          setNeServidorId={setNeServidorId}
          neDescricao={neDescricao}
          setNeDescricao={setNeDescricao}
          salvando={salvando}
          submitNovoEnc={submitNovoEnc}
        />
      )}

      {/* ── Modal: Detalhes do Encaminhamento ──────────────────────────────── */}
      {selectedEnc && (
        <EncaminhamentosCard
          selected={selectedEnc}
          onClose={closeEncDetail}
          novoRelato={encNovoRelato}
          setNovoRelato={setEncNovoRelato}
          savedRelato={encSavedRelato}
          setSavedRelato={setEncSavedRelato}
          saveRelato={saveEncRelato}
          finalizando={encFinalizando}
          setFinalizando={setEncFinalizando}
          parecerFinal={encParecerFinal}
          setParecerFinal={setEncParecerFinal}
          finalizar={finalizarEncDetail}
        />
      )}

    </div>
  );
}

import { useState, useRef } from "react";
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
import ModalDetalhes from "../components/Conselho/Modals/ModalDetalhes";

// Importação de tipos e data (enquanto não conectado com servidor)
import type { EncItemData, AlunoEval, ConselhoDeClasseProps, TabId, EncEvolucao, Enc, TabDef } from "../types/conselho";
import { professores, alunos, alunosTurmaB, turmasData, PONTOS_PRESET, DIFIC_PRESET, mockEncaminhamentos, defaultDisciplinas, disciplinasData,
  ENC_CATEGORIA_CORES, ENC_TIPO_CONF,
 } from "../data/conselhoData";


// ─── Component ───────────────────────────────────────────────────────────────

export default function ConselhoDeClasse({ onBack, mode = "final" }: ConselhoDeClasseProps) {
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
  const [editFields, setEditFields] = useState<Set<string>>(new Set());

  // Tab 3 — Avaliação
  const [groupAOpen, setGroupAOpen] = useState(true);
  const [groupBOpen, setGroupBOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<string>(alunos[0].matricula);
  const [avaliacoes, setAvaliacoes] = useState<Record<string, AlunoEval>>(
    Object.fromEntries(
      [...alunos, ...alunosTurmaB.map((a) => ({ ...a, risco: false }))].map((a) => [
        a.matricula,
        { risco: a.risco ?? false, obs: "", encaminhamento: "", acao: "", servidor: "", saved: false },
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


  // Discipline selector — keyed by student matricula
  const [selectedDisc, setSelectedDisc] = useState<Record<string, number>>({});
  // Retificada overrides — keyed by "matricula|disciplina"
  const [retificadas, setRetificadas] = useState<Record<string, string>>({});
  // Abono modal
  const [abonomat, setAbonomat] = useState<string | null>(null);
  const [abonoText, setAbonoText] = useState("");

  // Per-student encaminhamentos list
  const [encAtivos, setEncAtivos] = useState<Record<string, Enc[]>>({});
  const [encModalOpen, setEncModalOpen] = useState(false);
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
  const [encEvolucoes, setEncEvolucoes] = useState<Record<number, EncEvolucao[]>>(
    Object.fromEntries(mockEncaminhamentos.map((e) => [e.id, [{ data: e.data, autor: e.servidor || "Sistema", texto: e.descricao, tipo: "criacao" as const }]]))
  );

  const totalAlunos  = alunos.length + alunosTurmaB.length;
  const savedCount   = Object.values(avaliacoes).filter((e) => e.saved).length;
  const presentCount = Object.values(presenteToggle).filter(Boolean).length;

  // Tab 2 computed shortcuts
  const form           = turmaForms[activeTurmaIdx];
  const currentTurmaD  = turmasData[activeTurmaIdx];
  const allPontos      = [...PONTOS_PRESET, ...form.customPontos];
  const allDific       = [...DIFIC_PRESET, ...form.customDificuldades];
  const tab2HasContent  = turmaForms.some((f) => f.sintese || f.representantes || f.demandas.length > 0 || f.pontosPositivos.length > 0);

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
        isInter={isInter}
        savedCount={savedCount}
        totalAlunos={totalAlunos}
        alunos={alunos}
        alunosTurmaB={alunosTurmaB}
        presentCount={presentCount}
        professores={professores}
        visibleTabs={visibleTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tab2HasContent={tab2HasContent}
      />

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-hidden">

        {/* ── TAB 1: Participantes ─────────────────────────────────────────── */}
        {activeTab === 1 && (
          <ConselhoParticipantes
            professores={professores}
            presenteToggle={presenteToggle}
            setPresenteToggle={setPresenteToggle}
          />
        )}

        {/* ── TAB 2: Demandas Gerais ────────────────────────────────────────── */}
        {activeTab === 2 && (
          <ConselhoDemandas
            turmasData={turmasData}
            activeTurmaIdx={activeTurmaIdx}
            setActiveTurmaIdx={setActiveTurmaIdx}
            currentTurmaD={currentTurmaD}
            isInter={isInter}
            editFields={editFields}
            setEditFields={setEditFields}
            toggleEditField={toggleEditField}
            form={form}
            updateForm={updateForm}
            allPontos={allPontos}
            togglePonto={togglePonto}
            allDific={allDific}
            toggleDific={toggleDific}
            removeDemanda={removeDemanda}
            addDemanda={addDemanda}
          />
        )}

        {/* ── TAB 3: Registros e Encaminhamentos ──────────────────────────── */}
        {activeTab === 3 && (
          <ConselhosRegistros
            registros={registros}
            encList={encList}
            turmasData={turmasData}
            setNovoRegOpen={setNovoRegOpen}
            setNovoEncOpen={setNovoEncOpen}
            openEncDetail={openEncDetail}
          />
        )}

        {/* ── TAB 4: Avaliação Discente ────────────────────────────────────── */}
        {activeTab === 4 && (
          <ConselhoAvaliacao
            avaliacoes={avaliacoes}
            alunos={alunos}
            alunosTurmaB={alunosTurmaB}
            groupAOpen={groupAOpen}
            setGroupAOpen={setGroupAOpen}
            groupBOpen={groupBOpen}
            setGroupBOpen={setGroupBOpen}
            selectedAluno={selectedAluno}
            setSelectedAluno={setSelectedAluno}
            disciplinasData={disciplinasData}
            defaultDisciplinas={defaultDisciplinas}
            selectedDisc={selectedDisc}
            setSelectedDisc={setSelectedDisc}
            retificadas={retificadas}
            setRetificadas={setRetificadas}
            abonomat={abonomat}
            setAbonomat={setAbonomat}
            abonoText={abonoText}
            setAbonoText={setAbonoText}
            updateEval={updateEval}
            encAtivos={encAtivos}
            setEncAtivos={setEncAtivos}
            encModalOpen={encModalOpen}
            setEncModalOpen={setEncModalOpen}
            encNextId={encNextId}
            saveEval={saveEval}
          />
        )}
      </div>

      {/* ── Modal: Novo Registro Docente ────────────────────────────────────── */}
      {novoRegOpen && (
        <ModalRegistro
          novoRegOpen={novoRegOpen}
          setNovoRegOpen={setNovoRegOpen}
          nrAluno={nrAluno}
          selectNrAluno={selectNrAluno}
          nrDocente={nrDocente}
          setNrDocente={setNrDocente}
          todayFmt={todayFmt}
          nrTurma={nrTurma}
          nrTitulo={nrTitulo}
          setNrTitulo={setNrTitulo}
          nrCategoria={nrCategoria}
          setNrCategoria={setNrCategoria}
          nrDescricao={nrDescricao}
          setNrDescricao={setNrDescricao}
          nrMatricula={nrMatricula}
          nrDiscManual={nrDiscManual}
          setNrDiscManual={setNrDiscManual}
          nrEncOpcao={nrEncOpcao}
          setNrEncOpcao={setNrEncOpcao}
          nrEncId={nrEncId}
          setNrEncId={setNrEncId}
          encList={encList}
          submitNovoRegistro={submitNovoRegistro}
          novoEncOpen={novoEncOpen}
          setNovoEncOpen={setNovoEncOpen}
          neAluno={neAluno}
          selectNeAluno={selectNeAluno}
          neTurma={neTurma}
          neTitulo={neTitulo}
          setNeTitulo={setNeTitulo}
          neCategoria={neCategoria}
          setNeCategoria={setNeCategoria}
          neServidor={neServidor}
          setNeServidor={setNeServidor}
          neDescricao={neDescricao}
          setNeDescricao={setNeDescricao}
          submitNovoEnc={submitNovoEnc}
        />
      )}

      {/* ── Modal: Novo Encaminhamento ──────────────────────────────────────── */}
      {novoEncOpen && (
        <ModalEncaminhamento
          novoEncOpen={novoEncOpen}
          setNovoEncOpen={setNovoEncOpen}
          neAluno={neAluno}
          selectNeAluno={selectNeAluno}
          neTurma={neTurma}
          neTitulo={neTitulo}
          setNeTitulo={setNeTitulo}
          neCategoria={neCategoria}
          setNeCategoria={setNeCategoria}
          neServidor={neServidor}
          setNeServidor={setNeServidor}
          neDescricao={neDescricao}
          setNeDescricao={setNeDescricao}
          submitNovoEnc={submitNovoEnc}
        />
      )}

      {/* ── Modal: Detalhes do Encaminhamento ──────────────────────────────── */}
      {selectedEnc && (
          <ModalDetalhes
            selectedEnc={selectedEnc}
            closeEncDetail={closeEncDetail}
            ENC_CATEGORIA_CORES={ENC_CATEGORIA_CORES}
            encEvolucoes={encEvolucoes}
            ENC_TIPO_CONF={ENC_TIPO_CONF}
            encNovoRelato={encNovoRelato}
            setEncNovoRelato={setEncNovoRelato}
            encSavedRelato={encSavedRelato}
            setEncSavedRelato={setEncSavedRelato}
            encFinalizando={encFinalizando}
            setEncFinalizando={setEncFinalizando}
            encParecerFinal={encParecerFinal}
            setEncParecerFinal={setEncParecerFinal}
            saveEncRelato={saveEncRelato}
            finalizarEncDetail={finalizarEncDetail}
          />
      )}

    </div>
  );
}

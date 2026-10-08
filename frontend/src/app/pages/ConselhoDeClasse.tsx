import type { ConselhoDeClasseProps } from "../types/conselho";
import { conselhoData } from "../data/conselhoData";

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

export default function ConselhoDeClasse({ conselhoId, onBack, mode = "final" }: ConselhoDeClasseProps) {
  const {
  // Base & Globais
  isInter, activeTab, setActiveTab, dados, loading, erro, setErro, salvando, executar,

  // Tab 1: Participantes
  participantes, togglePresenca,

  // Tab 2: Demandas
  activeTurmaIdx, setActiveTurmaIdx, editFields, toggleEditField, form, currentTurmaD,
  allPontos, togglePonto, allDific, toggleDific, removeDemanda, addDemanda, salvarDemandas, updateForm,

  // Tab 3: Registros & Encaminhamentos
  registros, encList, novoRegOpen, setNovoRegOpen, novoEncOpen, setNovoEncOpen,
  nrMatricula, setNrMatricula, nrDocenteId, setNrDocenteId, nrTitulo, setNrTitulo,
  nrCategoria, setNrCategoria, nrDescricao, setNrDescricao, nrEncOpcao, setNrEncOpcao,
  nrEncId, setNrEncId, submitNovoRegistro,
  neMatricula, setNeMatricula, neTitulo, setNeTitulo, neCategoria, setNeCategoria,
  neServidorId, setNeServidorId, neDescricao, setNeDescricao, submitNovoEnc,
  selectedEnc, openEncDetail, closeEncDetail, encNovoRelato, setEncNovoRelato,
  encSavedRelato, setEncSavedRelato, saveEncRelato, encFinalizando, setEncFinalizando,
  encParecerFinal, setEncParecerFinal, finalizarEncDetail,

  // Tab 4: Avaliação
  openTurmas, setOpenTurmas, selectedAluno, setSelectedAluno, avaliacoes,
  selectedDisc, setSelectedDisc, retificadas, setRetificadas, abonomat, setAbonomat,
  abonoText, setAbonoText, updateEval, saveEval,

  // Ações & Computados
  salvarEVoltar, encerrar, totalAlunos, savedCount, presentCount, tab2HasContent, visibleTabs,
} = conselhoData({ conselhoId, mode, onBack });

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
        {/* TAB 1: Participantes */}
        {activeTab === 1 && (
          <ConselhoParticipantes
            professores={participantes}
            onTogglePresenca={togglePresenca}
          />
        )}

        {/* TAB 2: Demandas Gerais */}
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
                  toggleEditField(""); 
                })
              }
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-16">Este conselho não tem turmas vinculadas.</p>
          )
        )}

        {/* TAB 3: Registros e Encaminhamentos */}
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

        {/* TAB 4: Avaliação Discente */}
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
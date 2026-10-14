import type { AtendimentosProps } from "../types/atendimentos";
import { atendimentosData, motivoOptions, contatoOptions, servidoresOptions } from "../data/atendimentosData";

// Importação dos componentes
import AtendimentosHeader from "../components/Atendimentos/AtendimentosHeader";
import AtendimentosFilters from "../components/Atendimentos/AtendimentosFilters";
import AtendimentosTable from "../components/Atendimentos/AtendimentosTable";
import ModalAtendimento from "../components/Atendimentos/Modals/ModalAtendimento";
import ModalRelato from "../components/Atendimentos/Modals/ModalRelato";

export default function Atendimentos({
  initialStudent,
  onClearInitialStudent,
}: AtendimentosProps) {
  const {
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
    totalAtendimentos,
    resetForm,
    handleSave,
  } = atendimentosData({ initialStudent, onClearInitialStudent });

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Module Header Component */}
      <AtendimentosHeader
        onNovoAtendimento={() => {
          setDrawerOpen(true);
          setFSaved(false);
        }}
      />

      {/* Search & Filter Bar Component */}
      <AtendimentosFilters
        search={search}
        setSearch={setSearch}
        filterMotivo={filterMotivo}
        setFilterMotivo={setFilterMotivo}
        motivoOptions={motivoOptions}
        totalFiltered={filtered.length}
      />

      {/* Table Component */}
      <AtendimentosTable
        filtered={filtered}
        totalAtendimentos={totalAtendimentos}
        onViewRelato={(atendimento) => setViewModal({ atendimento })}
      />

      {/* ── Registrar Novo Atendimento — Centered Modal Component ── */}
      {drawerOpen && (
        <ModalAtendimento
          onClose={() => {
            setDrawerOpen(false);
            resetForm();
          }}
          fSaved={fSaved}
          fAlunoBusca={fAlunoBusca}
          setFAlunoBusca={setFAlunoBusca}
          fAlunoSelecionado={fAlunoSelecionado}
          setFAlunoSelecionado={setFAlunoSelecionado}
          showSugestoes={showSugestoes}
          setShowSugestoes={setShowSugestoes}
          sugestoesFiltradas={sugestoesFiltradas}
          fData={fData}
          setFData={setFData}
          fServidor={fServidor}
          setFServidor={setFServidor}
          servidoresOptions={servidoresOptions}
          fMotivo={fMotivo}
          setFMotivo={setFMotivo}
          motivoOptions={motivoOptions}
          fContato={fContato}
          setFContato={setFContato}
          contatoOptions={contatoOptions}
          fRelato={fRelato}
          setFRelato={setFRelato}
          handleSave={handleSave}
        />
      )}

      {/* Modal: Ver Relato Completo */}
      {viewModal.atendimento && (
        <ModalRelato
          atendimento={viewModal.atendimento}
          onClose={() => setViewModal({ atendimento: null })}
        />
      )}
    </div>
  );
}
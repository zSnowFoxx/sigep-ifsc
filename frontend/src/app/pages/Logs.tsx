import { LOGS_POR_PAGINA, useLogsData } from "../data/logsData";

import LogsHeader from "../components/Logs/LogsHeader";
import LogsFiltros from "../components/Logs/LogsFiltros";
import LogsTabela from "../components/Logs/LogsTabela";
import ModalLogDetalhes from "../components/Logs/Modals/ModalLogDetalhes";

export default function Logs() {
  const {
    logs,
    total,
    pagina,
    setPagina,
    totalPaginas,
    filtros,
    setFiltro,
    limparFiltros,
    temFiltro,
    opcoes,
    loading,
    erro,
    setErro,
    selecionado,
    setSelecionado,
    atualizar,
  } = useLogsData();

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      <LogsHeader onAtualizar={atualizar} loading={loading} />

      {erro && (
        <div className="shrink-0 px-6 py-2.5 bg-red-50 border-b border-red-200 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold text-red-700">{erro}</p>
          <button onClick={() => setErro("")} className="text-xs text-red-700 hover:underline shrink-0">
            Fechar
          </button>
        </div>
      )}

      <LogsFiltros
        filtros={filtros}
        setFiltro={setFiltro}
        limparFiltros={limparFiltros}
        temFiltro={temFiltro}
        opcoes={opcoes}
        total={total}
      />

      {loading && logs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-16">Carregando logs...</p>
      ) : (
        <LogsTabela
          logs={logs}
          total={total}
          pagina={pagina}
          totalPaginas={totalPaginas}
          porPagina={LOGS_POR_PAGINA}
          setPagina={setPagina}
          onVerDetalhes={setSelecionado}
        />
      )}

      {selecionado && <ModalLogDetalhes log={selecionado} onClose={() => setSelecionado(null)} />}
    </div>
  );
}

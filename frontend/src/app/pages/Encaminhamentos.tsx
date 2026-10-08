import { useCallback, useEffect, useState } from "react";
import type { Encaminhamento } from "../types/encaminhamentos";
import {
  carregarEncaminhamentos,
  finalizarEncaminhamento,
  registrarRelato,
} from "../services/encaminhamentosService";
import { normalizar } from "../utils/busca";

import EncaminhamentosHeader from "../components/Encaminhamentos/EncaminhamentosHeader";
import EncaminhamentosFiltros from "../components/Encaminhamentos/EncaminhamentosFiltros";
import EncaminhamentosQuadros from "../components/Encaminhamentos/EncaminhamentosQuadros";
import EncaminhamentosCard from "../components/Encaminhamentos/EncaminhamentosCard";

// Prazo a partir do qual um encaminhamento em aberto conta como "vencendo" (inclui os vencidos).
const DIAS_ALERTA_PRAZO = 7;

function estaVencendo(card: Encaminhamento) {
  if (card.status === "concluido" || !card.prazo) return false;
  const [dia, mes, ano] = card.prazo.split("/").map(Number);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dias = (new Date(ano, mes - 1, dia).getTime() - hoje.getTime()) / 86_400_000;
  return dias <= DIAS_ALERTA_PRAZO;
}

export default function Encaminhamentos() {
  const [cards, setCards] = useState<Encaminhamento[]>([]);
  const [selected, setSelected] = useState<Encaminhamento | null>(null);
  const [usuarioLogadoId, setUsuarioLogadoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState("");

  // Filter toolbar state
  const [filterSearch, setFilterSearch] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterSetor, setFilterSetor] = useState("");
  const [filterOrigem, setFilterOrigem] = useState("");
  const [filterUrgentes, setFilterUrgentes] = useState(false);

  // Details modal state
  const [novoRelato, setNovoRelato] = useState("");
  const [parecerFinal, setParecerFinal] = useState("");
  const [finalizando, setFinalizando] = useState(false);
  const [savedRelato, setSavedRelato] = useState(false);

  // Retorna a lista atualizada para o modal aberto acompanhar as mudanças.
  const load = useCallback(async () => {
    try {
      const dados = await carregarEncaminhamentos();
      setCards(dados.encaminhamentos);
      setUsuarioLogadoId(dados.usuarioLogadoId);
      setError("");
      return dados.encaminhamentos;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar os encaminhamentos.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // O valor selecionado continua na lista mesmo que nenhum card o tenha mais após recarregar;
  // senão o select mostraria "(Todos)" com o filtro ainda ativo.
  const opcoes = (valores: string[], selecionado: string) =>
    [...new Set([...valores, selecionado].filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const categorias = opcoes(cards.map((c) => c.categoria), filterCategoria);
  const setores = opcoes(cards.map((c) => c.responsavel), filterSetor);
  const origens = opcoes(cards.map((c) => c.origem), filterOrigem);

  const busca = normalizar(filterSearch).replace(/^#/, "");

  const matchesFilter = (card: Encaminhamento) => {
    if (
      busca &&
      !normalizar(card.aluno).includes(busca) &&
      !card.matricula.includes(busca) &&
      !String(card.id).includes(busca)
    )
      return false;
    if (filterCategoria && card.categoria !== filterCategoria) return false;
    if (filterSetor && card.responsavel !== filterSetor) return false;
    if (filterOrigem && card.origem !== filterOrigem) return false;
    if (filterUrgentes && !card.urgente && !estaVencendo(card)) return false;
    return true;
  };

  const anyFilter =
    Boolean(filterSearch || filterCategoria || filterSetor || filterOrigem || filterUrgentes);

  const clearFilters = () => {
    setFilterSearch("");
    setFilterCategoria("");
    setFilterSetor("");
    setFilterOrigem("");
    setFilterUrgentes(false);
  };

  const openModal = (card: Encaminhamento) => {
    setSelected(card);
    setNovoRelato("");
    setParecerFinal(card.parecer);
    setFinalizando(false);
    setSavedRelato(false);
    setErroModal("");
  };

  const closeModal = () => {
    if (salvando) return;
    setSelected(null);
    setFinalizando(false);
  };

  // Executa uma alteração no backend e recarrega o quadro, mantendo o modal sincronizado.
  const executar = async (acao: (card: Encaminhamento) => Promise<void>) => {
    if (!selected || salvando) return false;
    setSalvando(true);
    setErroModal("");
    try {
      await acao(selected);
      const atualizados = await load();
      setSelected(atualizados?.find((c) => c.id === selected.id) ?? null);
      return true;
    } catch (err) {
      setErroModal(err instanceof Error ? err.message : "Erro ao salvar o encaminhamento.");
      return false;
    } finally {
      setSalvando(false);
    }
  };

  const saveRelato = async () => {
    const texto = novoRelato.trim();
    if (!texto) return;
    const ok = await executar((card) => registrarRelato(card, usuarioLogadoId, texto));
    if (!ok) return;
    setNovoRelato("");
    setSavedRelato(true);
    setTimeout(() => setSavedRelato(false), 2500);
  };

  const finalizar = async () => {
    const parecer = parecerFinal.trim();
    if (!parecer) return;
    const ok = await executar((card) => finalizarEncaminhamento(card.id, usuarioLogadoId, parecer));
    if (!ok) return;
    setSelected(null);
    setFinalizando(false);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <EncaminhamentosHeader cards={cards} />

      <EncaminhamentosFiltros
        filterSearch={filterSearch}
        setFilterSearch={setFilterSearch}
        filterCategoria={filterCategoria}
        setFilterCategoria={setFilterCategoria}
        filterSetor={filterSetor}
        setFilterSetor={setFilterSetor}
        filterOrigem={filterOrigem}
        setFilterOrigem={setFilterOrigem}
        filterUrgentes={filterUrgentes}
        setFilterUrgentes={setFilterUrgentes}
        categorias={categorias}
        setores={setores}
        origens={origens}
        anyFilter={anyFilter}
        onClearFilters={clearFilters}
      />

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-16">
          Carregando encaminhamentos...
        </p>
      ) : error ? (
        <p className="text-sm font-semibold text-red-600 text-center py-16">
          {error}
        </p>
      ) : (
        <EncaminhamentosQuadros
          cards={cards}
          matchesFilter={matchesFilter}
          onOpenModal={openModal}
        />
      )}

      <EncaminhamentosCard
        selected={selected}
        onClose={closeModal}
        novoRelato={novoRelato}
        setNovoRelato={setNovoRelato}
        savedRelato={savedRelato}
        setSavedRelato={setSavedRelato}
        saveRelato={saveRelato}
        finalizando={finalizando}
        setFinalizando={setFinalizando}
        parecerFinal={parecerFinal}
        setParecerFinal={setParecerFinal}
        finalizar={finalizar}
        salvando={salvando}
        erro={erroModal}
      />
    </div>
  );
}
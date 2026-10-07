import { useState } from "react";
import type { Status, Encaminhamento } from "../types/encaminhamentos";
import { initialCards } from "../data/encaminhamentosData";

import EncaminhamentosHeader from "../components/Encaminhamentos/EncaminhamentosHeader";
import EncaminhamentosFiltros from "../components/Encaminhamentos/EncaminhamentosFiltros";
import EncaminhamentosQuadros from "../components/Encaminhamentos/EncaminhamentosQuadros";
import EncaminhamentosCard from "../components/Encaminhamentos/EncaminhamentosCard";

export default function Encaminhamentos() {
  const [cards, setCards] = useState<Encaminhamento[]>(initialCards);
  const [selected, setSelected] = useState<Encaminhamento | null>(null);

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

  const categorias = [...new Set(initialCards.map((c) => c.categoria))];
  const setores = [...new Set(initialCards.map((c) => c.responsavel))];
  const origens = [...new Set(initialCards.map((c) => c.origem))];

  const matchesFilter = (card: Encaminhamento) => {
    const q = filterSearch.toLowerCase();
    if (
      filterSearch &&
      !card.aluno.toLowerCase().includes(q) &&
      !card.matricula.includes(q) &&
      !String(card.id).includes(q)
    )
      return false;
    if (filterCategoria && card.categoria !== filterCategoria) return false;
    if (filterSetor && card.responsavel !== filterSetor) return false;
    if (filterOrigem && card.origem !== filterOrigem) return false;
    if (filterUrgentes && !card.urgente) return false;
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
  };

  const closeModal = () => {
    setSelected(null);
    setFinalizando(false);
  };

  const saveRelato = () => {
    if (!novoRelato.trim() || !selected) return;
    const hoje = new Date().toLocaleDateString("pt-BR");
    const updated = cards.map((c) =>
      c.id === selected.id
        ? {
            ...c,
            ultimoRelato: hoje.slice(0, 5),
            evolucoes: [
              ...c.evolucoes,
              {
                data: hoje,
                autor: "Servidor (Equipe Pedagógica)",
                texto: novoRelato,
                tipo: "relato" as const,
              },
            ],
          }
        : c
    );
    setCards(updated);
    setSelected(updated.find((c) => c.id === selected.id) ?? null);
    setNovoRelato("");
    setSavedRelato(true);
    setTimeout(() => setSavedRelato(false), 2500);
  };

  const finalizar = () => {
    if (!parecerFinal.trim() || !selected) return;
    const hoje = new Date().toLocaleDateString("pt-BR");
    const updated = cards.map((c) =>
      c.id === selected.id
        ? {
            ...c,
            status: "concluido" as Status,
            parecer: parecerFinal,
            evolucoes: [
              ...c.evolucoes,
              {
                data: hoje,
                autor: "Servidor (Equipe Pedagógica)",
                texto: `Encaminhamento finalizado. Parecer: ${parecerFinal}`,
                tipo: "conclusao" as const,
              },
            ],
          }
        : c
    );
    setCards(updated);
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

      <EncaminhamentosQuadros
        cards={cards}
        matchesFilter={matchesFilter}
        onOpenModal={openModal}
      />

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
      />
    </div>
  );
}
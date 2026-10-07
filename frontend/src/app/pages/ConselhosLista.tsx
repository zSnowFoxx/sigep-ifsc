import { useState } from "react";
import type { ReuniaoBrief, ReuniaoAberta } from "../types/conselho";
import {
  reunioesAbertasMock,
  reunioesRealizadasMock,
} from "../data/conselhoData";
import { CriarConselho } from "../components/Conselho/Modals/CriarConselho";
import { AgendarConselho } from "../components/Conselho/Modals/AgendarConselho";

import { ListaHeader } from "../components/Conselho/Lista/ListaHeader";
import { ListaFiltros } from "../components/Conselho/Lista/ListaFiltros";
import { ListaAbas } from "../components/Conselho/Lista/ListaAbas";
import { ListaAtivos } from "../components/Conselho/Lista/ListaAtivos";
import { ListaHistorico } from "../components/Conselho/Lista/ListaHistorico";

interface PropsConselhosLista {
  onEnterConselho: (tipo: "intermediario" | "final") => void;
}

export default function ConselhosLista({
  onEnterConselho,
}: PropsConselhosLista) {
  const [activeTab, setActiveTab] = useState<"abertas" | "historico">("abertas");
  const [search, setSearch] = useState("");
  const [filterCurso, setFilterCurso] = useState("");
  const [filterEtapa, setFilterEtapa] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [agendarFinalFor, setAgendarFinalFor] = useState<ReuniaoBrief | null>(
    null
  );

  const [promotedIds, setPromotedIds] = useState<Set<number>>(new Set());
  const [promotedFinais, setPromotedFinais] = useState<ReuniaoAberta[]>([]);

  const handleConfirmAgendarFinal = (
    novoFinal: ReuniaoAberta,
    reuniaoId: number
  ) => {
    setPromotedFinais((prev) => [...prev, novoFinal]);
    setPromotedIds((prev) => new Set([...prev, reuniaoId]));
  };

  const filteredAbertas = reunioesAbertasMock.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.titulo.toLowerCase().includes(q) ||
      r.turmas.some((t) => t.toLowerCase().includes(q));
    const matchEtapa = !filterEtapa || r.etapa === filterEtapa;
    return matchSearch && matchEtapa;
  });

  const filteredInter = filteredAbertas.filter(
    (r) => r.etapa === "Intermediário" && !promotedIds.has(r.id)
  );

  const filteredFinais = [
    ...filteredAbertas.filter((r) => r.etapa === "Final"),
    ...promotedFinais.filter((r) => {
      const q = search.toLowerCase();
      return (
        !search ||
        r.titulo.toLowerCase().includes(q) ||
        r.turmas.some((t) => t.toLowerCase().includes(q))
      );
    }),
  ];

  const filteredHistorico = reunioesRealizadasMock.filter((r) => {
    const q = search.toLowerCase();
    return !search || r.titulo.toLowerCase().includes(q);
  });

  return (
    <div
      className="flex flex-col h-full bg-background overflow-x-hidden"
      style={{ width: "100%" }}
    >
      {/* Page Header */}
      <ListaHeader onOpenCriarConselho={() => setDrawerOpen(true)} />

      {/* Filter Toolbar */}
      <ListaFiltros
        search={search}
        onSearchChange={setSearch}
        filterCurso={filterCurso}
        onFilterCursoChange={setFilterCurso}
        filterEtapa={filterEtapa}
        onFilterEtapaChange={setFilterEtapa}
        onClearFilters={() => {
          setFilterCurso("");
          setFilterEtapa("");
        }}
      />

      {/* Tabs Header */}
      <ListaAbas
        activeTab={activeTab}
        onTabChange={setActiveTab}
        countAbertas={reunioesAbertasMock.length}
        countHistorico={reunioesRealizadasMock.length}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Tab A: Conselhos Abertos */}
        {activeTab === "abertas" && (
          <ListaAtivos
            filterEtapa={filterEtapa}
            filteredInter={filteredInter}
            filteredFinais={filteredFinais}
            onAgendarFinal={(r) => setAgendarFinalFor(r)}
            onEnterConselho={onEnterConselho}
          />
        )}

        {/* Tab B: Histórico */}
        {activeTab === "historico" && (
          <ListaHistorico
            filteredHistorico={filteredHistorico}
            onOpenCriarConselho={() => setDrawerOpen(true)}
          />
        )}
      </div>

      {/* Modais */}
      <CriarConselho
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onConfirm={() => onEnterConselho("intermediario")}
      />

      <AgendarConselho
        agendarFinalFor={agendarFinalFor}
        onClose={() => setAgendarFinalFor(null)}
        onConfirm={handleConfirmAgendarFinal}
      />
    </div>
  );
}
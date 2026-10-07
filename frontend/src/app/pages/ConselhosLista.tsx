import { useCallback, useEffect, useMemo, useState } from "react";
import type { Conselho, ConselhoMode, ReuniaoBrief } from "../types/conselho";
import {
  conselhosService,
  fetchConselhoRefs,
  toReuniaoAberta,
  toReuniaoRealizada,
  type ConselhoRefs,
} from "../services/conselhoService";
import { CriarConselho } from "../components/Conselho/Modals/CriarConselho";
import { AgendarConselho } from "../components/Conselho/Modals/AgendarConselho";

import { ListaHeader } from "../components/Conselho/Lista/ListaHeader";
import { ListaFiltros } from "../components/Conselho/Lista/ListaFiltros";
import { ListaAbas } from "../components/Conselho/Lista/ListaAbas";
import { ListaAtivos } from "../components/Conselho/Lista/ListaAtivos";
import { ListaHistorico } from "../components/Conselho/Lista/ListaHistorico";

interface PropsConselhosLista {
  onEnterConselho: (tipo: ConselhoMode, conselhoId: number) => void;
}

const semRefs: ConselhoRefs = { turmas: [], cursos: [], servidores: [] };

export default function ConselhosLista({
  onEnterConselho,
}: PropsConselhosLista) {
  const [activeTab, setActiveTab] = useState<"abertas" | "historico">("abertas");
  const [search, setSearch] = useState("");
  const [filterCurso, setFilterCurso] = useState("");
  const [filterEtapa, setFilterEtapa] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [agendarFinalFor, setAgendarFinalFor] = useState<Conselho | null>(null);

  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  const [refs, setRefs] = useState<ConselhoRefs>(semRefs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [lista, referencias] = await Promise.all([
        conselhosService.getAll(),
        fetchConselhoRefs(),
      ]);
      setConselhos(lista);
      setRefs(referencias);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar os conselhos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCriar = async (dados: {
    nome: string;
    turmaIds: number[];
    servidorIds: number[];
  }) => {
    const novo = await conselhosService.create({
      nome: dados.nome,
      tipo: 1,
      status: "em_andamento",
      turmaIds: dados.turmaIds,
      servidores: dados.servidorIds.map((usuarioId) => ({ usuarioId })),
    });
    onEnterConselho("intermediario", novo.id);
  };

  // "Iniciar Conselho" de um final agendado passa a realização para em andamento.
  const handleEnter = async (tipo: ConselhoMode, conselhoId: number) => {
    const conselho = conselhos.find((c) => c.id === conselhoId);
    if (tipo === "final" && conselho?.status === "agendado") {
      try {
        await conselhosService.update(conselhoId, { status: "em_andamento" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao iniciar o conselho.");
        return;
      }
    }
    onEnterConselho(tipo, conselhoId);
  };

  const handleAgendarFinal = async (dados: {
    origemId: number;
    nome: string;
    turmaIds: number[];
    servidorIds: number[];
    dataRealizacao: string;
  }) => {
    await conselhosService.create({
      nome: dados.nome,
      tipo: 2,
      status: "agendado",
      conselhoOrigemId: dados.origemId,
      dataRealizacao: dados.dataRealizacao,
      turmaIds: dados.turmaIds,
      servidores: dados.servidorIds.map((usuarioId) => ({ usuarioId })),
    });
    await load();
  };

  const q = search.toLowerCase();

  // Um intermediário que já originou um conselho final deixa de aparecer como aberto.
  const origemIds = useMemo(
    () =>
      new Set(
        conselhos.flatMap((c) => (c.conselho_origem_id !== null ? [c.conselho_origem_id] : []))
      ),
    [conselhos]
  );

  const abertas = useMemo(
    () =>
      conselhos
        .filter((c) => c.status !== "encerrado")
        .map((c) => toReuniaoAberta(c, refs)),
    [conselhos, refs]
  );

  const realizadas = useMemo(
    () => conselhos.filter((c) => c.status === "encerrado").map(toReuniaoRealizada),
    [conselhos]
  );

  const filteredAbertas = abertas.filter((r) => {
    const matchSearch =
      !search ||
      r.titulo.toLowerCase().includes(q) ||
      r.turmas.some((t) => t.toLowerCase().includes(q));
    const matchEtapa = !filterEtapa || r.etapa === filterEtapa;
    return matchSearch && matchEtapa;
  });

  const filteredInter = filteredAbertas.filter(
    (r) => r.etapa === "Intermediário" && !origemIds.has(r.id)
  );

  const filteredFinais = filteredAbertas.filter((r) => r.etapa === "Final");

  const filteredHistorico = realizadas.filter(
    (r) => !search || r.titulo.toLowerCase().includes(q)
  );

  const handleOpenAgendar = (reuniao: ReuniaoBrief) =>
    setAgendarFinalFor(conselhos.find((c) => c.id === reuniao.id) ?? null);

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
        countAbertas={abertas.length}
        countHistorico={realizadas.length}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-16">
            Carregando conselhos...
          </p>
        ) : error ? (
          <p className="text-sm font-semibold text-red-600 text-center py-16">
            {error}
          </p>
        ) : (
          <>
            {/* Tab A: Conselhos Abertos */}
            {activeTab === "abertas" && (
              <ListaAtivos
                filterEtapa={filterEtapa}
                filteredInter={filteredInter}
                filteredFinais={filteredFinais}
                onAgendarFinal={handleOpenAgendar}
                onEnterConselho={handleEnter}
              />
            )}

            {/* Tab B: Histórico */}
            {activeTab === "historico" && (
              <ListaHistorico
                filteredHistorico={filteredHistorico}
                onOpenCriarConselho={() => setDrawerOpen(true)}
              />
            )}
          </>
        )}
      </div>

      {/* Modais */}
      <CriarConselho
        isOpen={drawerOpen}
        refs={refs}
        onClose={() => setDrawerOpen(false)}
        onConfirm={handleCriar}
      />

      <AgendarConselho
        agendarFinalFor={agendarFinalFor}
        refs={refs}
        onClose={() => setAgendarFinalFor(null)}
        onConfirm={handleAgendarFinal}
      />
    </div>
  );
}

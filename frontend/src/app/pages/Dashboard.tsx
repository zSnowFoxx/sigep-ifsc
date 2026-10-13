import Cards from "../components/Dashboard/Cards";
import Filtros from "../components/Dashboard/Filtros";
import PainelRisco from "../components/Dashboard/PainelRisco";
import { useState } from "react";
import ModalEncaminhamento from "../components/Conselho/Modals/ModalEncaminhamento";
import { backend } from "../services/apiClient";
import { criarEncaminhamentoNovo, type ServidorRef } from "../services/conselhoService";
import type { UserSession } from "../types/auth";
import type { StudentRisk } from "../types/dashboard";
import type { Aluno } from "../types/conselho";

interface DashboardProps {
  selectedPeriod: string;
  filterCurso: string;
  setFilterCurso: (v: string) => void;
  filterFase: string;
  setFilterFase: (v: string) => void;
  filterTurma: string;
  setFilterTurma: (v: string) => void;
  filterDisciplina: string;
  setFilterDisciplina: (v: string) => void;
  filteredStudents: StudentRisk[];
  totalRiskStudents: number;
  hidden?: boolean;
  loggedUser?: UserSession | null;
}

export default function Dashboard({
  selectedPeriod,
  filterCurso,
  setFilterCurso,
  filterFase,
  setFilterFase,
  filterTurma,
  setFilterTurma,
  filterDisciplina,
  setFilterDisciplina,
  filteredStudents,
  totalRiskStudents,
  hidden = false,
  loggedUser = null,
}: DashboardProps) {
  // Modal "Encaminhar" do painel de risco (encaminhamento sem conselho, origem "Painel de Risco").
  const [novoEncOpen, setNovoEncOpen] = useState(false);
  const [neMatricula, setNeMatricula] = useState("");
  const [neTitulo, setNeTitulo] = useState("");
  const [neCategoria, setNeCategoria] = useState("");
  const [neServidorId, setNeServidorId] = useState("");
  const [neDescricao, setNeDescricao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erroEnc, setErroEnc] = useState("");
  const [servidores, setServidores] = useState<ServidorRef[] | null>(null);

  // Alunos do painel (o id vem do backend junto com o risco).
  const alunosModal: Aluno[] = filteredStudents.map((fs) => ({
    id: fs.id,
    matricula: fs.matricula,
    nome: fs.nome,
    turma: fs.turma || "",
    atencao: true,
    risco: fs.fatores.includes("Risco alto de evasão"),
  }));

  // Ação ao clicar em "Encaminhar" na tabela; os servidores são carregados na primeira abertura.
  const handleOpenEncaminhamento = (matricula: string) => {
    const aluno = alunosModal.find((a) => a.matricula === matricula);
    setNeMatricula(matricula);
    setNeTitulo(aluno ? `Encaminhamento — ${aluno.nome}` : "");
    setNeCategoria("");
    setNeServidorId("");
    setNeDescricao("");
    setErroEnc("");
    setNovoEncOpen(true);
    if (!servidores) {
      backend<ServidorRef[]>("/users")
        .then((lista) => setServidores(lista.map((u) => ({ id: u.id, nome: u.nome }))))
        .catch((err) => setErroEnc(err instanceof Error ? err.message : "Erro ao carregar os servidores."));
    }
  };

  const submitNovoEncaminhamento = async () => {
    const aluno = alunosModal.find((a) => a.matricula === neMatricula);
    if (!aluno || !neTitulo.trim() || !neCategoria) return;
    setSalvando(true);
    setErroEnc("");
    try {
      await criarEncaminhamentoNovo({
        alunoId: aluno.id,
        titulo: neTitulo.trim(),
        categoria: neCategoria,
        servidorResponsavelId: neServidorId ? Number(neServidorId) : null,
        descricao: neDescricao,
      });
      setNovoEncOpen(false);
    } catch (err) {
      setErroEnc(err instanceof Error ? err.message : "Erro ao criar o encaminhamento.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <main className={`flex-1 overflow-y-auto px-6 py-5 space-y-5 ${hidden ? "hidden" : ""}`}>
      <div>
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Visão geral do período letivo {selectedPeriod}</p>
      </div>

      <Cards periodo={selectedPeriod} />

      <Filtros
        periodo={selectedPeriod}
        filterCurso={filterCurso}
        setFilterCurso={setFilterCurso}
        filterFase={filterFase}
        setFilterFase={setFilterFase}
        filterTurma={filterTurma}
        setFilterTurma={setFilterTurma}
        filterDisciplina={filterDisciplina}
        setFilterDisciplina={setFilterDisciplina}
      />

      <PainelRisco
        filteredStudents={filteredStudents}
        totalRiskStudents={totalRiskStudents}
        selectedPeriod={selectedPeriod}
        onEncaminhar={handleOpenEncaminhamento}
        loggedUser={loggedUser}
      />

      {novoEncOpen && (
        <ModalEncaminhamento
          setNovoEncOpen={setNovoEncOpen}
          alunos={alunosModal}
          servidores={servidores ?? []}
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
          submitNovoEnc={submitNovoEncaminhamento}
          erro={erroEnc}
        />
      )}

      <div className="h-4" />
    </main>
  );
}
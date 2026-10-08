import Cards from "../components/Dashboard/Cards";
import Filtros from "../components/Dashboard/Filtros";
import PainelRisco from "../components/Dashboard/PainelRisco";
import ModalEncaminhamento from "../components/Conselho/Modals/ModalEncaminhamento";
import { conselhoData } from "../data/conselhoData";
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
  conselhoId?: number;
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
  conselhoId = 1, // ID do conselho ativo padrão
}: DashboardProps) {
  // Consumo do hook conselhoData
  const {
    dados,
    novoEncOpen,
    setNovoEncOpen,
    neMatricula,
    setNeMatricula,
    neTitulo,
    setNeTitulo,
    neCategoria,
    setNeCategoria,
    neServidorId,
    setNeServidorId,
    neDescricao,
    setNeDescricao,
    salvando,
    submitNovoEncaminhamento,
  } = conselhoData({ conselhoId });

  // Consolida os alunos do conselho e do dashboard para que a busca da Turma e Seleção funcionem 100%
  const alunosConselho = dados?.alunos ?? [];
  const alunosModal: Aluno[] = [
  ...alunosConselho,
  ...filteredStudents
    .filter((fs) => !alunosConselho.some((a) => a.matricula === fs.matricula))
    .map((fs) => ({
      id: Number(fs.matricula) || 0,
      matricula: fs.matricula,
      nome: fs.nome,
      turma: fs.turma || "",
      atencao: false, // Propriedade obrigatória da interface Aluno
      risco: fs.risco ? true : false,
    } as Aluno)),
];

  // Ação ao clicar em "Encaminhar" na tabela
  const handleOpenEncaminhamento = (matricula: string) => {
    const aluno = alunosModal.find((a) => a.matricula === matricula);
    
    setNeMatricula(matricula);
    // Sugere um título padrão inicial (opcional)
    setNeTitulo(aluno ? `Encaminhamento — ${aluno.nome}` : "");
    setNovoEncOpen(true);
  };

  return (
    <main className={`flex-1 overflow-y-auto px-6 py-5 space-y-5 ${hidden ? "hidden" : ""}`}>
      <div>
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Visão geral do período letivo {selectedPeriod}</p>
      </div>

      <Cards />

      <Filtros
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

      {/* Modal de Encaminhamento controlado pelo estado do conselhoData */}
      {novoEncOpen && (
        <ModalEncaminhamento
          setNovoEncOpen={setNovoEncOpen}
          alunos={alunosModal}
          servidores={dados?.servidores ?? []}
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
        />
      )}

      <div className="h-4" />
    </main>
  );
}
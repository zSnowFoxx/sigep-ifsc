import Cards from "../components/Dashboard/Cards";
import Filtros from "../components/Dashboard/Filtros";
import PainelRisco from "../components/Dashboard/PainelRisco";
import type { StudentRisk } from "../types/dashboard";

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
  onStartAttendance: (student: { matricula: string; nome: string; turma: string }) => void;
  hidden?: boolean;
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
  onStartAttendance,
  hidden = false,
}: DashboardProps) {
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
        onStartAttendance={onStartAttendance}
      />

      <div className="h-4" />
    </main>
  );
}
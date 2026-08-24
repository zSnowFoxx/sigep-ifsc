import { useState } from "react";

// import Login from "./pages/Login";
// import ConselhoFinal from "./pages/ConselhoFinal";
// import ConselhosLista from "./pages/ConselhosLista";
// import Atendimentos from "./pages/Atendimentos";
// import Encaminhamentos from "./pages/Encaminhamentos";
// import ImportarDados from "./pages/ImportarDados";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { riskStudents } from "./data/mockData";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const [conselhoMode, setConselhoMode] = useState<"list" | "workspace">("list");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [importarOpen, setImportarOpen] = useState(false);
  const [naeStudent, setNaeStudent] = useState<{ matricula: string; nome: string; turma: string } | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("2026.1");
  const [filterCurso, setFilterCurso] = useState("");
  const [filterFase, setFilterFase] = useState("");
  const [filterTurma, setFilterTurma] = useState("");
  const [filterDisciplina, setFilterDisciplina] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  const filteredStudents = riskStudents.filter((s) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.nome.toLowerCase().includes(q) ||
        s.matricula.includes(q) ||
        s.turma.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // if (!authenticated) {
  //   return <Login onLogin={() => setAuthenticated(true)} />;
  // }

  return (
    <div
      className="flex h-screen w-full overflow-hidden bg-background"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        setImportarOpen={setImportarOpen}
        setConselhoMode={setConselhoMode}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          hidden={activeNav === 1 && conselhoMode === "workspace"}
        />

        {/* {activeNav === 1 ? (
          <div className="flex-1 min-h-0 overflow-hidden">
            {conselhoMode === "list" ? (
              <ConselhosLista onEnterConselho={() => setConselhoMode("workspace")} />
            ) : (
              <ConselhoFinal onNavigate={setActiveNav} onBack={() => setConselhoMode("list")} />
            )}
          </div>
        ) : activeNav === 2 ? (
          <div className="flex-1 min-h-0 overflow-hidden">
            <Atendimentos
              initialStudent={naeStudent}
              onClearInitialStudent={() => setNaeStudent(null)}
            />
          </div>
        ) : activeNav === 3 ? (
          <div className="flex-1 min-h-0 overflow-hidden">
            <Encaminhamentos />
          </div>
        ) : null} */}

        <Dashboard
          selectedPeriod={selectedPeriod}
          filterCurso={filterCurso}
          setFilterCurso={setFilterCurso}
          filterFase={filterFase}
          setFilterFase={setFilterFase}
          filterTurma={filterTurma}
          setFilterTurma={setFilterTurma}
          filterDisciplina={filterDisciplina}
          setFilterDisciplina={setFilterDisciplina}
          filteredStudents={filteredStudents}
          totalRiskStudents={riskStudents.length}
          onStartAttendance={(student) => {
            setNaeStudent(student);
            setActiveNav(2);
          }}
          hidden={activeNav !== 0}
        />
      </div>

      {/* {importarOpen && <ImportarDados onClose={() => setImportarOpen(false)} />} */}
    </div>
  );
}
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Cadastros from "./pages/Cadastros";
import Atendimentos from "./pages/Atendimentos";
import ConselhosLista from "./pages/ConselhosLista";
import ImportarDados from "./pages/ImportarDados";
import Encaminhamentos from "./pages/Encaminhamentos";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import type { UserProfile } from "./types/auth";
import { fetchRiskStudents } from "./services/dashService";
import { fetchCurrentUser } from "./services/profileService";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  // const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState(0);
  const [conselhoMode, setConselhoMode] = useState<"list" | "workspace">("list");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [importarOpen, setImportarOpen] = useState(false);
  const [naeStudent, setNaeStudent] = useState<{ matricula: string; nome: string; turma: string } | null>(null);
  const [riskStudents, setRiskStudents] = useState<Array<any>>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("2026.1");
  const [filterCurso, setFilterCurso] = useState("");
  const [filterFase, setFilterFase] = useState("");
  const [filterTurma, setFilterTurma] = useState("");
  const [filterDisciplina, setFilterDisciplina] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = await fetchCurrentUser();
        if (user) {
          setUserProfile(user);
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        console.error("Erro ao buscar perfil do usuário:", err);
        setUserProfile(null);
        setAuthenticated(false);
      } finally {
        // setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchRiskStudents().then((data) => {
      if (mounted) setRiskStudents(data as any[]);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!authenticated) {
    return (
      <Login 
        onLogin={(user) => {
          setUserProfile(user);
          setAuthenticated(true);
        }} 
      />
    );
  }

  return (
    <div
      className="flex h-screen w-full overflow-hidden bg-background"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        activeNav={activeNav}
        setActiveNav={(nav) => {
          setActiveNav(nav);
          // Reseta para visualização em lista ao mudar de aba
          if (nav === 1) setConselhoMode("list");
        }}
        setImportarOpen={setImportarOpen}
        setConselhoMode={setConselhoMode}
        userProfile={userProfile}
        showPerfil={showPerfil}
        setShowPerfil={setShowPerfil}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          setActiveNav={setActiveNav}
          setConselhoMode={setConselhoMode}
          setImportarOpen={setImportarOpen}
          setShowPerfil={setShowPerfil}
          hidden={showPerfil || (activeNav === 1 && conselhoMode === "workspace")}
        />

        {showPerfil && userProfile ? (
          <Profile
            profile={userProfile}
            onLogout={() => {
              localStorage.removeItem("userEmail");
              sessionStorage.removeItem("userEmail");
              setAuthenticated(false);
              setUserProfile(null);
              setShowPerfil(false);
            }}
          />
        ) : (
          <main className="flex-1 overflow-auto relative">
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
              filteredStudents={riskStudents}
              totalRiskStudents={riskStudents.length}
              onStartAttendance={(student) => {
                setNaeStudent(student);
                setActiveNav(2);
              }}
              hidden={activeNav !== 0}
            />

            {activeNav === 1 && (
              conselhoMode === "list" ? (
                <ConselhosLista 
                  onEnterConselho={() => setConselhoMode("workspace")} 
                />
              ) : (
                /* Caso possua uma página/componente separado de workspace: */
                /* <ConselhoWorkspace onBack={() => setConselhoMode("list")} /> */
                <div className="p-6">
                  <button 
                    onClick={() => setConselhoMode("list")} 
                    className="text-sm text-primary font-semibold underline mb-4"
                  >
                    ← Voltar para lista de conselhos
                  </button>
                  <p className="text-sm text-muted-foreground">Área de Realização do Conselho de Classe (Workspace)</p>
                </div>
              )
            )}

            {activeNav === 2 && (
              <Atendimentos
                initialStudent={naeStudent}
                onClearInitialStudent={() => setNaeStudent(null)}
              />
            )}

            {activeNav === 3 && <Encaminhamentos />}

            {(activeNav === 4 || importarOpen) && (
              <ImportarDados
                isOpen={importarOpen || activeNav === 4}
                onClose={() => {
                  setImportarOpen(false);
                  if (activeNav === 4) setActiveNav(0);
                }}
              />
            )}

            {activeNav === 5 && <Cadastros />}
          </main>
        )}
      </div>
    </div>
  );
}
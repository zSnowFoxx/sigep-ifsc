import { useState } from "react";
import { useEffect } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import type { UserProfile } from "./types/auth";
import { fetchRiskStudents } from "./data/dashData";
import { fetchCurrentUser } from "./data/authData";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
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
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

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
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  // Estado para controlar a exibição da tela do Perfil
  const [showPerfil, setShowPerfil] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchRiskStudents().then((data) => {
      if (mounted) setRiskStudents(data as any[]);
    });
    return () => {
      mounted = false;
    };
  }, []);

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

  // Verifica se o usuário está autenticado antes de renderizar o conteúdo principal
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
        setActiveNav={setActiveNav}
        setImportarOpen={setImportarOpen}
        setConselhoMode={setConselhoMode}
        userProfile={userProfile}
        showPerfil={showPerfil}
        setShowPerfil={setShowPerfil}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
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
            totalRiskStudents={fetchRiskStudents.length}
            onStartAttendance={(student) => {
              setNaeStudent(student);
              setActiveNav(2);
            }}
            hidden={activeNav !== 0}
          />
        )}
      </div>
    </div>
  );
}
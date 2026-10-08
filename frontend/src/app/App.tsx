import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Cadastros from "./pages/Cadastros";
import Atendimentos from "./pages/Atendimentos";
import ConselhosLista from "./pages/ConselhosLista";
import ConselhoDeClasse from "./pages/ConselhoDeClasse";
import ImportarDados from "./pages/ImportarDados";
import Encaminhamentos from "./pages/Encaminhamentos";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import type { UserSession } from "./types/auth";
import type { StudentRisk } from "./types/dashboard";
import { fetchRiskStudents } from "./services/dashService";
import { fetchSessionUser, clearSession } from "./services/authService";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserSession | null>(null);
  // const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState(0);
  const [conselhoMode, setConselhoMode] = useState<"list" | "workspace">("list");
  const [conselhoTipo, setConselhoTipo] = useState<"intermediario" | "final">("intermediario");
  const [conselhoId, setConselhoId] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [importarOpen, setImportarOpen] = useState(false);
  const [naeStudent, setNaeStudent] = useState<{ matricula: string; nome: string; turma: string } | null>(null);
  const [riskStudents, setRiskStudents] = useState<StudentRisk[]>([]);
  const [totalRiskStudents, setTotalRiskStudents] = useState(0);
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
        const user = await fetchSessionUser();
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

  // Painel de risco do período selecionado; com filtros, busca também o total do período
  // para o "Exibindo X de Y".
  useEffect(() => {
    let mounted = true;
    const temFiltro = Boolean(filterCurso || filterFase || filterTurma || filterDisciplina);
    Promise.all([
      fetchRiskStudents({
        periodo: selectedPeriod,
        curso: filterCurso,
        fase: filterFase,
        turma: filterTurma,
        disciplina: filterDisciplina,
      }),
      temFiltro ? fetchRiskStudents({ periodo: selectedPeriod }) : null,
    ])
      .then(([filtrados, todos]) => {
        if (!mounted) return;
        setRiskStudents(filtrados);
        setTotalRiskStudents((todos ?? filtrados).length);
      })
      .catch((err) => console.error("Erro ao carregar o painel de risco:", err));
    return () => {
      mounted = false;
    };
  }, [selectedPeriod, filterCurso, filterFase, filterTurma, filterDisciplina]);

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
        conselhoMode={conselhoMode}
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
              clearSession();
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
              totalRiskStudents={totalRiskStudents}
              hidden={activeNav !== 0}
              loggedUser={userProfile}
            />

            {activeNav === 1 && (
              conselhoMode === "list" ? (
                <ConselhosLista
                  onEnterConselho={(tipo, id) => { setConselhoTipo(tipo); setConselhoId(id); setConselhoMode("workspace"); }}
                />
              ) : (
                conselhoId !== null && (
                  <ConselhoDeClasse
                    key={conselhoId}
                    conselhoId={conselhoId}
                    onBack={() => setConselhoMode("list")}
                    mode={conselhoTipo}
                  />
                )
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
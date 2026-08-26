import { GraduationCap, ChevronLeft } from "lucide-react";
import { navItems } from "../data/sideData";
import type { UserProfile } from "../types/auth";

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeNav: number;
  setActiveNav: (index: number) => void;
  setImportarOpen: (open: boolean) => void;
  setConselhoMode: (mode: "list" | "workspace") => void;
  userProfile: UserProfile | null;
  showPerfil: boolean;
  setShowPerfil: (show: boolean) => void;
}

export default function Sidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  activeNav,
  setActiveNav,
  setImportarOpen,
  setConselhoMode,
  userProfile,
  showPerfil,
  setShowPerfil,
}: SidebarProps) {
  return (
    <aside
      className="flex flex-col shrink-0 h-full transition-all duration-300 ease-in-out overflow-hidden"
      style={{
        width: sidebarCollapsed ? "56px" : "256px",
        background: "var(--sidebar)",
      }}
    >
      <div
        className="flex items-center border-b shrink-0"
        style={{
          borderColor: "var(--sidebar-border)",
          padding: sidebarCollapsed ? "16px 0" : "16px 20px",
          justifyContent: sidebarCollapsed ? "center" : "space-between",
          minHeight: "64px",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "var(--sidebar-primary)" }}
          >
            <GraduationCap size={20} color="white" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p
                className="text-sm font-bold tracking-wide whitespace-nowrap"
                style={{ color: "var(--sidebar-foreground)" }}
              >
                SIGEP
              </p>
              <p
                className="text-xs leading-tight whitespace-nowrap"
                style={{ color: "rgba(232,240,235,0.55)" }}
              >
                Sistema de Gestão Pedagógica
              </p>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors hover:bg-white/10"
            style={{ color: "rgba(232,240,235,0.6)" }}
            title="Recolher menu"
          >
            <ChevronLeft size={15} />
          </button>
        )}
      </div>

      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="w-full flex items-center justify-center py-2 transition-colors hover:bg-white/10"
          style={{
            color: "rgba(232,240,235,0.6)",
            borderBottom: "1px solid var(--sidebar-border)",
          }}
          title="Expandir menu"
        >
          <ChevronLeft size={15} style={{ transform: "rotate(180deg)" }} />
        </button>
      )}

      <nav
        className="flex-1 py-3 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden"
        style={{ padding: sidebarCollapsed ? "12px 0" : "16px 12px" }}
      >
        {navItems.map((item, i) => {
          const isActive = !showPerfil && activeNav === i;
          return (
            <button
              key={i}
              onClick={() => {
                setShowPerfil(false);
                if (i === 4) {
                  setImportarOpen(true);
                } else {
                  setActiveNav(i);
                  if (i !== 1) setConselhoMode("list");
                }
              }}
              title={sidebarCollapsed ? item.label : undefined}
              className="flex items-center rounded-lg text-left w-full transition-colors duration-150 relative group"
              style={{
                gap: sidebarCollapsed ? "0" : "12px",
                padding: sidebarCollapsed ? "10px 0" : "10px 12px",
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
                background: isActive ? "var(--sidebar-accent)" : "transparent",
                color: isActive
                  ? "var(--sidebar-foreground)"
                  : "rgba(232,240,235,0.65)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.color = "var(--sidebar-foreground)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(232,240,235,0.65)";
                }
              }}
            >
              <item.icon size={17} className="shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium leading-tight">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {userProfile && (() => {
        const initials = userProfile.name
          .split(" ")
          .filter(Boolean)
          .map((n) => n[0].toUpperCase())
          .slice(0, 2)
          .join("");

        const roleShort = (() => {
          if (userProfile.role === "Professor") {
            const first = userProfile.disciplines?.[0];
            return first
              ? `Prof. — ${first.length > 16 ? first.slice(0, 14) + "…" : first}`
              : "Professor";
          }
          if (userProfile.role === "Coordenador de Curso") return "Coordenador de Curso";
          if (userProfile.role === "Equipe Pedagógica/NAE") return "Equipe Pedagógica";
          return userProfile.role;
        })();

        const displayName = userProfile.name.split(" ").slice(0, 2).join(" ");

        return (
          <button
            type="button"
            onClick={() => setShowPerfil(true)}
            className="border-t shrink-0 w-full text-left transition-colors"
            style={{
              borderColor: "var(--sidebar-border)",
              padding: sidebarCollapsed ? "12px 0" : "12px 16px",
              background: showPerfil ? "rgba(255,255,255,0.08)" : "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.07)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = showPerfil
                ? "rgba(255,255,255,0.08)"
                : "transparent";
            }}
            title={
              sidebarCollapsed
                ? `${userProfile.name} — ${roleShort}`
                : "Meu Perfil"
            }
          >
            <div
              className="flex items-center"
              style={{
                gap: sidebarCollapsed ? "0" : "10px",
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: "var(--sidebar-primary)",
                  color: "white",
                }}
              >
                {initials}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <p
                    className="text-xs font-semibold truncate leading-tight"
                    style={{ color: "var(--sidebar-foreground)" }}
                  >
                    {displayName}
                  </p>
                  <p
                    className="text-xs truncate leading-tight mt-0.5"
                    style={{ color: "rgba(232,240,235,0.55)" }}
                  >
                    {roleShort}
                  </p>
                </div>
              )}
            </div>
          </button>
        );
      })()}
    </aside>
  );
}
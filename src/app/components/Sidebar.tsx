import { GraduationCap, ChevronLeft } from "lucide-react";
import { navItems } from "../data/mockData";

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeNav: number;
  setActiveNav: (index: number) => void;
  setImportarOpen: (open: boolean) => void;
  setConselhoMode: (mode: "list" | "workspace") => void;
}

export default function Sidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  activeNav,
  setActiveNav,
  setImportarOpen,
  setConselhoMode,
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
              <p className="text-sm font-bold tracking-wide whitespace-nowrap" style={{ color: "var(--sidebar-foreground)" }}>
                SIGEP
              </p>
              <p className="text-xs leading-tight whitespace-nowrap" style={{ color: "rgba(232,240,235,0.55)" }}>
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
          style={{ color: "rgba(232,240,235,0.6)", borderBottom: "1px solid var(--sidebar-border)" }}
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
          const isActive = activeNav === i;
          return (
            <button
              key={i}
              onClick={() => {
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
                color: isActive ? "var(--sidebar-foreground)" : "rgba(232,240,235,0.65)",
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
                <span className="text-sm font-medium leading-tight">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div
        className="border-t shrink-0"
        style={{
          borderColor: "var(--sidebar-border)",
          padding: sidebarCollapsed ? "12px 0" : "12px 16px",
        }}
      >
        <div
          className="flex items-center"
          style={{
            gap: sidebarCollapsed ? "0" : "12px",
            justifyContent: sidebarCollapsed ? "center" : "flex-start",
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "var(--sidebar-primary)", color: "white" }}
            title={sidebarCollapsed ? "Servidor — Equipe Pedagógica" : undefined}
          >
            EP
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: "var(--sidebar-foreground)" }}>
                Servidor
              </p>
              <p className="text-xs truncate" style={{ color: "rgba(232,240,235,0.5)" }}>
                Equipe Pedagógica
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
import { Search, X, Bell, AlertTriangle, Clock, CheckCircle, ChevronDown } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifOpen: boolean;
  setNotifOpen: (open: boolean) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  hidden?: boolean;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  notifOpen,
  setNotifOpen,
  selectedPeriod,
  setSelectedPeriod,
  hidden = false,
}: HeaderProps) {
  if (hidden) return null;

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-5 gap-4 shrink-0 z-10">
      <div className="flex-1 relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar aluno por nome, matrícula ou turma..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
        />
        {searchQuery && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchQuery("")}
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Bell size={16} className="text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-white" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 w-72 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-sm font-semibold">Notificações</span>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">3 novas</span>
              </div>
              {[
                { icon: AlertTriangle, text: "3 alunos em risco crítico identificados", time: "Agora", color: "text-red-500" },
                { icon: Clock, text: "Conselho de Classe em 2 dias", time: "há 1h", color: "text-amber-500" },
                { icon: CheckCircle, text: "Importação SIGAA concluída", time: "há 3h", color: "text-green-600" },
              ].map((n, i) => (
                <div key={i} className="px-4 py-3 hover:bg-muted/50 border-b border-border last:border-0 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <n.icon size={15} className={`${n.color} shrink-0 mt-0.5`} />
                    <div>
                      <p className="text-xs leading-snug text-foreground">{n.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 text-sm font-semibold rounded-lg border border-border bg-card cursor-pointer outline-none focus:border-primary hover:border-primary/50 transition-colors"
            style={{ color: "var(--primary)" }}
          >
            <option value="2026.1">Período: 2026.1</option>
            <option value="2025.2">Período: 2025.2</option>
            <option value="2025.1">Período: 2025.1</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>
    </header>
  );
}
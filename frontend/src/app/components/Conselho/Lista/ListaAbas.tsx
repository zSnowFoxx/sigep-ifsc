interface ListaAbasProps {
  activeTab: "abertas" | "historico";
  onTabChange: (tab: "abertas" | "historico") => void;
  countAbertas: number;
  countHistorico: number;
}

export function ListaAbas({
  activeTab,
  onTabChange,
  countAbertas,
  countHistorico,
}: ListaAbasProps) {
  return (
    <div className="bg-card border-b border-border px-6 shrink-0">
      <div className="flex gap-0">
        {[
          {
            id: "abertas",
            label: "Conselhos Abertos",
            count: countAbertas,
          },
          {
            id: "historico",
            label: "Histórico de Realizados",
            count: countHistorico,
          },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as "abertas" | "historico")}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all"
              style={{
                borderColor: active ? "var(--primary)" : "transparent",
                color: active
                  ? "var(--primary)"
                  : "var(--muted-foreground)",
              }}
            >
              {tab.label}
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: active ? "var(--primary)" : "var(--muted)",
                  color: active ? "white" : "var(--muted-foreground)",
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
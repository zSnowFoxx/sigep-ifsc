import { BookOpen, Users, AlertTriangle, TrendingDown } from "lucide-react";

export default function KpiCards() {
  const cards = [
    {
      label: "Total de Turmas",
      value: 24,
      icon: BookOpen,
      iconBg: "bg-[#e8f0eb]",
      iconColor: "text-[#15622f]",
      sub: "+2 em relação ao período anterior",
      highlight: false,
    },
    {
      label: "Alunos Cadastrados",
      value: 620,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      sub: "distribuídos em 24 turmas",
      highlight: false,
    },
    {
      label: "Atenção Pedagógica",
      value: 42,
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      sub: "6.8% do total de alunos",
      highlight: "red",
    },
    {
      label: "Encaminhamentos Ativos",
      value: 15,
      icon: TrendingDown,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      sub: "8 aguardando resposta",
      highlight: "amber",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-card rounded-xl border border-border p-4 flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow duration-200"
          style={{
            borderLeft:
              card.highlight === "red"
                ? "3px solid #ef4444"
                : card.highlight === "amber"
                ? "3px solid #f59e0b"
                : undefined,
            background:
              card.highlight === "red"
                ? "#fff8f8"
                : card.highlight === "amber"
                ? "#fffbf0"
                : undefined,
          }}
        >
          <div className="flex items-start justify-between">
            <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}>
              <card.icon size={17} className={card.iconColor} />
            </div>
            {card.highlight && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  card.highlight === "red" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                Atenção
              </span>
            )}
          </div>
          <div>
            <p
              className="text-3xl font-bold"
              style={{
                color:
                  card.highlight === "red"
                    ? "#dc2626"
                    : card.highlight === "amber"
                    ? "#b45309"
                    : "var(--foreground)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {card.value}
            </p>
            <p className="text-sm font-medium text-foreground mt-0.5">{card.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
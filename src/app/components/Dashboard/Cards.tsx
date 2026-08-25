import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import type { DashboardStats } from "../../types/dashboard";
import { fetchDashboardStats, getDashboardCards } from "../../data/dashData";

export default function Cards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin text-gray-500" size={24} />
      </div>
    );
  }

  const cards = getDashboardCards(stats);

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
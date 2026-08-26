import React from "react";
import type { CategoryKey } from "../../types/cadastros";
import { CATEGORIES } from "../../data/cadastrosData";

interface CadastrosCardsProps {
  activeTab: CategoryKey;
  onTabChange: (tab: CategoryKey) => void;
}

export const CadastrosCards: React.FC<CadastrosCardsProps> = ({ activeTab, onTabChange }) => (
  <div className="grid grid-cols-6 gap-3">
    {CATEGORIES.map((c) => {
      const isActive = c.key === activeTab;
      const Icon = c.icon;
      return (
        <button
          key={c.key}
          type="button"
          onClick={() => onTabChange(c.key)}
          className="flex flex-col items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md"
          style={{
            borderColor: isActive ? "#15622f" : "#e5e7eb",
            background: isActive ? "#f0faf4" : "white",
            boxShadow: isActive
              ? "0 0 0 1px rgba(21,98,47,0.1), 0 4px 12px rgba(21,98,47,0.09)"
              : undefined,
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: isActive
                ? "linear-gradient(135deg, #0f4a23, #15622f)"
                : "#f0f2f5",
            }}
          >
            <Icon size={17} color={isActive ? "white" : "#6b7280"} />
          </div>
          <div className="min-w-0 w-full">
            <p
              className="text-xs font-bold leading-tight"
              style={{ color: isActive ? "#0f4a23" : "#374151" }}
            >
              {c.label}
            </p>
            <p
              className="text-[10px] mt-1 font-medium"
              style={{ color: isActive ? "#15622f" : "#9ca3af" }}
            >
              {c.badge}
            </p>
          </div>
        </button>
      );
    })}
  </div>
);
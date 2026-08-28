import React from "react";
import { getInitials, avatarColor } from "../../utils/cadastrosUtils";

// ── Componentes de Badge conforme Figma ─────────────────────────────────────────

export interface AvatarProps {
  name: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 28 }) => {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size <= 28 ? 10 : 12,
        background: avatarColor(name),
      }}
    >
      {getInitials(name)}
    </div>
  );
};

export interface StatusBadgeProps {
  label?: string;
  status?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, status }) => {
  const text = label ?? status ?? "";
  const ok = text === "Ativo" || text === "Ativa";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        background: ok ? "#dcfce7" : "#f3f4f6",
        color: ok ? "#166534" : "#6b7280",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: ok ? "#16a34a" : "#9ca3af" }}
      />
      {text}
    </span>
  );
};

export interface CargoBadgeProps {
  label?: string;
  cargo?: string;
}

export const CargoBadge: React.FC<CargoBadgeProps> = ({ label, cargo }) => {
  const text = label ?? cargo ?? "";
  const map: Record<string, { bg: string; color: string }> = {
    Professor: { bg: "#eff6ff", color: "#1d4ed8" },
    "Coordenador de Curso": { bg: "#f0fdf4", color: "#15803d" },
    "Equipe Pedagógica/NAE": { bg: "#faf5ff", color: "#7e22ce" },
    "Servidor Geral": { bg: "#f9fafb", color: "#4b5563" },
  };
  const c = map[text] ?? { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
      style={{ background: c.bg, color: c.color }}
    >
      {text}
    </span>
  );
};

export interface FuncaoBadgeProps {
  tag: string;
}

export const FuncaoBadge: React.FC<FuncaoBadgeProps> = ({ tag }) => {
  const s = tag.startsWith("Turma:")
    ? { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" }
    : tag.startsWith("Coord.")
    ? { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" }
    : tag.startsWith("Prof.")
    ? { bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe" }
    : { bg: "#faf5ff", color: "#7e22ce", border: "#e9d5ff" };

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap border"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      {tag}
    </span>
  );
};

export interface TurmasBadgeProps {
  tag: string;
}

export const TurmasBadge: React.FC<TurmasBadgeProps> = ({ tag }) => {
  const s = tag.startsWith("TDS")
    ? { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" }
    : tag.startsWith("MEC")
    ? { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" }
    : tag.startsWith("ADM")
    ? { bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe" }
    : { bg: "#faf5ff", color: "#7e22ce", border: "#e9d5ff" };

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap border"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      {tag}
    </span>
  );
};

export interface SimpleBadgeProps {
  label: string;
}

export const PeriodBadge: React.FC<SimpleBadgeProps> = ({ label }) => {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md text-xs font-bold"
      style={{
        background: "#e8f0eb",
        color: "#0f4a23",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {label}
    </span>
  );
};

export const SiglaBadge: React.FC<SimpleBadgeProps> = ({ label }) => {
  return (
    <span
      className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider"
      style={{
        background: "#f0f2f5",
        color: "#374151",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {label}
    </span>
  );
};

export const PpcBadge: React.FC<SimpleBadgeProps> = ({ label }) => {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md text-xs font-bold"
      style={{ background: "#fef9c3", color: "#713f12" }}
    >
      {label}
    </span>
  );
};

export const GrauBadge: React.FC<SimpleBadgeProps> = ({ label }) => {
  const map: Record<string, { bg: string; color: string }> = {
    "Integrado ao EM": { bg: "#eff6ff", color: "#1d4ed8" },
    Concomitante: { bg: "#fef3c7", color: "#92400e" },
    Subsequente: { bg: "#f0fdf4", color: "#15803d" },
    Bacharelado: { bg: "#faf5ff", color: "#7e22ce" },
    Licenciatura: { bg: "#fff1f2", color: "#be123c" },
    Tecnólogo: { bg: "#f0fdfa", color: "#0f766e" },
  };
  const c = map[label] ?? { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap"
      style={{ background: c.bg, color: c.color }}
    >
      {label}
    </span>
  );
};

export const FaseBadge: React.FC<SimpleBadgeProps> = ({ label }) => {
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold"
      style={{ background: "#f5f3ff", color: "#6d28d9" }}
    >
      {label}
    </span>
  );
};
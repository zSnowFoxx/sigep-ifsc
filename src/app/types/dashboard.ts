import type { LucideIcon } from "lucide-react";

export type NivelRisco = "medio" | "alto" | "critico";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  active: boolean;
}

export interface StudentRisk {
  matricula: string;
  nome: string;
  turma: string;
  media: number;
  infrequencia: number;
  fatores: string[];
  risco: NivelRisco;
}

export interface RiscoConfig {
  label: string;
  badgeClass: string;
  rowClass: string;
}
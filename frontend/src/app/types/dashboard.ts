import type { LucideIcon } from "lucide-react";

export type NivelRisco = "medio" | "alto" | "critico";

export interface DashboardStats {
  totalTurmas: number;
  totalAlunos: number;
  atencaoPedagogica: number;
  percentualAtencao: string;
  encaminhamentosAtivos: number;
}

export interface CardItem {
  label: string;
  value: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  sub: string;
  highlight: false | "red" | "amber";
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

export interface CourseOption {
  nome: string;
  fases: number;
}

export interface FilterOptions {
  courses: CourseOption[];
  turmas: string[];
  disciplines: string[];
}
import { BookOpen, Users, AlertTriangle, TrendingDown } from "lucide-react";
import type { DashboardStats, CardItem, StudentRisk, RiscoConfig, NivelRisco, FilterOptions } from "../types/dashboard";

const API_URL = "http://localhost:3001/api";

// 1. Requisição das estatísticas brutas
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_URL}/dashboard/stats`);
  if (!response.ok) {
    throw new Error("Erro ao buscar estatísticas do dashboard.");
  }
  return response.json();
}

// 2. Função para buscar os dados de alunos em risco via API REST
export async function fetchRiskStudents(): Promise<StudentRisk[]> {
  const response = await fetch(`${API_URL}/students/risk`);
  if (!response.ok) throw new Error("Falha ao buscar dados de alunos em risco.");
  return response.json();
}

// 3. Montagem da lista formatada de cards para a interface
export function getDashboardCards(stats: DashboardStats | null): CardItem[] {
  return [
    {
      label: "Total de Turmas",
      value: stats?.totalTurmas ?? 0,
      icon: BookOpen,
      iconBg: "bg-[#e8f0eb]",
      iconColor: "text-[#15622f]",
      sub: "Distribuídas no período atual",
      highlight: false,
    },
    {
      label: "Alunos Cadastrados",
      value: stats?.totalAlunos ?? 0,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      sub: `Matriculados em ${stats?.totalTurmas ?? 0} turmas`,
      highlight: false,
    },
    {
      label: "Atenção Pedagógica",
      value: stats?.atencaoPedagogica ?? 0,
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      sub: `${stats?.percentualAtencao ?? 0}% do total de alunos`,
      highlight: "red",
    },
    {
      label: "Encaminhamentos Ativos",
      value: stats?.encaminhamentosAtivos ?? 0,
      icon: TrendingDown,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      sub: "Com fatores de risco registrados",
      highlight: "amber",
    },
  ];
}

// 4. Estilização de acordo com o nível de risco
export const riscoConfig: Record<NivelRisco, RiscoConfig> = {
  medio: {
    label: "Médio",
    badgeClass: "bg-amber-100 text-amber-800 border border-amber-200",
    rowClass: "hover:bg-amber-50/50",
  },
  alto: {
    label: "Alto",
    badgeClass: "bg-orange-100 text-orange-800 border border-orange-200",
    rowClass: "hover:bg-orange-50/50",
  },
  critico: {
    label: "Crítico",
    badgeClass: "bg-red-100 text-red-800 border border-red-200",
    rowClass: "hover:bg-red-50/50",
  },
};

// 5. Função para buscar opções de filtro via API REST
export async function fetchFilterOptions(): Promise<FilterOptions> {
  const response = await fetch(`${API_URL}/dashboard/filter-options`);
  if (!response.ok) {
    throw new Error("Erro ao buscar opções de filtro.");
  }
  return response.json();
}
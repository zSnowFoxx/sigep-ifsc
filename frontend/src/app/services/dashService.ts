// import { API_URL } from "../data/apiData";
import { backend } from "./apiClient";
import type { DashboardStats, StudentRisk, FilterOptions } from "../types/dashboard";

const queryPeriodo = (periodo?: string) => (periodo ? `?periodo=${encodeURIComponent(periodo)}` : "");

// 1. Estatísticas dos cards do dashboard (sem período, contam todos os semestres)
export function fetchDashboardStats(periodo?: string): Promise<DashboardStats> {
  return backend<DashboardStats>(`/dashboard/stats${queryPeriodo(periodo)}`);
}

export interface FiltrosRisco {
  periodo?: string;
  curso?: string;
  fase?: string;
  turma?: string;
  disciplina?: string;
}

// 2. Alunos com situação de risco registrada (filtros vazios são ignorados)
export function fetchRiskStudents(filtros: FiltrosRisco = {}): Promise<StudentRisk[]> {
  const params = new URLSearchParams(
    Object.entries(filtros).filter((entry): entry is [string, string] => Boolean(entry[1]))
  ).toString();
  return backend<StudentRisk[]>(`/dashboard/risk-students${params ? `?${params}` : ""}`);
}

// 3. Opções dos filtros (cursos, turmas e disciplinas; turmas e disciplinas restritas ao período)
export function fetchFilterOptions(periodo?: string): Promise<FilterOptions> {
  return backend<FilterOptions>(`/dashboard/filter-options${queryPeriodo(periodo)}`);
}

// Versão anterior, que usava o mockup (server/).
// // 1. Requisição das estatísticas brutas
// export async function fetchDashboardStats(): Promise<DashboardStats> {
//   const response = await fetch(`${API_URL}/dashboard/stats`);
//   if (!response.ok) {
//     throw new Error("Erro ao buscar estatísticas do dashboard.");
//   }
//   return response.json();
// }
//
// // 2. Função para buscar os dados de alunos em risco via API REST
// export async function fetchRiskStudents(): Promise<StudentRisk[]> {
//   const response = await fetch(`${API_URL}/students/risk`);
//   if (!response.ok) throw new Error("Falha ao buscar dados de alunos em risco.");
//   return response.json();
// }
//
// // 5. Função para buscar opções de filtro via API REST
// export async function fetchFilterOptions(): Promise<FilterOptions> {
//   const response = await fetch(`${API_URL}/dashboard/filter-options`);
//   if (!response.ok) {
//     throw new Error("Erro ao buscar opções de filtro.");
//   }
//   return response.json();
// }

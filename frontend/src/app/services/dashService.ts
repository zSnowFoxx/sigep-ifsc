// import { API_URL } from "../data/apiData";
import { backend } from "./apiClient";
import type { DashboardStats, StudentRisk, FilterOptions } from "../types/dashboard";

// 1. Estatísticas dos cards do dashboard
export function fetchDashboardStats(): Promise<DashboardStats> {
  return backend<DashboardStats>("/dashboard/stats");
}

// 2. Alunos com situação de risco registrada
export function fetchRiskStudents(): Promise<StudentRisk[]> {
  return backend<StudentRisk[]>("/dashboard/risk-students");
}

// 3. Opções dos filtros (cursos, turmas e disciplinas)
export function fetchFilterOptions(): Promise<FilterOptions> {
  return backend<FilterOptions>("/dashboard/filter-options");
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

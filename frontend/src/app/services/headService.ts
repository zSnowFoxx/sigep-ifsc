import type { Periodo } from "../types/header";
// import { API_URL } from "../data/apiData";
import { backend } from "./apiClient";

export async function fetchPeriodos(): Promise<Periodo[]> {
  try {
    return await backend<Periodo[]>("/periodos");
  } catch (error) {
    console.error("Erro na requisição de períodos:", error);
    return [];
  }
}

// Versão anterior, que usava o mockup (server/).
// export async function fetchPeriodos(): Promise<Periodo[]> {
//   try {
//     const response = await fetch(`${API_URL}/options/periodos`);
//     if (!response.ok) throw new Error("Erro ao buscar períodos");
//     return await response.json();
//   } catch (error) {
//     console.error("Erro na requisição de períodos:", error);
//     return [];
//   }
// }

import { backend } from "./apiClient";
import type { FiltrosLogs, OpcoesLogs, PaginaLogs } from "../types/logs";

// O dia do filtro é o do navegador: os limites vão como instantes ISO, e não como data,
// para o backend (que pode estar em outro fuso, como na Vercel) não deslocar o intervalo.
const inicioDoDia = (data: string) => new Date(`${data}T00:00:00`).toISOString();
const fimDoDia = (data: string) => new Date(`${data}T23:59:59.999`).toISOString();

export async function fetchLogs(filtros: FiltrosLogs, pagina: number, limite: number): Promise<PaginaLogs> {
  const params = new URLSearchParams({ pagina: String(pagina), limite: String(limite) });
  if (filtros.busca.trim()) params.set("busca", filtros.busca.trim());
  if (filtros.acao) params.set("acao", filtros.acao);
  if (filtros.tabela) params.set("tabela", filtros.tabela);
  if (filtros.usuarioId) params.set("usuarioId", filtros.usuarioId);
  if (filtros.de) params.set("de", inicioDoDia(filtros.de));
  if (filtros.ate) params.set("ate", fimDoDia(filtros.ate));

  return backend<PaginaLogs>(`/logs-auditoria?${params}`);
}

export async function fetchOpcoesLogs(): Promise<OpcoesLogs> {
  return backend<OpcoesLogs>("/logs-auditoria/opcoes");
}

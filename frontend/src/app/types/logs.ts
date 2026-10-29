// Formato de GET /logs-auditoria (backend/src/models/logAuditoria.model.js).
export type DadosLog = Record<string, unknown> | unknown[] | null;

export interface LogAuditoria {
  id_log: number;
  usuario_id: number | null;
  usuario_nome: string | null;
  usuario_siape: string | null;
  acao: string;
  tabela_afetada: string;
  registro_id: string | null;
  dados_anteriores: DadosLog;
  dados_novos: DadosLog;
  data_hora: string;
  endereco_ip: string | null;
  user_agent: string | null;
}

export interface PaginaLogs {
  itens: LogAuditoria[];
  total: number;
  pagina: number;
  limite: number;
}

export interface OpcoesLogs {
  acoes: string[];
  tabelas: string[];
  usuarios: { id: number; nome: string; siape: string }[];
}

// Datas no formato do <input type="date"> (AAAA-MM-DD), no fuso do navegador.
export interface FiltrosLogs {
  busca: string;
  acao: string;
  tabela: string;
  usuarioId: string;
  de: string;
  ate: string;
}

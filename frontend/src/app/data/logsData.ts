import { useState, useEffect } from "react";
import type { FiltrosLogs, LogAuditoria, OpcoesLogs } from "../types/logs";
import { fetchLogs, fetchOpcoesLogs } from "../services/logsService";

export const LOGS_POR_PAGINA = 50;

export const acaoLabels: Record<string, string> = {
  INSERT: "Criação",
  UPDATE: "Alteração",
  DELETE: "Exclusão",
  LOGIN: "Login",
  LOGIN_FALHA: "Login recusado",
  LOGOUT: "Logout",
  ALTERAR_SENHA: "Alteração de senha",
  REDEFINIR_SENHA: "Redefinição de senha",
  IMPORTAR: "Importação",
};

export const acaoColors: Record<string, { bg: string; text: string; border: string }> = {
  INSERT: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  UPDATE: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  DELETE: { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
  LOGIN: { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" },
  LOGOUT: { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" },
  LOGIN_FALHA: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  ALTERAR_SENHA: { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff" },
  REDEFINIR_SENHA: { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff" },
  IMPORTAR: { bg: "#f0fdfa", text: "#0f766e", border: "#99f6e4" },
};

export const tabelaLabels: Record<string, string> = {
  usuarios: "Servidores",
  perfis: "Perfis",
  funcoes: "Funções",
  periodos: "Períodos",
  cursos: "Cursos",
  disciplinas: "Disciplinas",
  turmas: "Turmas",
  alunos: "Alunos",
  matriculas: "Matrículas",
  diarios: "Diários",
  notas_frequencias: "Notas e Frequências",
  conselhos_lista: "Conselhos de Classe",
  conselhos_demandas: "Demandas do Conselho",
  conselhos_deliberacoes: "Deliberações do Conselho",
  conselhos_abonos: "Abonos de Faltas",
  conselhos_retificacoes: "Retificações de Média",
  registros_docentes: "Registros Docentes",
  encaminhamentos: "Encaminhamentos",
  encaminhamentos_acompanhamento: "Acompanhamentos",
  atendimentos: "Atendimentos (NAE)",
  importacoes: "Importações",
};

export const labelAcao = (acao: string) => acaoLabels[acao] ?? acao;
export const labelTabela = (tabela: string) => tabelaLabels[tabela] ?? tabela;

export const formatarData = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");
export const formatarHora = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export const filtrosVazios: FiltrosLogs = { busca: "", acao: "", tabela: "", usuarioId: "", de: "", ate: "" };

const ATRASO_BUSCA_MS = 400;

export function useLogsData() {
  const [logs, setLogs] = useState<LogAuditoria[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [filtros, setFiltros] = useState<FiltrosLogs>(filtrosVazios);
  // A busca digitada só vai para a API depois de uma pausa na digitação.
  const [buscaAplicada, setBuscaAplicada] = useState("");
  const [opcoes, setOpcoes] = useState<OpcoesLogs>({ acoes: [], tabelas: [], usuarios: [] });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [selecionado, setSelecionado] = useState<LogAuditoria | null>(null);
  const [recarregar, setRecarregar] = useState(0);

  useEffect(() => {
    fetchOpcoesLogs()
      .then(setOpcoes)
      .catch((err) => console.error("Erro ao carregar os filtros dos logs:", err));
  }, [recarregar]);

  useEffect(() => {
    const id = setTimeout(() => setBuscaAplicada(filtros.busca), ATRASO_BUSCA_MS);
    return () => clearTimeout(id);
  }, [filtros.busca]);

  // Ignora respostas de buscas já substituídas por outra.
  const { acao, tabela, usuarioId, de, ate } = filtros;
  useEffect(() => {
    let ativo = true;
    setLoading(true);
    fetchLogs({ busca: buscaAplicada, acao, tabela, usuarioId, de, ate }, pagina, LOGS_POR_PAGINA)
      .then((res) => {
        if (!ativo) return;
        setLogs(res.itens);
        setTotal(res.total);
        setErro("");
      })
      .catch((err) => {
        if (!ativo) return;
        setLogs([]);
        setTotal(0);
        setErro(err instanceof Error ? err.message : "Erro ao carregar os logs.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });
    return () => {
      ativo = false;
    };
  }, [buscaAplicada, acao, tabela, usuarioId, de, ate, pagina, recarregar]);

  // Mudar um filtro volta para a primeira página.
  const setFiltro = (campo: keyof FiltrosLogs, valor: string) => {
    setFiltros((atual) => ({ ...atual, [campo]: valor }));
    setPagina(1);
  };

  const limparFiltros = () => {
    setFiltros(filtrosVazios);
    setBuscaAplicada("");
    setPagina(1);
  };

  const totalPaginas = Math.max(1, Math.ceil(total / LOGS_POR_PAGINA));

  return {
    logs,
    total,
    pagina,
    setPagina,
    totalPaginas,
    filtros,
    setFiltro,
    limparFiltros,
    temFiltro: Object.values(filtros).some(Boolean),
    opcoes,
    loading,
    erro,
    setErro,
    selecionado,
    setSelecionado,
    atualizar: () => setRecarregar((n) => n + 1),
  };
}

import { backend } from "./apiClient";
import { getSessionSiape, type BackendProfile } from "./authService";
import type { Encaminhamento, Evolucao, Status, TipoEvolucao } from "../types/encaminhamentos";

// Formatos retornados pelo backend (encaminhamento.model.js e acompanhamento.model.js).
interface EncaminhamentoApi {
  id: number;
  titulo: string;
  categoria: string;
  origem: string | null;
  status: "pendente" | "em-andamento" | "finalizado";
  urgente: boolean;
  prazo: string | null;
  aluno_nome: string;
  aluno_matricula: string;
  turma_nome: string;
  servidor_responsavel_nome: string | null;
  total_acompanhamentos: number;
  ultimo_relato: string | null;
  parecer: string | null;
}

interface AcompanhamentoApi {
  id: number;
  autor_nome: string | null;
  tipo: TipoEvolucao;
  relato: string;
  data_registro: string;
}

const STATUS_FROM_API: Record<EncaminhamentoApi["status"], Status> = {
  pendente: "pendente",
  "em-andamento": "andamento",
  finalizado: "concluido",
};

const STATUS_TO_API: Record<Status, EncaminhamentoApi["status"]> = {
  pendente: "pendente",
  andamento: "em-andamento",
  concluido: "finalizado",
};

// "2026-07-05" -> "05/07/2026"
const formatDateOnly = (value: string) => value.slice(0, 10).split("-").reverse().join("/");
const formatDate = (value: string) => new Date(value).toLocaleDateString("pt-BR");

const toEvolucao = (a: AcompanhamentoApi): Evolucao => ({
  data: formatDate(a.data_registro),
  autor: a.autor_nome ?? "Sistema SIGEP",
  texto: a.relato,
  tipo: a.tipo,
});

const toEncaminhamento = (e: EncaminhamentoApi): Encaminhamento => ({
  id: e.id,
  aluno: e.aluno_nome,
  matricula: e.aluno_matricula,
  turma: e.turma_nome,
  origem: e.origem ?? "—",
  categoria: e.categoria,
  responsavel: e.servidor_responsavel_nome ?? "Não atribuído",
  prazo: e.prazo ? formatDateOnly(e.prazo) : undefined,
  ultimoRelato: e.ultimo_relato ? formatDate(e.ultimo_relato).slice(0, 5) : undefined,
  urgente: e.urgente,
  status: STATUS_FROM_API[e.status],
  parecer: e.parecer ?? "",
  totalEvolucoes: e.total_acompanhamentos,
  evolucoes: [],
});

export const encaminhamentosService = {
  getAll: async () => (await backend<EncaminhamentoApi[]>("/encaminhamentos")).map(toEncaminhamento),

  getEvolucoes: async (id: number) =>
    (await backend<AcompanhamentoApi[]>(`/encaminhamentos/${id}/acompanhamentos`)).map(toEvolucao),

  // Id do usuário logado (a sessão guarda apenas o SIAPE), usado como autor dos registros.
  getAutorId: async () => {
    const siape = getSessionSiape();
    if (!siape) return null;
    return (await backend<BackendProfile>(`/users/${siape}/profile`)).id;
  },

  addAcompanhamento: (id: number, tipo: TipoEvolucao, relato: string, autorId: number | null) =>
    backend(`/encaminhamentos/${id}/acompanhamentos`, {
      method: "POST",
      body: JSON.stringify({ tipo, relato, autorId }),
    }),

  updateStatus: (id: number, status: Status) =>
    backend(`/encaminhamentos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: STATUS_TO_API[status] }),
    }),
};

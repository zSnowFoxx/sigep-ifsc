import type React from "react";

// Re-exportação para manter compatibilidade com arquivos que importavam de conselho.ts
export type { Encaminhamento as EncItemData, Evolucao as EncEvolucao, Enc, EncStatus, EncEvolucaoTipo } from "./encaminhamentos";

export type TabId = 1 | 2 | 3 | 4;
export type ConselhoMode = "intermediario" | "final";
export type GravidadeDemanda = "nao-urgente" | "urgente" | "critica";
export type EtapaConselho = "Intermediário" | "Pré-Conselho" | "Final";

export interface Professor {
  usuarioId: number;
  nome: string;
  disciplina: string;
  cargo: string;
  presente: boolean;
}

export interface Aluno {
  id: number;
  matricula: string;
  nome: string;
  // Calculados a partir das notas e frequências (mesmo critério do painel de risco); não são gravados.
  atencao: boolean;
  risco?: boolean;
  turma?: string;
}

export interface AlunoEval {
  risco: boolean;
  obs: string;
  encaminhamento: string;
  acao: string;
  servidor: string;
  saved: boolean;
}

export interface DemandaItem {
  id: number;
  situacao: string;
  gravidade: GravidadeDemanda;
}

export interface TurmaForm {
  representantes: string;
  sintese: string;
  pontosPositivos: string[];
  customPontos: string[];
  dificuldades: string[];
  customDificuldades: string[];
  demandas: DemandaItem[];
  registros: string;
}

export interface TurmaData {
  id: number;
  nome: string;
  alunosList: Aluno[];
  coord: string;
  semestre: string;
}

export interface Disciplina {
  nome: string;
  professor: string;
  ch: number;
  nota: number;
  presentes: number;
  faltasJust: number;
  faltasNaoJust: number;
}

export interface RegistroDocente {
  id: number;
  titulo: string;
  categoria: string;
  aluno: string;
  matricula: string;
  turma: string;
  docente: string;
  data: string;
  descricao: string;
  encOpcao: "novo" | "existente" | null;
  encId: number | null;
}

export type TabDef = {
  id: TabId;
  label: string;
  icon: React.ElementType;
  short: string;
  displayNum: number;
};

export interface ConselhoDeClasseProps {
  conselhoId: number;
  onBack?: () => void;
  mode?: ConselhoMode;
}

export interface ReuniaoAberta {
  id: number;
  titulo: string;
  etapa: EtapaConselho;
  curso: string;
  status: "em_andamento" | "agendado";
  criadoEm?: string;
  data?: string;
  hora?: string;
  docentes: number;
  rascunho: boolean;
  turmas: string[];
  progresso: number;
}

export interface ReuniaoRealizada {
  id: number;
  titulo: string;
  etapa: EtapaConselho;
  curso: string;
  data: string;
  docentes: number;
  ata?: string;
}

export interface Participante {
  id: number;
  nome: string;
  label: string;
  tipo: "importado" | "manual";
}

export type ReuniaoBrief = {
  id: number;
  titulo: string;
  turmas: string[];
  criadoEm?: string;
  data?: string;
};

export interface PropsConselhosLista {
  onEnterConselho: (tipo: ConselhoMode, conselhoId: number) => void;
}

// Tipos da API de conselhos (formato devolvido e recebido pelo backend)

export type StatusConselho = "agendado" | "em_andamento" | "encerrado";

// 1 = Intermediário, 2 = Final
export type TipoConselho = 1 | 2;

export interface ConselhoServidor {
  usuarioId: number;
  // null = presença ainda não registrada
  presente: boolean | null;
}

export interface Conselho {
  id: number;
  nome: string;
  tipo: TipoConselho;
  status: StatusConselho;
  conselho_origem_id: number | null;
  data_criacao: string;
  data_realizacao: string | null;
  turmaIds: number[];
  servidores: ConselhoServidor[];
}

export interface ConselhoPayload {
  nome: string;
  tipo: TipoConselho;
  status?: StatusConselho;
  conselhoOrigemId?: number | null;
  dataRealizacao?: string | null;
  turmaIds?: number[];
  servidores?: { usuarioId: number; presente?: boolean | null }[];
}

export interface DemandaGeral {
  id: number;
  situacao: string;
  gravidade: GravidadeDemanda;
}

export interface ConselhoDemanda {
  id: number;
  conselho_id: number;
  turma_id: number;
  aluno_representante_id: number | null;
  sintese_diagnostico: string | null;
  pontos_positivos: string[];
  dificuldades_apontadas: string[];
  registros_observacoes: string | null;
  demandasGerais: DemandaGeral[];
}

export interface ConselhoDemandaPayload {
  turmaId: number;
  alunoRepresentanteId?: number | null;
  sinteseDiagnostico?: string | null;
  pontosPositivos?: string[];
  dificuldadesApontadas?: string[];
  registrosObservacoes?: string | null;
  demandasGerais?: { situacao: string; gravidade?: GravidadeDemanda }[];
}

export type StatusEncaminhamentoApi = "pendente" | "em-andamento" | "finalizado";
export type TipoAcompanhamento = "criacao" | "triagem" | "relato" | "conclusao";

export interface RegistroDocenteApi {
  id: number;
  conselho_id: number;
  aluno_id: number;
  docente_id: number;
  data_registro: string;
  turma_id: number;
  titulo: string;
  categoria: string;
  registro: string;
  encaminhamento_id: number | null;
}

export interface DeliberacaoApi {
  id: number;
  conselho_id: number;
  aluno_id: number;
  turma_id: number;
  alteracoes_realizadas: string;
  data_registro: string;
}

export interface EncaminhamentoApi {
  id: number;
  aluno_id: number;
  turma_id: number;
  conselho_id: number | null;
  titulo: string;
  categoria: string;
  origem: string | null;
  servidor_responsavel_id: number | null;
  descricao_inicial: string | null;
  status: StatusEncaminhamentoApi;
  urgente: boolean;
  prazo: string | null;
  data_criacao: string;
}

export interface AcompanhamentoApi {
  id: number;
  encaminhamento_id: number;
  autor_id: number | null;
  tipo: TipoAcompanhamento;
  relato: string;
  data_registro: string;
}

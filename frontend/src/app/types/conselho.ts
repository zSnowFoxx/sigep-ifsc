import type React from "react";

// Re-exportação para manter compatibilidade com arquivos que importavam de conselho.ts
export type { Encaminhamento as EncItemData, Evolucao as EncEvolucao, Enc, EncStatus, EncEvolucaoTipo } from "./encaminhamentos";

export type TabId = 1 | 2 | 3 | 4;
export type ConselhoMode = "intermediario" | "final";
export type GravidadeDemanda = "nao-urgente" | "urgente" | "critica";
export type EtapaConselho = "Intermediário" | "Pré-Conselho" | "Final";

export interface Professor {
  nome: string;
  disciplina: string;
  cargo: string;
  presente: boolean;
}

export interface Aluno {
  matricula: string;
  nome: string;
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
  onNavigate?: (page: number) => void;
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
  ata: string;
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
  onEnterConselho: (tipo: "intermediario" | "final") => void;
}
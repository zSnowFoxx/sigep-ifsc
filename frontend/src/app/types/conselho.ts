import type { ElementType } from "react";

// ── 1. Modos e Navegação ─────────────────────────────────────────────────────
export type ModoConselho = "intermediario" | "final";
export type TabId = 1 | 2 | 3 | 4;

export interface TabDef {
  id: TabId;
  label: string;
  icon: ElementType;
  short: string;
  displayNum: number;
}

// ── 2. Participantes e Turmas ────────────────────────────────────────────────
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

export interface TurmaData {
  nome: string;
  alunosList: Aluno[];
  coord: string;
  semestre: string;
}

// ── 3. Demandas Coletivas da Turma (Aba 2) ────────────────────────────────────
export type GravidadeDemanda = "nao-urgente" | "urgente" | "critica";

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

// ── 4. Disciplinas e Avaliação Discente (Aba 4) ──────────────────────────────
export interface DisciplinaData {
  nome: string;
  professor: string;
  ch: number;
  nota: number;
  presentes: number;
  faltasJust: number;
  faltasNaoJust: number;
}

export interface AlunoEval {
  risco: boolean;
  obs: string;
  encaminhamento: string;
  acao: string;
  servidor: string;
  saved: boolean;
}

// ── 5. Registros Docentes e Encaminhamentos (Aba 3) ─────────────────────────
export type OpcaoEncaminhamento = "novo" | "existente" | null;

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
  encOpcao: OpcaoEncaminhamento;
  encId: number | null;
}

export type StatusEncaminhamento = "pendente" | "em-andamento" | "finalizado";

export interface EncItemData {
  id: number;
  titulo: string;
  categoria: string;
  aluno: string;
  matricula: string;
  turma: string;
  status: StatusEncaminhamento;
  data: string;
  servidor: string;
  descricao: string;
}

export type TipoEncEvolucao = "criacao" | "triagem" | "relato" | "conclusao";

export interface EncEvolucao {
  data: string;
  autor: string;
  texto: string;
  tipo: TipoEncEvolucao;
}

export interface EncAtivoAluno {
  id: number;
  categoria: string;
  descricao: string;
  servidor: string;
}

// ── 6. Props do Componente Principal ─────────────────────────────────────────
export interface ConselhoDeClasseProps {
  onNavigate?: (page: number) => void;
  onBack?: () => void;
  mode?: ModoConselho;
}
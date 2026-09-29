import type { ElementType } from "react";

export type CategoryKey = "alunos" | "servidores" | "cursos" | "disciplinas" | "turmas" | "diarios";
export type ModalMode = "create" | "edit" | null;

export interface Aluno {
  id?: number;
  matricula: string;
  nome: string;
  email: string;
  turmas_id?: number[];
  turmas?: string[];
  status: string;
}

export interface Servidor {
  id?: number;
  siape: string;
  nome: string;
  email: string;
  password?: string | null;
  perfil_id?: number;
  cargo?: string;
  funcoes_ids?: number[];
  funcoes?: string[];
  curso_id?: number | null;
  disciplinas_ids?: number[];
}

export interface Curso {
  id?: number;
  codigo: string;
  nome: string;
  tipo: string;
  grau: string;
  modalidade: string;
  ppc: string;
  fases: number;
  cargaHoraria?: string;
  coordenador_id?: number | null;
  coordenador?: string;
}

export interface Disciplina {
  id?: number;
  sigla: string;
  codigo?: string;
  nome: string;
  cargaHoraria: string;
  faseOferta: string;
  curso_id?: number;
  curso?: string;
}

export interface Turma {
  id?: number;
  nome: string;
  curso_id?: number;
  periodo_id?: number;
  periodo?: string;
  curso?: string;
  alunos_qtd?: number;
  alunos?: number;
}

export interface Diario {
  id?: number;
  codigo?: string;
  disciplina_id?: number;
  disciplina?: string;
  turma_id?: number;
  turma?: string;
  professor_usuario_id?: number;
  professor?: string;
  cargaHoraria?: string;
  aulasPrevistas?: number;
}

export interface CategoryItem {
  key: CategoryKey;
  label: string;
  badge: string;
  icon: ElementType;
  entity: string;
  entityPlural: string;
}
import type { ElementType } from "react";

export type CategoryKey = "alunos" | "servidores" | "cursos" | "disciplinas" | "turmas" | "diarios";
export type ModalMode = "create" | "edit" | null;

export interface Aluno {
  matricula: string;
  nome: string;
  email: string;
  turma: string;
  status: string;
}

export interface Servidor {
  siape: string;
  nome: string;
  email: string;
  cargo: string;
  funcoes: string[];
}

export interface Curso {
  nome: string;
  tipo: string;
  grau: string;
  modalidade: string;
  ppc: string;
  fases: number;
  cargaHoraria: string;
  coordenador: string;
}

export interface Disciplina {
  sigla: string;
  nome: string;
  cargaHoraria: string;
  faseOferta: string;
  curso: string;
}

export interface Turma {
  nome: string;
  periodo: string;
  curso: string;
  alunos: number;
}

export interface Diario {
  codigo: string;
  disciplina: string;
  turma: string;
  professor: string;
  cargaHoraria: string;
  aulasPrevistas: number;
}

export interface CategoryItem {
  key: CategoryKey;
  label: string;
  badge: string;
  icon: ElementType;
  entity: string;
  entityPlural: string;
}
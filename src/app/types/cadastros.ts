import type { ElementType } from "react";

export type CategoryKey = "alunos" | "servidores" | "cursos" | "disciplinas" | "turmas" | "diarios";
export type ModalMode = "create" | "edit" | null;

export interface Aluno {
  id?: number;
  matricula: string;
  nome: string;
  email: string;
  turmas_id?: number[];
  status: string;
  turmas?: string[];
}

export interface Servidor {
  id?: number;
  email: string;
  password?: string | null;
  nome: string;
  siape: string;
  funcoes_ids?: number[];
  perfil_id?: number;
  curso_id?: number | null;
  disciplinas_ids?: number[];
  cargo?: string;
  funcoes?: string[];
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
  coordenador_id?: number | null;
  cargaHoraria?: string;
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
  alunos_qtd?: number;
  periodo?: string;
  curso?: string;
  alunos?: number;
}

export interface Diario {
  id?: number;
  codigo?: string;
  disciplina_id?: number;
  turma_id?: number;
  professor_id?: number;
  professor_usuario_id?: number;
  cargaHoraria?: string;
  aulasPrevistas?: number;
  disciplina?: string;
  turma?: string;
  professor?: string;
}

export interface Perfil {
  id: number;
  nome: string;
}

export interface Funcao {
  id: number;
  nome: string;
}

export interface CategoryItem {
  key: CategoryKey;
  label: string;
  badge: string;
  icon: ElementType;
  entity: string;
  entityPlural: string;
}
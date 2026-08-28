import { API_URL } from "../data/apiData";
import type {
  Aluno,
  Servidor,
  Curso,
  Disciplina,
  Turma,
  Diario,
  Perfil,
  Funcao,
  CategoryKey,
} from "../types/cadastros";

async function http<T>(path: string, config?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...config?.headers },
    ...config,
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição ${path}: ${response.statusText}`);
  }

  if (response.status === 204) return {} as T;

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

export const alunosService = {
  getAll: () => http<Aluno[]>("/alunos"),
  getById: (id: number | string) => http<Aluno>(`/alunos/${id}`),
  create: (data: Partial<Aluno>) => http<Aluno>("/alunos", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: Partial<Aluno>) => http<Aluno>(`/alunos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => http<void>(`/alunos/${id}`, { method: "DELETE" }),
};

export const servidoresService = {
  getAll: () => http<Servidor[]>("/usuarios"),
  getById: (id: number | string) => http<Servidor>(`/usuarios/${id}`),
  create: (data: Partial<Servidor>) => http<Servidor>("/usuarios", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: Partial<Servidor>) => http<Servidor>(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => http<void>(`/usuarios/${id}`, { method: "DELETE" }),
};

export const cursosService = {
  getAll: () => http<Curso[]>("/cursos"),
  getById: (id: number | string) => http<Curso>(`/cursos/${id}`),
  create: (data: Partial<Curso>) => http<Curso>("/cursos", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: Partial<Curso>) => http<Curso>(`/cursos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => http<void>(`/cursos/${id}`, { method: "DELETE" }),
};

export const disciplinasService = {
  getAll: () => http<Disciplina[]>("/disciplinas"),
  getById: (id: number | string) => http<Disciplina>(`/disciplinas/${id}`),
  create: (data: Partial<Disciplina>) => http<Disciplina>("/disciplinas", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: Partial<Disciplina>) => http<Disciplina>(`/disciplinas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => http<void>(`/disciplinas/${id}`, { method: "DELETE" }),
};

export const turmasService = {
  getAll: () => http<Turma[]>("/turmas"),
  getById: (id: number | string) => http<Turma>(`/turmas/${id}`),
  create: (data: Partial<Turma>) => http<Turma>("/turmas", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: Partial<Turma>) => http<Turma>(`/turmas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => http<void>(`/turmas/${id}`, { method: "DELETE" }),
};

export const diariosService = {
  getAll: () => http<Diario[]>("/diarios"),
  getById: (id: number | string) => http<Diario>(`/diarios/${id}`),
  create: (data: Partial<Diario>) => http<Diario>("/diarios", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: Partial<Diario>) => http<Diario>(`/diarios/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => http<void>(`/diarios/${id}`, { method: "DELETE" }),
};

export const perfisService = {
  getAll: () => http<Perfil[]>("/perfis"),
};

export const funcoesService = {
  getAll: () => http<Funcao[]>("/funcoes"),
  getById: (id: number | string) => http<Funcao>(`/funcoes/${id}`),
  create: (data: Partial<Funcao>) => http<Funcao>("/funcoes", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: Partial<Funcao>) => http<Funcao>(`/funcoes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => http<void>(`/funcoes/${id}`, { method: "DELETE" }),
};

export interface EntityService<T = any> {
  getAll: () => Promise<T[]>;
  getById?: (id: number | string) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: number | string, data: Partial<T>) => Promise<T>;
  delete: (id: number | string) => Promise<any>;
}

export const entityServices: Record<CategoryKey, EntityService> = {
  alunos: alunosService,
  servidores: servidoresService,
  cursos: cursosService,
  disciplinas: disciplinasService,
  turmas: turmasService,
  diarios: diariosService,
};
import { API_URL } from "../data/apiData";

async function http<T>(path: string, config?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...config?.headers },
    ...config,
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição ${path}: ${response.statusText}`);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

export const alunosService = {
  getAll: () => http<any[]>("/alunos"),
  getById: (id: number | string) => http<any>(`/alunos/${id}`),
  create: (data: any) => http<any>("/alunos", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: any) => http<any>(`/alunos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => http<any>(`/alunos/${id}`, { method: "DELETE" }),
};

export const servidoresService = {
  getAll: () => http<any[]>("/usuarios"),
  getById: (id: number | string) => http<any>(`/usuarios/${id}`),
  create: (data: any) => http<any>("/usuarios", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: any) => http<any>(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => http<any>(`/usuarios/${id}`, { method: "DELETE" }),
};

export const cursosService = {
  getAll: () => http<any[]>("/cursos"),
  getById: (id: number | string) => http<any>(`/cursos/${id}`),
  create: (data: any) => http<any>("/cursos", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: any) => http<any>(`/cursos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => http<any>(`/cursos/${id}`, { method: "DELETE" }),
};

export const disciplinasService = {
  getAll: () => http<any[]>("/disciplinas"),
  getById: (id: number | string) => http<any>(`/disciplinas/${id}`),
  create: (data: any) => http<any>("/disciplinas", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: any) => http<any>(`/disciplinas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => http<any>(`/disciplinas/${id}`, { method: "DELETE" }),
};

export const turmasService = {
  getAll: () => http<any[]>("/turmas"),
  getById: (id: number | string) => http<any>(`/turmas/${id}`),
  create: (data: any) => http<any>("/turmas", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: any) => http<any>(`/turmas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => http<any>(`/turmas/${id}`, { method: "DELETE" }),
};

export const diariosService = {
  getAll: () => http<any[]>("/diarios"),
  getById: (id: number | string) => http<any>(`/diarios/${id}`),
  create: (data: any) => http<any>("/diarios", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: any) => http<any>(`/diarios/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => http<any>(`/diarios/${id}`, { method: "DELETE" }),
};

export const entityServices: Record<
  string,
  {
    getAll: () => Promise<any[]>;
    create: (data: any) => Promise<any>;
    update: (id: number | string, data: any) => Promise<any>;
    delete: (id: number | string) => Promise<any>;
  }
> = {
  alunos: alunosService,
  servidores: servidoresService,
  cursos: cursosService,
  disciplinas: disciplinasService,
  turmas: turmasService,
  diarios: diariosService,
};
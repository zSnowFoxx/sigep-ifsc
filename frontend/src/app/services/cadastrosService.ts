import { API_URL } from "../data/apiData";
import { request, backend, type Lookup } from "./apiClient";

const http = <T>(path: string, config?: RequestInit) => request<T>(API_URL, path, config);

export const perfisService = {
  getAll: () => backend<Lookup[]>("/perfis"),
};

export const funcoesService = {
  getAll: () => backend<Lookup[]>("/funcoes"),
  create: (nome: string) => backend<Lookup>("/funcoes", { method: "POST", body: JSON.stringify({ nome }) }),
};

// Converte nomes de funções em ids; funções digitadas que ainda não existem são cadastradas antes.
export async function resolveFuncaoIds(nomes: string[] = [], funcoes?: Lookup[]) {
  const existentes = funcoes ?? (await funcoesService.getAll());

  return Promise.all(
    nomes.map(async (nome) => {
      const existente = existentes.find((f) => f.nome.toLowerCase() === nome.toLowerCase());
      return existente ? existente.id : (await funcoesService.create(nome)).id;
    })
  );
}

// Converte o formulário (cargo e funções por nome) no payload do backend (perfilId e funcaoIds).
async function toUsuarioPayload(data: any, isCreate: boolean) {
  const [perfis, funcoes] = await Promise.all([perfisService.getAll(), funcoesService.getAll()]);

  const perfil = perfis.find((p) => p.nome === data.cargo);
  if (!perfil) throw new Error("Selecione um cargo/perfil válido.");

  const funcaoIds = await resolveFuncaoIds(data.funcoes, funcoes);

  return {
    ...(isCreate && { siape: data.siape?.trim() }),
    nome: data.nome?.trim(),
    email: data.email?.trim().toLowerCase(),
    perfilId: perfil.id,
    funcaoIds,
    ...(data.password && { senha: data.password }),
  };
}

export const alunosService = {
  getAll: () => http<any[]>("/alunos"),
  getById: (id: number | string) => http<any>(`/alunos/${id}`),
  create: (data: any) => http<any>("/alunos", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: any) => http<any>(`/alunos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => http<any>(`/alunos/${id}`, { method: "DELETE" }),
};

// Usuários são identificados pelo SIAPE nas rotas do backend.
export const servidoresService = {
  getAll: () => backend<any[]>("/users"),
  getById: (siape: number | string) => backend<any>(`/users/${siape}`),
  create: async (data: any) =>
    backend<any>("/users", { method: "POST", body: JSON.stringify(await toUsuarioPayload(data, true)) }),
  update: async (siape: number | string, data: any) =>
    backend<any>(`/users/${siape}`, { method: "PUT", body: JSON.stringify(await toUsuarioPayload(data, false)) }),
  delete: (siape: number | string) => backend<any>(`/users/${siape}`, { method: "DELETE" }),
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
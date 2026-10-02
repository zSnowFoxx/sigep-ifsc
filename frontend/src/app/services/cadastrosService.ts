// import { API_URL } from "../data/apiData";
// import { request, backend, type Lookup } from "./apiClient";
import { backend, type Lookup } from "./apiClient";
import type { Periodo } from "../types/header";

// Cliente do mockup (server/), substituído pelo backend real.
// const http = <T>(path: string, config?: RequestInit) => request<T>(API_URL, path, config);

export const perfisService = {
  getAll: () => backend<Lookup[]>("/perfis"),
};

export const funcoesService = {
  getAll: () => backend<Lookup[]>("/funcoes"),
  create: (nome: string) => backend<Lookup>("/funcoes", { method: "POST", body: JSON.stringify({ nome }) }),
};

export const periodosService = {
  getAll: () => backend<Periodo[]>("/periodos"),
};

// Rótulo do período usado nos formulários e no Header (ex.: "2026.1").
export const periodoLabel = (p: Pick<Periodo, "ano" | "semestre">) => `${p.ano}.${p.semestre}`;

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

// ==========================================
// CONVERSÃO DOS FORMULÁRIOS PARA O BACKEND
// Os formulários trabalham com nomes (curso, turma, professor...); o backend espera ids.
// ==========================================

const lookup = (path: string) => backend<Lookup[]>(path);

function idPorNome(lista: Lookup[], nome: string | undefined, campo: string) {
  const item = lista.find((i) => i.nome === nome);
  if (!item) throw new Error(`Selecione um(a) ${campo} válido(a).`);
  return item.id;
}

// Campos de texto opcionais vazios vão como null (o backend rejeita string vazia).
const texto = (valor: unknown) => (typeof valor === "string" && valor.trim() ? valor.trim() : null);

async function toAlunoPayload(data: any) {
  const turmas = await lookup("/turmas");
  return {
    matricula: data.matricula?.trim(),
    nome: data.nome?.trim(),
    email: texto(data.email),
    status: texto(data.status),
    turmaIds: (data.turmas ?? []).map((nome: string) => idPorNome(turmas, nome, "turma")),
  };
}

async function toCursoPayload(data: any) {
  const usuarios = await lookup("/users");
  return {
    codigo: data.codigo?.trim(),
    nome: data.nome?.trim(),
    tipo: texto(data.tipo),
    grau: texto(data.grau),
    modalidade: texto(data.modalidade),
    ppc: texto(data.ppc),
    fases: data.fases ?? null,
    coordenadorId: usuarios.find((u) => u.nome === data.coordenador)?.id ?? null,
  };
}

async function toDisciplinaPayload(data: any) {
  const cursos = await lookup("/cursos");
  return {
    codigo: data.codigo?.trim(),
    sigla: texto(data.sigla),
    nome: data.nome?.trim(),
    cargaHoraria: texto(data.cargaHoraria),
    faseOferta: texto(data.faseOferta),
    cursoId: idPorNome(cursos, data.curso, "curso"),
  };
}

async function toTurmaPayload(data: any) {
  const [cursos, periodos] = await Promise.all([lookup("/cursos"), periodosService.getAll()]);
  const periodosLookup = periodos.map((p) => ({ id: p.id, nome: periodoLabel(p) }));
  return {
    nome: data.nome?.trim(),
    cursoId: idPorNome(cursos, data.curso, "curso"),
    periodoId: idPorNome(periodosLookup, data.periodo, "período"),
    alunosQtd: data.alunos ?? 0,
  };
}

async function toDiarioPayload(data: any) {
  const [disciplinas, turmas, usuarios] = await Promise.all([
    lookup("/disciplinas"),
    lookup("/turmas"),
    lookup("/users"),
  ]);
  return {
    codigo: data.codigo?.trim(),
    disciplinaId: idPorNome(disciplinas, data.disciplina, "disciplina"),
    turmaId: idPorNome(turmas, data.turma, "turma"),
    professorId: idPorNome(usuarios, data.professor, "professor"),
    cargaHoraria: texto(data.cargaHoraria),
    aulasPrevistas: data.aulasPrevistas ?? null,
  };
}

// CRUD padrão de uma entidade do backend, convertendo o formulário antes de enviar.
function crudService(path: string, toPayload: (data: any) => Promise<object>) {
  return {
    getAll: () => backend<any[]>(path),
    getById: (id: number | string) => backend<any>(`${path}/${id}`),
    create: async (data: any) =>
      backend<any>(path, { method: "POST", body: JSON.stringify(await toPayload(data)) }),
    update: async (id: number | string, data: any) =>
      backend<any>(`${path}/${id}`, { method: "PUT", body: JSON.stringify(await toPayload(data)) }),
    delete: (id: number | string) => backend<any>(`${path}/${id}`, { method: "DELETE" }),
  };
}

export const alunosService = crudService("/alunos", toAlunoPayload);
export const cursosService = crudService("/cursos", toCursoPayload);
export const disciplinasService = crudService("/disciplinas", toDisciplinaPayload);
export const turmasService = crudService("/turmas", toTurmaPayload);
export const diariosService = crudService("/diarios", toDiarioPayload);

// Versão anterior, que usava o mockup (server/) e enviava o formulário sem conversão.
// export const alunosService = {
//   getAll: () => http<any[]>("/alunos"),
//   getById: (id: number | string) => http<any>(`/alunos/${id}`),
//   create: (data: any) => http<any>("/alunos", { method: "POST", body: JSON.stringify(data) }),
//   update: (id: number | string, data: any) => http<any>(`/alunos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
//   delete: (id: number | string) => http<any>(`/alunos/${id}`, { method: "DELETE" }),
// };
//
// export const cursosService = {
//   getAll: () => http<any[]>("/cursos"),
//   getById: (id: number | string) => http<any>(`/cursos/${id}`),
//   create: (data: any) => http<any>("/cursos", { method: "POST", body: JSON.stringify(data) }),
//   update: (id: number | string, data: any) => http<any>(`/cursos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
//   delete: (id: number | string) => http<any>(`/cursos/${id}`, { method: "DELETE" }),
// };
//
// export const disciplinasService = {
//   getAll: () => http<any[]>("/disciplinas"),
//   getById: (id: number | string) => http<any>(`/disciplinas/${id}`),
//   create: (data: any) => http<any>("/disciplinas", { method: "POST", body: JSON.stringify(data) }),
//   update: (id: number | string, data: any) => http<any>(`/disciplinas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
//   delete: (id: number | string) => http<any>(`/disciplinas/${id}`, { method: "DELETE" }),
// };
//
// export const turmasService = {
//   getAll: () => http<any[]>("/turmas"),
//   getById: (id: number | string) => http<any>(`/turmas/${id}`),
//   create: (data: any) => http<any>("/turmas", { method: "POST", body: JSON.stringify(data) }),
//   update: (id: number | string, data: any) => http<any>(`/turmas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
//   delete: (id: number | string) => http<any>(`/turmas/${id}`, { method: "DELETE" }),
// };
//
// export const diariosService = {
//   getAll: () => http<any[]>("/diarios"),
//   getById: (id: number | string) => http<any>(`/diarios/${id}`),
//   create: (data: any) => http<any>("/diarios", { method: "POST", body: JSON.stringify(data) }),
//   update: (id: number | string, data: any) => http<any>(`/diarios/${id}`, { method: "PUT", body: JSON.stringify(data) }),
//   delete: (id: number | string) => http<any>(`/diarios/${id}`, { method: "DELETE" }),
// };

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

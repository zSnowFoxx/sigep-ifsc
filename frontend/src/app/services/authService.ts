import type { Role, StoredUser, UserSession } from "../types/auth";
import { API_URL } from "../data/apiData";
import { backend, type Lookup } from "./apiClient";
import { perfisService, funcoesService, resolveFuncaoIds } from "./cadastrosService";

// ==========================================
// SESSÃO
// ==========================================

// O backend identifica usuários pelo SIAPE, então é ele que fica salvo na sessão.
const SESSION_KEY = "userSiape";

export function saveSession(siape: string, remember: boolean) {
  // "Permanecer conectado" usa localStorage; caso contrário, apenas a aba atual (sessionStorage).
  const [keep, drop] = remember ? [localStorage, sessionStorage] : [sessionStorage, localStorage];
  keep.setItem(SESSION_KEY, siape);
  drop.removeItem(SESSION_KEY);
}

export function getSessionSiape(): string | null {
  return localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

// Formato retornado pelo backend em /auth/login e /users/:siape/profile.
export interface BackendProfile {
  id: number;
  siape: string;
  nome: string;
  email: string;
  perfil: Lookup;
  funcoes: string[];
  disciplinas: string[];
  cursosCoordenados: string[];
}

export const toUserSession = (p: BackendProfile): UserSession => ({
  email: p.email,
  name: p.nome,
  siape: p.siape,
  role: p.perfil.nome as Role,
  course: p.cursosCoordenados.join(", ") || undefined,
  disciplines: p.disciplinas,
});

// ==========================================
// CADASTRO DE CONTA
// ==========================================

// 1. Busca opções do formulário (perfis, cursos e funções)
export async function fetchSystemOptions(): Promise<{
  roles: string[];
  courses: string[];
  funcoes: string[];
}> {
  const [perfis, cursos, funcoes] = await Promise.all([
    perfisService.getAll(),
    backend<Lookup[]>("/cursos"),
    funcoesService.getAll(),
  ]);

  return {
    roles: perfis.map((p) => p.nome),
    courses: cursos.map((c) => c.nome),
    funcoes: funcoes.map((f) => f.nome),
  };
}

// 2. Consulta a integração SIGAA (ainda atendida pelo mockup)
export async function fetchSigaaData(email: string): Promise<Omit<StoredUser, "password" | "email">> {
  const response = await fetch(`${API_URL}/sigaa/${encodeURIComponent(email)}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao consultar os dados no SIGAA.");
  return data;
}

// 3. Envia código OTP para confirmar o e-mail do novo cadastro
export async function sendOtp(email: string): Promise<void> {
  await backend("/auth/otp", { method: "POST", body: JSON.stringify({ email }) });
}

// 4. Valida código OTP (cadastro e recuperação de senha)
export async function verifyOtp(email: string, code: string): Promise<void> {
  await backend("/auth/otp/verify", { method: "POST", body: JSON.stringify({ email, codigo: code }) });
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  siape: string;
  role: string;
  disciplines?: string[];
  course?: string;
  funcoes?: string[];
}

function idPorNome(lista: Lookup[], nome: string, campo: string) {
  const item = lista.find((i) => i.nome === nome);
  if (!item) throw new Error(`${campo} não encontrado(a): ${nome}`);
  return item.id;
}

// 5. Cadastro de novo usuário: converte cargo, disciplinas, curso e funções (nomes) em ids.
export async function registerUser(data: RegisterInput) {
  const [perfis, disciplinas, cursos] = await Promise.all([
    perfisService.getAll(),
    backend<Lookup[]>("/disciplinas"),
    backend<Lookup[]>("/cursos"),
  ]);

  const perfilId = idPorNome(perfis, data.role, "Cargo");
  const disciplinaIds = (data.disciplines ?? []).map((nome) => idPorNome(disciplinas, nome, "Disciplina"));
  const cursoIds = data.course ? [idPorNome(cursos, data.course, "Curso")] : [];
  const funcaoIds = await resolveFuncaoIds(data.funcoes);

  return backend<BackendProfile>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      siape: data.siape,
      nome: data.name,
      email: data.email,
      senha: data.password,
      perfilId,
      funcaoIds,
      disciplinaIds,
      cursoIds,
    }),
  });
}

// ==========================================
// LOGIN E RECUPERAÇÃO DE SENHA
// ==========================================

// 6. Autenticação (Login)
export async function loginUser(email: string, password: string): Promise<UserSession> {
  if (!email || !password) throw new Error("E-mail e senha são obrigatórios.");

  const profile = await backend<BackendProfile>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha: password }),
  });
  return toUserSession(profile);
}

// 7. Busca dados do usuário da sessão salva (null se não houver sessão)
export async function fetchSessionUser(): Promise<UserSession | null> {
  const siape = getSessionSiape();
  if (!siape) return null;

  return toUserSession(await backend<BackendProfile>(`/users/${encodeURIComponent(siape)}/profile`));
}

// 8. Solicitação de Recuperação de Senha (Esqueci a senha)
export async function forgotPassword(email: string): Promise<void> {
  await backend("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
}

// 9. Redefinição de Senha com código OTP (sem login)
export async function resetPassword(email: string, code: string, newPassword: string): Promise<void> {
  await backend("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, codigo: code, novaSenha: newPassword }),
  });
}

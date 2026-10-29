import type { Role, StoredUser, UserSession } from "../types/auth";
import { API_URL } from "../data/apiData";
import { BACKEND_URL } from "../data/apiData";
import { backend, request, type Lookup } from "./apiClient";
import { perfisService, funcoesService } from "./cadastrosService";
import { saveSession, getToken, clearSession } from "./session";

export { saveSession, getSessionSiape, clearSession } from "./session";

// Formato retornado pelo backend em /auth/login, /auth/me e /users/:siape/profile.
export interface BackendProfile {
  id: number;
  siape: string;
  nome: string;
  email: string;
  perfil: Lookup;
  funcoes: string[];
  disciplinas: string[];
  cursosCoordenados: string[];
  acessoAuditoria?: boolean;
}

export const toUserSession = (p: BackendProfile): UserSession => ({
  email: p.email,
  name: p.nome,
  siape: p.siape,
  role: p.perfil.nome as Role,
  course: p.cursosCoordenados.join(", ") || undefined,
  disciplines: p.disciplinas,
  acessoAuditoria: p.acessoAuditoria ?? false,
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

// 5. Cadastro de novo usuário: converte cargo, disciplinas e curso (nomes) em ids.
// As funções vão por nome: o backend cria as que ainda não existem.
export async function registerUser(data: RegisterInput) {
  const [perfis, disciplinas, cursos] = await Promise.all([
    perfisService.getAll(),
    backend<Lookup[]>("/disciplinas"),
    backend<Lookup[]>("/cursos"),
  ]);

  const perfilId = idPorNome(perfis, data.role, "Cargo");
  const disciplinaIds = (data.disciplines ?? []).map((nome) => idPorNome(disciplinas, nome, "Disciplina"));
  const cursoIds = data.course ? [idPorNome(cursos, data.course, "Curso")] : [];

  return backend<BackendProfile>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      siape: data.siape,
      nome: data.name,
      email: data.email,
      senha: data.password,
      perfilId,
      funcoes: data.funcoes ?? [],
      disciplinaIds,
      cursoIds,
    }),
  });
}

// ==========================================
// LOGIN E RECUPERAÇÃO DE SENHA
// ==========================================

// 6. Autenticação (Login): salva o token da sessão e devolve o perfil
export async function loginUser(email: string, password: string, remember: boolean): Promise<UserSession> {
  if (!email || !password) throw new Error("E-mail e senha são obrigatórios.");

  const { token, user } = await backend<{ token: string; user: BackendProfile }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha: password }),
  });
  saveSession(token, remember);
  return toUserSession(user);
}

// 7. Busca dados do usuário da sessão salva (null se não houver sessão)
export async function fetchSessionUser(): Promise<UserSession | null> {
  if (!getToken()) return null;

  return toUserSession(await backend<BackendProfile>("/auth/me"));
}

// Sair: registra o logout no log de auditoria (sem esperar a resposta) e apaga o token.
// Usa request, e não backend, para um 401 aqui não disparar outro encerramento de sessão.
export function logoutUser() {
  const token = getToken();
  if (token) {
    request(BACKEND_URL, "/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      keepalive: true,
    }).catch(() => {});
  }
  clearSession();
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

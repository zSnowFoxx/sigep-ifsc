import type { Role, StoredUser, UserProfile } from "../types/auth";
import { API_URL } from "../data/apiData";

// 1. Busca opções do formulário (disciplinas, cursos, perfis)
export async function fetchSystemOptions(): Promise<{
  disciplines: string[];
  courses: string[];
  roles: Role[];
}> {
  const response = await fetch(`${API_URL}/options`);
  if (!response.ok) throw new Error("Erro ao buscar opções do sistema.");
  return response.json();
}

// 2. Consulta a integração SIGAA
export async function fetchSigaaData(email: string): Promise<Omit<StoredUser, "password" | "email">> {
  const response = await fetch(`${API_URL}/sigaa/${encodeURIComponent(email)}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao consultar os dados no SIGAA.");
  return data;
}

// 3. Envia código OTP
export async function sendOtp(email: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao enviar código OTP.");
  return data;
}

// 4. Valida código OTP
export async function verifyOtp(email: string, code: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao verificar código OTP.");
  return data;
}

// 5. Cadastro de novo usuário
export async function registerUser(userData: Record<string, any>) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao cadastrar usuário.");
  return data;
}

// 6. Autenticação (Login)
export async function loginUser(email: string, password: string): Promise<{ message: string; user: UserProfile }> {
  if (!email || !password) throw new Error("E-mail e senha são obrigatórios.");

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Credenciais inválidas.");
  return data;
}

// 7. Busca dados do usuário logado na sessão
export async function fetchCurrentUser(email: string): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/auth/me?email=${encodeURIComponent(email)}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao buscar dados do usuário.");
  return data;
}

// 8. Solicitação de Recuperação de Senha (Esqueci a senha)
export async function forgotPassword(email: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao solicitar recuperação.");
  return data;
}

// 9. Redefinição de Senha com Token/OTP (Sem login)
export async function resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao redefinir a senha.");
  return data;
}

// 10. Alteração de Senha (Com usuário autenticado no sistema)
export async function changePassword(email: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, currentPassword, newPassword }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao alterar a senha.");
  return data;
}
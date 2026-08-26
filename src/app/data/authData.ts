import type { Role, StoredUser, UserProfile } from "../types/auth";

const API_URL = "http://localhost:3001/api";

export const credenciaisTeste = [
  { label: "E-mail", value: "servidor@ifsc.edu.br" },
  { label: "Senha", value: "teste" },
  { label: "Perfil", value: "Equipe Pedagógica/NAE" },
];

// 1. Busca as listas de Opções (Disciplinas, Cursos, Perfil) no servidor
export async function fetchSystemOptions(): Promise<{
  disciplines: string[];
  courses: string[];
  roles: Role[];
}> {
  const response = await fetch(`${API_URL}/options`);
  if (!response.ok) throw new Error("Erro ao buscar opções do sistema.");
  return response.json();
}

// 2. Consulta a integração SIGAA via Servidor
export async function fetchData(email: string): Promise<Omit<StoredUser, "password" | "email">> {
  const response = await fetch(`${API_URL}/sigaa/${encodeURIComponent(email)}`);
  if (!response.ok) throw new Error("Erro ao consultar os dados no SIGAA.");
  return response.json();
}

// 3. Envia o código OTP via Servidor
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

// 4. Valida o código OTP no Servidor
export async function verifyOtp(email: string, code: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao verificar OTP.");
  return data;
}

// 5. Cadastra o novo usuário no servidor (espera a propriedade passwordHash na interface StoredUser)
export async function registerUser(userData: Omit<StoredUser, "id">): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao cadastrar usuário.");
  return data;
}

// 6. Autentica o Usuário (Login)
export async function loginUser(email: string, password: string): Promise<{ message: string; user: UserProfile }> {
  if (!email || !password) {
    throw new Error("E-mail e senha são obrigatórios.");
  }

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Credenciais inválidas.");
  return data;
}

// 7. Altera a Senha no Servidor
export async function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/profile/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, currentPassword, newPassword }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao alterar a senha.");
  return data;
}

// 8. Busca os dados do Usuário Logado (Perfil)
export async function fetchCurrentUser(): Promise<UserProfile | null> {
  const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");

  if (!userEmail) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/me?email=${encodeURIComponent(userEmail)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Trata erro HTTP antes de tentar ler como JSON
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Sessão inválida ou expirada.");
  }

  return response.json();
}
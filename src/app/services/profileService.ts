import type { UserProfile } from "../types/auth";
import { API_URL } from "../data/apiData";

// 1. Alteração de Senha no Perfil
export async function changePasswordApi(
  email: string,
  currentPassword: string,
  newPassword: string
) {
  const response = await fetch(`${API_URL}/profile/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, currentPassword, newPassword }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Erro ao alterar a senha.");
  }
  return data;
}

// 2. Busca os dados do Usuário Logado (Perfil)
export async function fetchCurrentUser(): Promise<UserProfile | null> {
  const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
  if (!userEmail) return null;

  const response = await fetch(`${API_URL}/auth/me?email=${encodeURIComponent(userEmail)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Sessão inválida ou expirada.");
  }

  return response.json();
}
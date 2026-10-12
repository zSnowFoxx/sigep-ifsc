import { backend } from "./apiClient";

// 1. Alteração de Senha no Perfil (do usuário logado, identificado pelo token)
export async function changePasswordApi(currentPassword: string, newPassword: string) {
  await backend("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ senhaAtual: currentPassword, novaSenha: newPassword }),
  });
}

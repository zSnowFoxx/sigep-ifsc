import { backend } from "./apiClient";

// 1. Alteração de Senha no Perfil
export async function changePasswordApi(
  email: string,
  currentPassword: string,
  newPassword: string
) {
  await backend("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ email, senhaAtual: currentPassword, novaSenha: newPassword }),
  });
}

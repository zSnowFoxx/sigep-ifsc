const API_URL = "http://localhost:3001/api";

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
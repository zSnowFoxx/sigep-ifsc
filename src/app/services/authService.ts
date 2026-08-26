const API_URL = "http://localhost:3001/api";

export async function fetchFormOptions() {
  const response = await fetch(`${API_URL}/options`);
  if (!response.ok) throw new Error("Erro ao carregar opções.");
  return response.json();
}

export async function sendOtpApi(email: string) {
  const response = await fetch(`${API_URL}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao enviar código.");
  return data;
}

export async function verifyOtpApi(email: string, code: string) {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Código inválido.");
  return data;
}

export async function fetchSigaaApi(email: string) {
  const response = await fetch(`${API_URL}/sigaa/${encodeURIComponent(email)}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao buscar dados do SIGAA.");
  return data;
}

export async function registerUserApi(payload: Record<string, any>) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao cadastrar.");
  return data;
}

export async function forgotPasswordApi(email: string) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erro ao solicitar recuperação.");
  return data;
}

export async function resetPasswordApi(email: string, code: string, newPassword: string) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erro ao redefinir a senha.");
  return data;
}
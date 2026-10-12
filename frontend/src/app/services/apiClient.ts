import { BACKEND_URL } from "../data/apiData";
import { getToken, clearSession, SESSION_EXPIRED_EVENT } from "./session";

// Erro de requisição com o status HTTP, para quem precisa tratar casos específicos (ex.: 403).
export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function request<T>(baseUrl: string, path: string, config?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...config,
    headers: { "Content-Type": "application/json", ...config?.headers },
  });

  if (response.status === 204) return {} as T;
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const details = Array.isArray(body?.details) ? `: ${body.details.join("; ")}` : "";
    throw new HttpError(
      `${body?.message || `Erro na requisição ${path}: ${response.statusText}`}${details}`,
      response.status
    );
  }

  // O backend real responde { success, data }; o mockup responde o dado diretamente.
  return body && typeof body === "object" && "success" in body ? body.data : body;
}

// Backend real (API RESTful com MySQL). Envia o JWT da sessão, se houver.
export async function backend<T>(path: string, config?: RequestInit): Promise<T> {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}`, ...config?.headers } : config?.headers;

  try {
    return await request<T>(BACKEND_URL, path, { ...config, headers });
  } catch (err) {
    // Token expirado ou inválido: encerra a sessão e o App volta para o login.
    if (token && err instanceof HttpError && err.status === 401) {
      clearSession();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    throw err;
  }
}

export interface Lookup {
  id: number;
  nome: string;
}

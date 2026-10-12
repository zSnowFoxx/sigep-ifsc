// Sessão do usuário: o JWT emitido pelo backend no login.
const TOKEN_KEY = "authToken";
// Chave da versão anterior, que guardava só o SIAPE.
const LEGACY_KEY = "userSiape";

// Disparado quando o backend recusa o token (expirado ou inválido).
export const SESSION_EXPIRED_EVENT = "sessionexpired";

export function saveSession(token: string, remember: boolean) {
  // "Permanecer conectado" usa localStorage; caso contrário, apenas a aba atual (sessionStorage).
  const [keep, drop] = remember ? [localStorage, sessionStorage] : [sessionStorage, localStorage];
  keep.setItem(TOKEN_KEY, token);
  drop.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(LEGACY_KEY);
  }
}

// SIAPE do usuário logado, lido do payload do token. Só para a interface:
// quem valida a assinatura é o backend.
export function getSessionSiape(): string | null {
  const payload = getToken()?.split(".")[1];
  if (!payload) return null;

  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json).siape ?? null;
  } catch {
    return null;
  }
}

export type Role =
  | "Equipe Pedagógica/NAE"
  | "Professor"
  | "Coordenador de Curso"
  | "Servidor Geral";

export interface UserSession {
  email: string;
  name: string;
  siape: string;
  role: Role;
  course?: string;
  disciplines?: string[];
  // Definido pelo backend (AUDITORIA_PERFIS): libera a tela de logs.
  acessoAuditoria?: boolean;
}

export type StoredUser = UserSession & { password: string };

export interface LoginProps {
  onLogin: (profile: UserSession) => void;
}
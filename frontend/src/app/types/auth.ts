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
}

export type StoredUser = UserSession & { password: string };

export interface LoginProps {
  onLogin: (profile: UserSession) => void;
}
export type Role =
  | "Equipe Pedagógica/NAE"
  | "Professor"
  | "Coordenador de Curso"
  | "Servidor Geral";

export interface UserProfile {
  email: string;
  name: string;
  siape: string;
  role: Role;
  course?: string;
  disciplines?: string[];
}

export type StoredUser = UserProfile & { password: string };

export interface LoginProps {
  onLogin: (profile: UserProfile) => void;
}
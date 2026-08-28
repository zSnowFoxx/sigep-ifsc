export type Role =
  | "Professor"
  | "Coordenador de Curso"
  | "Equipe Pedagógica/NAE"
  | "Servidor Geral";

export interface SystemOptions {
  roles: Role[];
  courses: Array<{ id: number; nome: string }>;
  disciplines: Array<{ id: number; nome: string; sigla?: string }>;
  funcoes: Array<{ id: number; nome: string }>;
}

export interface RegisterUserData {
  email: string;
  password?: string;
  name: string;
  siape: string;
  role: Role | "";
  course?: string; // Nome ou ID do curso (Coordenador)
  disciplines?: string[]; // Nomes das disciplinas lecionadas (Professor ou Coordenador)
  funcoes?: string[]; // Nomes ou IDs das funções/áreas
}

export interface UserSession {
  id: number;
  nome: string;
  email: string;
  siape: string;
  perfil_id: number;
  cargo?: string;
  funcoes?: string[];
}


export type StoredUser = UserSession & { password: string };


export interface LoginProps {
  onLogin: (user: UserSession) => void;
}
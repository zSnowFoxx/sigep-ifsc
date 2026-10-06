export type TabId = 1 | 2 | 3 | 4;

export type ConselhoMode = "intermediario" | "final";

export type EncStatus = "pendente" | "em-andamento" | "finalizado";

export type GravidadeDemanda = "nao-urgente" | "urgente" | "critica";

export type EncEvolucaoTipo = "criacao" | "triagem" | "relato" | "conclusao";

export interface Professor {
  nome: string;
  disciplina: string;
  cargo: string;
  presente: boolean;
}

export interface Aluno {
  matricula: string;
  nome: string;
  atencao: boolean;
  risco?: boolean;
  turma?: string;
}

export interface EncItemData {
  id: number;
  titulo: string;
  categoria: string;
  aluno: string;
  matricula: string;
  turma: string;
  status: EncStatus;
  data: string;
  servidor: string;
  descricao: string;
}

export interface AlunoEval {
  risco: boolean;
  obs: string;
  encaminhamento: string;
  acao: string;
  servidor: string;
  saved: boolean;
}

export interface DemandaItem {
  id: number;
  situacao: string;
  gravidade: GravidadeDemanda;
}

export interface TurmaForm {
  representantes: string;
  sintese: string;
  pontosPositivos: string[];
  customPontos: string[];
  dificuldades: string[];
  customDificuldades: string[];
  demandas: DemandaItem[];
  registros: string;
}

export interface TurmaData {
  nome: string;
  alunosList: Aluno[];
  coord: string;
  semestre: string;
}

export interface Disciplina {
  nome: string;
  professor: string;
  ch: number;
  nota: number;
  presentes: number;
  faltasJust: number;
  faltasNaoJust: number;
}

export interface RegistroDocente {
  id: number;
  titulo: string;
  categoria: string;
  aluno: string;
  matricula: string;
  turma: string;
  docente: string;
  data: string;
  descricao: string;
  encOpcao: "novo" | "existente" | null;
  encId: number | null;
}

export interface Enc {
  id: number;
  categoria: string;
  descricao: string;
  servidor: string;
}

export interface EncEvolucao {
  data: string;
  autor: string;
  texto: string;
  tipo: EncEvolucaoTipo;
}


export type TabDef = { 
    id: TabId; 
    label: string; 
    icon: React.ElementType; 
    short: string; 
    displayNum: number 
};

export interface ConselhoDeClasseProps {
  onNavigate?: (page: number) => void;
  onBack?: () => void;
  mode?: ConselhoMode;
}
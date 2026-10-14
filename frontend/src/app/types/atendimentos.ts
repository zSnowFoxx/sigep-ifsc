export interface AtendimentoItem {
  id: number;
  data: string;
  hora: string;
  aluno: string;
  matricula: string;
  turma: string;
  servidor: string;
  cargo: string;
  motivo: string;
  contato: string;
  relato: string;
}

// Resposta de GET /atendimentos (colunas em snake_case, como no banco).
export interface AtendimentoApi {
  id: number;
  aluno_id: number;
  turma_id: number;
  servidor_id: number | null;
  data_atendimento: string;
  motivo: string;
  forma_contato: string | null;
  relato: string;
}

export interface AlunoSugestao {
  id: number;
  matricula: string;
  nome: string;
  turma: string;
}

export interface ServidorOpcao {
  id: number;
  nome: string;
  cargo: string;
}

export interface ViewModal {
  atendimento: AtendimentoItem | null;
}

export interface InitialStudent {
  matricula: string;
  nome: string;
  turma: string;
}

export interface AtendimentosProps {
  initialStudent?: InitialStudent | null;
  onClearInitialStudent?: () => void;
}
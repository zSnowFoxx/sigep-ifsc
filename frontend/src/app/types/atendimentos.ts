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

export interface AlunoSugestao {
  matricula: string;
  nome: string;
  turma: string;
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
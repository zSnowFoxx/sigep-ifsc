export type Status = "pendente" | "andamento" | "concluido";
export type EncStatus = "pendente" | "em-andamento" | "finalizado";
export type EncEvolucaoTipo = "criacao" | "triagem" | "relato" | "conclusao";

export interface Evolucao {
  data: string;
  autor: string;
  texto: string;
  tipo: EncEvolucaoTipo;
}

export interface Encaminhamento {
  id: number;
  titulo: string;
  aluno: string;
  matricula: string;
  turma: string;
  // Criado em uma turma que não faz parte do conselho aberto (histórico do aluno).
  turmaAnterior?: boolean;
  origem: string;
  categoria: string;
  responsavel: string;
  prazo?: string;
  ultimoRelato?: string;
  descricao?: string;
  urgente: boolean;
  status: Status;
  parecer: string;
  evolucoes: Evolucao[];
}

export interface Enc {
  id: number;
  categoria: string;
  descricao: string;
  servidor: string;
}
export type Status = "pendente" | "andamento" | "concluido";

export type TipoEvolucao = "criacao" | "triagem" | "relato" | "conclusao";

export interface Evolucao {
  data: string;
  autor: string;
  texto: string;
  tipo: TipoEvolucao;
}

export interface Encaminhamento {
  id: number;
  aluno: string;
  matricula: string;
  turma: string;
  origem: string;
  categoria: string;
  responsavel: string;
  prazo?: string;
  ultimoRelato?: string;
  urgente: boolean;
  status: Status;
  parecer: string;
  // Total de entradas da linha do tempo; as entradas em si são carregadas ao abrir o card.
  totalEvolucoes: number;
  evolucoes: Evolucao[];
}

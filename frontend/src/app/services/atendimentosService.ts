import { backend, type Lookup } from "./apiClient";
import {
  formatData,
  formatHora,
  type AlunoApi,
  type TurmaRef,
  type UsuarioApi,
} from "./conselhoService";
import type {
  AlunoSugestao,
  AtendimentoApi,
  AtendimentoItem,
  ServidorOpcao,
} from "../types/atendimentos";

export interface DadosAtendimentos {
  atendimentos: AtendimentoItem[];
  alunos: AlunoSugestao[];
  servidores: ServidorOpcao[];
}

export async function carregarAtendimentos(): Promise<DadosAtendimentos> {
  const [atendimentosApi, alunosApi, turmas, usuarios, perfis] = await Promise.all([
    backend<AtendimentoApi[]>("/atendimentos"),
    backend<AlunoApi[]>("/alunos"),
    backend<TurmaRef[]>("/turmas"),
    backend<UsuarioApi[]>("/users"),
    backend<Lookup[]>("/perfis"),
  ]);

  const turmasPorId = new Map(turmas.map((t) => [t.id, t]));
  const usuariosPorId = new Map(usuarios.map((u) => [u.id, u]));
  const alunosPorId = new Map(alunosApi.map((a) => [a.id, a]));
  const nomeDaTurma = (id: number) => turmasPorId.get(id)?.nome ?? `Turma ${id}`;
  const cargoDo = (usuario: UsuarioApi | undefined) =>
    perfis.find((p) => p.id === usuario?.perfil_id)?.nome ?? "";

  const atendimentos: AtendimentoItem[] = atendimentosApi.map((a) => {
    const aluno = alunosPorId.get(a.aluno_id);
    const servidor = a.servidor_id ? usuariosPorId.get(a.servidor_id) : undefined;
    return {
      id: a.id,
      data: formatData(a.data_atendimento),
      hora: formatHora(a.data_atendimento).replace(":", "h"),
      aluno: aluno?.nome ?? "",
      matricula: aluno?.matricula ?? "",
      turma: nomeDaTurma(a.turma_id),
      servidor: servidor?.nome ?? "—",
      cargo: cargoDo(servidor),
      motivo: a.motivo,
      contato: a.forma_contato ?? "",
      relato: a.relato,
    };
  });

  const alunos: AlunoSugestao[] = alunosApi.map((a) => ({
    id: a.id,
    matricula: a.matricula,
    nome: a.nome,
    turma: a.turmaIds.map(nomeDaTurma).join(", "),
  }));

  const servidores: ServidorOpcao[] = usuarios.map((u) => ({
    id: u.id,
    nome: u.nome,
    cargo: cargoDo(u),
  }));

  return { atendimentos, alunos, servidores };
}

const pad = (n: number) => String(n).padStart(2, "0");

// O formulário escolhe só a data; a hora é a atual.
export const combinarDataHora = (data: string) => {
  const agora = new Date();
  return new Date(`${data}T${pad(agora.getHours())}:${pad(agora.getMinutes())}`).toISOString();
};

export const criarAtendimento = (dados: {
  alunoId: number;
  servidorId: number | null;
  data: string;
  motivo: string;
  contato: string;
  relato: string;
}) =>
  backend<AtendimentoApi>("/atendimentos", {
    method: "POST",
    body: JSON.stringify({
      alunoId: dados.alunoId,
      servidorId: dados.servidorId,
      dataAtendimento: combinarDataHora(dados.data),
      motivo: dados.motivo,
      formaContato: dados.contato.trim() || null,
      relato: dados.relato,
    }),
  });

import { backend } from "./apiClient";
import { getSessionSiape } from "./authService";
import {
  adicionarAcompanhamento,
  toEncaminhamento,
  type AlunoApi,
  type TurmaRef,
  type UsuarioApi,
} from "./conselhoService";
import type { AcompanhamentoApi, EncaminhamentoApi } from "../types/conselho";
import type { Encaminhamento } from "../types/encaminhamentos";

export { finalizarEncaminhamento } from "./conselhoService";

export interface DadosEncaminhamentos {
  encaminhamentos: Encaminhamento[];
  usuarioLogadoId: number | null;
}

export async function carregarEncaminhamentos(): Promise<DadosEncaminhamentos> {
  const [encaminhamentosApi, acompanhamentosApi, alunos, turmas, usuarios] = await Promise.all([
    backend<EncaminhamentoApi[]>("/encaminhamentos"),
    backend<AcompanhamentoApi[]>("/encaminhamentos/acompanhamentos"),
    backend<AlunoApi[]>("/alunos"),
    backend<TurmaRef[]>("/turmas"),
    backend<UsuarioApi[]>("/users"),
  ]);

  const acompanhamentosPorEnc = new Map<number, AcompanhamentoApi[]>();
  for (const a of acompanhamentosApi) {
    acompanhamentosPorEnc.set(a.encaminhamento_id, [...(acompanhamentosPorEnc.get(a.encaminhamento_id) ?? []), a]);
  }

  const alunosPorId = new Map(alunos.map((a) => [a.id, a]));
  const turmasPorId = new Map(turmas.map((t) => [t.id, t]));
  const usuariosPorId = new Map(usuarios.map((u) => [u.id, u]));
  const siape = getSessionSiape();

  return {
    encaminhamentos: encaminhamentosApi.map((e) =>
      toEncaminhamento(e, acompanhamentosPorEnc.get(e.id) ?? [], alunosPorId, turmasPorId, usuariosPorId)
    ),
    usuarioLogadoId: usuarios.find((u) => u.siape === siape)?.id ?? null,
  };
}

// O primeiro relato tira o encaminhamento da triagem e o põe em acompanhamento.
export async function registrarRelato(encaminhamento: Encaminhamento, autorId: number | null, relato: string) {
  await adicionarAcompanhamento(encaminhamento.id, autorId, "relato", relato);
  if (encaminhamento.status === "pendente") {
    await backend(`/encaminhamentos/${encaminhamento.id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "em-andamento" }),
    });
  }
}

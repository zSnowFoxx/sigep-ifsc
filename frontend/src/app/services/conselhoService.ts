import { backend, type Lookup } from "./apiClient";
import { getSessionSiape } from "./authService";
import { periodoLabel } from "./cadastrosService";
import type {
  AcompanhamentoApi,
  Aluno,
  Conselho,
  ConselhoDemanda,
  ConselhoPayload,
  DeliberacaoApi,
  Disciplina,
  EncaminhamentoApi,
  Professor,
  RegistroDocente,
  RegistroDocenteApi,
  ReuniaoAberta,
  ReuniaoRealizada,
  StatusEncaminhamentoApi,
  TurmaData,
  TurmaForm,
} from "../types/conselho";
import type { Encaminhamento, Status } from "../types/encaminhamentos";
import type { StudentRisk } from "../types/dashboard";
import type { Periodo } from "../types/header";
import { DIFIC_PRESET, PONTOS_PRESET } from "../data/conselhoData";

export interface TurmaRef {
  id: number;
  nome: string;
  curso_id: number;
  periodo_id: number;
}

export interface CursoRef {
  id: number;
  nome: string;
  coordenador_id: number | null;
}

export interface ServidorRef {
  id: number;
  nome: string;
}

export interface ConselhoRefs {
  turmas: TurmaRef[];
  cursos: CursoRef[];
  servidores: ServidorRef[];
}

export const conselhosService = {
  getAll: () => backend<Conselho[]>("/conselhos"),
  create: (data: ConselhoPayload) =>
    backend<Conselho>("/conselhos", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<ConselhoPayload>) =>
    backend<Conselho>(`/conselhos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};

export async function fetchConselhoRefs(): Promise<ConselhoRefs> {
  const [turmas, cursos, servidores] = await Promise.all([
    backend<TurmaRef[]>("/turmas"),
    backend<CursoRef[]>("/cursos"),
    backend<ServidorRef[]>("/users"),
  ]);
  return { turmas, cursos, servidores };
}

// Coordenadores dos cursos das turmas informadas, sem repetir servidores.
export function coordenadoresDasTurmas(turmaIds: number[], refs: ConselhoRefs): ServidorRef[] {
  const cursoIds = new Set(refs.turmas.filter((t) => turmaIds.includes(t.id)).map((t) => t.curso_id));
  const coordenadorIds = new Set(
    refs.cursos.filter((c) => cursoIds.has(c.id) && c.coordenador_id !== null).map((c) => c.coordenador_id)
  );
  return refs.servidores.filter((s) => coordenadorIds.has(s.id));
}

// Converte data e hora dos inputs (data "YYYY-MM-DD", hora "HH:mm") em ISO 8601.
export const toDataRealizacao = (data: string, hora: string) => new Date(`${data}T${hora}`).toISOString();

const pad = (n: number) => String(n).padStart(2, "0");
export const formatData = (valor: string) => {
  // "YYYY-MM-DD" é data pura: new Date() a leria como UTC e mostraria o dia anterior.
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [ano, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${ano}`;
  }
  const d = new Date(valor);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};
const formatCriadoEm = (iso: string) => {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
};
export const formatHora = (iso: string) => {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const nomesTurmas = (conselho: Conselho, refs: ConselhoRefs) =>
  conselho.turmaIds.map((id) => refs.turmas.find((t) => t.id === id)?.nome ?? `Turma ${id}`);

export function toReuniaoAberta(conselho: Conselho, refs: ConselhoRefs): ReuniaoAberta {
  return {
    id: conselho.id,
    titulo: conselho.nome,
    etapa: conselho.tipo === 1 ? "Intermediário" : "Final",
    curso: "",
    status: conselho.status === "em_andamento" ? "em_andamento" : "agendado",
    criadoEm: formatCriadoEm(conselho.data_criacao),
    data: conselho.data_realizacao ? formatData(conselho.data_realizacao) : undefined,
    hora: conselho.data_realizacao ? formatHora(conselho.data_realizacao) : undefined,
    docentes: conselho.servidores.length,
    rascunho: conselho.status === "em_andamento",
    turmas: nomesTurmas(conselho, refs),
    progresso: 0,
  };
}

export function toReuniaoRealizada(conselho: Conselho): ReuniaoRealizada {
  return {
    id: conselho.id,
    titulo: conselho.nome,
    etapa: conselho.tipo === 1 ? "Intermediário" : "Final",
    curso: "",
    data: formatData(conselho.data_realizacao ?? conselho.data_criacao),
    docentes: conselho.servidores.length,
  };
}

// ==========================================
// TELA DO CONSELHO (abas)
// ==========================================

interface UsuarioApi { id: number; siape: string; nome: string; perfil_id: number }
interface AlunoApi { id: number; matricula: string; nome: string; turmaIds: number[] }
interface MatriculaApi { id: number; aluno_id: number; turma_id: number }
interface DiarioApi { id: number; disciplina_id: number; turma_id: number; professor_id: number | null; cargaHoraria: string | null }
interface DisciplinaApi { id: number; nome: string; carga_horaria: string | null }
interface NotaApi {
  matricula_id: number;
  diario_id: number;
  media: number | null;
  infrequencia: number | null;
  presencas: number;
  faltas_justificadas: number;
  faltas_nao_justificadas: number;
}

export interface DadosConselho {
  conselho: Conselho;
  turmas: TurmaData[];
  alunos: Aluno[];
  participantes: Professor[];
  servidores: ServidorRef[];
  coordenadores: string[];
  disciplinas: Record<string, Disciplina[]>;
  demandas: ConselhoDemanda[];
  registros: RegistroDocente[];
  deliberacoes: DeliberacaoApi[];
  encaminhamentos: Encaminhamento[];
  usuarioLogadoId: number | null;
}

const STATUS_DA_API: Record<StatusEncaminhamentoApi, Status> = {
  pendente: "pendente",
  "em-andamento": "andamento",
  finalizado: "concluido",
};

const horas = (valor: string | null | undefined) => parseInt(valor ?? "", 10) || 0;
const textoOuNull = (valor: string) => (valor.trim() ? valor.trim() : null);

function toDisciplina(nota: NotaApi, diario: DiarioApi, disciplina: DisciplinaApi | undefined, professor: string): Disciplina {
  const contadas = nota.presencas + nota.faltas_justificadas + nota.faltas_nao_justificadas;
  const ch = horas(diario.cargaHoraria) || horas(disciplina?.carga_horaria) || contadas || 1;
  const base = { nome: disciplina?.nome ?? "Disciplina", professor, ch, nota: nota.media ?? 0 };

  // Sem horas lançadas, as faltas vêm do percentual de infrequência do SIGAA (sem separar as justificadas).
  if (contadas === 0 && nota.infrequencia !== null) {
    const faltas = Math.round((ch * nota.infrequencia) / 100);
    return { ...base, presentes: ch - faltas, faltasJust: 0, faltasNaoJust: faltas };
  }

  return {
    ...base,
    presentes: nota.presencas,
    faltasJust: nota.faltas_justificadas,
    faltasNaoJust: nota.faltas_nao_justificadas,
  };
}

function toEncaminhamento(
  e: EncaminhamentoApi,
  acompanhamentos: AcompanhamentoApi[],
  alunos: Map<number, AlunoApi>,
  turmas: Map<number, TurmaRef>,
  usuarios: Map<number, UsuarioApi>
): Encaminhamento {
  const aluno = alunos.get(e.aluno_id);
  const conclusao = [...acompanhamentos].reverse().find((a) => a.tipo === "conclusao");
  return {
    id: e.id,
    titulo: e.titulo,
    aluno: aluno?.nome ?? "",
    matricula: aluno?.matricula ?? "",
    turma: turmas.get(e.turma_id)?.nome ?? "",
    origem: e.origem ?? "",
    categoria: e.categoria,
    responsavel: (e.servidor_responsavel_id && usuarios.get(e.servidor_responsavel_id)?.nome) || "",
    prazo: e.prazo ? formatData(e.prazo) : undefined,
    descricao: e.descricao_inicial ?? undefined,
    urgente: e.urgente,
    status: STATUS_DA_API[e.status],
    parecer: conclusao?.relato ?? "",
    evolucoes: acompanhamentos.map((a) => ({
      data: formatData(a.data_registro),
      autor: (a.autor_id && usuarios.get(a.autor_id)?.nome) || "Sistema",
      texto: a.relato,
      tipo: a.tipo,
    })),
  };
}

export async function carregarConselho(conselhoId: number): Promise<DadosConselho> {
  const base = `/conselhos/${conselhoId}`;
  const [
    conselho, turmasApi, cursos, usuariosApi, perfis, periodos, alunosApi, matriculas, diarios,
    disciplinasApi, notas, riscos, demandas, registrosApi, deliberacoes, encaminhamentosApi,
  ] = await Promise.all([
    backend<Conselho>(base),
    backend<TurmaRef[]>("/turmas"),
    backend<CursoRef[]>("/cursos"),
    backend<UsuarioApi[]>("/users"),
    backend<Lookup[]>("/perfis"),
    backend<Periodo[]>("/periodos"),
    backend<AlunoApi[]>("/alunos"),
    backend<MatriculaApi[]>("/matriculas"),
    backend<DiarioApi[]>("/diarios"),
    backend<DisciplinaApi[]>("/disciplinas"),
    backend<NotaApi[]>("/notas-frequencias"),
    backend<StudentRisk[]>("/dashboard/risk-students"),
    backend<ConselhoDemanda[]>(`${base}/demandas`),
    backend<RegistroDocenteApi[]>(`${base}/registros-docentes`),
    backend<DeliberacaoApi[]>(`${base}/deliberacoes`),
    backend<EncaminhamentoApi[]>("/encaminhamentos"),
  ]);

  const turmaIds = new Set(conselho.turmaIds);
  const turmasPorId = new Map(turmasApi.map((t) => [t.id, t]));
  const usuarios = new Map(usuariosApi.map((u) => [u.id, u]));
  const alunosPorId = new Map(alunosApi.map((a) => [a.id, a]));
  const diariosPorId = new Map(diarios.map((d) => [d.id, d]));
  const disciplinasPorId = new Map(disciplinasApi.map((d) => [d.id, d]));
  const nomesDasTurmas = conselho.turmaIds.map((id) => turmasPorId.get(id)?.nome ?? `Turma ${id}`);

  // Atenção e risco seguem o painel de risco do dashboard, restrito às turmas deste conselho.
  const alunos: Aluno[] = alunosApi
    .filter((a) => a.turmaIds.some((id) => turmaIds.has(id)))
    .map((a) => {
      const riscosDoAluno = riscos.filter((r) => r.matricula === a.matricula && nomesDasTurmas.includes(r.turma));
      return {
        id: a.id,
        matricula: a.matricula,
        nome: a.nome,
        atencao: riscosDoAluno.length > 0,
        risco: riscosDoAluno.some((r) => r.fatores.includes("Risco alto de evasão")),
        turma: a.turmaIds.filter((id) => turmaIds.has(id)).map((id) => turmasPorId.get(id)?.nome).join(", "),
      };
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  const coordenadorDaTurma = (turma: TurmaRef | undefined) => {
    const coordId = cursos.find((c) => c.id === turma?.curso_id)?.coordenador_id;
    return (coordId && usuarios.get(coordId)?.nome) || "—";
  };

  const turmas: TurmaData[] = conselho.turmaIds.map((id) => {
    const turma = turmasPorId.get(id);
    const periodo = periodos.find((p) => p.id === turma?.periodo_id);
    return {
      id,
      nome: turma?.nome ?? `Turma ${id}`,
      alunosList: alunos.filter((a) => alunosPorId.get(a.id)?.turmaIds.includes(id)),
      coord: coordenadorDaTurma(turma),
      semestre: periodo ? periodoLabel(periodo) : "",
    };
  });

  const coordenadores = [...new Set(turmas.map((t) => t.coord).filter((c) => c !== "—"))];

  const participantes: Professor[] = conselho.servidores.map((s) => {
    const usuario = usuarios.get(s.usuarioId);
    const disciplinasLecionadas = [
      ...new Set(
        diarios
          .filter((d) => d.professor_id === s.usuarioId && turmaIds.has(d.turma_id))
          .map((d) => disciplinasPorId.get(d.disciplina_id)?.nome)
          .filter(Boolean)
      ),
    ];
    return {
      usuarioId: s.usuarioId,
      nome: usuario?.nome ?? `Servidor ${s.usuarioId}`,
      cargo: perfis.find((p) => p.id === usuario?.perfil_id)?.nome ?? "",
      disciplina: disciplinasLecionadas.join(", ") || "—",
      presente: s.presente === true,
    };
  });

  const matriculasDoConselho = matriculas.filter((m) => turmaIds.has(m.turma_id));
  const disciplinas: Record<string, Disciplina[]> = {};
  for (const aluno of alunos) {
    const matriculaIds = new Set(matriculasDoConselho.filter((m) => m.aluno_id === aluno.id).map((m) => m.id));
    disciplinas[aluno.matricula] = notas
      .filter((n) => matriculaIds.has(n.matricula_id))
      .flatMap((n) => {
        const diario = diariosPorId.get(n.diario_id);
        if (!diario) return [];
        const professor = (diario.professor_id && usuarios.get(diario.professor_id)?.nome) || "—";
        return [toDisciplina(n, diario, disciplinasPorId.get(diario.disciplina_id), professor)];
      });
  }

  const registros: RegistroDocente[] = registrosApi.map((r) => {
    const aluno = alunosPorId.get(r.aluno_id);
    return {
      id: r.id,
      titulo: r.titulo,
      categoria: r.categoria,
      aluno: aluno?.nome ?? "",
      matricula: aluno?.matricula ?? "",
      turma: turmasPorId.get(r.turma_id)?.nome ?? "",
      docente: usuarios.get(r.docente_id)?.nome ?? "",
      data: formatData(r.data_registro),
      descricao: r.registro,
      encOpcao: r.encaminhamento_id ? "existente" : null,
      encId: r.encaminhamento_id,
    };
  });

  const encaminhamentosDasTurmas = encaminhamentosApi.filter((e) => turmaIds.has(e.turma_id));
  const acompanhamentos = await Promise.all(
    encaminhamentosDasTurmas.map((e) => backend<AcompanhamentoApi[]>(`/encaminhamentos/${e.id}/acompanhamentos`))
  );
  const encaminhamentos = encaminhamentosDasTurmas.map((e, i) =>
    toEncaminhamento(e, acompanhamentos[i], alunosPorId, turmasPorId, usuarios)
  );

  const siape = getSessionSiape();

  return {
    conselho,
    turmas,
    alunos,
    participantes,
    servidores: usuariosApi.map((u) => ({ id: u.id, nome: u.nome })),
    coordenadores,
    disciplinas,
    demandas,
    registros,
    deliberacoes,
    encaminhamentos,
    usuarioLogadoId: usuariosApi.find((u) => u.siape === siape)?.id ?? null,
  };
}

// ── Demandas gerais (formulário por turma) ──

export function toTurmaForm(demanda: ConselhoDemanda | undefined, alunos: Aluno[]): TurmaForm {
  const pontos = demanda?.pontos_positivos ?? [];
  const dificuldades = demanda?.dificuldades_apontadas ?? [];
  return {
    representantes: alunos.find((a) => a.id === demanda?.aluno_representante_id)?.nome ?? "",
    sintese: demanda?.sintese_diagnostico ?? "",
    pontosPositivos: pontos,
    customPontos: pontos.filter((p) => !(PONTOS_PRESET as readonly string[]).includes(p)),
    dificuldades,
    customDificuldades: dificuldades.filter((d) => !(DIFIC_PRESET as readonly string[]).includes(d)),
    demandas: (demanda?.demandasGerais ?? []).map((d) => ({ id: d.id, situacao: d.situacao, gravidade: d.gravidade })),
    registros: demanda?.registros_observacoes ?? "",
  };
}

export const turmaFormVazio = (form: TurmaForm) =>
  !form.representantes.trim() &&
  !form.sintese.trim() &&
  !form.registros.trim() &&
  form.pontosPositivos.length === 0 &&
  form.dificuldades.length === 0 &&
  form.demandas.length === 0;

export async function salvarDemanda(
  conselhoId: number,
  turma: TurmaData,
  form: TurmaForm,
  existe: boolean
): Promise<ConselhoDemanda> {
  const nomeRepresentante = form.representantes.trim().toLowerCase();
  const representante = turma.alunosList.find((a) => a.nome.toLowerCase() === nomeRepresentante);
  if (nomeRepresentante && !representante) {
    throw new Error(`Representante de ${turma.nome}: selecione um aluno da turma na lista.`);
  }

  const dados = {
    alunoRepresentanteId: representante?.id ?? null,
    sinteseDiagnostico: textoOuNull(form.sintese),
    pontosPositivos: form.pontosPositivos,
    dificuldadesApontadas: form.dificuldades,
    registrosObservacoes: textoOuNull(form.registros),
    demandasGerais: form.demandas.map((d) => ({ situacao: d.situacao, gravidade: d.gravidade })),
  };

  return existe
    ? backend<ConselhoDemanda>(`/conselhos/${conselhoId}/demandas/${turma.id}`, {
        method: "PUT",
        body: JSON.stringify(dados),
      })
    : backend<ConselhoDemanda>(`/conselhos/${conselhoId}/demandas`, {
        method: "POST",
        body: JSON.stringify({ turmaId: turma.id, ...dados }),
      });
}

// ── Participantes, deliberações e status ──

export const salvarPresencas = (conselhoId: number, participantes: Professor[]) =>
  conselhosService.update(conselhoId, {
    servidores: participantes.map((p) => ({ usuarioId: p.usuarioId, presente: p.presente })),
  });

export const salvarDeliberacao = (conselhoId: number, alunoId: number, texto: string, existenteId?: number) =>
  existenteId
    ? backend<DeliberacaoApi>(`/conselhos/${conselhoId}/deliberacoes/${existenteId}`, {
        method: "PUT",
        body: JSON.stringify({ alteracoesRealizadas: texto }),
      })
    : backend<DeliberacaoApi>(`/conselhos/${conselhoId}/deliberacoes`, {
        method: "POST",
        body: JSON.stringify({ alunoId, alteracoesRealizadas: texto }),
      });

// ── Registros docentes e encaminhamentos ──

export const adicionarAcompanhamento = (
  encaminhamentoId: number,
  autorId: number | null,
  tipo: AcompanhamentoApi["tipo"],
  relato: string
) =>
  backend<AcompanhamentoApi>(`/encaminhamentos/${encaminhamentoId}/acompanhamentos`, {
    method: "POST",
    body: JSON.stringify({ autorId, tipo, relato }),
  });

export async function criarEncaminhamento(dados: {
  conselhoId: number;
  alunoId: number;
  titulo: string;
  categoria: string;
  servidorResponsavelId: number | null;
  descricao: string;
  autorId: number | null;
}): Promise<number> {
  const encaminhamento = await backend<EncaminhamentoApi>("/encaminhamentos", {
    method: "POST",
    body: JSON.stringify({
      alunoId: dados.alunoId,
      conselhoId: dados.conselhoId,
      titulo: dados.titulo,
      categoria: dados.categoria,
      origem: "Conselho de Classe",
      servidorResponsavelId: dados.servidorResponsavelId,
      descricaoInicial: textoOuNull(dados.descricao),
    }),
  });
  await adicionarAcompanhamento(
    encaminhamento.id,
    dados.autorId,
    "criacao",
    dados.descricao.trim() || "Encaminhamento gerado no Conselho de Classe."
  );
  return encaminhamento.id;
}

export const criarRegistro = (
  conselhoId: number,
  dados: {
    alunoId: number;
    docenteId: number;
    titulo: string;
    categoria: string;
    registro: string;
    encaminhamentoId: number | null;
  }
) =>
  backend<RegistroDocenteApi>(`/conselhos/${conselhoId}/registros-docentes`, {
    method: "POST",
    body: JSON.stringify(dados),
  });

export async function finalizarEncaminhamento(encaminhamentoId: number, autorId: number | null, parecer: string) {
  await adicionarAcompanhamento(encaminhamentoId, autorId, "conclusao", parecer);
  await backend(`/encaminhamentos/${encaminhamentoId}`, {
    method: "PUT",
    body: JSON.stringify({ status: "finalizado" }),
  });
}

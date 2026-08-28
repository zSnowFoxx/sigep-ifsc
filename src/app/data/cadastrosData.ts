import { GraduationCap, Users, LayoutGrid, Award, BookMarked, ClipboardList } from "lucide-react";
import type { CategoryItem, Aluno, Servidor, Curso, Disciplina, Turma, Diario } from "../types/cadastros";
import {
  alunosService,
  servidoresService,
  funcoesService,
  cursosService,
  disciplinasService,
  turmasService,
  diariosService,
} from "../services/cadastrosService";

export const CATEGORIES: CategoryItem[] = [
  { key: "alunos", label: "Alunos", icon: GraduationCap, badge: "", entity: "Aluno", entityPlural: "Alunos Cadastrados" },
  { key: "servidores", label: "Usuários / Servidores", icon: Users, badge: "", entity: "Servidor", entityPlural: "Usuários e Servidores" },
  { key: "cursos", label: "Cursos", icon: Award, badge: "", entity: "Curso", entityPlural: "Cursos" },
  { key: "disciplinas", label: "Disciplinas", icon: BookMarked, badge: "", entity: "Disciplina", entityPlural: "Disciplinas" },
  { key: "turmas", label: "Turmas", icon: LayoutGrid, badge: "", entity: "Turma", entityPlural: "Turmas Cadastradas" },
  { key: "diarios", label: "Diários de Classe", icon: ClipboardList, badge: "", entity: "Diário", entityPlural: "Diários de Classe" },
];

export function updateCategoriesWithCounts(counts: Record<string, number>): CategoryItem[] {
  CATEGORIES.forEach((cat) => {
    const total = counts[cat.key] ?? 0;
    cat.badge = `${total} ${total === 1 ? "cadastrado" : "cadastrados"}`;
  });
  return CATEGORIES;
}

export const FASES = [
  "1ª Fase", "2ª Fase", "3ª Fase", "4ª Fase",
  "5ª Fase", "6ª Fase", "7ª Fase", "8ª Fase"
];

// Perfis padrão do sistema
const PERFIS_MAP: Record<number, string> = {
  1: "Professor",
  2: "Coordenador de Curso",
  3: "Equipe Pedagógica/NAE",
  4: "Servidor Geral"
};

export async function fetchAllInitialData() {
  const [
    rawAlunos,
    rawUsuarios,
    rawFuncoes,
    rawCursos,
    rawDisciplinas,
    rawTurmas,
    rawDiarios,
  ] = await Promise.all([
    alunosService.getAll().catch(() => []),
    servidoresService.getAll().catch(() => []),
    funcoesService.getAll().catch(() => []),
    cursosService.getAll().catch(() => []),
    disciplinasService.getAll().catch(() => []),
    turmasService.getAll().catch(() => []),
    diariosService.getAll().catch(() => []),
  ]);

  // Criar mapas para cruzamento dinâmico via tabela do backend
  const funcoesMap = new Map(rawFuncoes.map((f: any) => [String(f.id), f.nome]));
  const cursosMap = new Map(rawCursos.map((c: any) => [String(c.id), c.nome]));
  const turmasMap = new Map(rawTurmas.map((t: any) => [String(t.id), t.nome]));
  const usuariosMap = new Map(rawUsuarios.map((u: any) => [String(u.id), u.nome]));
  const disciplinasMap = new Map(rawDisciplinas.map((d: any) => [String(d.id), d.nome]));

  // 1. Servidores / Usuários
  const servidores: Servidor[] = rawUsuarios.map((u: any) => {
    const ids: number[] = Array.isArray(u.funcoes_ids) ? u.funcoes_ids : [];

    const funcoesMapeadas = ids
      .map((fid) => funcoesMap.get(String(fid)))
      .filter((nome): nome is string => Boolean(nome));

    return {
      ...u,
      cargo: PERFIS_MAP[u.perfil_id] || "Não especificado",
      funcoes: funcoesMapeadas.length > 0 ? funcoesMapeadas : ["Nenhuma função vinculada"],
    };
  });

  // 2. Alunos
  const alunos: Aluno[] = rawAlunos.map((a: any) => ({
    ...a,
    turmas: (a.turmas_id || a.turmasIds || [])
      .map((tid: any) => turmasMap.get(String(tid)))
      .filter(Boolean),
  }));

  // 3. Cursos
  const cursos: Curso[] = rawCursos.map((c: any) => {
    const coordId = c.coordenador_id ?? c.coordenadorId;
    return {
      ...c,
      cargaHoraria: c.cargaHoraria || c.carga_horaria || "1.200h",
      coordenador: coordId ? (usuariosMap.get(String(coordId)) || c.coordenador) : "Sem coordenador vinculado",
    };
  });

  // 4. Disciplinas
  const disciplinas: Disciplina[] = rawDisciplinas.map((d: any) => {
    const cursoId = d.curso_id ?? d.cursoId;
    return {
      ...d,
      curso: cursoId ? (cursosMap.get(String(cursoId)) || d.curso) : "Sem curso vinculado",
    };
  });

  // 5. Turmas (calcula a quantidade exata de alunos vinculados filtrando a lista total de alunos)
  const turmas: Turma[] = rawTurmas.map((t: any) => {
    const cursoId = t.curso_id ?? t.cursoId;
    const totalAlunosNaTurma = rawAlunos.filter((a: any) => {
      const tIds = a.turmas_id || a.turmasIds || [];
      return Array.isArray(tIds) && tIds.some((tid) => String(tid) === String(t.id));
    }).length;

    return {
      ...t,
      curso: cursoId ? (cursosMap.get(String(cursoId)) || t.curso) : "Sem curso vinculado",
      periodo: t.periodo || (t.periodo_id === 3 ? "2026.2" : "2026.1"),
      alunos: totalAlunosNaTurma || t.alunos_qtd || t.alunosQtd || 0,
    };
  });

  // 6. Diários
  const diarios: Diario[] = rawDiarios.map((d: any) => {
    const profId = d.professor_usuario_id ?? d.professor_id ?? d.professorUsuarioId ?? d.usuario_id;
    const discId = d.disciplina_id ?? d.disciplinaId;
    const turmaId = d.turma_id ?? d.turmaId;

    return {
      ...d,
      codigo: d.codigo || `DIR-2026-0${d.id}`,
      disciplina: discId ? (disciplinasMap.get(String(discId)) || d.disciplina) : "—",
      turma: turmaId ? (turmasMap.get(String(turmaId)) || d.turma) : "—",
      professor: profId ? (usuariosMap.get(String(profId)) || d.professor) : "Sem professor vinculado",
      cargaHoraria: d.cargaHoraria || d.carga_horaria || "80h",
      aulasPrevistas: d.aulasPrevistas || d.aulas_previstas || 96,
    };
  });

  // Mapeamento dinâmico dos totais por entidade
  const counts: Record<string, number> = {
    alunos: alunos.length,
    servidores: servidores.length,
    cursos: cursos.length,
    disciplinas: disciplinas.length,
    turmas: turmas.length,
    diarios: diarios.length,
  };

  // Categorias processadas com a quantidade real ("X cadastrados")
 const categories = updateCategoriesWithCounts(counts);

  return { alunos, servidores, cursos, disciplinas, turmas, diarios, counts, categories };
}
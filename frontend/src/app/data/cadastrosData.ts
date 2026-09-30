import { GraduationCap, Users, LayoutGrid, Award, BookMarked, ClipboardList } from "lucide-react";
import type { CategoryItem, Aluno, Servidor, Curso, Disciplina, Turma, Diario } from "../types/cadastros";
import {
  alunosService,
  servidoresService,
  cursosService,
  disciplinasService,
  turmasService,
  diariosService,
  perfisService,
  funcoesService,
} from "../services/cadastrosService";

export const CATEGORIES: CategoryItem[] = [
  { key: "alunos", label: "Alunos", icon: GraduationCap, badge: "Alunos", entity: "Aluno", entityPlural: "Alunos Cadastrados" },
  { key: "servidores", label: "Usuários / Servidores", icon: Users, badge: "Servidores", entity: "Servidor", entityPlural: "Usuários e Servidores" },
  { key: "cursos", label: "Cursos", icon: Award, badge: "Cursos", entity: "Curso", entityPlural: "Cursos" },
  { key: "disciplinas", label: "Disciplinas", icon: BookMarked, badge: "Disciplinas", entity: "Disciplina", entityPlural: "Disciplinas" },
  { key: "turmas", label: "Turmas", icon: LayoutGrid, badge: "Turmas", entity: "Turma", entityPlural: "Turmas Cadastradas" },
  { key: "diarios", label: "Diários de Classe", icon: ClipboardList, badge: "Diários", entity: "Diário", entityPlural: "Diários de Classe" },
];

export const FASES = [
  "1ª Fase", "2ª Fase", "3ª Fase", "4ª Fase",
  "5ª Fase", "6ª Fase", "7ª Fase", "8ª Fase"
];

export async function fetchAllInitialData() {
  const [rawAlunos, rawUsuarios, rawCursos, rawDisciplinas, rawTurmas, rawDiarios, rawPerfis, rawFuncoes] = await Promise.all([
    alunosService.getAll().catch(() => []),
    servidoresService.getAll().catch(() => []),
    cursosService.getAll().catch(() => []),
    disciplinasService.getAll().catch(() => []),
    turmasService.getAll().catch(() => []),
    diariosService.getAll().catch(() => []),
    perfisService.getAll().catch(() => []),
    funcoesService.getAll().catch(() => []),
  ]);

  // Conversão de IDs para String garante compatibilidade no Map.get() independente se o backend envia número ou texto
  const cursosMap = new Map(rawCursos.map((c: any) => [String(c.id), c.nome]));
  const turmasMap = new Map(rawTurmas.map((t: any) => [String(t.id), t.nome]));
  const usuariosMap = new Map(rawUsuarios.map((u: any) => [String(u.id), u.nome]));
  const disciplinasMap = new Map(rawDisciplinas.map((d: any) => [String(d.id), d.nome]));
  const perfisMap = new Map(rawPerfis.map((p) => [String(p.id), p.nome]));
  const funcoesMap = new Map(rawFuncoes.map((f) => [String(f.id), f.nome]));

  // 1. Servidores / Usuários (backend retorna perfil_id e funcaoIds)
  const servidores: Servidor[] = rawUsuarios.map((u: any) => ({
    ...u,
    cargo: perfisMap.get(String(u.perfil_id)) || "Não especificado",
    funcoes: (u.funcaoIds || [])
      .map((fid: number) => funcoesMap.get(String(fid)))
      .filter(Boolean),
  }));

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

  // 5. Turmas
  const turmas: Turma[] = rawTurmas.map((t: any) => {
    const cursoId = t.curso_id ?? t.cursoId;
    return {
      ...t,
      curso: cursoId ? (cursosMap.get(String(cursoId)) || t.curso) : "Sem curso vinculado",
      periodo: t.periodo || (t.periodo_id === 3 ? "2026.2" : "2026.1"),
      alunos: t.alunos_qtd || t.alunosQtd || 0,
    };
  });

  // 6. Diários
  const diarios: Diario[] = rawDiarios.map((d: any) => {
    // Aceita múltiplos nomes de chaves que o backend costuma retornar
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

  return {
    alunos,
    servidores,
    cursos,
    disciplinas,
    turmas,
    diarios,
    perfis: rawPerfis.map((p) => p.nome),
    funcoes: rawFuncoes.map((f) => f.nome),
  };
}
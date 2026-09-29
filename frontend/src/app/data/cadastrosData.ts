import { GraduationCap, Users, LayoutGrid, Award, BookMarked, ClipboardList } from "lucide-react";
import type { CategoryItem, Aluno, Servidor, Curso, Disciplina, Turma, Diario } from "../types/cadastros";
import {
  alunosService,
  servidoresService,
  cursosService,
  disciplinasService,
  turmasService,
  diariosService,
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

// Tabelas auxiliares do backend para cruzamento de IDs
const PERFIS_MAP: Record<number, string> = {
  1: "Professor",
  2: "Coordenador de Curso",
  3: "Equipe Pedagógica/NAE",
  4: "Servidor Geral"
};

const FUNCOES_MAP: Record<number, string> = {
  1: "Pedagogo(a)", 2: "Psicólogo(a) Educacional", 3: "Assistente Social",
  4: "Tradutor(a) e Intérprete de LIBRAS", 5: "Orientador(a) Educacional",
  6: "Técnico(a) em Assuntos Educacionais", 7: "Apoio ao NAPNE",
  8: "Coordenador(a) de Curso", 9: "Coordenador(a) de Ensino",
  15: "Secretário(a) Acadêmico(a)", 16: "Assistente Administrativo"
};

export async function fetchAllInitialData() {
  const [rawAlunos, rawUsuarios, rawCursos, rawDisciplinas, rawTurmas, rawDiarios] = await Promise.all([
    alunosService.getAll().catch(() => []),
    servidoresService.getAll().catch(() => []),
    cursosService.getAll().catch(() => []),
    disciplinasService.getAll().catch(() => []),
    turmasService.getAll().catch(() => []),
    diariosService.getAll().catch(() => []),
  ]);

  // Conversão de IDs para String garante compatibilidade no Map.get() independente se o backend envia número ou texto
  const cursosMap = new Map(rawCursos.map((c: any) => [String(c.id), c.nome]));
  const turmasMap = new Map(rawTurmas.map((t: any) => [String(t.id), t.nome]));
  const usuariosMap = new Map(rawUsuarios.map((u: any) => [String(u.id), u.nome]));
  const disciplinasMap = new Map(rawDisciplinas.map((d: any) => [String(d.id), d.nome]));

  // 1. Servidores / Usuários
  const servidores: Servidor[] = rawUsuarios.map((u: any) => {
    // Aceita funcoes_ids, funcoesIds, ou o próprio array de funções se já vier formatado
    const ids = u.funcoes_ids || u.funcoesIds || [];
    let funcoesMapeadas: string[] = [];

    if (Array.isArray(ids) && ids.length > 0) {
      funcoesMapeadas = ids
        .map((fid: any) => (typeof fid === "number" ? FUNCOES_MAP[fid] : fid))
        .filter(Boolean);
    } else if (typeof u.funcao === "string" && u.funcao) {
      funcoesMapeadas = [u.funcao];
    }

    return {
      ...u,
      cargo: PERFIS_MAP[u.perfil_id || u.perfilId] || u.cargo || "Não especificado",
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

  return { alunos, servidores, cursos, disciplinas, turmas, diarios };
}
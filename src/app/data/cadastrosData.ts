import { GraduationCap, Users, LayoutGrid, Award, BookMarked, ClipboardList } from "lucide-react";
import type { CategoryItem, Aluno, Servidor, Curso, Disciplina, Turma, Diario } from "../types/cadastros";

export const CATEGORIES: CategoryItem[] = [
  { key: "alunos",      label: "Alunos",                icon: GraduationCap, badge: "620 cadastrados", entity: "Aluno",      entityPlural: "Alunos Cadastrados"    },
  { key: "servidores",  label: "Usuários / Servidores", icon: Users,         badge: "48 cadastrados",  entity: "Servidor",   entityPlural: "Usuários e Servidores" },
  { key: "cursos",      label: "Cursos",                icon: Award,         badge: "6 cursos",        entity: "Curso",      entityPlural: "Cursos"                },
  { key: "disciplinas", label: "Disciplinas",           icon: BookMarked,    badge: "82 disciplinas",  entity: "Disciplina", entityPlural: "Disciplinas"           },
  { key: "turmas",      label: "Turmas",                icon: LayoutGrid,    badge: "24 turmas",       entity: "Turma",      entityPlural: "Turmas Cadastradas"    },
  { key: "diarios",     label: "Diários de Classe",     icon: ClipboardList, badge: "82 diários",      entity: "Diário",     entityPlural: "Diários de Classe"     },
];

export const FASES = ["1ª Fase", "2ª Fase", "3ª Fase", "4ª Fase", "5ª Fase", "6ª Fase", "7ª Fase", "8ª Fase"];

export const SEED_ALUNOS: Aluno[] = [
  { matricula: "202110806528", nome: "João Pedro Silva",       email: "joao.silva@aluno.ifsc.edu.br",      turma: "TDS 2026/1",         status: "Ativo"   },
  { matricula: "202210809911", nome: "Maria Eduarda Oliveira", email: "maria.oliveira@aluno.ifsc.edu.br",  turma: "TDS 2026/2",         status: "Ativo"   },
  { matricula: "202310804422", nome: "Carlos Henrique Souza",  email: "carlos.souza@aluno.ifsc.edu.br",    turma: "MEC 4ª Fase 2026/1", status: "Ativo"   },
  { matricula: "202110801345", nome: "Ana Beatriz Ferreira",   email: "ana.ferreira@aluno.ifsc.edu.br",    turma: "TDS 3ª Fase 2026/1", status: "Ativo"   },
  { matricula: "202210812788", nome: "Lucas Mendes Costa",     email: "lucas.costa@aluno.ifsc.edu.br",     turma: "MEC 2026/1",         status: "Inativo" },
  { matricula: "202310807654", nome: "Fernanda Costa Lima",    email: "fernanda.lima@aluno.ifsc.edu.br",   turma: "ADM 2026/1",         status: "Ativo"   },
  { matricula: "202110811234", nome: "Rafael Augusto Neves",   email: "rafael.neves@aluno.ifsc.edu.br",    turma: "TDS 4ª Fase 2026/1", status: "Ativo"   },
  { matricula: "202210803321", nome: "Isabela Rocha Martins",  email: "isabela.martins@aluno.ifsc.edu.br", turma: "MEC 3ª Fase 2026/1", status: "Ativo"   },
  { matricula: "202310809876", nome: "Thiago Alves Pereira",   email: "thiago.pereira@aluno.ifsc.edu.br",  turma: "TDS 2026/1",         status: "Ativo"   },
  { matricula: "202110814499", nome: "Camila Dias Santos",     email: "camila.santos@aluno.ifsc.edu.br",   turma: "ADM 2ª Fase 2026/2", status: "Inativo" },
];

export const SEED_SERVIDORES: Servidor[] = [
  { siape: "1234567", nome: "Ana Clara Souza",  email: "ana.souza@ifsc.edu.br",    cargo: "Equipe Pedagógica/NAE", funcoes: ["Psicóloga Educacional", "Secretaria Acadêmica"]                          },
  { siape: "7654321", nome: "Carlos Lima",      email: "carlos.lima@ifsc.edu.br",  cargo: "Professor",             funcoes: ["Turma: TDS 2026/1", "Turma: TDS 2026/2"]                                },
  { siape: "9876543", nome: "Maria Santos",     email: "maria.santos@ifsc.edu.br", cargo: "Coordenador de Curso",  funcoes: ["Coord. Desenvolvimento de Sistemas", "Prof. Banco de Dados"]            },
  { siape: "3456789", nome: "Marcos Pereira",   email: "marcos@ifsc.edu.br",       cargo: "Coordenador de Curso",  funcoes: ["Coord. Mecatrônica", "Prof. Automação Industrial"]                     },
  { siape: "5678901", nome: "Juliana Rocha",    email: "juliana@ifsc.edu.br",      cargo: "Professor",             funcoes: ["Turma: MEC 2026/1", "Turma: ADM 2026/1", "Turma: TDS 3ª Fase 2026/1"] },
  { siape: "6789012", nome: "Fernanda Lima",    email: "fernanda@ifsc.edu.br",     cargo: "Equipe Pedagógica/NAE", funcoes: ["Pedagoga", "Coord. de Turno Vespertino"]                               },
  { siape: "2345678", nome: "Roberto Andrade",  email: "roberto@ifsc.edu.br",      cargo: "Servidor Geral",        funcoes: ["Assistente Administrativo", "Apoio à Secretaria"]                      },
  { siape: "8901234", nome: "Patrícia Gomes",   email: "patricia@ifsc.edu.br",     cargo: "Professor",             funcoes: ["Turma: MEC 2026/2", "Turma: MEC 3ª Fase 2026/1"]                      },
];

export const SEED_CURSOS: Curso[] = [
  { nome: "Técnico em Desenvolvimento de Sistemas", tipo: "Técnico", grau: "Integrado ao EM", modalidade: "Presencial", ppc: "PPC 2023", fases: 4, cargaHoraria: "3.200h", coordenador: "Maria Santos"   },
  { nome: "Técnico em Mecatrônica",                 tipo: "Técnico", grau: "Integrado ao EM", modalidade: "Presencial", ppc: "PPC 2022", fases: 4, cargaHoraria: "3.400h", coordenador: "Marcos Pereira" },
  { nome: "Técnico em Administração",               tipo: "Técnico", grau: "Concomitante",    modalidade: "Presencial", ppc: "PPC 2021", fases: 3, cargaHoraria: "1.200h", coordenador: "Fernanda Lima"  },
  { nome: "Técnico em Enfermagem",                  tipo: "Técnico", grau: "Subsequente",     modalidade: "Presencial", ppc: "PPC 2020", fases: 3, cargaHoraria: "1.600h", coordenador: "—"              },
  { nome: "Técnico em Eletrotécnica",               tipo: "Técnico", grau: "Integrado ao EM", modalidade: "Presencial", ppc: "PPC 2019", fases: 4, cargaHoraria: "3.000h", coordenador: "Roberto Andrade"},
  { nome: "Técnico em Agroindústria",               tipo: "Técnico", grau: "Subsequente",     modalidade: "Presencial", ppc: "PPC 2021", fases: 3, cargaHoraria: "1.400h", coordenador: "—"              },
];

export const SEED_DISCIPLINAS: Disciplina[] = [
  { sigla: "ALG",  nome: "Algoritmos e Programação", cargaHoraria: "80h", faseOferta: "1ª Fase", curso: "Técnico em Desenvolvimento de Sistemas" },
  { sigla: "BD",   nome: "Banco de Dados",           cargaHoraria: "60h", faseOferta: "2ª Fase", curso: "Técnico em Desenvolvimento de Sistemas" },
  { sigla: "PW",   nome: "Programação Web",          cargaHoraria: "80h", faseOferta: "2ª Fase", curso: "Técnico em Desenvolvimento de Sistemas" },
  { sigla: "ED",   nome: "Estrutura de Dados",       cargaHoraria: "80h", faseOferta: "3ª Fase", curso: "Técnico em Desenvolvimento de Sistemas" },
  { sigla: "SO",   nome: "Sistemas Operacionais",    cargaHoraria: "72h", faseOferta: "4ª Fase", curso: "Técnico em Desenvolvimento de Sistemas" },
  { sigla: "ES",   nome: "Engenharia de Software",   cargaHoraria: "72h", faseOferta: "4ª Fase", curso: "Técnico em Desenvolvimento de Sistemas" },
  { sigla: "ING",  nome: "Inglês Técnico",           cargaHoraria: "40h", faseOferta: "1ª Fase", curso: "Técnico em Desenvolvimento de Sistemas" },
  { sigla: "ELE",  nome: "Eletrônica Digital",       cargaHoraria: "72h", faseOferta: "3ª Fase", curso: "Técnico em Mecatrônica"                },
  { sigla: "MAT",  nome: "Matemática Aplicada",      cargaHoraria: "60h", faseOferta: "2ª Fase", curso: "Técnico em Mecatrônica"                },
  { sigla: "HID",  nome: "Hidráulica e Pneumática",  cargaHoraria: "60h", faseOferta: "3ª Fase", curso: "Técnico em Mecatrônica"                },
  { sigla: "GES",  nome: "Gestão Empresarial",       cargaHoraria: "60h", faseOferta: "1ª Fase", curso: "Técnico em Administração"              },
  { sigla: "CONT", nome: "Contabilidade Básica",     cargaHoraria: "60h", faseOferta: "2ª Fase", curso: "Técnico em Administração"              },
];

export const SEED_TURMAS: Turma[] = [
  { nome: "TDS 2026/1",         periodo: "2026.1", curso: "Técnico em Desenvolvimento de Sistemas", alunos: 28 },
  { nome: "TDS 2026/2",         periodo: "2026.2", curso: "Técnico em Desenvolvimento de Sistemas", alunos: 32 },
  { nome: "TDS 3ª Fase 2026/1", periodo: "2026.1", curso: "Técnico em Desenvolvimento de Sistemas", alunos: 24 },
  { nome: "TDS 4ª Fase 2026/1", periodo: "2026.1", curso: "Técnico em Desenvolvimento de Sistemas", alunos: 19 },
  { nome: "MEC 2026/1",         periodo: "2026.1", curso: "Técnico em Mecatrônica",                 alunos: 30 },
  { nome: "MEC 3ª Fase 2026/1", periodo: "2026.1", curso: "Técnico em Mecatrônica",                 alunos: 26 },
  { nome: "MEC 4ª Fase 2026/1", periodo: "2026.1", curso: "Técnico em Mecatrônica",                 alunos: 22 },
  { nome: "ADM 2026/1",         periodo: "2026.1", curso: "Técnico em Administração",               alunos: 35 },
  { nome: "ADM 2ª Fase 2026/2", periodo: "2026.2", curso: "Técnico em Administração",               alunos: 31 },
];

export const SEED_DIARIOS: Diario[] = [
  { codigo: "DIR-2026-01", disciplina: "Banco de Dados",          turma: "TDS 2026/1",         professor: "Juliana Rocha",  cargaHoraria: "60h", aulasPrevistas: 72 },
  { codigo: "DIR-2026-02", disciplina: "Programação Web",         turma: "TDS 2026/1",         professor: "Carlos Lima",    cargaHoraria: "80h", aulasPrevistas: 96 },
  { codigo: "DIR-2026-03", disciplina: "Estrutura de Dados",      turma: "TDS 3ª Fase 2026/1", professor: "Carlos Lima",    cargaHoraria: "80h", aulasPrevistas: 96 },
  { codigo: "DIR-2026-04", disciplina: "Matemática Aplicada",     turma: "MEC 2026/1",         professor: "Patrícia Gomes", cargaHoraria: "60h", aulasPrevistas: 72 },
  { codigo: "DIR-2026-05", disciplina: "Eletrônica Digital",      turma: "MEC 3ª Fase 2026/1", professor: "Patrícia Gomes", cargaHoraria: "72h", aulasPrevistas: 86 },
  { codigo: "DIR-2026-06", disciplina: "Gestão Empresarial",      turma: "ADM 2026/1",         professor: "Juliana Rocha",  cargaHoraria: "60h", aulasPrevistas: 72 },
  { codigo: "DIR-2026-07", disciplina: "Inglês Técnico",          turma: "TDS 2026/1",         professor: "Carlos Lima",    cargaHoraria: "40h", aulasPrevistas: 48 },
  { codigo: "DIR-2026-08", disciplina: "Sistemas Operacionais",   turma: "TDS 4ª Fase 2026/1", professor: "Patrícia Gomes", cargaHoraria: "72h", aulasPrevistas: 86 },
  { codigo: "DIR-2026-09", disciplina: "Hidráulica e Pneumática", turma: "MEC 3ª Fase 2026/1", professor: "Juliana Rocha",  cargaHoraria: "60h", aulasPrevistas: 72 },
];
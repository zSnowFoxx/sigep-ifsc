import type { Professor, Aluno, TurmaData, EncItemData, Disciplina, ReuniaoAberta, ReuniaoRealizada, Participante } from "../types/conselho";
import { initialCards } from "../data/encaminhamentosData";

export const professores: Professor[] = [
  { nome: "Prof. Ricardo Alves",   disciplina: "Algoritmos e Programação",   cargo: "Professor",         presente: true  },
  { nome: "Profa. Camila Torres",  disciplina: "Matemática Aplicada",         cargo: "Professora",        presente: true  },
  { nome: "Prof. Henrique Lopes",  disciplina: "Inglês Técnico",              cargo: "Professor",         presente: true  },
  { nome: "Profa. Sandra Melo",    disciplina: "Comunicação e Expressão",     cargo: "Professora",        presente: false },
  { nome: "Prof. Fábio Carvalho",  disciplina: "Banco de Dados",              cargo: "Professor",         presente: true  },
  { nome: "Profa. Juliana Neves",  disciplina: "Programação Web",             cargo: "Professora",        presente: true  },
  { nome: "Profa. Renata Dias",    disciplina: "—",                           cargo: "Coord. Pedagógica", presente: true  },
  { nome: "Carlos Lima",           disciplina: "—",                           cargo: "Psicólogo / NAE",   presente: false },
  { nome: "Ana Costa",             disciplina: "—",                           cargo: "Pedagoga",          presente: true  },
];

export const alunos: Aluno[] = [
  { matricula: "202110806528", nome: "João Silva",           atencao: true,  risco: true  },
  { matricula: "202210809911", nome: "Maria Oliveira",       atencao: true,  risco: false },
  { matricula: "202310804422", nome: "Carlos Souza",         atencao: true,  risco: true  },
  { matricula: "202110801345", nome: "Ana Beatriz Ferreira", atencao: false, risco: false },
  { matricula: "202210812788", nome: "Lucas Mendes",         atencao: true,  risco: true  },
  { matricula: "202310807654", nome: "Fernanda Costa",       atencao: true,  risco: false },
  { matricula: "202110809002", nome: "Rafael Rocha",         atencao: false, risco: false },
  { matricula: "202210806731", nome: "Isabela Martins",      atencao: false, risco: false },
  { matricula: "202310805519", nome: "Diego Pereira",        atencao: false, risco: false },
  { matricula: "202110803347", nome: "Letícia Barbosa",      atencao: false, risco: false },
  { matricula: "202210808820", nome: "Bruno Nascimento",     atencao: false, risco: false },
  { matricula: "202310801198", nome: "Tatiane Lima",         atencao: false, risco: false },
];

export const alunosTurmaB: Aluno[] = [
  { matricula: "202210870011", nome: "Amanda Silveira",     atencao: false, risco: false },
  { matricula: "202310871234", nome: "Breno Cavalcante",    atencao: true,  risco: false },
  { matricula: "202110872005", nome: "Cristina Duarte",     atencao: false, risco: false },
  { matricula: "202210873418", nome: "Eduardo Teixeira",    atencao: false, risco: false },
  { matricula: "202310874622", nome: "Gabriela Pinheiro",   atencao: true,  risco: false },
  { matricula: "202110875839", nome: "Henrique Azevedo",    atencao: false, risco: false },
  { matricula: "202210876044", nome: "Larissa Guimarães",   atencao: false, risco: false },
  { matricula: "202310877251", nome: "Matheus Fonseca",     atencao: false, risco: false },
  { matricula: "202110878467", nome: "Natália Cardoso",     atencao: false, risco: false },
  { matricula: "202210879683", nome: "Otávio Ribeiro",      atencao: true,  risco: false },
];

export const turmasData: TurmaData[] = [
  { nome: "TDS - 2ª Fase",         alunosList: alunos,       coord: "Profa. Renata Dias",   semestre: "2026.1" },
  { nome: "Mecatrônica - 3ª Fase", alunosList: alunosTurmaB, coord: "Prof. Eduardo Santos", semestre: "2026.1" },
];

export const mockEncaminhamentos: EncItemData[] = initialCards;

export const disciplinasData: Record<string, Disciplina[]> = {
  "202110806528": [
    { nome: "Algoritmos e Programação", professor: "Prof. Ricardo Alves",  ch: 80, nota: 4.8, presentes: 56, faltasJust: 0,  faltasNaoJust: 24 },
    { nome: "Banco de Dados",           professor: "Prof. Fábio Carvalho",  ch: 60, nota: 5.8, presentes: 52, faltasJust: 4,  faltasNaoJust: 4  },
    { nome: "Programação Web",          professor: "Prof. Marcos",           ch: 80, nota: 5.4, presentes: 60, faltasJust: 4,  faltasNaoJust: 16 },
    { nome: "Matemática Aplicada",      professor: "Profa. Camila Torres",   ch: 60, nota: 5.0, presentes: 54, faltasJust: 0,  faltasNaoJust: 6  },
    { nome: "Inglês Técnico",           professor: "Prof. Henrique Lopes",   ch: 40, nota: 6.5, presentes: 36, faltasJust: 0,  faltasNaoJust: 4  },
  ],
  "202210809911": [
    { nome: "Algoritmos e Programação", professor: "Prof. Ricardo Alves",  ch: 80, nota: 7.0, presentes: 52, faltasJust: 8,  faltasNaoJust: 20 },
    { nome: "Banco de Dados",           professor: "Prof. Fábio Carvalho",  ch: 60, nota: 7.8, presentes: 44, faltasJust: 4,  faltasNaoJust: 12 },
    { nome: "Programação Web",          professor: "Prof. Marcos",           ch: 80, nota: 7.5, presentes: 60, faltasJust: 0,  faltasNaoJust: 20 },
    { nome: "Matemática Aplicada",      professor: "Profa. Camila Torres",   ch: 60, nota: 8.2, presentes: 48, faltasJust: 0,  faltasNaoJust: 12 },
  ],
};

export const defaultDisciplinas: Disciplina[] = [
  { nome: "Algoritmos e Programação", professor: "Prof. Ricardo Alves",  ch: 80, nota: 7.0, presentes: 68, faltasJust: 4, faltasNaoJust: 8 },
  { nome: "Programação Web",          professor: "Prof. Marcos",           ch: 80, nota: 7.2, presentes: 70, faltasJust: 2, faltasNaoJust: 8 },
  { nome: "Matemática Aplicada",      professor: "Profa. Camila Torres",   ch: 60, nota: 6.8, presentes: 52, faltasJust: 0, faltasNaoJust: 8 },
];

export const ENCAMINHAMENTOS_OPTIONS = [
  "— Selecione —",
  "Encaminhar ao NAE / Pedagogia",
  "Encaminhar para Assistência Estudantil",
  "Agendar Atendimento Psicológico",
  "Nivelamento / Monitoria",
  "Orientação de Carreira",
  "Mediação de Conflito",
] as const;

export const SERVIDORES_OPTIONS = [
  "— Selecione —",
  "Coord. Pedagógica — Profa. Renata Dias",
  "NAE — Psic. Carlos Lima",
  "Assistência Estudantil — Sra. Paula Andrade",
  "Monitoria — Dept. Técnico",
  "Direção de Ensino",
] as const;

export const CATEGORIAS_REGISTRO = [
  "Dificuldade de aprendizagem",
  "Baixa frequência",
  "Comportamento em sala",
  "Questões socioeconômicas",
  "Saúde / Bem-estar",
  "Relacionamento interpessoal",
  "Desempenho acadêmico",
  "Outros",
] as const;

export const PONTOS_PRESET = [
  "Facilidade de aprendizagem",
  "Boa didática dos professores",
  "Bom relacionamento entre os alunos",
  "Alta participação nas aulas",
  "Progressos visíveis no período",
  "Boa infraestrutura da sala",
] as const;

export const DIFIC_PRESET = [
  "Baixa participação nas aulas",
  "Conteúdo muito difícil",
  "Falta de material didático",
  "Alta taxa de faltas",
  "Dificuldades socioeconômicas",
  "Problemas de relacionamento entre alunos",
  "Dificuldades com atividades avaliativas",
] as const;

export const ENC_CATEGORIA_CORES: Record<string, { bg: string; text: string }> = {
  "Dificuldade de aprendizagem": { bg: "#eff6ff", text: "#1d4ed8" },
  "Baixa frequência":            { bg: "#fffbeb", text: "#b45309" },
  "Saúde / Bem-estar":           { bg: "#fff7ed", text: "#c2410c" },
  "Desempenho acadêmico":        { bg: "#fdf4ff", text: "#7e22ce" },
  "Comportamento em sala":       { bg: "#fef2f2", text: "#dc2626" },
  "Questões socioeconômicas":    { bg: "#f0fdf4", text: "#15803d" },
  "Relacionamento interpessoal": { bg: "#f0f9ff", text: "#0369a1" },
  "Outros":                      { bg: "#f8fafc", text: "#475569" },
};

export const ENC_TIPO_CONF = {
  criacao:   { color: "var(--primary)", label: "Criação",   dot: "bg-green-600" },
  triagem:   { color: "#7c3aed",        label: "Triagem",   dot: "bg-purple-500" },
  relato:    { color: "#2563eb",        label: "Relato",    dot: "bg-blue-500" },
  conclusao: { color: "#15803d",        label: "Conclusão", dot: "bg-emerald-500" },
} as const;


// Conselhos Lista

export const reunioesAbertasMock: ReuniaoAberta[] = [
  {
    id: 1,
    titulo:
      "Conselho de Classe Intermediário — Curso Técnico em Desenvolvimento de Sistemas",
    etapa: "Intermediário",
    curso: "Técnico Integrado",
    status: "em_andamento",
    criadoEm: "24/06",
    docentes: 9,
    rascunho: true,
    turmas: ["TDS - 2ª Fase", "Mecatrônica - 3ª Fase"],
    progresso: 20,
  },
  {
    id: 2,
    titulo: "Pré-Conselho — Mecatrônica 4ª Fase",
    etapa: "Pré-Conselho",
    curso: "Técnico Integrado",
    status: "agendado",
    data: "02/07/2026",
    hora: "14:00",
    docentes: 11,
    rascunho: false,
    turmas: ["Mecatrônica - 4ª Fase"],
    progresso: 0,
  },
  {
    id: 3,
    titulo: "Conselho Final — Administração 1ª e 2ª Fase",
    etapa: "Final",
    curso: "Técnico Integrado",
    status: "agendado",
    data: "10/07/2026",
    hora: "09:00",
    docentes: 14,
    rascunho: false,
    turmas: ["Administração - 1ª Fase", "Administração - 2ª Fase"],
    progresso: 0,
  },
  {
    id: 4,
    titulo: "Pré-Conselho — Informática para Internet 3ª Fase",
    etapa: "Pré-Conselho",
    curso: "Técnico Integrado",
    status: "agendado",
    data: "08/07/2026",
    hora: "14:00",
    docentes: 9,
    rascunho: false,
    turmas: ["Informática - 3ª Fase"],
    progresso: 0,
  },
];

export const reunioesRealizadasMock: ReuniaoRealizada[] = [
  {
    id: 10,
    titulo: "Conselho Intermediário — Técnico em Administração 3ª e 4ª Fase",
    etapa: "Intermediário",
    curso: "Técnico Integrado",
    data: "10/06/2026",
    docentes: 13,
    ata: "Ata_Adm_3_4_Intermediario_2026.pdf",
  },
  {
    id: 11,
    titulo: "Pré-Conselho — Mecatrônica 2ª Fase",
    etapa: "Pré-Conselho",
    curso: "Técnico Integrado",
    data: "03/06/2026",
    docentes: 10,
    ata: "Ata_Meca_2_PreConselho_2026.pdf",
  },
  {
    id: 12,
    titulo: "Conselho Final — TDS 3ª e 4ª Fase",
    etapa: "Final",
    curso: "Técnico Integrado",
    data: "28/05/2026",
    docentes: 15,
    ata: "Ata_TDS_3_4_Final_2026.pdf",
  },
  {
    id: 13,
    titulo: "Conselho Intermediário — Informática para Internet 1ª Fase",
    etapa: "Intermediário",
    curso: "Técnico Integrado",
    data: "20/05/2026",
    docentes: 8,
    ata: "Ata_Info_1_Intermediario_2026.pdf",
  },
];

export const etapaColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "Pré-Conselho": {
    bg: "#f0f9ff",
    text: "#0369a1",
    border: "#bae6fd",
  },
  Intermediário: {
    bg: "#fdf4ff",
    text: "#7e22ce",
    border: "#e9d5ff",
  },
  Final: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
};

export const turmasDisponiveis = [
  "TDS - 1ª Fase",
  "TDS - 2ª Fase",
  "TDS - 3ª Fase",
  "TDS - 4ª Fase",
  "Mecatrônica - 1ª Fase",
  "Mecatrônica - 2ª Fase",
  "Mecatrônica - 3ª Fase",
  "Mecatrônica - 4ª Fase",
  "Administração - 1ª Fase",
  "Administração - 2ª Fase",
  "Informática - 1ª Fase",
  "Informática - 2ª Fase",
  "Informática - 3ª Fase",
];

export const conselhosOrigem = [
  "Pré-Conselho - TDS 1ª e 2ª Fase (Concluído em 10/05)",
  "Pré-Conselho - Mecatrônica 4ª Fase (Concluído em 03/06)",
  "Conselho Intermediário - Administração 3ª e 4ª Fase (Concluído em 10/06)",
];

export const defaultParticipantes: Participante[] = [
  {
    id: 1,
    nome: "Prof. Alberto",
    label: "TDS 1ª - Importado",
    tipo: "importado",
  },
  {
    id: 2,
    nome: "Prof. Marcos",
    label: "TDS 2ª - Importado",
    tipo: "importado",
  },
  {
    id: 3,
    nome: "Prof. Roberto",
    label: "Convidado - Manual",
    tipo: "manual",
  },
  {
    id: 4,
    nome: "Tec. Claudia",
    label: "Equipe NAE - Manual",
    tipo: "manual",
  },
];

export const servidoresCatalogo = [
  "Prof. Ana Costa",
  "Prof. Ricardo Alves",
  "Profa. Camila Torres",
  "Prof. Henrique Lopes",
  "Profa. Sandra Melo",
  "Prof. Fábio Carvalho",
  "Profa. Juliana Neves",
  "Profa. Renata Dias",
  "Carlos Lima (Psicólogo)",
];
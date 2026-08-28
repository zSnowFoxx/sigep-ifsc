import { fetchPerfis, fetchFuncoesList } from "../services/authService";
import type { Role } from "../types/auth";

// Valores legados mantidos como fallback caso a API esteja indisponível
export const DEFAULT_ROLES: Role[] = [
  "Professor",
  "Coordenador de Curso",
  "Equipe Pedagógica/NAE",
  "Servidor Geral",
];

export const DEFAULT_FUNCOES: string[] = [
  "Pedagogo(a)",
  "Psicólogo(a) Educacional",
  "Assistente Social",
  "Tradutor(a) e Intérprete de LIBRAS",
  "Orientador(a) Educacional",
  "Técnico(a) em Assuntos Educacionais",
  "Apoio ao NAPNE",
  "Coordenador(a) de Curso",
  "Coordenador(a) de Ensino",
  "Secretário(a) Acadêmico(a)",
  "Assistente Administrativo",
];

export const credenciaisTeste = [
  { label: "E-mail", value: "servidor@ifsc.edu.br" },
  { label: "Senha", value: "teste" },
  { label: "Perfil", value: "Equipe Pedagógica/NAE" },
];

// Funções para carregar dinamicamente os dados atualizados da API REST
export async function getDynamicRoles(): Promise<Role[]> {
  try {
    const perfis = await fetchPerfis();
    if (perfis.length > 0) {
      return perfis.map((p) => p.nome as Role);
    }
  } catch (err) {
    console.error("Erro ao carregar perfis dinâmicos, usando fallback:", err);
  }
  return DEFAULT_ROLES;
}

export async function getDynamicFuncoes(): Promise<string[]> {
  try {
    const funcoes = await fetchFuncoesList();
    if (funcoes.length > 0) {
      return funcoes.map((f) => f.nome);
    }
  } catch (err) {
    console.error("Erro ao carregar funções dinâmicas, usando fallback:", err);
  }
  return DEFAULT_FUNCOES;
}
import type { Role } from "../types/auth";

export const verifyPassword = (_email: string, pw: string) => pw.length > 0;
export const updatePassword = (_email: string, _pw: string) => true;

export function passwordMeetsRules(pw: string) {
  return pw.length >= 8 && /\d/.test(pw) && /[@#$%^&*!?]/.test(pw);
}

export const ROLE_TO_PERFIL_ID: Record<Role, number> = {
  "Professor": 1,
  "Coordenador de Curso": 2,
  "Equipe Pedagógica/NAE": 3,
  "Servidor Geral": 4,
};

export const PERFIL_ID_TO_ROLE: Record<number, Role> = {
  1: "Professor",
  2: "Coordenador de Curso",
  3: "Equipe Pedagógica/NAE",
  4: "Servidor Geral",
};

export function validateEmail(email: string): boolean {
  const clean = email.trim().toLowerCase();
  return clean.length > 0 && clean.endsWith("@ifsc.edu.br");
}

export function validatePassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /\d/.test(password) &&
    /[@#$%^&*!?]/.test(password)
  );
}
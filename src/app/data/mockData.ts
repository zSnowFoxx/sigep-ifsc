import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Send,
  Upload,
  Settings,
} from "lucide-react";

import type { NavItem, StudentRisk, NivelRisco, RiscoConfig } from "../types/dashboard";

export const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ClipboardList, label: "Conselhos de Classe", active: false },
  { icon: Users, label: "Atendimentos (NAE)", active: false },
  { icon: Send, label: "Encaminhamentos", active: false },
  { icon: Upload, label: "Importar Dados (SIGAA/Planilha)", active: false },
  { icon: Settings, label: "Configurações", active: false },
];

export const riskStudents: StudentRisk[] = [
  {
    matricula: "202110806528",
    nome: "João Silva",
    turma: "TDS - 2ª Fase",
    media: 5.2,
    infrequencia: 12,
    fatores: ["Baixo Rendimento Cognitivo"],
    risco: "medio",
  },
  {
    matricula: "202210809911",
    nome: "Maria Oliveira",
    turma: "TDS - 1ª Fase",
    media: 7.5,
    infrequencia: 28,
    fatores: ["Frequência Crítica (LDB Limit)"],
    risco: "alto",
  },
  {
    matricula: "202310804422",
    nome: "Carlos Souza",
    turma: "Mecatrônica - 4ª Fase",
    media: 4.8,
    infrequencia: 26,
    fatores: ["Rendimento + Frequência", "Risco Evasão"],
    risco: "critico",
  },
  {
    matricula: "202110801345",
    nome: "Ana Beatriz Ferreira",
    turma: "TDS - 3ª Fase",
    media: 5.8,
    infrequencia: 18,
    fatores: ["Baixo Rendimento Cognitivo"],
    risco: "medio",
  },
  {
    matricula: "202210812788",
    nome: "Lucas Mendes",
    turma: "Mecatrônica - 2ª Fase",
    media: 4.1,
    infrequencia: 31,
    fatores: ["Rendimento + Frequência", "Risco Evasão"],
    risco: "critico",
  },
  {
    matricula: "202310807654",
    nome: "Fernanda Costa",
    turma: "Administração - 1ª Fase",
    media: 6.9,
    infrequencia: 22,
    fatores: ["Frequência Crítica (LDB Limit)"],
    risco: "alto",
  },
];

export const riscoConfig: Record<NivelRisco, RiscoConfig> = {
  medio: {
    label: "Médio",
    badgeClass: "bg-amber-100 text-amber-800 border border-amber-200",
    rowClass: "hover:bg-amber-50/50",
  },
  alto: {
    label: "Alto",
    badgeClass: "bg-orange-100 text-orange-800 border border-orange-200",
    rowClass: "hover:bg-orange-50/50",
  },
  critico: {
    label: "Crítico",
    badgeClass: "bg-red-100 text-red-800 border border-red-200",
    rowClass: "hover:bg-red-50/50",
  },
};
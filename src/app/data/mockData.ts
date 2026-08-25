import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Send,
  Upload,
  Settings,
} from "lucide-react";
import type { NavItem, StudentRisk, NivelRisco, RiscoConfig } from "../types/dashboard";

// Mantém apenas itens visuais de navegação
export const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ClipboardList, label: "Conselhos de Classe", active: false },
  { icon: Users, label: "Atendimentos (NAE)", active: false },
  { icon: Send, label: "Encaminhamentos", active: false },
  { icon: Upload, label: "Importar Dados (SIGAA/Planilha)", active: false },
  { icon: Settings, label: "Configurações", active: false },
];

// Mantém configurações estéticas da interface
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

// Função para buscar os dados de alunos em risco via API REST
export async function fetchRiskStudents(): Promise<StudentRisk[]> {
  const response = await fetch("http://localhost:3001/api/students/risk");
  if (!response.ok) throw new Error("Falha ao buscar dados de alunos em risco.");
  return response.json();
}
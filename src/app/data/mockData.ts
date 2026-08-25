import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Send,
  Upload,
  Settings,
} from "lucide-react";
import type { NavItem } from "../types/nav";

// Mantém apenas itens visuais de navegação
export const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ClipboardList, label: "Conselhos de Classe", active: false },
  { icon: Users, label: "Atendimentos (NAE)", active: false },
  { icon: Send, label: "Encaminhamentos", active: false },
  { icon: Upload, label: "Importar Dados (SIGAA/Planilha)", active: false },
  { icon: Settings, label: "Configurações", active: false },
];
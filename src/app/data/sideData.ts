import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Send,
  Upload,
  Database,
} from "lucide-react";
import type { NavItem } from "../types/sidebar";

// Mantém apenas itens visuais de navegação
export const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ClipboardList, label: "Conselhos de Classe", active: false },
  { icon: Users, label: "Atendimentos (NAE)", active: false },
  { icon: Send, label: "Encaminhamentos", active: false },
  { icon: Upload, label: "Importar Dados (SIGAA/Planilha)", active: false },
  { icon: Database, label: "Cadastros", active: false },
];
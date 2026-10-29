import type { LucideIcon } from "lucide-react";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  active: boolean;
  // Só aparece para quem tem acesso aos logs de auditoria.
  auditoria?: boolean;
}
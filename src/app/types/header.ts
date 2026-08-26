import type { LucideIcon } from "lucide-react";

export interface CommandItem {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  keywords: string[];
  badge: string;
  action: () => void;
}

export interface CommandActions {
  setActiveNav: (nav: number) => void;
  setConselhoMode: (mode: "list" | "workspace") => void;
  setImportarOpen: (open: boolean) => void;
  setShowPerfil: (show: boolean) => void;
}

export interface Periodo {
  id: number;
  ano: string;
  semestre: string;
  ativo: boolean;
}
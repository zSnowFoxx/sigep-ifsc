import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Send,
  Upload,
  Database,
  User
} from "lucide-react";
import type { CommandActions, CommandItem, Periodo } from "../types/header";

export const getCommandPalette = ({
  setActiveNav,
  setConselhoMode,
  setImportarOpen,
  setShowPerfil,
}: CommandActions): CommandItem[] => [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "Painel de Risco Acadêmico",
    subtitle: "Visão geral de KPIs e alunos em atenção pedagógica",
    keywords: ["dashboard", "home", "início", "inicio", "risco", "alerta", "kpi", "monitoramento", "indicadores", "painel"],
    badge: "Ir para Página",
    action: () => {
      setShowPerfil(false);
      setActiveNav(0);
    },
  },
  {
    id: "conselhos",
    icon: ClipboardList,
    title: "Conselho de Classe Intermediário",
    subtitle: "Registrar pareceres, pautas coletivas e emitir ata em PDF",
    keywords: ["conselho", "ata", "emitir ata", "parecer", "deliberação", "deliberacao", "pauta", "participantes", "avaliação discente", "risco de evasão", "conselhos", "avaliacao discente"],
    badge: "Ir para Página",
    action: () => {
      setShowPerfil(false);
      setActiveNav(1);
      setConselhoMode("list");
    },
  },
  {
    id: "nae",
    icon: Users,
    title: "Atendimentos e Acompanhamento Individual (NAE)",
    subtitle: "Registrar ou consultar intervenções pedagógicas e psicológicas",
    keywords: ["atendimento", "nae", "registrar atendimento", "psicologia", "pedagogia", "relato", "queixa", "escuta", "sigiloso", "atendimentos", "intervenção", "intervencao"],
    badge: "Ir para Página",
    action: () => {
      setShowPerfil(false);
      setActiveNav(2);
    },
  },
  {
    id: "encaminhamentos",
    icon: Send,
    title: "Monitoramento de Encaminhamentos",
    subtitle: "Acompanhar ciclo de vida dos encaminhamentos e desfechos",
    keywords: ["encaminhamento", "kanban", "triagem", "pendentes", "urgente", "evolução", "evolucao", "desfecho", "acompanhamento", "encaminhamentos"],
    badge: "Ir para Página",
    action: () => {
      setShowPerfil(false);
      setActiveNav(3);
    },
  },
  {
    id: "importar",
    icon: Upload,
    title: "Importação e Sincronização de Dados",
    subtitle: "Sincronizar via API do SIGAA ou enviar planilhas manuais",
    keywords: ["importar", "sincronizar", "sigaa", "planilha", "excel", "csv", "api", "sincronização", "sincronizacao", "importação", "importacao"],
    badge: "Abrir Modal",
    action: () => {
      setImportarOpen(true);
    },
  },
  {
    id: "cadastros",
    icon: Database,
    title: "Cadastros Institucionais",
    subtitle: "Gerenciar alunos, servidores, turmas, cursos e diários",
    keywords: ["cadastrar", "aluno", "servidor", "usuário", "usuario", "turma", "curso", "disciplina", "diário", "diario", "editar", "novo aluno", "novo curso", "cadastros", "cadastrar aluno", "registrar"],
    badge: "Ir para Página",
    action: () => {
      setShowPerfil(false);
      setActiveNav(5);
    },
  },
  {
    id: "perfil",
    icon: User,
    title: "Meu Perfil e Configurações",
    subtitle: "Visualizar dados institucionais e alterar senha de acesso",
    keywords: ["perfil", "meu perfil", "senha", "alterar senha", "minha conta", "siape", "sair", "logout", "conta", "configurações", "configuracoes"],
    badge: "Meu Perfil",
    action: () => {
      setShowPerfil(true);
    },
  },
];

export async function fetchPeriodos(): Promise<Periodo[]> {
  try {
    const response = await fetch("http://localhost:3001/api/options/periodos"); // Substitua pela sua URL/rota real
    if (!response.ok) throw new Error("Erro ao buscar períodos");
    return await response.json();
  } catch (error) {
    console.error("Erro na requisição de períodos:", error);
    return [];
  }
}
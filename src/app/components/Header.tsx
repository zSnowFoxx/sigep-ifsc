import { useState, useMemo, useEffect, useRef } from "react";
import { getCommandPalette, fetchPeriodos } from "../data/headData";
import type { CommandItem, Periodo } from "../types/header";

import {
  Search,
  X,
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  ChevronDown,
  Command
} from "lucide-react";

interface HeaderProps {
  notifOpen: boolean;
  setNotifOpen: (open: boolean) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  setActiveNav: (nav: number) => void;
  setConselhoMode: (mode: "list" | "workspace") => void;
  setImportarOpen: (open: boolean) => void;
  setShowPerfil: (show: boolean) => void;
  hidden?: boolean;
}

export default function Header({
  notifOpen,
  setNotifOpen,
  selectedPeriod,
  setSelectedPeriod,
  setActiveNav,
  setConselhoMode,
  setImportarOpen,
  setShowPerfil,
  hidden = false,
}: HeaderProps) {
  const [cmdQuery, setCmdQuery] = useState("");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdSelected, setCmdSelected] = useState(-1);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Carrega os períodos da API
  useEffect(() => {
    fetchPeriodos().then((data) => {
      setPeriodos(data);

      const periodoAtivo = data.find((p) => p.ativo);
      if (periodoAtivo && !selectedPeriod) {
        setSelectedPeriod(`${periodoAtivo.ano}.${periodoAtivo.semestre}`);
      }
    });
  }, []);

  // Reconhece que, ao apertar K, seleciona o Search e abre o dropdown de sugestões
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setCmdOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Chamada limpa delegando a lista para a função externa
  const cmdPalette = useMemo(
    () => getCommandPalette({ setActiveNav, setConselhoMode, setImportarOpen, setShowPerfil }),
    [setActiveNav, setConselhoMode, setImportarOpen, setShowPerfil]
  );

  const cmdResults = useMemo(() => {
    const q = cmdQuery.trim().toLowerCase();
    if (!q) return [];
    return cmdPalette.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) ||
        entry.subtitle.toLowerCase().includes(q) ||
        entry.keywords.some((kw) => kw.includes(q) || q.includes(kw))
    );
  }, [cmdQuery, cmdPalette]);

  const handleCmdSelect = (entry: CommandItem) => {
    entry.action();
    setCmdQuery("");
    setCmdOpen(false);
    setCmdSelected(-1);
  };

  const handleCmdKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!cmdOpen || cmdResults.length === 0) {
      if (e.key === "Escape") {
        setCmdOpen(false);
        setCmdSelected(-1);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCmdSelected((s) => Math.min(s + 1, cmdResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCmdSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      if (cmdSelected >= 0 && cmdResults[cmdSelected]) {
        e.preventDefault();
        handleCmdSelect(cmdResults[cmdSelected]);
      }
    } else if (e.key === "Escape") {
      setCmdOpen(false);
      setCmdSelected(-1);
    }
  };

  if (hidden) return null;

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-5 gap-4 shrink-0 z-10">
      {/* Input com Menu suspenso de busca */}
      <div className="flex-1 relative max-w-md">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: cmdOpen ? "#15622f" : "#9ca3af" }}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar módulos, ações e páginas do SIGEP..."
          value={cmdQuery}
          onChange={(e) => {
            setCmdQuery(e.target.value);
            setCmdOpen(true);
            setCmdSelected(-1);
          }}
          onFocus={() => {
            if (cmdQuery.trim()) setCmdOpen(true);
          }}
          onBlur={() =>
            setTimeout(() => {
              setCmdOpen(false);
              setCmdSelected(-1);
            }, 160)
          }
          onKeyDown={handleCmdKeyDown}
          className="w-full pl-9 pr-8 py-1.5 text-sm rounded-lg border bg-[#f7f8fa] outline-none placeholder:text-gray-400 transition-all"
          style={{
            borderColor: cmdOpen && cmdQuery ? "#15622f" : "#e5e7eb",
            boxShadow: cmdOpen && cmdQuery ? "0 0 0 3px rgba(21,98,47,0.07)" : undefined,
            color: "#111827",
          }}
        />

        {cmdQuery ? (
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            onMouseDown={() => {
              setCmdQuery("");
              setCmdOpen(false);
              setCmdSelected(-1);
            }}
          >
            <X size={13} />
          </button>
        ) : (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
            <Command size={10} className="text-gray-300" />
            <span className="text-[10px] font-semibold text-gray-300">K</span>
          </span>
        )}

        {/* Dropdown de Sugestões */}
        {cmdOpen && cmdQuery.trim().length > 0 && (
          <div
            className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-2xl overflow-hidden z-50"
            style={{ maxHeight: "340px", overflowY: "auto" }}
          >
            {cmdResults.length === 0 ? (
              <div className="px-5 py-6 text-center space-y-1">
                <Search size={20} className="mx-auto text-gray-200 mb-2" />
                <p className="text-sm font-medium text-gray-500">
                  Nenhuma função ou página encontrada para &ldquo;{cmdQuery}&rdquo;.
                </p>
                <p className="text-xs text-gray-400">
                  Tente palavras-chave como &ldquo;aluno&rdquo;, &ldquo;conselho&rdquo; ou &ldquo;importar&rdquo;.
                </p>
              </div>
            ) : (
              <>
                <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Módulos e Ações
                  </span>
                  <span className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10px] text-gray-300 font-medium">↑ ↓ navegar · Enter abrir</span>
                </div>
                {cmdResults.map((entry, i) => {
                  const Icon = entry.icon;
                  const isActive = i === cmdSelected;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onMouseDown={() => handleCmdSelect(entry)}
                      onMouseEnter={() => setCmdSelected(i)}
                      className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
                      style={{
                        background: isActive ? "#f0fdf4" : "white",
                        borderBottom: i < cmdResults.length - 1 ? "1px solid #f9fafb" : undefined,
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                        style={{ background: isActive ? "#dcfce7" : "#f0f2f5" }}
                      >
                        <Icon size={17} style={{ color: isActive ? "#15622f" : "#6b7280" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold leading-tight truncate"
                          style={{ color: isActive ? "#0f4a23" : "#111827" }}
                        >
                          {entry.title}
                        </p>
                        <p
                          className="text-xs leading-snug mt-0.5 truncate"
                          style={{ color: isActive ? "#15622f" : "#6b7280" }}
                        >
                          {entry.subtitle}
                        </p>
                      </div>
                      <span
                        className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-colors"
                        style={{
                          background: isActive ? "#bbf7d0" : "#f0f2f5",
                          color: isActive ? "#14532d" : "#6b7280",
                        }}
                      >
                        {entry.badge}
                      </span>
                    </button>
                  );
                })}
                <div className="px-4 py-2 border-t border-gray-50" style={{ background: "#fafbfc" }}>
                  <p className="text-[10px] text-gray-400">
                    Pressione{" "}
                    <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[9px]">
                      Esc
                    </kbd>{" "}
                    para fechar
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Lado Direito do Header (Notificações e Período) */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Bell size={16} className="text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-white" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 w-72 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-sm font-semibold">Notificações</span>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">3 novas</span>
              </div>
              {[
                { icon: AlertTriangle, text: "3 alunos em risco crítico identificados", time: "Agora", color: "text-red-500" },
                { icon: Clock, text: "Conselho de Classe em 2 dias", time: "há 1h", color: "text-amber-500" },
                { icon: CheckCircle, text: "Importação SIGAA concluída", time: "há 3h", color: "text-green-600" },
              ].map((n, i) => (
                <div key={i} className="px-4 py-3 hover:bg-muted/50 border-b border-border last:border-0 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <n.icon size={15} className={`${n.color} shrink-0 mt-0.5`} />
                    <div>
                      <p className="text-xs leading-snug text-foreground">{n.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 text-sm font-semibold rounded-lg border border-border bg-card cursor-pointer outline-none focus:border-primary hover:border-primary/50 transition-colors"
            style={{ color: "var(--primary)" }}
          >
            {periodos.length === 0 ? (
              <option value="">Carregando...</option>
            ) : (
              periodos.map((p) => {
                const valor = `${p.ano}.${p.semestre}`;
                return (
                  <option key={p.id} value={valor}>
                    Período: {valor}
                  </option>
                );
              })
            )}
          </select>
          <ChevronDown
            size={13}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>
    </header>
  );
}
import {
  Download,
  Users,
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
} from "lucide-react";

import type { TabDef, TabId } from "../../../types/conselho";
import { formatData, formatHora } from "../../../services/conselhoService";

interface ConselhoHeaderProps {
  onBack?: () => void;
  onSalvar: () => void;
  onEncerrar: () => void;
  salvando: boolean;
  isInter: boolean;
  titulo: string;
  dataRealizacao: string | null;
  coordenadores: string[];
  savedCount: number;
  totalAlunos: number;
  presentCount: number;
  totalParticipantes: number;
  visibleTabs: TabDef[];
  activeTab: TabId;
  setActiveTab: (tabId: TabId) => void;
  tab2HasContent: boolean;
}

export default function ConselhoHeader({
  onBack,
  onSalvar,
  onEncerrar,
  salvando,
  isInter,
  titulo,
  dataRealizacao,
  coordenadores,
  savedCount,
  totalAlunos,
  presentCount,
  totalParticipantes,
  visibleTabs,
  activeTab,
  setActiveTab,
  tab2HasContent,
}: ConselhoHeaderProps) {
  return (
    <>
      {/* ── Top Header Bar (Permanecida em branco) ─────────────────────────── */}
      <div
        className="shrink-0 px-6 py-3 border-b border-border"
        style={{
          background: "var(--card)",
        }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80 group"
            style={{ color: "var(--primary)" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="group-hover:-translate-x-0.5 transition-transform"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Sair para Central de Conselhos
          </button>

          {/* Right-side actions */}
          <div className="flex items-center gap-2">
            {isInter ? (
              <>
                {/* Importar Planilha — outline */}
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-[#e8f0eb] active:scale-[0.98]"
                  style={{
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                  }}
                >
                  <Download size={14} />
                  Importar Planilha
                </button>
                {/* Salvar alterações — solid green */}
                <button
                  onClick={onSalvar}
                  disabled={salvando}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "var(--primary)" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  {salvando ? "Salvando..." : "Salvar alterações"}
                </button>
              </>
            ) : (
              <>
                {/* Salvar Sessão — ghost outline */}
                <button
                  onClick={onSalvar}
                  disabled={salvando}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-[#e8f0eb] active:scale-[0.98] disabled:opacity-50"
                  style={{
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  {salvando ? "Salvando..." : "Salvar Sessão"}
                </button>
                {/* Encerrar — solid green */}
                <button
                  onClick={onEncerrar}
                  disabled={salvando}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "var(--primary)" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Encerrar Conselho e Emitir Ata
                </button>
                {/* Progress chip */}
                <div className="text-right pl-2 border-l border-border ml-1">
                  <p className="text-xs text-muted-foreground leading-none mb-1">
                    Pareceres
                  </p>
                  <p
                    className="text-sm font-bold leading-none"
                    style={{ color: "var(--primary)" }}
                  >
                    {savedCount} / {totalAlunos}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Header Bar (Fundo verde com Título, Meta e Abas) ───────────── */}
      <div
        className="shrink-0 px-6 pt-5 pb-0 text-white"
        style={{
          background: "var(--primary)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* Row 1 — title + metadata */}
        <div className="pb-4">
          <h1 className="text-xl font-bold text-white leading-snug mb-2">
            {titulo}
          </h1>
          <div className="flex items-center gap-5 flex-wrap">
            {isInter ? (
              <>
                <span className="flex items-center gap-1.5 text-xs text-white/85">
                  <Users size={13} className="shrink-0 text-white/70" />
                  {totalAlunos} alunos
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/85">
                  <UserCheck size={13} className="shrink-0 text-white/70" />
                  Coord.:{" "}
                  <span className="font-semibold text-white ml-0.5">
                    {coordenadores.join(", ") || "—"}
                  </span>
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1.5 text-xs text-white/85">
                  <Calendar size={13} className="shrink-0 text-white/70" />
                  {dataRealizacao ? formatData(dataRealizacao) : "Data a definir"}
                </span>
                {dataRealizacao && (
                  <span className="flex items-center gap-1.5 text-xs text-white/85">
                    <Clock size={13} className="shrink-0 text-white/70" />
                    {formatHora(dataRealizacao).replace(":", "h")}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-white/85">
                  <Users size={13} className="shrink-0 text-white/70" />
                  {presentCount} de {totalParticipantes} participantes presentes
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── Sub-header Tab Navigation ─────────────────────────────────────── */}
        <nav className="flex items-end gap-1 -mb-px">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold transition-all duration-150 rounded-t-lg border-t border-x border-b-0 mr-1 group"
                style={{
                  background: active ? "var(--background)" : "transparent",
                  color: active ? "var(--primary)" : "rgba(255, 255, 255, 0.9)",
                  borderColor: "transparent",
                  fontWeight: active ? 700 : 500,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255, 255, 255, 0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(255, 255, 255, 0.9)";
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }
                }}
              >
                {/* Number badge */}
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
                  style={{
                    background: active
                      ? "var(--primary)"
                      : "rgba(255, 255, 255, 0.25)",
                    color: "white",
                  }}
                >
                  {tab.displayNum}
                </span>

                <Icon size={15} className="shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>

                {/* Completion badges */}
                {tab.id === 1 && (
                  <span
                    className="ml-1 text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: active
                        ? "rgba(21, 98, 47, 0.12)"
                        : "rgba(255, 255, 255, 0.2)",
                      color: active ? "var(--primary)" : "white",
                    }}
                  >
                    {presentCount}/{totalParticipantes}
                  </span>
                )}
                {tab.id === 4 && savedCount > 0 && (
                  <span
                    className="ml-1 text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: active
                        ? "rgba(21, 98, 47, 0.12)"
                        : "rgba(255, 255, 255, 0.2)",
                      color: active ? "var(--primary)" : "white",
                    }}
                  >
                    {savedCount}/{totalAlunos}
                  </span>
                )}
                {tab.id === 2 && tab2HasContent && (
                  <CheckCircle2
                    size={13}
                    style={{ color: active ? "var(--primary)" : "#86efac" }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
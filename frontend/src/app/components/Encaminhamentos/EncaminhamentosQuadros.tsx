import {
  Flag,
  CheckCircle2,
  ArrowRight,
  User,
  CalendarClock,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

import type { Status, Encaminhamento } from "../../types/encaminhamentos";
import { colConfig, categoriaColors } from "../../data/encaminhamentosData";

interface EncaminhamentosQuadrosProps {
  cards: Encaminhamento[];
  matchesFilter: (card: Encaminhamento) => boolean;
  onOpenModal: (card: Encaminhamento) => void;
}

export default function EncaminhamentosQuadros({
  cards,
  matchesFilter,
  onOpenModal,
}: EncaminhamentosQuadrosProps) {
  const byStatus = (s: Status) => cards.filter((c) => c.status === s);

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden">
      <div className="flex h-full gap-4 px-6 py-5 min-w-225">
        {(["pendente", "andamento", "concluido"] as Status[]).map((status) => {
          const cfg = colConfig[status];
          const ColIcon = cfg.icon;
          const colCards = byStatus(status).filter(matchesFilter);

          return (
            <div key={status} className="flex-1 flex flex-col min-h-0 min-w-70">
              {/* Column Header */}
              <div
                className="flex items-center justify-between px-4 py-2.5 rounded-t-xl border border-b-0"
                style={{ background: cfg.headerBg, borderColor: cfg.headerBg }}
              >
                <div className="flex items-center gap-2">
                  <ColIcon size={14} style={{ color: cfg.color }} />
                  <span className="text-xs font-bold" style={{ color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>
                <span
                  className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: cfg.color, color: "white" }}
                >
                  {colCards.length}
                </span>
              </div>

              {/* Cards List */}
              <div
                className="flex-1 overflow-y-auto rounded-b-xl border p-3 space-y-3"
                style={{ background: "#f7f8fa", borderColor: "var(--border)" }}
              >
                {colCards.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 gap-2 opacity-40">
                    <ColIcon size={22} style={{ color: cfg.color }} />
                    <p className="text-xs text-muted-foreground">Nenhum encaminhamento</p>
                  </div>
                )}
                {colCards.map((card) => {
                  const catColors = categoriaColors[card.categoria] ?? {
                    bg: "#f8fafc",
                    text: "#475569",
                  };
                  return (
                    <button
                      key={card.id}
                      onClick={() => onOpenModal(card)}
                      className="w-full text-left bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 overflow-hidden group"
                    >
                      {/* Card accent strip */}
                      <div
                        className="h-1 w-full"
                        style={{
                          background: card.urgente
                            ? "#ef4444"
                            : status === "andamento"
                            ? "#3b82f6"
                            : status === "concluido"
                            ? "#22c55e"
                            : "#f59e0b",
                        }}
                      />
                      <div className="p-3.5 space-y-2.5">
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{ background: "var(--secondary)", color: "var(--primary)" }}
                            >
                              {card.aluno
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground leading-tight">
                                {card.aluno}
                              </p>
                              <p
                                className="text-xs text-muted-foreground"
                                style={{ fontFamily: "monospace", fontSize: "10px" }}
                              >
                                #{card.id} · {card.turma}
                              </p>
                            </div>
                          </div>
                          {card.urgente && (
                            <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1 shrink-0">
                              <Flag size={9} /> Urgente
                            </span>
                          )}
                          {status === "andamento" && !card.urgente && (
                            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                              No Prazo
                            </span>
                          )}
                          {status === "concluido" && (
                            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1 shrink-0">
                              <CheckCircle2 size={9} /> Finalizado
                            </span>
                          )}
                        </div>

                        {/* Categoria */}
                        <span
                          className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: catColors.bg, color: catColors.text }}
                        >
                          {card.categoria}
                        </span>

                        {/* Meta rows */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <ArrowRight size={10} className="shrink-0" />
                            <span className="truncate">{card.origem}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <User size={10} className="shrink-0" />
                            <span className="truncate">{card.responsavel}</span>
                          </div>
                          {card.prazo && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <CalendarClock size={10} className="shrink-0" />
                              <span>Prazo: {card.prazo}</span>
                            </div>
                          )}
                          {card.ultimoRelato && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MessageSquare size={10} className="shrink-0" />
                              <span>Último relato: {card.ultimoRelato}</span>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-1 border-t border-border">
                          <span className="text-xs text-muted-foreground">
                            {card.evolucoes.length} entrada
                            {card.evolucoes.length !== 1 ? "s" : ""}
                          </span>
                          <span
                            className="text-xs font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: "var(--primary)" }}
                          >
                            Ver histórico <ChevronRight size={11} />
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
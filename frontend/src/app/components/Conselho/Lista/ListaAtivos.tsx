import {
  Search,
  Play,
  FileText,
  Clock,
  CalendarDays,
  Users,
  ArrowRight,
  CircleDot,
  Calendar,
} from "lucide-react";
import type { ConselhoMode, ReuniaoBrief, ReuniaoAberta } from "../../../types/conselho";
import { etapaColors } from "../../../data/conselhoData";

interface ListaAtivosProps {
  filterEtapa: string;
  filteredInter: ReuniaoAberta[];
  filteredFinais: ReuniaoAberta[];
  onAgendarFinal: (reuniao: ReuniaoBrief) => void;
  onEnterConselho: (tipo: ConselhoMode, conselhoId: number) => void;
}

export function ListaAtivos({
  filterEtapa,
  filteredInter,
  filteredFinais,
  onAgendarFinal,
  onEnterConselho,
}: ListaAtivosProps) {
  return (
    <div className="space-y-8">
      {/* Conselhos Intermediários */}
      {(filterEtapa === "" || filterEtapa === "Intermediário") && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-1 h-4 rounded-full shrink-0"
              style={{ background: "#7c3aed" }}
            />
            <h2 className="text-xs font-black uppercase tracking-widest text-foreground">
              Conselhos Intermediários
            </h2>
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{
                background: "#fdf4ff",
                color: "#7c3aed",
                border: "1px solid #e9d5ff",
              }}
            >
              {filteredInter.length}
            </span>
          </div>

          {filteredInter.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-center bg-card rounded-xl border border-dashed border-border">
              <p className="text-sm text-muted-foreground">
                Nenhum conselho intermediário encontrado.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInter.map((r) => (
                <div
                  key={r.id}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow duration-200"
                  style={{ borderLeft: "4px solid #7c3aed" }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                            style={{
                              background: "#fdf4ff",
                              color: "#7e22ce",
                              borderColor: "#e9d5ff",
                            }}
                          >
                            Intermediário
                          </span>
                          {r.status === "em_andamento" ? (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1.5">
                              <CircleDot
                                size={10}
                                className="animate-pulse"
                              />
                              Em Andamento · Rascunho Salvo
                            </span>
                          ) : (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                              <CalendarDays size={10} /> Agendado
                            </span>
                          )}
                        </div>

                        <h2 className="text-sm font-bold text-foreground leading-snug mb-2">
                          {r.titulo}
                        </h2>

                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {r.turmas.map((t) => (
                            <span
                              key={t}
                              className="text-xs bg-[#f0f2f5] text-foreground px-2 py-0.5 rounded-md font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock size={11} /> Criado em{" "}
                          {r.criadoEm ?? r.data}
                        </span>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={() => onAgendarFinal(r)}
                          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-[#e8f0eb] active:scale-[0.98]"
                          style={{
                            borderColor: "var(--primary)",
                            color: "var(--primary)",
                          }}
                        >
                          <CalendarDays size={13} />
                          Agendar conselho final
                        </button>
                        <button
                          onClick={() => onEnterConselho("intermediario", r.id)}
                          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                          style={{ background: "var(--primary)" }}
                        >
                          Visualizar e editar dados
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Conselhos Finais */}
      {(filterEtapa === "" || filterEtapa === "Final") && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-1 h-4 rounded-full shrink-0"
              style={{ background: "#c2410c" }}
            />
            <h2 className="text-xs font-black uppercase tracking-widest text-foreground">
              Conselhos Finais
            </h2>
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{
                background: "#fff7ed",
                color: "#c2410c",
                border: "1px solid #fed7aa",
              }}
            >
              {filteredFinais.length}
            </span>
          </div>

          {filteredFinais.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-center bg-card rounded-xl border border-dashed border-border">
              <p className="text-sm text-muted-foreground">
                Nenhum conselho final encontrado.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFinais.map((r) => {
                const isAndamento = r.status === "em_andamento";
                const etapaCfg =
                  etapaColors[r.etapa] ?? etapaColors["Intermediário"];
                return (
                  <div
                    key={r.id}
                    className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow duration-200"
                    style={{
                      borderLeft: isAndamento
                        ? "4px solid #f97316"
                        : "4px solid #c2410c",
                    }}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                              style={{
                                background: etapaCfg.bg,
                                color: etapaCfg.text,
                                borderColor: etapaCfg.border,
                              }}
                            >
                              {r.etapa}
                            </span>
                            {isAndamento ? (
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1.5">
                                <CircleDot
                                  size={10}
                                  className="animate-pulse"
                                />
                                Em Andamento · Rascunho Salvo
                              </span>
                            ) : (
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                                <CalendarDays size={10} /> Agendado
                              </span>
                            )}
                          </div>

                          <h2 className="text-sm font-bold text-foreground leading-snug mb-2">
                            {r.titulo}
                          </h2>

                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {r.turmas.map((t) => (
                              <span
                                key={t}
                                className="text-xs bg-[#f0f2f5] text-foreground px-2 py-0.5 rounded-md font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 flex-wrap">
                            {isAndamento ? (
                              <>
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Clock size={11} /> Criado em{" "}
                                  {r.criadoEm}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Users size={11} /> {r.docentes}{" "}
                                  docentes convocados
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all"
                                      style={{
                                        width: `${r.progresso}%`,
                                        background: "var(--primary)",
                                      }}
                                    />
                                  </div>
                                  <span
                                    className="text-xs font-semibold"
                                    style={{
                                      color: "var(--primary)",
                                    }}
                                  >
                                    {r.progresso}% concluído
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Calendar size={11} /> Data: {r.data}{" "}
                                  às {r.hora}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Users size={11} /> {r.docentes}{" "}
                                  docentes convocados
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 flex flex-col gap-2 items-end">
                          {isAndamento ? (
                            <button
                              onClick={() => onEnterConselho("final", r.id)}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                              style={{
                                background: "var(--primary)",
                              }}
                            >
                              <Play size={13} fill="white" />
                              Retomar Realização
                            </button>
                          ) : (
                            <button
                              onClick={() => onEnterConselho("final", r.id)}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-[#e8f0eb] active:scale-[0.98] border-2"
                              style={{
                                borderColor: "var(--primary)",
                                color: "var(--primary)",
                              }}
                            >
                              <ArrowRight size={13} />
                              Iniciar Conselho
                            </button>
                          )}
                          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                            <FileText size={11} /> Ver detalhes
                          </button>
                        </div>
                      </div>
                    </div>

                    {isAndamento && (
                      <div className="h-1 w-full bg-muted">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${r.progresso}%`,
                            background: "var(--primary)",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {filteredInter.length === 0 && filteredFinais.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Search size={24} className="text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            Nenhum conselho encontrado com os filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
}
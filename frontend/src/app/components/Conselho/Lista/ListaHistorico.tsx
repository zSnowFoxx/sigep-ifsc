import {
  CheckCircle2,
  Calendar,
  Users,
  FileText,
  Download,
  SkipForward,
} from "lucide-react";
import type { ReuniaoRealizada } from "../../../types/conselho";
import { etapaColors } from "../../../data/conselhoData";

interface ListaHistoricoProps {
  filteredHistorico: ReuniaoRealizada[];
  onOpenCriarConselho: () => void;
}

export function ListaHistorico({
  filteredHistorico,
  onOpenCriarConselho,
}: ListaHistoricoProps) {
  return (
    <div className="space-y-3">
      {filteredHistorico.map((r) => {
        const etapaCfg =
          etapaColors[r.etapa] ?? etapaColors["Intermediário"];
        return (
          <div
            key={r.id}
            className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-sm transition-shadow"
            style={{ borderLeft: "4px solid #22c55e" }}
          >
            <div className="p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Concluído
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground truncate">
                  {r.titulo}
                </p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar size={10} /> {r.data}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users size={10} /> {r.docentes} docentes
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FileText size={10} /> {r.ata}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                  <Download size={12} />
                  Baixar Ata (PDF)
                </button>
                {r.etapa !== "Final" && (
                  <button
                    onClick={onOpenCriarConselho}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: "var(--primary)" }}
                  >
                    <SkipForward size={12} />
                    Agendar Próximo Passo
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
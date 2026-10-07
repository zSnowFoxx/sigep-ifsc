import { Layers } from "lucide-react";
import type { Status, Encaminhamento } from "../../types/encaminhamentos";
import { colConfig } from "../../data/encaminhamentosData";

interface EncaminhamentosHeaderProps {
  cards: Encaminhamento[];
}

export default function EncaminhamentosHeader({ cards }: EncaminhamentosHeaderProps) {
  const byStatus = (s: Status) => cards.filter((c) => c.status === s);

  return (
    <div className="bg-card border-b border-border px-6 py-4 shrink-0">
      <div className="flex items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers size={16} style={{ color: "var(--primary)" }} />
            <h1 className="text-base font-bold text-foreground">
              Monitoramento de Encaminhamentos Pedagógicos
            </h1>
            <span className="text-xs bg-[#e8f0eb] text-[#15622f] border border-[#c3dbc9] px-2 py-0.5 rounded-full font-semibold">
              RN07
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Ciclo de vida das ações pedagógicas — triagem, acompanhamento e desfecho
          </p>
        </div>

        {/* Status summary badges */}
        <div className="flex items-center gap-2 shrink-0">
          {(["pendente", "andamento", "concluido"] as Status[]).map((s) => {
            const cfg = colConfig[s];
            const Icon = cfg.icon;
            const count = byStatus(s).length;
            return (
              <div
                key={s}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold"
                style={{ background: cfg.bg, borderColor: cfg.headerBg, color: cfg.color }}
              >
                <Icon size={13} />
                {cfg.label.split(" /")[0].split(" ")[0]}:&nbsp;
                <span className="font-bold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
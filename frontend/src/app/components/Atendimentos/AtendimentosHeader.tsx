import { HeartHandshake, Plus } from "lucide-react";

interface AtendimentosHeaderProps {
  onNovoAtendimento: () => void;
}

export default function AtendimentosHeader({
  onNovoAtendimento,
}: AtendimentosHeaderProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-4 shrink-0">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HeartHandshake size={16} style={{ color: "var(--primary)" }} />
            <h1 className="text-base font-bold text-foreground">
              Atendimentos e Acompanhamento Individual (NAE)
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Registro de intervenções pedagógicas, psicológicas e sociais
          </p>
        </div>
        <button
          onClick={onNovoAtendimento}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 shrink-0"
          style={{ background: "var(--primary)" }}
        >
          <Plus size={15} />
          Registrar Novo Atendimento
        </button>
      </div>
    </div>
  );
}
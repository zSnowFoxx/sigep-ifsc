import { BookOpen, Plus } from "lucide-react";

interface ListaHeaderProps {
  onOpenCriarConselho: () => void;
}

export function ListaHeader({ onOpenCriarConselho }: ListaHeaderProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-4 shrink-0">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={16} style={{ color: "var(--primary)" }} />
            <h1 className="text-base font-bold text-foreground">
              Gestão de Conselhos de Classe
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Agende, retome ou consulte as atas das reuniões colegiadas
          </p>
        </div>
        <button
          onClick={onOpenCriarConselho}
          className="flex items-center self-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] shrink-0"
          style={{ background: "var(--primary)" }}
        >
          <Plus size={15} />
          Criar novo Conselho
        </button>
      </div>
    </div>
  );
}
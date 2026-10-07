import { useState } from "react";
import { Plus, X } from "lucide-react";

interface AdicionarDemandaProps {
  addDemanda?: () => void;
}

export function AdicionarDemanda({ addDemanda }: AdicionarDemandaProps) {
  const [demandaOpen, setDemandaOpen] = useState(false);
  const [demandaSit, setDemandaSit] = useState("");
  const [demandaGrav, setDemandaGrav] = useState<"nao-urgente" | "urgente" | "critica">("nao-urgente");

  const handleAdd = () => {
    if (addDemanda) {
      addDemanda();
    }
    setDemandaOpen(false);
    setDemandaSit("");
    setDemandaGrav("nao-urgente");
  };

  if (!demandaOpen) {
    return (
      <button
        onClick={() => setDemandaOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-2 border-dashed transition-all hover:bg-[#f7f8fa] active:scale-[0.98]"
        style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
      >
        <Plus size={14} />
        Adicionar demanda
      </button>
    );
  }

  return (
    <div className="bg-[#f7f8fa] rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-foreground">Nova demanda</span>
        <button
          onClick={() => {
            setDemandaOpen(false);
            setDemandaSit("");
            setDemandaGrav("nao-urgente");
          }}
          className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={13} />
        </button>
      </div>
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">Situação</label>
        <textarea
          rows={2}
          value={demandaSit}
          onChange={(e) => setDemandaSit(e.target.value)}
          placeholder="Descreva a situação ou demanda..."
          className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">Gravidade</label>
        <select
          value={demandaGrav}
          onChange={(e) => setDemandaGrav(e.target.value as "nao-urgente" | "urgente" | "critica")}
          className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-white outline-none focus:border-primary cursor-pointer"
        >
          <option value="nao-urgente">Não urgente</option>
          <option value="urgente">Urgente</option>
          <option value="critica">Crítica</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={() => {
            setDemandaOpen(false);
            setDemandaSit("");
            setDemandaGrav("nao-urgente");
          }}
          className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={handleAdd}
          disabled={!demandaSit.trim()}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: "var(--primary)" }}
        >
          <Plus size={13} />
          Adicionar demanda
        </button>
      </div>
    </div>
  );
}
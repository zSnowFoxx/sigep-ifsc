import { Search, X, Filter, ChevronDown } from "lucide-react";

interface AtendimentosFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  filterMotivo: string;
  setFilterMotivo: (value: string) => void;
  motivoOptions: string[];
  totalFiltered: number;
}

export default function AtendimentosFilters({
  search,
  setSearch,
  filterMotivo,
  setFilterMotivo,
  motivoOptions,
  totalFiltered,
}: AtendimentosFiltersProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-3 shrink-0">
      <div className="flex items-center gap-3">
        {/* Input de Busca */}
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Buscar aluno atendido por nome ou matrícula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filtro por Motivo */}
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-muted-foreground" />
          <div className="relative">
            <select
              value={filterMotivo}
              onChange={(e) => setFilterMotivo(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all min-w-55"
              style={{
                color: filterMotivo
                  ? "var(--foreground)"
                  : "var(--muted-foreground)",
              }}
            >
              <option value="">Motivo do Atendimento</option>
              {motivoOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
          {filterMotivo && (
            <button
              onClick={() => setFilterMotivo("")}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <X size={11} /> Limpar
            </button>
          )}
        </div>

        {/* Totalizador de registros */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {totalFiltered} registro{totalFiltered !== 1 ? "s" : ""}
            {search || filterMotivo ? " encontrados" : " recentes"}
          </span>
        </div>
      </div>
    </div>
  );
}
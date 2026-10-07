import { Search, Filter, ChevronDown } from "lucide-react";

interface ListaFiltrosProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterCurso: string;
  onFilterCursoChange: (value: string) => void;
  filterEtapa: string;
  onFilterEtapaChange: (value: string) => void;
  onClearFilters: () => void;
}

export function ListaFiltros({
  search,
  onSearchChange,
  filterCurso,
  onFilterCursoChange,
  filterEtapa,
  onFilterEtapaChange,
  onClearFilters,
}: ListaFiltrosProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-3 shrink-0">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Buscar por nome da turma ou conselho..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
          />
        </div>

        <Filter size={13} className="text-muted-foreground shrink-0" />

        {[
          {
            label: "Filtrar por Curso",
            value: filterCurso,
            set: onFilterCursoChange,
            opts: ["Técnico Integrado", "Ensino Superior"],
          },
          {
            label: "Etapa Regulamentar",
            value: filterEtapa,
            set: onFilterEtapaChange,
            opts: ["Intermediário", "Final"],
          },
        ].map((f) => (
          <div key={f.label} className="relative">
            <select
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer transition-all min-w-37.5"
              style={{
                color: f.value
                  ? "var(--foreground)"
                  : "var(--muted-foreground)",
              }}
            >
              <option value="">{f.label}</option>
              {f.opts.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        ))}

        {(filterCurso || filterEtapa) && (
          <button
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={onClearFilters}
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
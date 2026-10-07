import { Search, X, Filter, ChevronDown, AlertTriangle } from "lucide-react";

interface EncaminhamentosFiltrosProps {
  filterSearch: string;
  setFilterSearch: (value: string) => void;
  filterCategoria: string;
  setFilterCategoria: (value: string) => void;
  filterSetor: string;
  setFilterSetor: (value: string) => void;
  filterOrigem: string;
  setFilterOrigem: (value: string) => void;
  filterUrgentes: boolean;
  setFilterUrgentes: React.Dispatch<React.SetStateAction<boolean>>;
  categorias: string[];
  setores: string[];
  origens: string[];
  anyFilter: boolean;
  onClearFilters: () => void;
}

export default function EncaminhamentosFiltros({
  filterSearch,
  setFilterSearch,
  filterCategoria,
  setFilterCategoria,
  filterSetor,
  setFilterSetor,
  filterOrigem,
  setFilterOrigem,
  filterUrgentes,
  setFilterUrgentes,
  categorias,
  setores,
  origens,
  anyFilter,
  onClearFilters,
}: EncaminhamentosFiltrosProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-3 shrink-0">
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0 max-w-xs">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Buscar por aluno, matrícula ou protocolo (#)..."
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
          />
          {filterSearch && (
            <button
              onClick={() => setFilterSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <Filter size={13} className="text-muted-foreground shrink-0" />

        {/* Dropdowns */}
        {[
          { label: "Categoria", value: filterCategoria, set: setFilterCategoria, opts: categorias },
          { label: "Setor Responsável", value: filterSetor, set: setFilterSetor, opts: setores },
          { label: "Origem", value: filterOrigem, set: setFilterOrigem, opts: origens },
        ].map((f) => (
          <div key={f.label} className="relative shrink-0">
            <select
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer transition-all"
              style={{
                color: f.value ? "var(--foreground)" : "var(--muted-foreground)",
                minWidth: "140px",
              }}
            >
              <option value="">{f.label} (Todos)</option>
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

        {/* Urgentes toggle chip */}
        <button
          onClick={() => setFilterUrgentes((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all shrink-0 ml-auto"
          style={{
            borderColor: filterUrgentes ? "#f97316" : "var(--border)",
            background: filterUrgentes ? "#fff7ed" : "var(--card)",
            color: filterUrgentes ? "#c2410c" : "var(--muted-foreground)",
            boxShadow: filterUrgentes ? "0 0 0 3px rgba(249,115,22,0.12)" : undefined,
          }}
        >
          <AlertTriangle
            size={12}
            className={filterUrgentes ? "text-orange-500" : "text-muted-foreground/50"}
          />
          Somente Urgentes / Vencendo
        </button>

        {/* Clear all */}
        {anyFilter && (
          <button
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 flex items-center gap-1"
          >
            <X size={11} /> Limpar
          </button>
        )}
      </div>
    </div>
  );
}
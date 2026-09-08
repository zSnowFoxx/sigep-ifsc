import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface DisciplineTagInputProps {
  value: string[];
  onChange: (v: string[]) => void;
}

export function DisciplineTagInput({ value, onChange }: DisciplineTagInputProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Busca a lista de disciplinas no backend ao montar o componente
  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/disciplines");
        const data = await response.json();

        if (response.ok) {
          setOptions(Array.isArray(data) ? data : data.disciplines || []);
        }
      } catch (err) {
        console.error("Erro ao carregar lista de disciplinas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDisciplines();
  }, []);

  const filtered = options.filter(
    (d) => !value.includes(d) && d.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Tags Selecionadas */}
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-6">
        {value.map((d) => (
          <span
            key={d}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold"
            style={{ background: "#e8f0eb", color: "#0f4a23" }}
          >
            {d}
            <button
              type="button"
              onClick={() => onChange(value.filter((v) => v !== d))}
              className="hover:opacity-70"
            >
              <X size={9} strokeWidth={3} />
            </button>
          </span>
        ))}
      </div>

      {/* Input de Busca */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={loading ? "Carregando disciplinas..." : "Buscar disciplina..."}
          disabled={loading}
          className="w-full px-3 py-2 text-sm rounded-xl border bg-gray-50 outline-none disabled:opacity-60 transition-all"
          style={{ borderColor: "#e5e7eb", color: "#111827" }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#15622f";
          }}
          onBlur={(e) => {
            setTimeout(() => setSearch(""), 150);
            e.currentTarget.style.borderColor = "#e5e7eb";
          }}
        />

        {loading && (
          <Loader2
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
          />
        )}

        {/* Dropdown de Resultados */}
        {search && filtered.length > 0 && (
          <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-36 overflow-y-auto">
            {filtered.map((d) => (
              <button
                key={d}
                type="button"
                onMouseDown={() => {
                  onChange([...value, d]);
                  setSearch("");
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors"
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
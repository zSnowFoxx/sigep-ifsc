import { useEffect, useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import { fetchFilterOptions } from "../../services/dashService";
import type { FilterOptions } from "../../types/dashboard";
import FilterSelect from "./FilterSelect";

interface FiltrosProps {
  filterCurso: string;
  setFilterCurso: (val: string) => void;
  filterFase: string;
  setFilterFase: (val: string) => void;
  filterTurma: string;
  setFilterTurma: (val: string) => void;
  filterDisciplina: string;
  setFilterDisciplina: (val: string) => void;
}

export default function Filtros({
  filterCurso,
  setFilterCurso,
  filterFase,
  setFilterFase,
  filterTurma,
  setFilterTurma,
  filterDisciplina,
  setFilterDisciplina,
}: FiltrosProps) {
  const [options, setOptions] = useState<FilterOptions>({
    courses: [],
    turmas: [],
    disciplines: [],
  });

  useEffect(() => {
    fetchFilterOptions()
      .then(setOptions)
      .catch((err) => console.error("Erro ao carregar opções de filtros:", err));
  }, []);

  const maxFases = useMemo(() => {
    const selected = options.courses.find((c) => c.nome === filterCurso);
    return selected
      ? selected.fases
      : options.courses.reduce((max, c) => Math.max(max, c.fases), 0);
  }, [options.courses, filterCurso]);

  useEffect(() => {
    const numFase = parseInt(filterFase, 10);
    if (filterFase && !isNaN(numFase) && numFase > maxFases) {
      setFilterFase("");
    }
  }, [maxFases, filterFase, setFilterFase]);

  const fasesOptions = useMemo(
    () => ["", ...Array.from({ length: maxFases }, (_, i) => `${i + 1}ª Fase`)],
    [maxFases]
  );

  const hasFilter = Boolean(filterCurso || filterFase || filterTurma || filterDisciplina);

  const handleClear = () => {
    setFilterCurso("");
    setFilterFase("");
    setFilterTurma("");
    setFilterDisciplina("");
  };

  const filterList = [
    { label: "Curso", value: filterCurso, setter: setFilterCurso, options: ["", ...options.courses.map((c) => c.nome)] },
    { label: "Fase", value: filterFase, setter: setFilterFase, options: fasesOptions },
    { label: "Turma", value: filterTurma, setter: setFilterTurma, options: ["", ...options.turmas] },
    { label: "Componente Curricular / Disciplina", value: filterDisciplina, setter: setFilterDisciplina, options: ["", ...options.disciplines] },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={14} className="text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">Filtros</span>
        {hasFilter && (
          <button
            className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            onClick={handleClear}
          >
            <X size={11} /> Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {filterList.map((f) => (
          <FilterSelect
            key={f.label}
            label={f.label}
            value={f.value}
            options={f.options}
            onChange={f.setter}
          />
        ))}
      </div>
    </div>
  );
}
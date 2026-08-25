import { Filter, X, ChevronDown } from "lucide-react";

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
  const hasFilter = filterCurso || filterFase || filterTurma || filterDisciplina;

  const filters = [
    {
      label: "Curso",
      value: filterCurso,
      setter: setFilterCurso,
      options: ["", "Técnico Integrado", "Ensino Superior"],
    },
    {
      label: "Fase",
      value: filterFase,
      setter: setFilterFase,
      options: ["", "1ª Fase", "2ª Fase", "3ª Fase", "4ª Fase", "5ª Fase", "6ª Fase", "7ª Fase", "8ª Fase"],
    },
    {
      label: "Turma",
      value: filterTurma,
      setter: setFilterTurma,
      options: ["", "TDS 2026/1", "Mecatrônica 2026/1", "Administração 2026/1", "Informática 2026/1"],
    },
    {
      label: "Componente Curricular / Disciplina",
      value: filterDisciplina,
      setter: setFilterDisciplina,
      options: ["", "Algoritmos e Programação", "Matemática", "Física", "Inglês Técnico", "Eletrônica Digital"],
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={14} className="text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">Filtros</span>
        {hasFilter && (
          <button
            className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            onClick={() => {
              setFilterCurso("");
              setFilterFase("");
              setFilterTurma("");
              setFilterDisciplina("");
            }}
          >
            <X size={11} /> Limpar filtros
          </button>
        )}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {filters.map((f, i) => (
          <div key={i} className="relative">
            <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
            <div className="relative">
              <select
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                style={{ color: f.value ? "var(--foreground)" : "var(--muted-foreground)" }}
              >
                {f.options.map((o, j) => (
                  <option key={j} value={o}>
                    {o || `Todos os ${f.label.split(" ")[0].toLowerCase()}s`}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
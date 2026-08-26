import { AlertTriangle, ChevronDown, CheckCircle2, ArrowLeft } from "lucide-react";
import type { Role } from "../../../types/auth";
import { DisciplineTagInput } from "../../ui/DisciplineTagInput";
import { GreenBtn } from "../../ui/GreenBtn";
import { OutlineBtn } from "../../ui/OutlineBtn";

interface RegisterRolesProps {
  role: Role | "";
  disciplines: string[];
  setDisciplines: (v: string[]) => void;
  course: string;
  setCourse: (v: string) => void;
  courseOptions: string[];
  loadingOptions: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function RegisterRoles({
  role, disciplines, setDisciplines, course, setCourse,
  courseOptions, loadingOptions, onNext, onBack
}: RegisterRolesProps) {
  const step3Valid = () => {
    if (role === "Professor") return disciplines.length > 0;
    if (role === "Coordenador de Curso") return !!course;
    return true;
  };

  return (
    <>
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Atribuição Acadêmica</p>
        <p className="text-xs text-gray-500">
          {role === "Professor"
            ? "Selecione as disciplinas que você leciona no câmpus."
            : role === "Coordenador de Curso"
            ? "Indique o curso que você coordena."
            : "Nenhuma atribuição acadêmica específica para este cargo."}
        </p>
      </div>

      {role === "Professor" && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Disciplinas Lecionadas</label>
          <DisciplineTagInput value={disciplines} onChange={setDisciplines} />
          {disciplines.length === 0 && (
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
              <AlertTriangle size={11} /> Adicione pelo menos uma disciplina para continuar.
            </p>
          )}
        </div>
      )}

      {role === "Coordenador de Curso" && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Curso Coordenado</label>
          <div className="relative">
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              disabled={loadingOptions}
              className="w-full pl-3 pr-8 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none appearance-none cursor-pointer disabled:opacity-50"
              style={{ borderColor: "#e5e7eb", color: course ? "#111827" : "#9ca3af" }}
            >
              <option value="">{loadingOptions ? "Carregando cursos..." : "Selecione o curso..."}</option>
              {courseOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}

      {(role === "Equipe Pedagógica/NAE" || role === "Servidor Geral") && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: "#f0faf4", borderColor: "#bbf7d0" }}>
          <CheckCircle2 size={16} style={{ color: "#15622f" }} className="shrink-0" />
          <p className="text-xs text-gray-600">
            Cargo de <strong style={{ color: "#0f4a23" }}>{role}</strong> não requer atribuição acadêmica específica.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <OutlineBtn onClick={onBack}><ArrowLeft size={14} /> Voltar</OutlineBtn>
        <GreenBtn type="button" onClick={onNext} disabled={!step3Valid()}>Continuar</GreenBtn>
      </div>
    </>
  );
}
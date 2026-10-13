import React from "react";
import type { Turma } from "../../../types/cadastros";
import {
  FLabel,
  FInput,
  FNumber,
  FSelect,
  FRow,
} from "../../ui/FormPrimitives";

interface FormProps {
  formData: Partial<Turma>;
  onChange: (data: Partial<Turma>) => void;
  cursosOptions: string[];
  periodosOptions?: string[];
  // Quantidade de fases de cada curso (pelo nome), para limitar a fase da turma.
  fasesPorCurso?: Record<string, number | null>;
}

const opcoesDeFase = (fases: number | null | undefined) =>
  Array.from({ length: fases ?? 0 }, (_, i) => `${i + 1}ª Fase`);

export const TurmaForm: React.FC<FormProps> = ({
  formData,
  onChange,
  cursosOptions,
  periodosOptions = ["2026.1", "2026.2", "2025.1", "2025.2"],
  fasesPorCurso = {},
}) => {
  const fasesOptions = opcoesDeFase(formData.curso ? fasesPorCurso[formData.curso] : 0);

  return (
    <div className="space-y-4">
      <div>
        <FLabel>Nome da Turma</FLabel>
        <FInput
          value={formData.nome || ""}
          onChange={(v) => onChange({ ...formData, nome: v })}
          placeholder="Ex: TDS - 1ª Fase"
        />
      </div>

      <FRow>
        <div>
          <FLabel>Período Letivo</FLabel>
          <FSelect
            value={formData.periodo || ""}
            onChange={(v) => onChange({ ...formData, periodo: v })}
            placeholder="Selecionar período..."
            options={periodosOptions}
          />
        </div>
        <div>
          <FLabel>Quantidade de Alunos</FLabel>
          <FNumber
            value={formData.alunos !== undefined ? String(formData.alunos) : ""}
            onChange={(v) => onChange({ ...formData, alunos: v ? Number(v) : 0 })}
            placeholder="0"
          />
        </div>
      </FRow>

      <div>
        <FLabel>Curso Vinculado</FLabel>
        <FSelect
          value={formData.curso || ""}
          onChange={(v) =>
            // Fase que não existe no novo curso é limpa.
            onChange({ ...formData, curso: v, fase: opcoesDeFase(fasesPorCurso[v]).includes(formData.fase ?? "") ? formData.fase : "" })
          }
          placeholder="Selecionar curso..."
          options={cursosOptions}
        />
      </div>

      <div>
        <FLabel>Fase</FLabel>
        <FSelect
          value={formData.fase || ""}
          onChange={(v) => onChange({ ...formData, fase: v })}
          placeholder={formData.curso ? "Selecionar fase..." : "Selecione o curso primeiro"}
          options={fasesOptions}
          disabled={fasesOptions.length === 0}
        />
      </div>
    </div>
  );
};
import React from "react";
import type { Turma } from "../../../types/cadastros";
import { FLabel, FInput, FSelect, FRow } from "../../ui/FormPrimitives";

interface FormProps {
  formData: Partial<Turma>;
  onChange: (data: Partial<Turma>) => void;
  cursosOptions: string[];
  periodosOptions?: string[];
  isEdit?: boolean;
}

export const TurmaForm: React.FC<FormProps> = ({
  formData,
  onChange,
  cursosOptions,
  periodosOptions = ["2026.1", "2026.2", "2025.1", "2025.2"],
  isEdit = false,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <FLabel>Nome da Turma</FLabel>
        <FInput
          value={formData.nome || ""}
          onChange={(v) => onChange({ ...formData, nome: v })}
          placeholder="Ex: TDS 2026/1"
        />
      </div>

      {!isEdit && (
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
            <FLabel>Curso Vinculado</FLabel>
            <FSelect
              value={formData.curso || ""}
              onChange={(v) => onChange({ ...formData, curso: v })}
              placeholder="Selecionar curso..."
              options={cursosOptions}
            />
          </div>
        </FRow>
      )}
    </div>
  );
};
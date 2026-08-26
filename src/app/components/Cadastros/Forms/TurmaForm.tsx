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
}

export const TurmaForm: React.FC<FormProps> = ({
  formData,
  onChange,
  cursosOptions,
  periodosOptions = ["2026.1", "2026.2", "2025.1", "2025.2"],
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
          onChange={(v) => onChange({ ...formData, curso: v })}
          placeholder="Selecionar curso..."
          options={cursosOptions}
        />
      </div>
    </div>
  );
};
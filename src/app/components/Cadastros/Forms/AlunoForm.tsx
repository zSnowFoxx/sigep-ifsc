import React from "react";
import type { Aluno } from "../../../types/cadastros";
import {
  FLabel,
  FInput,
  FRow,
  ToggleStatus,
  MultiSelectPills,
} from "../../ui/FormPrimitives";

interface FormProps {
  formData: Partial<Aluno>;
  onChange: (data: Partial<Aluno>) => void;
  turmasOptions: string[];
  isEdit?: boolean;
}

export const AlunoForm: React.FC<FormProps> = ({
  formData,
  onChange,
  turmasOptions,
  isEdit = false,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <FLabel>Nome Completo do Aluno</FLabel>
        <FInput
          value={formData.nome || ""}
          onChange={(v) => onChange({ ...formData, nome: v })}
          placeholder="Nome completo"
        />
      </div>

      <FRow>
        {!isEdit && (
          <div>
            <FLabel>Matrícula</FLabel>
            <FInput
              value={formData.matricula || ""}
              onChange={(v) => onChange({ ...formData, matricula: v })}
              placeholder="202110806528"
              mono
            />
          </div>
        )}
        <div>
          <FLabel>Status</FLabel>
          <ToggleStatus
            value={formData.status || "Ativo"}
            onChange={(v) => onChange({ ...formData, status: v })}
          />
        </div>
      </FRow>

      <div>
        <FLabel>E-mail Institucional</FLabel>
        <FInput
          type="email"
          value={formData.email || ""}
          onChange={(v) => onChange({ ...formData, email: v })}
          placeholder="nome@aluno.ifsc.edu.br"
        />
      </div>

      {!isEdit && (
        <div>
          <FLabel>Turmas Vinculadas</FLabel>
          <MultiSelectPills
            value={formData.turmas || []}
            onChange={(v) => onChange({ ...formData, turmas: v })}
            options={turmasOptions}
            placeholder="Selecionar turmas..."
          />
        </div>
      )}
    </div>
  );
};
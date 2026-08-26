import React from "react";
import type { Aluno } from "../../../types/cadastros";
import {
  FLabel,
  FInput,
  FSelect,
  FRow,
  ToggleStatus,
} from "../../ui/FormPrimitives";

interface FormProps {
  formData: Partial<Aluno>;
  onChange: (data: Partial<Aluno>) => void;
  turmasOptions: string[];
}

export const AlunoForm: React.FC<FormProps> = ({
  formData,
  onChange,
  turmasOptions,
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
        <div>
          <FLabel>Matrícula</FLabel>
          <FInput
            value={formData.matricula || ""}
            onChange={(v) => onChange({ ...formData, matricula: v })}
            placeholder="202110806528"
            mono
          />
        </div>
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

      <div>
        <FLabel>Curso / Turma Vinculada</FLabel>
        <FSelect
          value={formData.turma || ""}
          onChange={(v) => onChange({ ...formData, turma: v })}
          placeholder="Selecionar turma..."
          options={turmasOptions}
        />
      </div>
    </div>
  );
};
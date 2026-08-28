import React from "react";
import type { Diario } from "../../../types/cadastros";
import { FLabel, FInput, FNumber, FSelect, FRow } from "../../ui/FormPrimitives";

interface FormProps {
  formData: Partial<Diario>;
  onChange: (data: Partial<Diario>) => void;
  disciplinasOptions: string[];
  turmasOptions: string[];
  professoresOptions: string[];
  isEdit?: boolean;
}

export const DiarioForm: React.FC<FormProps> = ({
  formData,
  onChange,
  disciplinasOptions,
  turmasOptions,
  professoresOptions,
  isEdit = false,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <FLabel>Código do Diário</FLabel>
        <FInput
          value={formData.codigo || ""}
          onChange={(v) => onChange({ ...formData, codigo: v })}
          placeholder="DIR-2026-99"
          mono
        />
      </div>

      {!isEdit && (
        <>
          <FRow>
            <div>
              <FLabel>Disciplina</FLabel>
              <FSelect
                value={formData.disciplina || ""}
                onChange={(v) => onChange({ ...formData, disciplina: v })}
                placeholder="Selecionar disciplina..."
                options={disciplinasOptions}
              />
            </div>
            <div>
              <FLabel>Turma</FLabel>
              <FSelect
                value={formData.turma || ""}
                onChange={(v) => onChange({ ...formData, turma: v })}
                placeholder="Selecionar turma..."
                options={turmasOptions}
              />
            </div>
          </FRow>

          <div>
            <FLabel>Professor Responsável</FLabel>
            <FSelect
              value={formData.professor || ""}
              onChange={(v) => onChange({ ...formData, professor: v })}
              placeholder="Selecionar professor..."
              options={professoresOptions}
            />
          </div>
        </>
      )}

      <FRow>
        <div>
          <FLabel>Carga Horária</FLabel>
          <FInput
            value={formData.cargaHoraria || ""}
            onChange={(v) => onChange({ ...formData, cargaHoraria: v })}
            placeholder="Ex: 60h"
          />
        </div>
        <div>
          <FLabel>Aulas Previstas</FLabel>
          <FNumber
            value={
              formData.aulasPrevistas !== undefined
                ? String(formData.aulasPrevistas)
                : ""
            }
            onChange={(v) =>
              onChange({ ...formData, aulasPrevistas: v ? Number(v) : 0 })
            }
            placeholder="72"
          />
        </div>
      </FRow>
    </div>
  );
};
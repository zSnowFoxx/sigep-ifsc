import React from "react";
import type { Disciplina } from "../../../types/cadastros";
import { FLabel, FInput, FSelect, FRow } from "../../ui/FormPrimitives";
import { FASES } from "../../../data/cadastrosData";

interface FormProps {
  formData: Partial<Disciplina>;
  onChange: (data: Partial<Disciplina>) => void;
  cursosOptions: string[];
  isEdit?: boolean;
}

export const DisciplinaForm: React.FC<FormProps> = ({
  formData,
  onChange,
  cursosOptions,
  isEdit = false,
}) => {
  return (
    <div className="space-y-4">
      <FRow>
        <div>
          <FLabel>Sigla</FLabel>
          <FInput
            value={formData.sigla || ""}
            onChange={(v) => onChange({ ...formData, sigla: v.toUpperCase() })}
            placeholder="ALG"
            mono
          />
        </div>
        <div>
          <FLabel>Fase de Oferta</FLabel>
          <FSelect
            value={formData.faseOferta || ""}
            onChange={(v) => onChange({ ...formData, faseOferta: v })}
            placeholder="Selecionar fase..."
            options={FASES}
          />
        </div>
      </FRow>

      <div>
        <FLabel>Nome da Disciplina</FLabel>
        <FInput
          value={formData.nome || ""}
          onChange={(v) => onChange({ ...formData, nome: v })}
          placeholder="Ex: Algoritmos e Programação"
        />
      </div>

      <FRow>
        <div>
          <FLabel>Carga Horária</FLabel>
          <FInput
            value={formData.cargaHoraria || ""}
            onChange={(v) => onChange({ ...formData, cargaHoraria: v })}
            placeholder="Ex: 60h"
          />
        </div>
        {!isEdit && (
          <div>
            <FLabel>Curso Vinculado</FLabel>
            <FSelect
              value={formData.curso || ""}
              onChange={(v) => onChange({ ...formData, curso: v })}
              placeholder="Selecionar curso..."
              options={cursosOptions}
            />
          </div>
        )}
      </FRow>
    </div>
  );
};
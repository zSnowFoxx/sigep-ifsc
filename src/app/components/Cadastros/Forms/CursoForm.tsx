import React from "react";
import type { Curso } from "../../../types/cadastros";
import {
  FLabel,
  FInput,
  FNumber,
  FSelect,
  FRow,
} from "../../ui/FormPrimitives";

interface FormProps {
  formData: Partial<Curso>;
  onChange: (data: Partial<Curso>) => void;
  servidoresOptions: string[];
  isEdit?: boolean;
}

export const CursoForm: React.FC<FormProps> = ({
  formData,
  onChange,
  servidoresOptions,
  isEdit = false,
}) => {
  const handleModalidadeChange = (modalidade: string) => {
    onChange({
      ...formData,
      modalidade: modalidade as NonNullable<Curso["modalidade"]>,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <FLabel>Nome do Curso</FLabel>
        <FInput
          value={formData.nome || ""}
          onChange={(v) => onChange({ ...formData, nome: v })}
          placeholder="Ex: Técnico em Desenvolvimento de Sistemas"
        />
      </div>

      <div>
        <FLabel>Modalidade</FLabel>
        <FSelect
          value={formData.modalidade || "Presencial"}
          onChange={handleModalidadeChange}
          placeholder="Selecionar modalidade..."
          options={["Presencial", "Semipresencial", "EAD"]}
        />
      </div>

      {!isEdit && (
        <>
          <FRow>
            <div>
              <FLabel>Tipo</FLabel>
              <FSelect
                value={formData.tipo || ""}
                onChange={(v) => onChange({ ...formData, tipo: v })}
                placeholder="Selecionar tipo..."
                options={["Técnico", "Superior", "Pós-Graduação"]}
              />
            </div>
            <div>
              <FLabel>Grau</FLabel>
              <FSelect
                value={formData.grau || ""}
                onChange={(v) => onChange({ ...formData, grau: v })}
                placeholder="Selecionar grau..."
                options={[
                  "Integrado ao EM",
                  "Concomitante",
                  "Subsequente",
                  "Bacharelado",
                  "Licenciatura",
                  "Tecnólogo",
                ]}
              />
            </div>
          </FRow>

          <FRow>
            <div>
              <FLabel>Código PPC</FLabel>
              <FInput
                value={formData.ppc || ""}
                onChange={(v) => onChange({ ...formData, ppc: v })}
                placeholder="Ex: 2023"
                mono
              />
            </div>
            <div>
              <FLabel>Quantidade de Fases</FLabel>
              <FNumber
                value={formData.fases !== undefined ? String(formData.fases) : ""}
                onChange={(v) => onChange({ ...formData, fases: v ? Number(v) : 0 })}
                placeholder="4"
              />
            </div>
          </FRow>

          <div>
            <FLabel>Carga Horária Total</FLabel>
            <FInput
              value={formData.cargaHoraria || ""}
              onChange={(v) => onChange({ ...formData, cargaHoraria: v })}
              placeholder="Ex: 3.200h"
            />
          </div>
        </>
      )}

      <div>
        <FLabel>Coordenador Responsável</FLabel>
        <FSelect
          value={formData.coordenador || ""}
          onChange={(v) => onChange({ ...formData, coordenador: v })}
          placeholder="Selecionar coordenador..."
          options={["Nenhum Coordenador", ...servidoresOptions]}
        />
      </div>
    </div>
  );
};
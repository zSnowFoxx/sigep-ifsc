import React from "react";
import type { Servidor } from "../../../types/cadastros";
import {
  FLabel,
  FInput,
  FSelect,
  FRow,
  CreatableTagInput,
  MultiSelectPills,
} from "../../ui/FormPrimitives";

export interface ServidorFormData extends Partial<Servidor> {
  turmasLecionadas?: string[];
  cursoCoord?: string;
}

interface FormProps {
  formData: ServidorFormData;
  onChange: (data: ServidorFormData) => void;
  turmasOptions?: string[];
  cursosOptions?: string[];
  allFuncoesOptions?: string[];
}

export const ServidorForm: React.FC<FormProps> = ({
  formData,
  onChange,
  turmasOptions = [],
  cursosOptions = [],
  allFuncoesOptions = [],
}) => {
  const handleCargoChange = (cargo: string) => {
    onChange({
      ...formData,
      cargo,
      turmasLecionadas: [],
      cursoCoord: "",
      funcoes: [],
    });
  };

  return (
    <div className="space-y-4">
      <FRow>
        <div>
          <FLabel>SIAPE</FLabel>
          <FInput
            value={formData.siape || ""}
            onChange={(v) => onChange({ ...formData, siape: v })}
            placeholder="0000000"
            mono
          />
        </div>
        <div>
          <FLabel>Cargo / Perfil</FLabel>
          <FSelect
            value={formData.cargo || ""}
            onChange={handleCargoChange}
            placeholder="Selecionar cargo..."
            options={[
              "Professor",
              "Coordenador de Curso",
              "Equipe Pedagógica/NAE",
              "Servidor Geral",
            ]}
          />
        </div>
      </FRow>

      <div>
        <FLabel>Nome Completo</FLabel>
        <FInput
          value={formData.nome || ""}
          onChange={(v) => onChange({ ...formData, nome: v })}
          placeholder="Nome completo do servidor"
        />
      </div>

      <div>
        <FLabel>E-mail Institucional</FLabel>
        <FInput
          type="email"
          value={formData.email || ""}
          onChange={(v) => onChange({ ...formData, email: v })}
          placeholder="nome@ifsc.edu.br"
        />
      </div>

      {formData.cargo === "Professor" && (
        <div>
          <FLabel>Turmas / Disciplinas Lecionadas</FLabel>
          <MultiSelectPills
            value={formData.turmasLecionadas || []}
            onChange={(v) => onChange({ ...formData, turmasLecionadas: v })}
            options={turmasOptions}
            placeholder="Selecionar turmas..."
          />
        </div>
      )}

      {formData.cargo === "Coordenador de Curso" && (
        <div>
          <FLabel>Curso Coordenado</FLabel>
          <FSelect
            value={formData.cursoCoord || ""}
            onChange={(v) => onChange({ ...formData, cursoCoord: v })}
            placeholder="Selecionar curso..."
            options={cursosOptions}
          />
        </div>
      )}

      {(formData.cargo === "Equipe Pedagógica/NAE" ||
        formData.cargo === "Servidor Geral") && (
        <div>
          <FLabel>Função / Área</FLabel>
          <CreatableTagInput
            value={formData.funcoes || []}
            onChange={(v) => onChange({ ...formData, funcoes: v })}
            allTags={allFuncoesOptions}
            placeholder="Adicionar função ou área..."
          />
        </div>
      )}
    </div>
  );
};
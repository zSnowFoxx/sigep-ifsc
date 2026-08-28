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
  disciplinasOptions?: string[];
  perfisOptions?: string[];
  allFuncoesOptions?: string[];
  isEdit?: boolean;
}

export const ServidorForm: React.FC<FormProps> = ({
  formData,
  onChange,
  turmasOptions = [],
  cursosOptions = [],
  disciplinasOptions = [],
  perfisOptions = [
    "Professor",
    "Coordenador de Curso",
    "Equipe Pedagógica/NAE",
    "Servidor Geral",
  ],
  allFuncoesOptions = [],
  isEdit = false,
}) => {
  // Une disciplinas e turmas para permitir a seleção de ambos no mesmo campo
  const opcoesLecionadas = Array.from(
    new Set([...disciplinasOptions, ...turmasOptions])
  );

  const handleCargoChange = (cargo: string) => {
    onChange({
      ...formData,
      cargo: cargo as NonNullable<Servidor["cargo"]>,
      turmasLecionadas: [],
      cursoCoord: "",
      funcoes: [],
    });
  };

  if (isEdit) {
    const isCoordenador = formData.cargo === "Coordenador de Curso";
    const isProfessor = formData.cargo === "Professor" || isCoordenador;

    return (
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl mb-3">
          <p className="text-xs text-gray-500 font-medium">
            Servidor: <span className="text-gray-800 font-bold">{formData.nome}</span>
          </p>
          <p className="text-xs text-gray-500 font-medium">
            Cargo atual: <span className="text-emerald-700 font-bold">{formData.cargo}</span>
          </p>
          {isCoordenador && formData.cursoCoord && (
            <p className="text-xs text-gray-500 font-medium">
              Curso coordenado: <span className="text-emerald-700 font-bold">{formData.cursoCoord}</span>
            </p>
          )}
        </div>

        {isProfessor && (
          <div>
            <FLabel>Disciplinas / Turmas Lecionadas</FLabel>
            <MultiSelectPills
              value={formData.turmasLecionadas || []}
              onChange={(v) => onChange({ ...formData, turmasLecionadas: v })}
              options={opcoesLecionadas}
              placeholder="Selecionar disciplinas ou turmas..."
            />
          </div>
        )}

        <div>
          <FLabel>Funções / Áreas de Atuação</FLabel>
          <CreatableTagInput
            value={formData.funcoes || []}
            onChange={(v) => onChange({ ...formData, funcoes: v })}
            allTags={allFuncoesOptions}
            placeholder="Adicionar ou remover função..."
          />
        </div>

        {isCoordenador && (
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-700 hover:text-amber-800">
              <input
                type="checkbox"
                checked={!formData.cursoCoord}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange({
                      ...formData,
                      cursoCoord: "",
                      cargo: "Professor" as NonNullable<Servidor["cargo"]>,
                    });
                  } else {
                    onChange({
                      ...formData,
                      cargo: "Coordenador de Curso" as NonNullable<Servidor["cargo"]>,
                    });
                  }
                }}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              Remover da coordenação e alterar cargo para apenas Professor
            </label>
          </div>
        )}
      </div>
    );
  }

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
            options={perfisOptions}
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

      {(formData.cargo === "Professor" || formData.cargo === "Coordenador de Curso") && (
        <div>
          <FLabel>Disciplinas / Turmas Lecionadas</FLabel>
          <MultiSelectPills
            value={formData.turmasLecionadas || []}
            onChange={(v) => onChange({ ...formData, turmasLecionadas: v })}
            options={opcoesLecionadas}
            placeholder="Selecionar disciplinas ou turmas..."
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

      <div>
        <FLabel>Funções / Áreas de Atuação</FLabel>
        <CreatableTagInput
          value={formData.funcoes || []}
          onChange={(v) => onChange({ ...formData, funcoes: v })}
          allTags={allFuncoesOptions}
          placeholder="Adicionar função ou área..."
        />
      </div>
    </div>
  );
};
import React from "react";
import type { Disciplina } from "../../../types/cadastros";
import {
  TableContainer,
  Th,
  Td,
  TRow,
  EmptyState,
  RowActions,
} from "../../ui/TablePrimitives";
import { SiglaBadge, FaseBadge } from "../../ui/Badges";
import { stripPrefix } from "../../../utils/cadastrosUtils";

interface Props {
  data: Disciplina[];
  onEdit: (disciplina: Disciplina) => void;
  onDelete?: (disciplina: Disciplina) => void;
}

export const DisciplinasTable: React.FC<Props> = ({
  data,
  onEdit,
  onDelete,
}) => (
  <TableContainer>
    <thead>
      <tr>
        <Th>Sigla</Th>
        <Th>Nome da Disciplina</Th>
        <Th>Carga Horária</Th>
        <Th>Fase Oferta</Th>
        <Th>Curso Vinculado</Th>
        <Th className="text-right">Ações</Th>
      </tr>
    </thead>
    <tbody>
      {data.length === 0 ? (
        <EmptyState colSpan={6} message="Nenhuma disciplina encontrada." />
      ) : (
        data.map((item, i) => (
          <TRow key={`${item.sigla}-${i}`}>
            <Td>
              <SiglaBadge label={item.sigla} />
            </Td>
            <Td>
              <span className="font-semibold text-gray-800">{item.nome}</span>
            </Td>
            <Td>
              <span className="font-semibold" style={{ color: "#15622f" }}>
                {item.cargaHoraria}
              </span>
            </Td>
            <Td>
              <FaseBadge label={item.faseOferta} />
            </Td>
            <Td>
              <span className="text-xs text-gray-600">
                {stripPrefix(item.curso)}
              </span>
            </Td>
            <Td className="text-right">
              <RowActions
                onEdit={() => onEdit(item)}
                onDelete={onDelete ? () => onDelete(item) : undefined}
              />
            </Td>
          </TRow>
        ))
      )}
    </tbody>
  </TableContainer>
);
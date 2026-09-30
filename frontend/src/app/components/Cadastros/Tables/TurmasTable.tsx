import React from "react";
import type { Turma } from "../../../types/cadastros";
import {
  TableContainer,
  Th,
  Td,
  TRow,
  EmptyState,
  RowActions,
} from "../../ui/TablePrimitives";
import { PeriodBadge } from "../../ui/Badges";
import { stripPrefix } from "../../../utils/cadastrosUtils";

interface Props {
  data: Turma[];
  onEdit: (turma: Turma) => void;
  onDelete?: (turma: Turma) => void;
}

export const TurmasTable: React.FC<Props> = ({ data, onEdit, onDelete }) => (
  <TableContainer>
    <thead>
      <tr>
        <Th>Nome da Turma</Th>
        <Th>Período Letivo</Th>
        <Th>Curso Vinculado</Th>
        <Th>Qtd. Alunos</Th>
        <Th className="text-right">Ações</Th>
      </tr>
    </thead>
    <tbody>
      {data.length === 0 ? (
        <EmptyState colSpan={5} message="Nenhuma turma encontrada." />
      ) : (
        data.map((item) => (
          <TRow key={`${item.nome}-${item.periodo}`}>
            <Td>
              <span className="font-semibold text-gray-800">{item.nome}</span>
            </Td>
            <Td>
              <PeriodBadge label={item.periodo ?? ""} />
            </Td>
            <Td>
              <span className="text-xs text-gray-600">
                {stripPrefix(item.curso ?? "")}
              </span>
            </Td>
            <Td>
              <span className="font-bold" style={{ color: "#15622f" }}>
                {item.alunos}
              </span>
              <span className="text-xs text-gray-400 ml-1">alunos</span>
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
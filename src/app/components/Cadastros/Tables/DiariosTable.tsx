import React from "react";
import type { Diario } from "../../../types/cadastros";
import {
  TableContainer,
  Th,
  Td,
  TRow,
  EmptyState,
  RowActions,
} from "../../ui/TablePrimitives";
import { Avatar } from "../../ui/Badges";

interface Props {
  data: Diario[];
  onEdit: (diario: Diario) => void;
  onDelete?: (diario: Diario) => void;
}

export const DiariosTable: React.FC<Props> = ({ data, onEdit, onDelete }) => (
  <TableContainer>
    <thead>
      <tr>
        <Th>Código Diário</Th>
        <Th>Disciplina</Th>
        <Th>Turma</Th>
        <Th>Professor Responsável</Th>
        <Th>CH / Aulas Previstas</Th>
        <Th className="text-right">Ações</Th>
      </tr>
    </thead>
    <tbody>
      {data.length === 0 ? (
        <EmptyState colSpan={6} message="Nenhum diário encontrado." />
      ) : (
        data.map((item) => (
          <TRow key={item.codigo}>
            <Td className="font-mono text-xs text-gray-500">{item.codigo}</Td>
            <Td>
              <span className="font-semibold text-gray-800">
                {item.disciplina}
              </span>
            </Td>
            <Td>
              <span className="text-xs text-gray-600">{item.turma}</span>
            </Td>
            <Td>
              <div className="flex items-center gap-2">
                <Avatar name={item.professor ?? "Professor"} size={22} />
                <span className="text-xs text-gray-700">{item.professor}</span>
              </div>
            </Td>
            <Td>
              <span className="font-semibold" style={{ color: "#15622f" }}>
                {item.cargaHoraria}
              </span>
              <span className="text-xs text-gray-400 mx-1">/</span>
              <span className="text-xs text-gray-600">
                {item.aulasPrevistas} aulas
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
import React from "react";
import type { Aluno } from "../../../types/cadastros";
import {
  TableContainer,
  Th,
  Td,
  TRow,
  EmptyState,
  RowActions,
} from "../../ui/TablePrimitives";
import { Avatar, StatusBadge, TurmasBadge } from "../../ui/Badges";

interface Props {
  data: Aluno[];
  onEdit: (aluno: Aluno) => void;
  onDelete?: (aluno: Aluno) => void;
}

export const AlunosTable: React.FC<Props> = ({ data, onEdit, onDelete }) => (
  <TableContainer>
    <thead>
      <tr>
        <Th>Matrícula</Th>
        <Th>Nome do Aluno</Th>
        <Th>Turmas</Th>
        <Th>Status</Th>
        <Th className="text-right">Ações</Th>
      </tr>
    </thead>
    <tbody>
      {data.length === 0 ? (
        <EmptyState colSpan={4} message="Nenhum aluno encontrado." />
      ) : (
        data.map((item) => (
          <TRow key={item.matricula}>
            <Td className="font-mono text-xs text-gray-500">{item.matricula}</Td>
            <Td>
              <div className="flex items-center gap-2.5">
                <Avatar name={item.nome} />
                <div>
                  <p className="font-semibold text-gray-800 leading-tight">
                    {item.nome}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.email}</p>
                </div>
              </div>
            </Td>
            <Td>
              <div className="flex flex-wrap gap-1.5">
                {item.turmas.map((f, i) => (
                  <TurmasBadge key={i} tag={f} />
                ))}
              </div>
            </Td>
            <Td>
              <StatusBadge label={item.status} />
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
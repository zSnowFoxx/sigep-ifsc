import React from "react";
import type { Servidor } from "../../../types/cadastros";
import {
  TableContainer,
  Th,
  Td,
  TRow,
  EmptyState,
  RowActions,
} from "../../ui/TablePrimitives";
import { Avatar, CargoBadge, FuncaoBadge } from "../../ui/Badges";

interface Props {
  data: Servidor[];
  onEdit: (servidor: Servidor) => void;
  onDelete?: (servidor: Servidor) => void;
}

export const ServidoresTable: React.FC<Props> = ({ data, onEdit, onDelete }) => (
  <TableContainer>
    <thead>
      <tr>
        <Th>SIAPE</Th>
        <Th>Servidor</Th>
        <Th>Cargo</Th>
        <Th>Função / Área</Th>
        <Th className="text-right">Ações</Th>
      </tr>
    </thead>
    <tbody>
      {data.length === 0 ? (
        <EmptyState colSpan={5} message="Nenhum servidor encontrado." />
      ) : (
        data.map((item) => (
          <TRow key={item.siape}>
            <Td className="font-mono text-xs text-gray-500">{item.siape}</Td>
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
              <CargoBadge label={item.cargo} />
            </Td>
            <Td>
              <div className="flex flex-wrap gap-1.5">
                {(item.funcoes ?? []).map((f, i) => (
                  <FuncaoBadge key={i} tag={f} />
                ))}
              </div>
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
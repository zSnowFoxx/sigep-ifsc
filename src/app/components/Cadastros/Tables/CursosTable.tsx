import React from "react";
import type { Curso } from "../../../types/cadastros";
import {
  TableContainer,
  Th,
  Td,
  TRow,
  EmptyState,
  RowActions,
} from "../../ui/TablePrimitives";
import { Avatar, GrauBadge, PpcBadge } from "../../ui/Badges";
import { stripPrefix } from "../../../utils/cadastrosUtils";

interface Props {
  data: Curso[];
  onEdit: (curso: Curso) => void;
  onDelete?: (curso: Curso) => void;
}

export const CursosTable: React.FC<Props> = ({ data, onEdit, onDelete }) => (
  <TableContainer>
    <thead>
      <tr>
        <Th>Nome do Curso</Th>
        <Th>Tipo</Th>
        <Th>Grau</Th>
        <Th>Modalidade</Th>
        <Th>PPC</Th>
        <Th>Fases</Th>
        <Th>Carga Horária</Th>
        <Th>Coordenador</Th>
        <Th className="text-right">Ações</Th>
      </tr>
    </thead>
    <tbody>
      {data.length === 0 ? (
        <EmptyState colSpan={9} message="Nenhum curso encontrado." />
      ) : (
        data.map((item) => (
          <TRow key={item.nome}>
            <Td>
              <span className="font-semibold text-gray-800">
                {stripPrefix(item.nome)}
              </span>
            </Td>
            <Td>
              <span
                className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold"
                style={{ background: "#f0f2f5", color: "#374151" }}
              >
                {item.tipo}
              </span>
            </Td>
            <Td>
              <GrauBadge label={item.grau} />
            </Td>
            <Td>
              <span
                className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold"
                style={{ background: "#f0f2f5", color: "#374151" }}
              >
                {item.modalidade}
              </span>
            </Td>
            <Td>
              <PpcBadge label={item.ppc} />
            </Td>
            <Td>
              <span className="font-semibold text-gray-700">
                {item.fases} fases
              </span>
            </Td>
            <Td>
              <span className="font-semibold" style={{ color: "#15622f" }}>
                {item.cargaHoraria}
              </span>
            </Td>
            <Td>
              {item.coordenador && item.coordenador !== "—" ? (
                <div className="flex items-center gap-2">
                  <Avatar name={item.coordenador} size={22} />
                  <span className="text-xs text-gray-700">
                    {item.coordenador}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic">
                  Não atribuído
                </span>
              )}
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
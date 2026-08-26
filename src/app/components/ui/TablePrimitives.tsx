import React from "react";
import { Edit2, Inbox } from "lucide-react";

interface TableContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const TableContainer: React.FC<TableContainerProps> = ({ children, className = "" }) => (
  <div className={`w-full overflow-x-auto ${className}`}>
    <table className="w-full text-left text-sm text-gray-600 font-sans border-collapse">
      {children}
    </table>
  </div>
);

export const Th: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <th className={`px-4 py-3 bg-[#f7f8fa] text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200 whitespace-nowrap ${className}`}>
    {children}
  </th>
);

export const Td: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <td className={`px-4 py-3 border-b border-gray-100 align-middle ${className}`}>
    {children}
  </td>
);

export const TRow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <tr className={`border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-colors duration-150 group ${className}`}>
    {children}
  </tr>
);

export const EmptyState: React.FC<{ message?: string; colSpan?: number }> = ({ 
  message = "Nenhum registro encontrado.", 
  colSpan = 6 
}) => (
  <tr>
    <td colSpan={colSpan} className="py-12 text-center text-gray-400">
      <Inbox className="mx-auto h-10 w-10 stroke-[1.5] mb-2 text-gray-300" />
      <p className="text-sm font-medium">{message}</p>
    </td>
  </tr>
);

interface RowActionsProps {
  onEdit: () => void;
  onDelete?: () => void;
}

export const RowActions: React.FC<RowActionsProps> = ({ onEdit }) => (
  <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
    <button
      onClick={onEdit}
      className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
      title="Editar"
    >
      <Edit2 className="w-4 h-4" />
    </button>
  </div>
);
import React from "react";
import { Plus } from "lucide-react";

interface CadastrosHeaderProps {
  entityName: string;
  onOpenCreate: () => void;
}

export const CadastrosHeader: React.FC<CadastrosHeaderProps> = ({ entityName, onOpenCreate }) => (
  <div className="flex items-start justify-between gap-4">
    <div>
      <h1 className="text-lg font-bold text-gray-900">Cadastros Institucionais</h1>
      <p className="text-sm text-gray-500 mt-0.5">
        Gerenciamento de dados de alunos, servidores, turmas, cursos e diários registrados no sistema.
      </p>
    </div>
    <button
      type="button"
      onClick={onOpenCreate}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shrink-0 transition-all hover:opacity-90 active:scale-[0.99]"
      style={{
        background: "linear-gradient(135deg, #0f4a23 0%, #15622f 100%)",
        boxShadow: "0 4px 12px rgba(15,74,35,0.28)",
      }}
    >
      <Plus size={14} /> Cadastrar Novo {entityName}
    </button>
  </div>
);
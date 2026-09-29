import React, { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

export interface ModalProps {
  title: string;
  subtitle?: string;
  entity?: string;
  mode?: "create" | "edit" | null;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
  saveLabel?: string;
  onDelete?: () => void;
  onRequestDelete?: () => void;
  deleteConfirm?: boolean;
  onConfirmDelete?: () => void;
  onCancelDelete?: () => void;
  isOpen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  subtitle,
  entity,
  mode = "create",
  children,
  onClose,
  onSave,
  saveLabel,
  onDelete,
  onRequestDelete,
  deleteConfirm: externalDeleteConfirm,
  onConfirmDelete,
  onCancelDelete,
  isOpen = true,
}) => {
  const [internalDeleteConfirm, setInternalDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const isDeleting = externalDeleteConfirm ?? internalDeleteConfirm;

  const handleRequestDelete = () => {
    if (onRequestDelete) {
      onRequestDelete();
    } else {
      setInternalDeleteConfirm(true);
    }
  };

  const handleCancelDelete = () => {
    if (onCancelDelete) {
      onCancelDelete();
    } else {
      setInternalDeleteConfirm(false);
    }
  };

  const handleConfirmDelete = () => {
    if (onConfirmDelete) {
      onConfirmDelete();
    } else if (onDelete) {
      onDelete();
      setInternalDeleteConfirm(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-2xl shrink-0"
          style={{
            background: "linear-gradient(135deg, #0b3d1e 0%, #15622f 100%)",
          }}
        >
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {mode === "create" ? "Novo registro" : "Editar registro"}
            </p>
            <h2 className="text-sm font-bold text-white mt-0.5">{title}</h2>
            {subtitle && (
              <p className="text-xs text-white/70 mt-0.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 min-h-0">
          {children}
        </div>

        {/* Footer */}
        <div
          className="border-t border-gray-100 px-6 py-4 rounded-b-2xl shrink-0"
          style={{ background: "#fafbfc" }}
        >
          {isDeleting ? (
            <div className="space-y-3">
              <div
                className="flex items-start gap-3 px-4 py-3 rounded-xl border"
                style={{ background: "#fff8f8", borderColor: "#fecaca" }}
              >
                <AlertTriangle
                  size={15}
                  className="text-red-500 shrink-0 mt-0.5"
                />
                <p className="text-xs text-red-700 font-medium leading-relaxed">
                  Deseja realmente excluir este registro? Esta ação não pode ser
                  desfeita.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="flex-1 py-2 rounded-xl border text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-all hover:bg-red-50 flex items-center justify-center gap-2"
                  style={{ borderColor: "#dc2626", color: "#dc2626" }}
                >
                  <Trash2 size={13} /> Confirmar Exclusão
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {(mode === "edit" || onDelete) && (
                <button
                  type="button"
                  onClick={handleRequestDelete}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-xs font-bold transition-all hover:bg-red-50"
                  style={{ borderColor: "#dc2626", color: "#dc2626" }}
                >
                  <Trash2 size={12} /> Excluir {entity || "Registro"}
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.99]"
                  style={{
                    background:
                      "linear-gradient(135deg, #0f4a23 0%, #15622f 100%)",
                    boxShadow: "0 4px 12px rgba(15,74,35,0.28)",
                  }}
                >
                  {saveLabel ||
                    (mode === "create" ? "Salvar Registro" : "Salvar Alterações")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ModalShell = Modal;
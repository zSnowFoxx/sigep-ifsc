import { X, Calendar, User, FileText, Lock, HeartHandshake } from "lucide-react";
import {
  motivoIcons,
  motivoColors
} from "../../../data/atendimentosData";
import type { AtendimentoItem } from "../../../types/atendimentos";

interface ModalRelatoProps {
  atendimento: AtendimentoItem;
  onClose: () => void;
}

export default function ModalRelato({ atendimento, onClose }: ModalRelatoProps) {
  const MotivoIcon = motivoIcons[atendimento.motivo] ?? HeartHandshake;
  const colors = motivoColors[atendimento.motivo] ?? motivoColors["Outro"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(3px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative z-10 bg-card rounded-2xl shadow-2xl w-full overflow-hidden"
        style={{ maxWidth: "560px", maxHeight: "88vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="px-6 py-4 flex items-start justify-between"
          style={{
            background: "linear-gradient(135deg, #0b3d1e 0%, #15622f 100%)",
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border"
                style={{
                  background: colors.bg,
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                <MotivoIcon size={10} />
                {atendimento.motivo}
              </span>
            </div>
            <p className="text-base font-bold text-white">{atendimento.aluno}</p>
            <p
              className="text-xs text-white/60 mt-0.5"
              style={{ fontFamily: "monospace" }}
            >
              {atendimento.matricula} · {atendimento.turma}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Data",
                value: `${atendimento.data} · ${atendimento.hora}`,
                icon: Calendar,
              },
              {
                label: "Servidor",
                value: `${atendimento.servidor}`,
                icon: User,
              },
              {
                label: "Contato",
                value: atendimento.contato,
                icon: FileText,
              },
            ].map((m, i) => (
              <div key={i} className="bg-[#f7f8fa] rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <m.icon size={11} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                </div>
                <p className="text-xs font-semibold text-foreground leading-snug">
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Lock size={11} className="text-amber-600" />
              <p className="text-xs font-semibold text-foreground">
                Relato Detalhado
              </p>
              <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-medium ml-auto">
                Sigiloso
              </span>
            </div>
            <div className="bg-[#f7f8fa] rounded-lg p-4 text-sm text-foreground leading-relaxed border border-border">
              {atendimento.relato}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
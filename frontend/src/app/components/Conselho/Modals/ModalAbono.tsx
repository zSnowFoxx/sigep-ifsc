import React from "react";
import type { Aluno } from "../../../types/conselho";

interface ModalAbonoProps {
  abonomat: string | null;
  setAbonomat: React.Dispatch<React.SetStateAction<string | null>>;
  abonoText: string;
  setAbonoText: React.Dispatch<React.SetStateAction<string>>;
  alunos: Aluno[];
  alunosTurmaB: Aluno[];
}

export function ModalAbono({
  abonomat,
  setAbonomat,
  abonoText,
  setAbonoText,
  alunos,
  alunosTurmaB,
}: ModalAbonoProps) {
  if (!abonomat) return null;

  const alunoNome = [...alunos, ...alunosTurmaB].find((a) => a.matricula === abonomat)?.nome;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
      onClick={() => setAbonomat(null)}
    >
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between" style={{ background: "var(--primary)" }}>
          <div>
            <p className="text-xs text-white/60">Registro de Abono</p>
            <h3 className="text-sm font-bold text-white">Abonar Faltas / Inserir Justificativa</h3>
            <p className="text-xs text-white/60 mt-0.5" style={{ fontFamily: "monospace" }}>
              {alunoNome} · {abonomat}
            </p>
          </div>
          <button onClick={() => setAbonomat(null)} className="text-white/60 hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Quantidade de horas a abonar</label>
              <input
                type="number"
                min="1"
                placeholder="Ex: 8"
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Tipo de justificativa</label>
              <select className="w-full appearance-none text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer">
                <option>Atestado Médico</option>
                <option>Luto</option>
                <option>Serviço Militar</option>
                <option>Representação Discente</option>
                <option>Decisão do Conselho</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Observações / Fundamentação</label>
            <textarea
              rows={4}
              value={abonoText}
              onChange={(e) => setAbonoText(e.target.value)}
              placeholder="Descreva a justificativa e o embasamento legal ou pedagógico para o abono das faltas..."
              className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground leading-relaxed"
            />
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-border flex gap-2 justify-end bg-[#f7f8fa]">
          <button onClick={() => setAbonomat(null)} className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => setAbonomat(null)}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--primary)" }}
          >
            Confirmar Abono
          </button>
        </div>
      </div>
    </div>
  );
}
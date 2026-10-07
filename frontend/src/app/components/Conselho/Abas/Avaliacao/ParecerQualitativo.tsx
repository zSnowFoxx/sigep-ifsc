import React from "react";
import { AlertTriangle, ChevronRight, Save } from "lucide-react";
import type { Aluno, AlunoEval } from "../../../../types/conselho";

interface ParecerQualitativoProps {
  current: Aluno;
  currentEval: AlunoEval;
  updateEval: (matricula: string, field: keyof AlunoEval, value: any) => void;
  saveEval: (matricula: string) => void;
  salvando: boolean;
  alunos: Aluno[];
  setSelectedAluno: (matricula: string) => void;
  encForm: { categoria: string; descricao: string; servidor: string };
  setEncForm: React.Dispatch<React.SetStateAction<{ categoria: string; descricao: string; servidor: string }>>;
}

export function ParecerQualitativo({
  current,
  currentEval,
  updateEval,
  saveEval,
  salvando,
  alunos,
  setSelectedAluno,
}: ParecerQualitativoProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <div className="w-1 h-4 rounded-full bg-[#7c3aed]" />
        <h3 className="text-sm font-bold text-foreground">Parecer Qualitativo e Deliberações</h3>
        <span className="ml-auto text-xs text-muted-foreground">Registrado pelo Colegiado</span>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Toggle de Risco (calculado pelas notas e frequências; vale só nesta sessão, não é gravado) */}
        <div
          className="flex items-center justify-between p-4 rounded-xl border transition-all"
          style={{
            borderColor: currentEval.risco ? "#f97316" : "var(--border)",
            background: currentEval.risco ? "#fff7ed" : "#f7f8fa",
            boxShadow: currentEval.risco ? "0 0 0 3px rgba(249,115,22,0.1)" : undefined,
          }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className={`mt-0.5 shrink-0 ${currentEval.risco ? "text-orange-500" : "text-muted-foreground/40"}`} />
            <div>
              <p className={`text-sm font-semibold ${currentEval.risco ? "text-orange-800" : "text-foreground"}`}>
                Sinalizar Risco Iminente de Evasão Escolar
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Calculado pelas notas e frequências; vale apenas durante este conselho</p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={currentEval.risco}
            onClick={() => updateEval(current.matricula, "risco", !currentEval.risco)}
            className="relative w-11 h-6 rounded-full transition-all duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            style={{ background: currentEval.risco ? "#f97316" : "#d1d5db" }}
          >
            <span
              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200"
              style={{ transform: currentEval.risco ? "translateX(20px)" : "translateX(0)" }}
            />
          </button>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Observações Pedagógicas e Parecer do Colegiado
          </label>
          <textarea
            rows={5}
            value={currentEval.obs}
            onChange={(e) => updateEval(current.matricula, "obs", e.target.value)}
            placeholder="Registre o parecer coletivo dos professores sobre este aluno: desempenho, comportamento, evolução, dificuldades específicas, fatores externos observados..."
            className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground leading-relaxed transition-all"
          />
          <p className="text-xs text-muted-foreground text-right mt-1">{currentEval.obs.length} caracteres</p>
        </div>

        {/* Ações de Salvar */}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {currentEval.saved ? "Parecer registrado com sucesso." : "Preencha os campos e salve o parecer."}
          </p>
          <div className="flex gap-2">
            {currentEval.saved && (
              <button
                onClick={() => {
                  const idx = alunos.findIndex((a) => a.matricula === current.matricula);
                  if (idx < alunos.length - 1) setSelectedAluno(alunos[idx + 1].matricula);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-border text-foreground hover:bg-muted transition-colors"
              >
                Próximo aluno <ChevronRight size={12} />
              </button>
            )}
            <button
              onClick={() => saveEval(current.matricula)}
              disabled={salvando}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: "var(--primary)" }}
            >
              <Save size={13} />
              {salvando ? "Salvando..." : "Salvar Parecer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
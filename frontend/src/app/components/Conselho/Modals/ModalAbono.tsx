import React, { useEffect, useState } from "react";
import type { Aluno, Disciplina } from "../../../types/conselho";
import { TIPOS_ABONO, formatData } from "../../../services/conselhoService";

interface ModalAbonoProps {
  abonomat: string | null;
  setAbonomat: React.Dispatch<React.SetStateAction<string | null>>;
  abonoText: string;
  setAbonoText: React.Dispatch<React.SetStateAction<string>>;
  alunos: Aluno[];
  disciplina?: Disciplina;
  conselhoId: number;
  onConfirmar: (notaFrequenciaId: number, horas: number, tipo: string) => Promise<void>;
  onRemover: (abonoId: number) => Promise<void>;
}

const mensagem = (err: unknown) => (err instanceof Error ? err.message : "Erro ao salvar o abono.");

export function ModalAbono({
  abonomat,
  setAbonomat,
  abonoText,
  setAbonoText,
  alunos,
  disciplina,
  conselhoId,
  onConfirmar,
  onRemover,
}: ModalAbonoProps) {
  const [horas, setHoras] = useState("");
  const [tipo, setTipo] = useState<string>(TIPOS_ABONO[0]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // Cada abertura (aluno/disciplina) começa com o formulário limpo.
  useEffect(() => {
    setHoras("");
    setTipo(TIPOS_ABONO[0]);
    setErro("");
  }, [abonomat, disciplina?.notaId]);

  if (!abonomat) return null;

  const alunoNome = alunos.find((a) => a.matricula === abonomat)?.nome;
  const disponiveis = disciplina?.faltasNaoJust ?? 0;
  const horasNum = Number(horas);
  const horasValidas = Number.isInteger(horasNum) && horasNum >= 1 && horasNum <= disponiveis;
  const fechar = () => setAbonomat(null);

  const confirmar = async () => {
    if (!disciplina || !horasValidas) return;
    setSalvando(true);
    setErro("");
    try {
      await onConfirmar(disciplina.notaId, horasNum, tipo);
      fechar();
    } catch (err) {
      setErro(mensagem(err));
    } finally {
      setSalvando(false);
    }
  };

  const remover = async (abonoId: number) => {
    setSalvando(true);
    setErro("");
    try {
      await onRemover(abonoId);
    } catch (err) {
      setErro(mensagem(err));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
      onClick={fechar}
    >
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between" style={{ background: "var(--primary)" }}>
          <div>
            <p className="text-xs text-white/60">Registro de Abono</p>
            <h3 className="text-sm font-bold text-white">Abonar Faltas / Inserir Justificativa</h3>
            <p className="text-xs text-white/60 mt-0.5" style={{ fontFamily: "monospace" }}>
              {alunoNome} · {abonomat}
            </p>
            {disciplina && <p className="text-xs text-white/80 mt-0.5">{disciplina.nome}</p>}
          </div>
          <button onClick={fechar} className="text-white/60 hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {!disciplina ? (
            <p className="text-sm text-muted-foreground">Nenhuma nota ou frequência registrada para este aluno.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Quantidade de horas a abonar</label>
                  <input
                    type="number"
                    min="1"
                    max={disponiveis}
                    step="1"
                    value={horas}
                    onChange={(e) => setHoras(e.target.value)}
                    disabled={disponiveis === 0}
                    placeholder={disponiveis > 0 ? `Até ${disponiveis}h` : "Sem faltas"}
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Tipo de justificativa</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full appearance-none text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer"
                  >
                    {TIPOS_ABONO.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground -mt-2">
                {disponiveis > 0
                  ? `${disponiveis}h de faltas não justificadas disponíveis para abono.`
                  : "Não há faltas não justificadas para abonar nesta disciplina."}
              </p>
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

              {disciplina.abonos.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1.5">Abonos registrados nesta disciplina</p>
                  <ul className="space-y-1.5">
                    {disciplina.abonos.map((a) => (
                      <li key={a.id} className="flex items-start gap-2 text-xs rounded-lg border border-border bg-[#f7f8fa] px-3 py-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">
                            {a.horas}h · {a.tipo} · {formatData(a.data_registro)}
                          </p>
                          {a.fundamentacao && <p className="text-muted-foreground mt-0.5 break-words">{a.fundamentacao}</p>}
                        </div>
                        {a.conselho_id === conselhoId ? (
                          <button
                            onClick={() => remover(a.id)}
                            disabled={salvando}
                            className="text-red-600 font-semibold hover:underline disabled:opacity-50 shrink-0"
                          >
                            Remover
                          </button>
                        ) : (
                          <span className="text-muted-foreground shrink-0">Outro conselho</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {erro && <p className="text-xs font-semibold text-red-600">{erro}</p>}
        </div>

        <div className="px-5 py-3.5 border-t border-border flex gap-2 justify-end bg-[#f7f8fa]">
          <button onClick={fechar} className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
            Cancelar
          </button>
          <button
            onClick={confirmar}
            disabled={!disciplina || !horasValidas || salvando}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--primary)" }}
          >
            {salvando ? "Salvando..." : "Confirmar Abono"}
          </button>
        </div>
      </div>
    </div>
  );
}

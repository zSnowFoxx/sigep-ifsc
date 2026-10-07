import React from "react";
import type { Disciplina } from "../../../../types/conselho";

interface PainelDisciplinasProps {
  disc: Disciplina;
  selectedAluno: string;
  retificadas: Record<string, string>;
  setRetificadas: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setAbonomat: React.Dispatch<React.SetStateAction<string | null>>;
  setAbonoText: React.Dispatch<React.SetStateAction<string>>;
}

export function PainelDisciplinas({
  disc,
  selectedAluno,
  retificadas,
  setRetificadas,
  setAbonomat,
  setAbonoText,
}: PainelDisciplinasProps) {
  const retKey = `${selectedAluno}|${disc.nome}`;
  const retVal = retificadas[retKey] ?? "";
  const retNum = parseFloat(retVal);
  const retOk = retVal !== "" && !isNaN(retNum) && retNum >= 0 && retNum <= 10;

  const chTotal = disc.ch;
  const pctPres = Math.round((disc.presentes / chTotal) * 100);
  const pctJust = Math.round((disc.faltasJust / chTotal) * 100);
  const pctNaoJust = Math.round((disc.faltasNaoJust / chTotal) * 100);
  const freqDisc = Math.round((disc.presentes / chTotal) * 100);
  const ldbAlert = (disc.faltasJust + disc.faltasNaoJust) / chTotal > 0.25;

  return (
    <div className="grid grid-cols-2 divide-x divide-border" style={{ minHeight: "140px" }}>
      {/* Esquerda — Notas */}
      <div className="px-4 py-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notas</p>

        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Nota Bruta SIGAA:</span>
          <span
            className="text-lg font-bold"
            style={{
              color: disc.nota < 6 ? "#dc2626" : disc.nota < 7 ? "#d97706" : "#15803d",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {disc.nota.toFixed(1)}
          </span>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Média Retificada em Conselho:</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={retVal}
              onChange={(e) => setRetificadas((prev) => ({ ...prev, [retKey]: e.target.value }))}
              placeholder={disc.nota.toFixed(1)}
              className="w-20 text-xl font-bold px-2 py-1 rounded-lg border-2 outline-none transition-all placeholder:text-muted-foreground/30 bg-white"
              style={{
                borderColor: retOk ? "var(--primary)" : "var(--border)",
                color: retOk ? "var(--primary)" : "var(--foreground)",
                fontVariantNumeric: "tabular-nums",
              }}
            />
            {retOk && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                Retificado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Direita — Frequência */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Frequência</p>
          {ldbAlert && (
            <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              LDB
            </span>
          )}
        </div>

        <div>
          <div className="flex h-5 rounded-md overflow-hidden border border-border gap-px bg-border mb-1.5">
            <div
              className="flex items-center justify-center text-xs font-bold text-white"
              style={{ width: `${pctPres}%`, background: "#15803d" }}
              title={`${disc.presentes}h presentes`}
            >
              {pctPres > 15 && `${disc.presentes}h`}
            </div>
            {disc.faltasJust > 0 && (
              <div style={{ width: `${pctJust}%`, background: "#d97706" }} title={`${disc.faltasJust}h justificadas`} />
            )}
            {disc.faltasNaoJust > 0 && (
              <div style={{ width: `${pctNaoJust}%`, background: "#dc2626" }} title={`${disc.faltasNaoJust}h não justificadas`} />
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[
              { color: "#15803d", v: `${disc.presentes}h Pres.` },
              { color: "#d97706", v: `${disc.faltasJust}h Just.` },
              { color: "#dc2626", v: `${disc.faltasNaoJust}h Falta` },
            ].map((s, i) => (
              <span key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.color }} />
                {s.v}
              </span>
            ))}
            <span
              className="text-xs font-semibold ml-auto"
              style={{ color: freqDisc < 75 ? "#dc2626" : freqDisc < 80 ? "#d97706" : "#15803d" }}
            >
              {freqDisc}%
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setAbonomat(selectedAluno);
            setAbonoText("");
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:opacity-90 active:scale-[0.98] mt-1"
          style={{ borderColor: "var(--primary)", color: "var(--primary)", background: "var(--secondary)" }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Abonar Faltas / Justificar
        </button>
      </div>
    </div>
  );
}
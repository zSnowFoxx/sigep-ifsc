import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Send,
  FileText,
  UserCheck,
  Save,
} from "lucide-react";

import type {
  Aluno,
  AlunoEval,
  Disciplina,
  Enc,
} from "../../../types/conselho";

import { ENCAMINHAMENTOS_OPTIONS as encaminhamentos, SERVIDORES_OPTIONS as servidores  } from "../../../data/conselhoData";

interface ConselhoAvaliacaoProps {
  avaliacoes: Record<string, AlunoEval>;
  alunos: Aluno[];
  alunosTurmaB: Aluno[];
  groupAOpen: boolean;
  setGroupAOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupBOpen: boolean;
  setGroupBOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAluno: string;
  setSelectedAluno: (matricula: string) => void;
  disciplinasData: Record<string, Disciplina[]>;
  defaultDisciplinas: Disciplina[];
  selectedDisc: Record<string, number>;
  setSelectedDisc: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  retificadas: Record<string, string>;
  setRetificadas: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  abonomat: string | null;
  setAbonomat: React.Dispatch<React.SetStateAction<string | null>>;
  abonoText: string;
  setAbonoText: React.Dispatch<React.SetStateAction<string>>;
  updateEval: (matricula: string, field: keyof AlunoEval, value: any) => void;
  encAtivos: Record<string, Enc[]>;
  setEncAtivos: React.Dispatch<React.SetStateAction<Record<string, Enc[]>>>;
  encModalOpen: boolean;
  setEncModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  encNextId: React.RefObject<number>;
  saveEval: (matricula: string) => void;
}

export default function ConselhoAvaliacao({
  avaliacoes,
  alunos,
  alunosTurmaB,
  groupAOpen,
  setGroupAOpen,
  groupBOpen,
  setGroupBOpen,
  selectedAluno,
  setSelectedAluno,
  disciplinasData,
  defaultDisciplinas,
  selectedDisc,
  setSelectedDisc,
  retificadas,
  setRetificadas,
  abonomat,
  setAbonomat,
  abonoText,
  setAbonoText,
  updateEval,
  encAtivos,
  setEncAtivos,
  encModalOpen,
  setEncModalOpen,
  encNextId,
  saveEval,
}: ConselhoAvaliacaoProps) {

  // Variáveis auxiliares calculadas a partir dos alunos selecionados
  const current = [...alunos, ...alunosTurmaB].find((a) => a.matricula === selectedAluno) ?? alunos[0];
  const currentEval = avaliacoes[selectedAluno] ?? { saved: false, risco: false, obs: "" };
  const [encForm, setEncForm] = useState({ categoria: "", descricao: "", servidor: "" });

  return (
    <div className="flex h-full min-h-0 overflow-hidden">

    {/* Student list sidebar — accordion groups */}
    <div className="shrink-0 border-r border-border flex flex-col overflow-hidden bg-[#f7f8fa]" style={{ width: "308px" }}>

        {/* Sidebar header */}
        <div className="px-4 py-3.5 border-b border-border bg-card shrink-0">
        <h2 className="text-sm font-semibold text-foreground">Discentes por Turma</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
            {Object.values(avaliacoes).filter((e) => e.saved).length} de {alunos.length + alunosTurmaB.length} pareceres salvos
        </p>
        </div>

        <div className="flex-1 overflow-y-auto">

        {/* ── Group A — expanded (active) ────────────────────────── */}
        <div>
            <button
            onClick={() => setGroupAOpen((v) => !v)}
            className="w-full flex items-center gap-2 px-4 py-3 border-b border-border bg-card hover:bg-[#f0f2f5] transition-colors"
            >
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--primary)" }} />
            <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-foreground truncate">TDS - 2ª Fase</p>
                <p className="text-xs text-muted-foreground">
                {alunos.length} alunos · {alunos.filter((a) => avaliacoes[a.matricula]?.saved).length} salvos
                </p>
            </div>
            {groupAOpen
                ? <ChevronDown size={14} className="text-muted-foreground shrink-0" />
                : <ChevronRight size={14} className="text-muted-foreground shrink-0" />
            }
            </button>

            {groupAOpen && (
            <div>
                {[...alunos]
                .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
                .map((a) => {
                    const ev         = avaliacoes[a.matricula];
                    const isSelected = selectedAluno === a.matricula;
                    const discsA     = disciplinasData[a.matricula] ?? defaultDisciplinas;
                    const acad       = { mediaSistema: discsA.reduce((s, d) => s + d.nota, 0) / discsA.length, presentes: discsA.reduce((s, d) => s + d.presentes, 0), chTotal: discsA.reduce((s, d) => s + d.ch, 0) };
                    const freq       = Math.round((acad.presentes / acad.chTotal) * 100);

                    const gradePill = acad.mediaSistema >= 7.1
                    ? { bg: "#dcfce7", text: "#15803d", label: `Média ${acad.mediaSistema.toFixed(1)}` }
                    : acad.mediaSistema >= 6.0
                    ? { bg: "#ffedd5", text: "#c2410c", label: `Média ${acad.mediaSistema.toFixed(1)}` }
                    : { bg: "#fee2e2", text: "#b91c1c", label: `Média ${acad.mediaSistema.toFixed(1)}` };

                    const freqPill = freq >= 80
                    ? { bg: "#dcfce7", text: "#15803d", label: `${freq}% presença` }
                    : freq >= 75
                    ? { bg: "#ffedd5", text: "#c2410c", label: `${freq}% presença` }
                    : { bg: "#fee2e2", text: "#b91c1c", label: `${freq}% presença` };

                    return (
                    <button
                        key={a.matricula}
                        onClick={() => setSelectedAluno(a.matricula)}
                        className="w-full text-left px-4 py-3 border-b border-border transition-colors"
                        style={{
                        background: isSelected ? "var(--secondary)" : "transparent",
                        borderLeft: isSelected ? "3px solid var(--primary)" : "3px solid transparent",
                        }}
                        onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(21,98,47,0.04)"; }}
                        onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                        <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                            style={{
                            background: isSelected ? "var(--primary)" : "#d1d5db",
                            color:      isSelected ? "white"          : "#374151",
                            }}
                        >
                            {a.nome.split(" ").filter((n) => n.length > 1).slice(0, 2).map((n) => n[0]).join("")}
                        </div>

                        <div className="min-w-0 flex-1">
                            {/* Name row */}
                            <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold truncate text-foreground leading-tight">{a.nome}</p>
                            <div className="flex items-center gap-1 shrink-0">
                                {ev.saved   && <CheckCircle   size={12} style={{ color: "var(--primary)" }} />}
                                {ev.risco   && <AlertTriangle size={12} className="text-orange-500" />}
                                {isSelected && <ChevronRight  size={12} className="text-muted-foreground" />}
                            </div>
                            </div>

                            {/* Metric pills */}
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span
                                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                style={{ background: gradePill.bg, color: gradePill.text }}
                            >
                                {gradePill.label}
                            </span>
                            <span
                                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                style={{ background: freqPill.bg, color: freqPill.text }}
                            >
                                {freqPill.label}
                            </span>
                            </div>

                            {/* Atenção badge */}
                            {a.atencao && (
                            <div className="mt-1.5">
                                <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                                Atenção Ativa
                                </span>
                            </div>
                            )}
                        </div>
                        </div>
                    </button>
                    );
                })}
            </div>
            )}
        </div>

        {/* ── Group B — collapsed ────────────────────────────────── */}
        <div>
            <button
            onClick={() => setGroupBOpen((v) => !v)}
            className="w-full flex items-center gap-2 px-4 py-3 border-b border-border bg-card hover:bg-[#f0f2f5] transition-colors"
            >
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 shrink-0" />
            <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-muted-foreground truncate">Mecatrônica - 3ª Fase</p>
                <p className="text-xs text-muted-foreground">
                {alunosTurmaB.length} alunos · {alunosTurmaB.filter((a) => avaliacoes[a.matricula]?.saved).length} salvos
                </p>
            </div>
            {groupBOpen
                ? <ChevronDown  size={14} className="text-muted-foreground shrink-0" />
                : <ChevronRight size={14} className="text-muted-foreground shrink-0" />
            }
            </button>

            {groupBOpen && (
            <div>
                {[...alunosTurmaB]
                .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
                .map((a) => {
                    const ev         = avaliacoes[a.matricula];
                    const isSelected = selectedAluno === a.matricula;
                    const discsA     = disciplinasData[a.matricula] ?? defaultDisciplinas;
                    const acad       = { mediaSistema: discsA.reduce((s, d) => s + d.nota, 0) / discsA.length, presentes: discsA.reduce((s, d) => s + d.presentes, 0), chTotal: discsA.reduce((s, d) => s + d.ch, 0) };
                    const freq       = Math.round((acad.presentes / acad.chTotal) * 100);

                    const gradePill = acad.mediaSistema >= 7.1
                    ? { bg: "#dcfce7", text: "#15803d", label: `Média ${acad.mediaSistema.toFixed(1)}` }
                    : acad.mediaSistema >= 6.0
                    ? { bg: "#ffedd5", text: "#c2410c", label: `Média ${acad.mediaSistema.toFixed(1)}` }
                    : { bg: "#fee2e2", text: "#b91c1c", label: `Média ${acad.mediaSistema.toFixed(1)}` };

                    const freqPill = freq >= 80
                    ? { bg: "#dcfce7", text: "#15803d", label: `${freq}% presença` }
                    : freq >= 75
                    ? { bg: "#ffedd5", text: "#c2410c", label: `${freq}% presença` }
                    : { bg: "#fee2e2", text: "#b91c1c", label: `${freq}% presença` };

                    return (
                    <button
                        key={a.matricula}
                        onClick={() => setSelectedAluno(a.matricula)}
                        className="w-full text-left px-4 py-3 border-b border-border transition-colors"
                        style={{
                        background: isSelected ? "var(--secondary)" : "transparent",
                        borderLeft: isSelected ? "3px solid var(--primary)" : "3px solid transparent",
                        }}
                        onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(21,98,47,0.04)"; }}
                        onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                        <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                            style={{
                            background: isSelected ? "var(--primary)" : "#d1d5db",
                            color:      isSelected ? "white"          : "#374151",
                            }}
                        >
                            {a.nome.split(" ").filter((n) => n.length > 1).slice(0, 2).map((n) => n[0]).join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold truncate text-foreground leading-tight">{a.nome}</p>
                            <div className="flex items-center gap-1 shrink-0">
                                {ev?.saved  && <CheckCircle   size={12} style={{ color: "var(--primary)" }} />}
                                {isSelected && <ChevronRight  size={12} className="text-muted-foreground" />}
                            </div>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: gradePill.bg, color: gradePill.text }}>
                                {gradePill.label}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: freqPill.bg, color: freqPill.text }}>
                                {freqPill.label}
                            </span>
                            </div>
                            {a.atencao && (
                            <div className="mt-1.5">
                                <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                                Atenção Ativa
                                </span>
                            </div>
                            )}
                        </div>
                        </div>
                    </button>
                    );
                })}
            </div>
            )}
        </div>

        </div>
    </div>

    {/* Eval panel */}
    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

        {/* ── 1. Student identity header (absolute top) ──────────── */}
        <div
        className="rounded-xl border px-5 py-4 flex items-center justify-between"
        style={{
            background:  currentEval.risco ? "linear-gradient(135deg,#fff7ed 0%,#fff3e0 100%)" : "var(--card)",
            borderColor: currentEval.risco ? "#f97316" : "var(--border)",
            boxShadow:   currentEval.risco ? "0 0 0 1px rgba(249,115,22,0.12)" : undefined,
        }}
        >
        <div className="flex items-center gap-3">
            <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: "var(--primary)", color: "white" }}
            >
            {current.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
            <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base font-bold text-foreground leading-tight">{current.nome}</p>
                {current.atencao && (
                <span className="text-xs bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                    Atenção Pedagógica Ativa
                </span>
                )}
                {currentEval.risco && (
                <span className="text-xs bg-orange-100 text-orange-800 border border-orange-300 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <AlertTriangle size={10} /> Risco de Evasão
                </span>
                )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "monospace" }}>
                Matrícula: {current.matricula}&ensp;·&ensp;{"TDS - 2ª Fase"}
            </p>
            </div>
        </div>
        {currentEval.saved && (
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 shrink-0">
            <CheckCircle size={11} /> Parecer salvo
            </span>
        )}
        </div>

        {/* ── 2. Desempenho Acadêmico e Gestão por Disciplina ──────── */}
        {(() => {
        const discs    = disciplinasData[selectedAluno] ?? defaultDisciplinas;
        const discIdx  = selectedDisc[selectedAluno] ?? 0;
        const disc     = discs[discIdx] ?? discs[0];
        const retKey   = `${selectedAluno}|${disc.nome}`;
        const retVal   = retificadas[retKey] ?? "";
        const retNum   = parseFloat(retVal);
        const retOk    = retVal !== "" && !isNaN(retNum) && retNum >= 0 && retNum <= 10;

        // Global averages across all disciplines
        const globalMedia = discs.reduce((s, d) => s + d.nota, 0) / discs.length;
        const globalCH    = discs.reduce((s, d) => s + d.ch, 0);
        const globalPres  = discs.reduce((s, d) => s + d.presentes, 0);
        const globalFreq  = Math.round((globalPres / globalCH) * 100);

        // Active discipline frequency
        const chTotal     = disc.ch;
        const pctPres     = Math.round((disc.presentes  / chTotal) * 100);
        const pctJust     = Math.round((disc.faltasJust / chTotal) * 100);
        const pctNaoJust  = Math.round((disc.faltasNaoJust / chTotal) * 100);
        const freqDisc    = Math.round((disc.presentes  / chTotal) * 100);
        const ldbAlert    = (disc.faltasJust + disc.faltasNaoJust) / chTotal > 0.25;

        return (
            <div className="bg-card rounded-xl border border-border overflow-hidden">

            {/* Card header */}
            <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
                <div className="w-1 h-4 rounded-full shrink-0" style={{ background: "var(--primary)" }} />
                <h3 className="text-sm font-bold text-foreground">Desempenho Acadêmico e Gestão por Disciplina</h3>
                <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">SIGAA · 2026.1</span>
            </div>

            {/* ── Top Layer: Global read-only banner ─────────────── */}
            <div className="px-4 py-2 border-b border-border flex items-center gap-4 flex-wrap" style={{ background: "#f7f8fa" }}>
                <div className="flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground shrink-0"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span className="text-xs text-muted-foreground">Média Global Acumulada:</span>
                <span
                    className="text-xs font-bold"
                    style={{ color: globalMedia < 6 ? "#dc2626" : globalMedia < 7 ? "#d97706" : "#15803d" }}
                >
                    {globalMedia.toFixed(1)}
                </span>
                </div>
                <div className="w-px h-3 bg-border shrink-0" />
                <div className="flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground shrink-0"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span className="text-xs text-muted-foreground">Frequência Global Acumulada:</span>
                <span
                    className="text-xs font-bold"
                    style={{ color: globalFreq < 75 ? "#dc2626" : globalFreq < 80 ? "#d97706" : "#15803d" }}
                >
                    {globalFreq}%
                </span>
                </div>
                <span className="text-xs text-muted-foreground/70 ml-auto hidden sm:block">
                Cálculo automático projetado a partir das disciplinas matriculadas
                </span>
            </div>

            {/* ── Middle Layer: Discipline selector ──────────────── */}
            <div className="px-4 py-2.5 border-b border-border">
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                Selecione a Disciplina para Retificação:
                </label>
                <div className="relative">
                <select
                    value={discIdx}
                    onChange={(e) =>
                    setSelectedDisc((prev) => ({ ...prev, [selectedAluno]: Number(e.target.value) }))
                    }
                    className="w-full appearance-none text-sm font-medium pl-3 pr-8 py-2 rounded-lg border border-border bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                    style={{ color: "var(--foreground)" }}
                >
                    {discs.map((d, i) => (
                    <option key={i} value={i}>
                        {d.nome} ({d.ch}h) — {d.professor}
                    </option>
                    ))}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
            </div>

            {/* ── Bottom Layer: 2-column discipline editor ────────── */}
            <div className="grid grid-cols-2 divide-x divide-border" style={{ minHeight: "140px" }}>

                {/* Left — Grades */}
                <div className="px-4 py-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notas</p>

                {/* Nota bruta */}
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

                {/* Editable override */}
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Média Retificada em Conselho:</p>
                    <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min="0" max="10" step="0.1"
                        value={retVal}
                        onChange={(e) => setRetificadas((prev) => ({ ...prev, [retKey]: e.target.value }))}
                        placeholder={disc.nota.toFixed(1)}
                        className="w-20 text-xl font-bold px-2 py-1 rounded-lg border-2 outline-none transition-all placeholder:text-muted-foreground/30 bg-white"
                        style={{
                        borderColor: retOk ? "var(--primary)" : "var(--border)",
                        color:       retOk ? "var(--primary)" : "var(--foreground)",
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

                {/* Right — Attendance */}
                <div className="px-4 py-3 space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Frequência</p>
                    {ldbAlert && (
                    <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        LDB
                    </span>
                    )}
                </div>

                {/* Segmented bar */}
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
                        <div
                        style={{ width: `${pctJust}%`, background: "#d97706" }}
                        title={`${disc.faltasJust}h justificadas`}
                        />
                    )}
                    {disc.faltasNaoJust > 0 && (
                        <div
                        style={{ width: `${pctNaoJust}%`, background: "#dc2626" }}
                        title={`${disc.faltasNaoJust}h não justificadas`}
                        />
                    )}
                    </div>

                    {/* Compact legend */}
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
                    <span className="text-xs font-semibold ml-auto" style={{ color: freqDisc < 75 ? "#dc2626" : freqDisc < 80 ? "#d97706" : "#15803d" }}>
                        {freqDisc}%
                    </span>
                    </div>
                </div>

                {/* Abono button */}
                <button
                    onClick={() => { setAbonomat(selectedAluno); setAbonoText(""); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:opacity-90 active:scale-[0.98] mt-1"
                    style={{ borderColor: "var(--primary)", color: "var(--primary)", background: "var(--secondary)" }}
                >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                    Abonar Faltas / Justificar
                </button>
                </div>
            </div>
            </div>
        );
        })()}

        {/* Abono modal */}
        {abonomat && (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
            onClick={() => setAbonomat(null)}
        >
            <div
            className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            >
            <div className="px-5 py-4 border-b border-border flex items-center justify-between" style={{ background: "var(--primary)" }}>
                <div>
                <p className="text-xs text-white/60">Registro de Abono</p>
                <h3 className="text-sm font-bold text-white">Abonar Faltas / Inserir Justificativa</h3>
                <p className="text-xs text-white/60 mt-0.5" style={{ fontFamily: "monospace" }}>
                    {[...alunos, ...alunosTurmaB].find((a) => a.matricula === abonomat)?.nome} · {abonomat}
                </p>
                </div>
                <button onClick={() => setAbonomat(null)} className="text-white/60 hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="px-5 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Quantidade de horas a abonar</label>
                    <input
                    type="number" min="1" placeholder="Ex: 8"
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
        )}

        {/* ── 3. Parecer Qualitativo e Deliberações ──────────────────── */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Section header */}
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-[#7c3aed]" />
            <h3 className="text-sm font-bold text-foreground">Parecer Qualitativo e Deliberações</h3>
            <span className="ml-auto text-xs text-muted-foreground">Registrado pelo Colegiado</span>
        </div>

        <div className="px-5 py-4 space-y-5">

            {/* Risk toggle */}
            <div
            className="flex items-center justify-between p-4 rounded-xl border transition-all"
            style={{
                borderColor: currentEval.risco ? "#f97316" : "var(--border)",
                background:  currentEval.risco ? "#fff7ed" : "#f7f8fa",
                boxShadow:   currentEval.risco ? "0 0 0 3px rgba(249,115,22,0.1)" : undefined,
            }}
            >
            <div className="flex items-start gap-3">
                <AlertTriangle size={16} className={`mt-0.5 shrink-0 ${currentEval.risco ? "text-orange-500" : "text-muted-foreground/40"}`} />
                <div>
                <p className={`text-sm font-semibold ${currentEval.risco ? "text-orange-800" : "text-foreground"}`}>
                    Sinalizar Risco Iminente de Evasão Escolar
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Ativa alerta prioritário no painel de monitoramento (RF06)
                </p>
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

            {/* Observations */}
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

            {/* Encaminhamentos Ativos */}
            <div className="rounded-xl border border-border overflow-hidden">
            {/* Card header */}
            <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-[#f7f8fa]">
                <div className="flex items-center gap-2">
                <Send size={13} style={{ color: "var(--primary)" }} />
                <span className="text-xs font-bold text-foreground">Encaminhamentos Ativos do Discente</span>
                {(encAtivos[current.matricula]?.length ?? 0) > 0 && (
                    <span
                    className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "var(--primary)", color: "white" }}
                    >
                    {encAtivos[current.matricula].length}
                    </span>
                )}
                </div>
            </div>

            {/* Tag list / empty state */}
            <div className="px-4 py-3 bg-card min-h-13">
                {(encAtivos[current.matricula]?.length ?? 0) === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nenhum encaminhamento cadastrado</p>
                ) : (
                <div className="flex flex-wrap gap-2">
                    {encAtivos[current.matricula].map((enc) => {
                    const catColors: Record<string, { bg: string; text: string; border: string }> = {
                        "Encaminhar ao NAE / Pedagogia":         { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
                        "Encaminhar para Assistência Estudantil": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
                        "Agendar Atendimento Psicológico":        { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
                        "Nivelamento / Monitoria":                { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
                        "Orientação de Carreira":                 { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd" },
                        "Mediação de Conflito":                   { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
                    };
                    const col = catColors[enc.categoria] ?? { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" };
                    return (
                        <div
                        key={enc.id}
                        className="flex items-start gap-2 px-3 py-2 rounded-lg border text-xs"
                        style={{ background: col.bg, borderColor: col.border }}
                        >
                        <div className="min-w-0">
                            <p className="font-semibold leading-tight" style={{ color: col.text }}>{enc.categoria}</p>
                            {enc.descricao && (
                            <p className="text-muted-foreground mt-0.5 leading-snug">{enc.descricao}</p>
                            )}
                            {enc.servidor && (
                            <p className="mt-0.5 leading-tight" style={{ color: col.text, opacity: 0.7 }}>
                                → {enc.servidor}
                            </p>
                            )}
                        </div>
                        <button
                            onClick={() =>
                            setEncAtivos((prev) => ({
                                ...prev,
                                [current.matricula]: prev[current.matricula].filter((e) => e.id !== enc.id),
                            }))
                            }
                            className="shrink-0 mt-0.5 text-muted-foreground hover:text-red-500 transition-colors"
                            title="Remover"
                        >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                        </div>
                    );
                    })}
                </div>
                )}
            </div>

            {/* Add button */}
            <div className="px-4 py-2.5 border-t border-border bg-[#f7f8fa]">
                <button
                onClick={() => { setEncForm({ categoria: "", descricao: "", servidor: "" }); setEncModalOpen(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "var(--primary)", color: "white" }}
                >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Novo Encaminhamento
                </button>
            </div>
            </div>

            {/* Encaminhamento creation modal */}
            {encModalOpen && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
                onClick={() => setEncModalOpen(false)}
            >
                <div
                className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                >
                {/* Modal header */}
                <div className="px-5 py-4 border-b border-border flex items-center justify-between" style={{ background: "var(--primary)" }}>
                    <div>
                    <p className="text-xs text-white/60">Conselho de Classe · {current.nome}</p>
                    <h3 className="text-sm font-bold text-white mt-0.5">Novo Encaminhamento</h3>
                    </div>
                    <button onClick={() => setEncModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                {/* Modal body */}
                <div className="px-5 py-4 space-y-4">

                    {/* Categoria */}
                    <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Categoria Proposta <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <FileText size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <select
                        value={encForm.categoria}
                        onChange={(e) => setEncForm((f) => ({ ...f, categoria: e.target.value }))}
                        className="w-full appearance-none text-sm pl-9 pr-8 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                        style={{ color: encForm.categoria ? "var(--foreground)" : "var(--muted-foreground)" }}
                        >
                        <option value="">Selecione a categoria...</option>
                        {encaminhamentos.slice(1).map((o) => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                    </div>

                    {/* Descrição */}
                    <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Descrição da Ação <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={4}
                        value={encForm.descricao}
                        onChange={(e) => setEncForm((f) => ({ ...f, descricao: e.target.value }))}
                        placeholder="Descreva a ação pedagógica proposta, os objetivos esperados e o prazo sugerido..."
                        className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground leading-relaxed transition-all"
                    />
                    </div>

                    {/* Servidor */}
                    <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Servidor Responsável
                        <span className="font-normal text-muted-foreground ml-1">(vinculado ao perfil SIAPE)</span>
                    </label>
                    <div className="relative">
                        <UserCheck size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <select
                        value={encForm.servidor}
                        onChange={(e) => setEncForm((f) => ({ ...f, servidor: e.target.value }))}
                        className="w-full appearance-none text-sm pl-9 pr-8 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                        style={{ color: encForm.servidor ? "var(--foreground)" : "var(--muted-foreground)" }}
                        >
                        <option value="">Selecione o servidor...</option>
                        {servidores.slice(1).map((o) => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                    </div>
                </div>

                {/* Modal footer */}
                <div className="px-5 py-3.5 border-t border-border bg-[#f7f8fa] flex gap-2 justify-end">
                    <button
                    onClick={() => setEncModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                    >
                    Cancelar
                    </button>
                    <button
                    disabled={!encForm.categoria || !encForm.descricao}
                    onClick={() => {
                        const novo = { id: encNextId.current++, ...encForm };
                        setEncAtivos((prev) => ({
                        ...prev,
                        [current.matricula]: [...(prev[current.matricula] ?? []), novo],
                        }));
                        setEncModalOpen(false);
                    }}
                    className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "var(--primary)" }}
                    >
                    Salvar
                    </button>
                </div>
                </div>
            </div>
            )}

            {/* Save actions */}
            <div className="flex items-center justify-between pt-1 border-t border-border">
            <p className="text-xs text-muted-foreground">
                {currentEval.saved ? "Parecer registrado com sucesso." : "Preencha os campos e salve o parecer."}
            </p>
            <div className="flex gap-2">
                {currentEval.saved && (
                <button
                    onClick={() => {
                    const allAlunos = [...alunos, ...alunosTurmaB];
                    const idx = allAlunos.findIndex((a) => a.matricula === current.matricula);
                    if (idx < allAlunos.length - 1) setSelectedAluno(allAlunos[idx + 1].matricula);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-border text-foreground hover:bg-muted transition-colors"
                >
                    Próximo aluno <ChevronRight size={12} />
                </button>
                )}
                <button
                onClick={() => saveEval(current.matricula)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "var(--primary)" }}
                >
                <Save size={13} />
                Salvar Parecer
                </button>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
  );
}
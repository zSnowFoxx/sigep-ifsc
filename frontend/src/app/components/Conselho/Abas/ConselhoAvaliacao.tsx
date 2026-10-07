import React, { useState } from "react";
import type { Aluno, AlunoEval, Disciplina, TurmaData } from "../../../types/conselho";

import { ListaAlunos } from "./Avaliacao/ListaAlunos";
import { AvaliacaoHeader } from "./Avaliacao/AvaliacaoHeader";
import { AvaliacaoDesempenho } from "./Avaliacao/AvaliacaoDesempenho";
import { ModalAbono } from "../Modals/ModalAbono";
import { ParecerQualitativo } from "./Avaliacao/ParecerQualitativo";

interface ConselhoAvaliacaoProps {
  avaliacoes: Record<string, AlunoEval>;
  turmas: TurmaData[];
  alunos: Aluno[];
  openTurmas: Record<number, boolean>;
  setOpenTurmas: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  selectedAluno: string;
  setSelectedAluno: (matricula: string) => void;
  disciplinasData: Record<string, Disciplina[]>;
  selectedDisc: Record<string, number>;
  setSelectedDisc: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  retificadas: Record<string, string>;
  setRetificadas: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  abonomat: string | null;
  setAbonomat: React.Dispatch<React.SetStateAction<string | null>>;
  abonoText: string;
  setAbonoText: React.Dispatch<React.SetStateAction<string>>;
  updateEval: (matricula: string, field: keyof AlunoEval, value: any) => void;
  saveEval: (matricula: string) => void;
  salvando: boolean;
}

export default function ConselhoAvaliacao({
  avaliacoes,
  turmas,
  alunos,
  openTurmas,
  setOpenTurmas,
  selectedAluno,
  setSelectedAluno,
  disciplinasData,
  selectedDisc,
  setSelectedDisc,
  retificadas,
  setRetificadas,
  abonomat,
  setAbonomat,
  abonoText,
  setAbonoText,
  updateEval,
  saveEval,
  salvando,
}: ConselhoAvaliacaoProps) {
  const current = alunos.find((a) => a.matricula === selectedAluno) ?? alunos[0];
  const currentEval = avaliacoes[current?.matricula] ?? { saved: false, risco: false, obs: "", encaminhamento: "", acao: "", servidor: "" };
  const [encForm, setEncForm] = useState({ categoria: "", descricao: "", servidor: "" });

  if (!current) {
    return (
      <p className="text-sm text-muted-foreground text-center py-16">
        Nenhum aluno matriculado nas turmas deste conselho.
      </p>
    );
  }

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      {/* Sidebar - Lista de Alunos */}
      <ListaAlunos
        turmas={turmas}
        totalAlunos={alunos.length}
        avaliacoes={avaliacoes}
        openTurmas={openTurmas}
        setOpenTurmas={setOpenTurmas}
        selectedAluno={current.matricula}
        setSelectedAluno={setSelectedAluno}
        disciplinasData={disciplinasData}
      />

      {/* Painel de Avaliação Principal */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {/* Cabeçalho do Aluno */}
        <AvaliacaoHeader current={current} currentEval={currentEval} />

        {/* Desempenho e Disciplinas */}
        <AvaliacaoDesempenho
          selectedAluno={current.matricula}
          disciplinasData={disciplinasData}
          selectedDisc={selectedDisc}
          setSelectedDisc={setSelectedDisc}
          retificadas={retificadas}
          setRetificadas={setRetificadas}
          setAbonomat={setAbonomat}
          setAbonoText={setAbonoText}
        />

        {/* Modal de Abono */}
        <ModalAbono
          abonomat={abonomat}
          setAbonomat={setAbonomat}
          abonoText={abonoText}
          setAbonoText={setAbonoText}
          alunos={alunos}
        />

        {/* Parecer Qualitativo, Encaminhamentos e Deliberações */}
        <ParecerQualitativo
          current={current}
          currentEval={currentEval}
          updateEval={updateEval}
          saveEval={saveEval}
          salvando={salvando}
          alunos={alunos}
          setSelectedAluno={setSelectedAluno}
          encForm={encForm}
          setEncForm={setEncForm}
        />
      </div>
    </div>
  );
}

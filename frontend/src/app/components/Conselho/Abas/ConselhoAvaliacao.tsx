import React, { useState } from "react";
import type { Aluno, AlunoEval, Disciplina } from "../../../types/conselho";

import { ListaAlunos } from "./Avaliacao/ListaAlunos";
import { AvaliacaoHeader } from "./Avaliacao/AvaliacaoHeader";
import { AvaliacaoDesempenho } from "./Avaliacao/AvaliacaoDesempenho";
import { ModalAbono } from "../Modals/ModalAbono";
import { ParecerQualitativo } from "./Avaliacao/ParecerQualitativo";

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
  saveEval
}: ConselhoAvaliacaoProps) {
  const current = [...alunos, ...alunosTurmaB].find((a) => a.matricula === selectedAluno) ?? alunos[0];
  const currentEval = avaliacoes[selectedAluno] ?? { saved: false, risco: false, obs: "" };
  const [encForm, setEncForm] = useState({ categoria: "", descricao: "", servidor: "" });

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      {/* Sidebar - Lista de Alunos */}
      <ListaAlunos
        alunos={alunos}
        alunosTurmaB={alunosTurmaB}
        avaliacoes={avaliacoes}
        groupAOpen={groupAOpen}
        setGroupAOpen={setGroupAOpen}
        groupBOpen={groupBOpen}
        setGroupBOpen={setGroupBOpen}
        selectedAluno={selectedAluno}
        setSelectedAluno={setSelectedAluno}
        disciplinasData={disciplinasData}
        defaultDisciplinas={defaultDisciplinas}
      />

      {/* Painel de Avaliação Principal */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {/* Cabeçalho do Aluno */}
        <AvaliacaoHeader current={current} currentEval={currentEval} />

        {/* Desempenho e Disciplinas */}
        <AvaliacaoDesempenho
          selectedAluno={selectedAluno}
          disciplinasData={disciplinasData}
          defaultDisciplinas={defaultDisciplinas}
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
          alunosTurmaB={alunosTurmaB}
        />

        {/* Parecer Qualitativo, Encaminhamentos e Deliberações */}
        <ParecerQualitativo
          current={current}
          currentEval={currentEval}
          updateEval={updateEval}
          saveEval={saveEval}
          alunos={alunos}
          alunosTurmaB={alunosTurmaB}
          setSelectedAluno={setSelectedAluno}
          encForm={encForm}
          setEncForm={setEncForm}
        />
      </div>
    </div>
  );
}
import React from "react";
import type { CategoryKey } from "../../types/cadastros";
import { SearchInput, FilterSelect } from "../ui/FilterPrimitives";

interface CadastrosFiltersProps {
  activeTab: CategoryKey;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  // Estados de filtro
  fStatus: string; setFStatus: (val: string) => void;
  fCargo: string; setFCargo: (val: string) => void;
  fFuncao: string; setFFuncao: (val: string) => void;
  fTipo: string; setFTipo: (val: string) => void;
  fGrau: string; setFGrau: (val: string) => void;
  fModalidade: string; setFModalidade: (val: string) => void;
  fDiscCurso: string; setFDiscCurso: (val: string) => void;
  fFase: string; setFFase: (val: string) => void;
  fTurmaPer: string; setFTurmaPer: (val: string) => void;
  fTurmaCurso: string; setFTurmaCurso: (val: string) => void;
  fDiarioTurma: string; setFDiarioTurma: (val: string) => void;
  fDiarioProf: string; setFDiarioProf: (val: string) => void;
  // Listas para selects
  allFuncoes: string[];
  discCursos: string[];
  discFases: string[];
  turmaPers: string[];
  turmaCursos: string[];
  diarioTurmas: string[];
  professoresList: string[];
}

export const CadastrosFilters: React.FC<CadastrosFiltersProps> = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  fStatus, setFStatus,
  fCargo, setFCargo,
  fFuncao, setFFuncao,
  fTipo, setFTipo,
  fGrau, setFGrau,
  fModalidade, setFModalidade,
  fDiscCurso, setFDiscCurso,
  fFase, setFFase,
  fTurmaPer, setFTurmaPer,
  fTurmaCurso, setFTurmaCurso,
  fDiarioTurma, setFDiarioTurma,
  fDiarioProf, setFDiarioProf,
  allFuncoes,
  discCursos,
  discFases,
  turmaPers,
  turmaCursos,
  diarioTurmas,
  professoresList,
}) => {
  return (
    <div className="flex items-center gap-3 flex-wrap px-5 py-3 border-b border-gray-100 bg-[#fdfdfd]">
      {activeTab === "alunos" && (
        <>
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Buscar por nome ou matrícula..." />
          <FilterSelect value={fStatus} onChange={setFStatus} placeholder="Status: Todos" options={["Ativo", "Inativo"]} />
        </>
      )}

      {activeTab === "servidores" && (
        <>
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Buscar por nome, SIAPE ou e-mail..." />
          <FilterSelect value={fCargo} onChange={setFCargo} placeholder="Cargo: Todos" options={["Professor", "Coordenador de Curso", "Equipe Pedagógica/NAE", "Servidor Geral"]} />
          <FilterSelect value={fFuncao} onChange={setFFuncao} placeholder="Função/Área: Todas" options={allFuncoes} />
        </>
      )}

      {activeTab === "cursos" && (
        <>
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Buscar por nome do curso..." />
          <FilterSelect value={fTipo} onChange={setFTipo} placeholder="Tipo: Todos" options={["Técnico", "Superior", "Pós-Graduação"]} />
          <FilterSelect value={fGrau} onChange={setFGrau} placeholder="Grau: Todos" options={["Integrado ao EM", "Concomitante", "Subsequente", "Bacharelado", "Licenciatura", "Tecnólogo"]} />
          <FilterSelect value={fModalidade} onChange={setFModalidade} placeholder="Modalidade: Todas" options={["Presencial", "EAD", "Semipresencial"]} />
        </>
      )}

      {activeTab === "disciplinas" && (
        <>
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Buscar por sigla ou nome da disciplina..." />
          <FilterSelect value={fDiscCurso} onChange={setFDiscCurso} placeholder="Curso: Todos" options={discCursos} />
          <FilterSelect value={fFase} onChange={setFFase} placeholder="Fase: Todas" options={discFases} />
        </>
      )}

      {activeTab === "turmas" && (
        <>
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Buscar por nome da turma..." />
          <FilterSelect value={fTurmaPer} onChange={setFTurmaPer} placeholder="Período: Todos" options={turmaPers} />
          <FilterSelect value={fTurmaCurso} onChange={setFTurmaCurso} placeholder="Curso: Todos" options={turmaCursos} />
        </>
      )}

      {activeTab === "diarios" && (
        <>
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Buscar por código ou disciplina..." />
          <FilterSelect value={fDiarioTurma} onChange={setFDiarioTurma} placeholder="Turma: Todas" options={diarioTurmas} />
          <FilterSelect value={fDiarioProf} onChange={setFDiarioProf} placeholder="Professor: Todos" options={professoresList} />
        </>
      )}
    </div>
  );
};
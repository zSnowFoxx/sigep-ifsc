import type { GravidadeDemanda, TurmaData, TurmaForm } from "../../../types/conselho";
import { DemandasTurma } from "./Demandas/DemandasTurma";
import { DemandasPautas } from "./Demandas/DemandasPautas";

interface ConselhoDemandasProps {
  turmasData: TurmaData[];
  activeTurmaIdx: number;
  setActiveTurmaIdx: (idx: number) => void;
  currentTurmaD: TurmaData;
  isInter: boolean;
  editFields: Set<string>;
  toggleEditField: (field: string) => void;
  form: TurmaForm;
  updateForm: (fields: Partial<TurmaForm>) => void;
  allPontos: string[];
  togglePonto: (item: string) => void;
  allDific: string[];
  toggleDific: (item: string) => void;
  removeDemanda: (id: number) => void;
  addDemanda: (situacao: string, gravidade: GravidadeDemanda) => void;
  salvando: boolean;
  onSalvar: () => void;
}

export default function ConselhoDemandas({
  turmasData,
  activeTurmaIdx,
  setActiveTurmaIdx,
  currentTurmaD,
  isInter,
  editFields,
  toggleEditField,
  form,
  updateForm,
  allPontos,
  togglePonto,
  allDific,
  toggleDific,
  removeDemanda,
  addDemanda,
  salvando,
  onSalvar,
}: ConselhoDemandasProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-6 space-y-4">
        <DemandasTurma
          turmasData={turmasData}
          activeTurmaIdx={activeTurmaIdx}
          setActiveTurmaIdx={setActiveTurmaIdx}
          currentTurmaD={currentTurmaD}
        />

        <DemandasPautas
          currentTurmaD={currentTurmaD}
          activeTurmaIdx={activeTurmaIdx}
          isInter={isInter}
          editFields={editFields}
          toggleEditField={toggleEditField}
          form={form}
          updateForm={updateForm}
          allPontos={allPontos}
          togglePonto={togglePonto}
          allDific={allDific}
          toggleDific={toggleDific}
          removeDemanda={removeDemanda}
          addDemanda={addDemanda}
          salvando={salvando}
          onSalvar={onSalvar}
        />
      </div>
    </div>
  );
}
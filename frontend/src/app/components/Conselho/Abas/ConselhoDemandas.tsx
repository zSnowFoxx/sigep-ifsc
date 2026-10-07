import type { TurmaData, TurmaForm } from "../../../types/conselho";
import { DemandasTurma } from "./Demandas/DemandasTurma";
import { DemandasPautas } from "./Demandas/DemandasPautas";

interface ConselhoDemandasProps {
  turmasData: TurmaData[];
  activeTurmaIdx: number;
  setActiveTurmaIdx: (idx: number) => void;
  currentTurmaD: TurmaData;
  isInter: boolean;
  editFields: Set<string>;
  setEditFields: (fields: Set<string>) => void;
  toggleEditField: (field: string) => void;
  form: TurmaForm;
  updateForm: (fields: Partial<TurmaForm>) => void;
  allPontos: string[];
  togglePonto: (item: string) => void;
  allDific: string[];
  toggleDific: (item: string) => void;
  removeDemanda: (id: number) => void;
  addDemanda?: () => void;
}

export default function ConselhoDemandas({
  turmasData,
  activeTurmaIdx,
  setActiveTurmaIdx,
  currentTurmaD,
  isInter,
  editFields,
  setEditFields,
  toggleEditField,
  form,
  updateForm,
  allPontos,
  togglePonto,
  allDific,
  toggleDific,
  removeDemanda,
  addDemanda,
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
          setEditFields={setEditFields}
          toggleEditField={toggleEditField}
          form={form}
          updateForm={updateForm}
          allPontos={allPontos}
          togglePonto={togglePonto}
          allDific={allDific}
          toggleDific={toggleDific}
          removeDemanda={removeDemanda}
          addDemanda={addDemanda}
        />
      </div>
    </div>
  );
}
import type { EncItemData, RegistroDocente, TurmaData } from "../../../types/conselho";
import { RegistrosLista } from "./Registros/RegistrosLista";
import { EncaminhamentosLista } from "./Registros/EncaminhamentosLista";

interface ConselhosRegistrosProps {
  registros: RegistroDocente[];
  encList: EncItemData[];
  turmasData: TurmaData[];
  setNovoRegOpen: (open: boolean) => void;
  setNovoEncOpen: (open: boolean) => void;
  openEncDetail: (enc: EncItemData) => void;
}

export default function ConselhosRegistros({
  registros,
  encList,
  turmasData,
  setNovoRegOpen,
  setNovoEncOpen,
  openEncDetail,
}: ConselhosRegistrosProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-6 space-y-8">
        <RegistrosLista
          registros={registros}
          setNovoRegOpen={setNovoRegOpen}
        />

        <EncaminhamentosLista
          encList={encList}
          turmasData={turmasData}
          setNovoEncOpen={setNovoEncOpen}
          openEncDetail={openEncDetail}
        />
      </div>
    </div>
  );
}
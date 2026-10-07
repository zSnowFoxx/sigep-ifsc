import type { Professor } from "../../../types/conselho";
import { ParticipantesBarra } from "./Participantes/ParticipantesBarra";
import { ParticipantesLista } from "./Participantes/ParticipantesLista";
import { ParticipantesFooter } from "./Participantes/ParticipantesFooter";

interface ConselhoParticipantesProps {
  professores: Professor[];
  onTogglePresenca: (index: number) => void;
}

export default function ConselhoParticipantes({
  professores,
  onTogglePresenca,
}: ConselhoParticipantesProps) {
  const presentCount = professores.filter((p) => p.presente).length;

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <div className="max-w-3xl mx-auto space-y-5">
        <ParticipantesBarra
          presentCount={presentCount}
          totalCount={professores.length}
        />

        <ParticipantesLista
          professores={professores}
          onTogglePresenca={onTogglePresenca}
        />

        <ParticipantesFooter />
      </div>
    </div>
  );
}

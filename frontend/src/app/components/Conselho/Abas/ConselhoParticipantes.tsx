import React from "react";
import type { Professor } from "../../../types/conselho";
import { ParticipantesBarra } from "./Participantes/ParticipantesBarra";
import { ParticipantesLista } from "./Participantes/ParticipantesLista";
import { ParticipantesFooter } from "./Participantes/ParticipantesFooter";

interface ConselhoParticipantesProps {
  professores: Professor[];
  presenteToggle: Record<number, boolean>;
  setPresenteToggle: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

export default function ConselhoParticipantes({
  professores,
  presenteToggle,
  setPresenteToggle,
}: ConselhoParticipantesProps) {
  const presentCount = Object.values(presenteToggle).filter(Boolean).length;

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <div className="max-w-3xl mx-auto space-y-5">
        <ParticipantesBarra
          presentCount={presentCount}
          totalCount={professores.length}
        />

        <ParticipantesLista
          professores={professores}
          presenteToggle={presenteToggle}
          setPresenteToggle={setPresenteToggle}
        />

        <ParticipantesFooter />
      </div>
    </div>
  );
}
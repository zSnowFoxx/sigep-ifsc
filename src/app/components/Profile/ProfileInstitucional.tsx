import { User } from "lucide-react";
import type { UserProfile } from "../../types/auth";
import { Card } from "./ProfileCard";
import { InfoTile } from "./ProfileInfo";

interface ProfileInstitutionalProps {
  profile: UserProfile;
}

export function ProfileInstitutional({ profile }: ProfileInstitutionalProps) {
  const vinculoLabel =
    profile.role === "Professor"
      ? "Disciplinas Lecionadas"
      : profile.role === "Coordenador de Curso"
      ? "Curso Coordenado"
      : null;

  return (
    <Card title="Identificação Institucional" icon={User}>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <InfoTile label="Nome Completo" value={profile.name} />
        </div>
        <InfoTile
          label="Matrícula SIAPE"
          value={
            <span style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>
              {profile.siape}
            </span>
          }
        />

        <div className="col-span-2">
          <InfoTile label="E-mail Institucional" value={profile.email} />
        </div>
        <InfoTile label="Cargo / Função" value={profile.role} />

        {vinculoLabel && (
          <div className="col-span-3">
            <div
              className="flex flex-col gap-2.5 px-4 py-3.5 rounded-xl border"
              style={{ borderColor: "#d1e8d9", background: "#f8faf9" }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {vinculoLabel}
              </span>
              {profile.role === "Professor" && profile.disciplines?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.disciplines.map((d) => (
                    <span
                      key={d}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ background: "#e8f0eb", color: "#0f4a23" }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-semibold text-gray-800">
                  {profile.course ?? "—"}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
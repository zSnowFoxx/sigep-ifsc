import { GraduationCap } from "lucide-react";
import type { UserProfile } from "../../types/auth";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0b3d1e 0%, #0f4a23 50%, #15622f 100%)",
        boxShadow: "0 4px 20px rgba(15,74,35,0.22)",
      }}
    >
      <div className="relative px-8 py-7 flex items-center gap-7">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "2px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(4px)",
          }}
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xl font-bold text-white leading-tight">{profile.name}</p>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>
            {profile.email}
          </p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: "rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              {profile.role}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              SIAPE: {profile.siape}
            </span>
          </div>
        </div>

        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 opacity-40"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <GraduationCap size={22} color="white" />
        </div>
      </div>
    </div>
  );
}
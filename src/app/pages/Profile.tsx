import { LogOut } from "lucide-react";
import type { UserProfile } from "../types/auth";
import { Card } from "../components/Profile/ProfileCard";
import { ProfileHeader } from "../components/Profile/ProfileHeader";
import { ProfileInstitutional } from "../components/Profile/ProfileInstitucional";
import { ProfilePassword } from "../components/Profile/ProfilePassword";

interface Props {
  profile: UserProfile;
  onLogout: () => void;
}

export default function Profile({ profile, onLogout }: Props) {
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="w-full max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configurações da Conta e Segurança
          </p>
        </div>

        <ProfileHeader profile={profile} />

        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: "minmax(0,3fr) minmax(0,2fr)" }}
        >
          <ProfileInstitutional profile={profile} />

          <div className="flex flex-col gap-5">
            <ProfilePassword email={profile.email} />

            <Card title="Gerenciamento de Sessão" icon={LogOut}>
              <div className="space-y-4">
                <div className="px-4 py-3.5 rounded-xl border" style={{ borderColor: "#fee2e2", background: "#fff8f8" }}>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Sessão ativa</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Sair encerrará sua sessão e redirecionará para a tela de login. Trabalho não salvo será perdido.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 transition-all hover:bg-red-50 text-red-600 border-red-600"
                >
                  <LogOut size={14} />
                  Sair da Conta
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
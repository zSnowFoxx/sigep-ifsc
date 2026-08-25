import { useState } from "react";
import { Check, CheckCircle2, LogOut, ShieldCheck, User, GraduationCap } from "lucide-react";
import type { UserProfile } from "../types/auth";
import { passwordMeetsRules } from "../utils/authUtils";
import { Card } from "../components/Profile/Card";
import { InfoTile } from "../components/Profile/InfoTile";
import { PwInput } from "../components/Profile/PwInput";
import { StrengthRule } from "../components/Profile/StrengthRule";interface Props {
  profile: UserProfile;
  onLogout: () => void;
}

export default function MeuPerfil({ profile, onLogout }: Props) {
  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join("");

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPwError, setCurrentPwError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const pwStrong = passwordMeetsRules(newPw);

  const handleSavePassword = async () => {
    setCurrentPwError("");
    setConfirmError("");

    if (!pwStrong) return;
    if (newPw !== confirmPw) {
      setConfirmError("As senhas não coincidem.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("http://localhost:3001/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          currentPassword: currentPw,
          newPassword: newPw,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao alterar a senha.");
      }

      setSaveSuccess(true);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setCurrentPwError(err.message || "Erro de conexão com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  const vinculoLabel =
    profile.role === "Professor"
      ? "Disciplinas Lecionadas"
      : profile.role === "Coordenador de Curso"
      ? "Curso Coordenado"
      : null;

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="w-full max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configurações da Conta e Segurança
          </p>
        </div>

        <div
          className="w-full rounded-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0b3d1e 0%, #0f4a23 50%, #15622f 100%)",
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
              <p className="text-xl font-bold text-white leading-tight">
                {profile.name}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
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

        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: "minmax(0,3fr) minmax(0,2fr)" }}
        >
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

          <div className="flex flex-col gap-5">
            <Card title="Segurança e Alterar Senha" icon={ShieldCheck}>
              {saveSuccess && (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border mb-5 text-sm"
                  style={{ background: "#f0faf4", borderColor: "#bbf7d0", color: "#166534" }}
                >
                  <CheckCircle2 size={15} className="shrink-0" />
                  <span className="font-semibold">Senha atualizada com sucesso!</span>
                </div>
              )}

              <div className="space-y-4">
                <PwInput
                  label="Senha Atual"
                  value={currentPw}
                  onChange={(v) => {
                    setCurrentPw(v);
                    setCurrentPwError("");
                  }}
                  show={showCurrent}
                  onToggleShow={() => setShowCurrent((s) => !s)}
                  error={currentPwError}
                />

                <PwInput
                  label="Nova Senha"
                  value={newPw}
                  onChange={setNewPw}
                  show={showNew}
                  onToggleShow={() => setShowNew((s) => !s)}
                />

                {newPw.length > 0 && (
                  <div
                    className="space-y-1.5 px-3 py-3 rounded-xl border"
                    style={{ borderColor: "#e5e7eb", background: "#fafbfc" }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Requisitos de segurança
                    </p>
                    <StrengthRule ok={newPw.length >= 8} label="Mínimo de 8 caracteres" />
                    <StrengthRule ok={/\d/.test(newPw)} label="Pelo menos 1 número" />
                    <StrengthRule ok={/[@#$%^&*!?]/.test(newPw)} label="Caractere especial (@, #, $, etc.)" />
                  </div>
                )}

                <PwInput
                  label="Confirmar Nova Senha"
                  value={confirmPw}
                  onChange={(v) => {
                    setConfirmPw(v);
                    setConfirmError("");
                  }}
                  show={showConfirm}
                  onToggleShow={() => setShowConfirm((s) => !s)}
                  error={confirmError}
                />

                <button
                  type="button"
                  onClick={handleSavePassword}
                  disabled={saving || !currentPw || !pwStrong || !confirmPw}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #0f4a23 0%, #15622f 100%)",
                    boxShadow: "0 4px 12px rgba(15,74,35,0.28)",
                  }}
                >
                  {saving ? "Salvando..." : <><Check size={14} /> Salvar Nova Senha</>}
                </button>
              </div>
            </Card>

            <Card title="Gerenciamento de Sessão" icon={LogOut}>
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 transition-all hover:bg-red-50 text-red-600 border-red-600"
              >
                <LogOut size={14} />
                Sair da Conta
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
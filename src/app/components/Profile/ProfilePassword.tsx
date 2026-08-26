import { useState } from "react";
import { Check, CheckCircle2, ShieldCheck } from "lucide-react";
import { passwordMeetsRules } from "../../utils/authUtils";
import { changePasswordApi } from "../../services/profileService";
import { Card } from "./ProfileCard";
import { PwInput } from "./ProfilePasswordInput";
import { StrengthRule } from "./ProfilePasswordStrenght";

interface ProfilePasswordProps {
  email: string;
}

export function ProfilePassword({ email }: ProfilePasswordProps) {
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
      await changePasswordApi(email, currentPw, newPw);
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

  return (
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
  );
}
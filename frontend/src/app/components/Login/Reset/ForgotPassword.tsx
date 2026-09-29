import { Lock, Eye, EyeOff, Shield, ArrowLeft, AlertTriangle } from "lucide-react";
import { GreenBtn } from "../../ui/GreenBtn";
import { OutlineBtn } from "../../ui/OutlineBtn";
import { FieldInput } from "../../ui/FieldInput";
import { PasswordStrength } from "../../ui/PasswordStrength";

interface ForgotNewPasswordProps {
  newPw: string;
  setNewPw: (v: string) => void;
  confirmPw: string;
  setConfirmPw: (v: string) => void;
  showPw: boolean;
  setShowPw: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirm: boolean;
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  resetError: string;
  loading: boolean;
  pwStrong: boolean;
  onReset: () => void;
  onBackStep: () => void;
}

export function ForgotNewPassword({
  newPw, setNewPw, confirmPw, setConfirmPw, showPw, setShowPw,
  showConfirm, setShowConfirm, resetError, loading, pwStrong, onReset, onBackStep
}: ForgotNewPasswordProps) {
  return (
    <>
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Definir Nova Senha</p>
        <p className="text-xs text-gray-500">Escolha uma senha segura para proteger sua conta.</p>
      </div>

      <FieldInput
        label="Nova Senha"
        type={showPw ? "text" : "password"}
        value={newPw}
        onChange={setNewPw}
        placeholder="••••••••"
        icon={Lock}
        suffix={
          <button type="button" onClick={() => setShowPw((v) => !v)} tabIndex={-1} className="text-gray-400 hover:text-gray-600">
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />
      {newPw.length > 0 && <PasswordStrength password={newPw} />}

      <FieldInput
        label="Confirmar Nova Senha"
        type={showConfirm ? "text" : "password"}
        value={confirmPw}
        onChange={setConfirmPw}
        placeholder="••••••••"
        icon={Lock}
        error={!!confirmPw && confirmPw !== newPw}
        suffix={
          <button type="button" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1} className="text-gray-400 hover:text-gray-600">
            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />

      {resetError && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertTriangle size={11} /> {resetError}
        </p>
      )}

      <GreenBtn type="button" loading={loading} onClick={onReset} disabled={!pwStrong || newPw !== confirmPw}>
        <Shield size={14} /> Redefinir Senha
      </GreenBtn>
      <OutlineBtn onClick={onBackStep}>
        <ArrowLeft size={14} /> Voltar
      </OutlineBtn>
    </>
  );
}
import { Lock, EyeOff, Eye, AlertTriangle, Check, ArrowLeft } from "lucide-react";
import { FieldInput } from "../../ui/FieldInput";
import { PasswordStrength } from "../../ui/PasswordStrength";
import { GreenBtn } from "../../ui/GreenBtn";
import { OutlineBtn } from "../../ui/OutlineBtn";

interface RegisterPasswordProps {
  password: string;
  setPassword: (v: string) => void;
  confirmPw: string;
  setConfirmPw: (v: string) => void;
  showPw: boolean;
  setShowPw: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirm: boolean;
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  finalError: string;
  finalLoading: boolean;
  onFinalize: () => void;
  onBackStep: () => void;
  onBackLogin: () => void;
}

export function RegisterPassword({
  password, setPassword, confirmPw, setConfirmPw,
  showPw, setShowPw, showConfirm, setShowConfirm,
  finalError, finalLoading, onFinalize, onBackStep, onBackLogin
}: RegisterPasswordProps) {
  const pwStrong = password.length >= 8 && /\d/.test(password) && /[@#$%^&*!?]/.test(password);

  return (
    <>
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Criação de Senha</p>
        <p className="text-xs text-gray-500">Defina uma senha segura para acessar o SIGEP.</p>
      </div>

      <FieldInput
        label="Criar Senha"
        type={showPw ? "text" : "password"}
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        icon={Lock}
        suffix={
          <button type="button" onClick={() => setShowPw((v) => !v)} tabIndex={-1} className="text-gray-400 hover:text-gray-600">
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />

      {password.length > 0 && <PasswordStrength password={password} />}

      <FieldInput
        label="Confirmar Senha"
        type={showConfirm ? "text" : "password"}
        value={confirmPw}
        onChange={setConfirmPw}
        placeholder="••••••••"
        icon={Lock}
        error={!!confirmPw && confirmPw !== password}
        suffix={
          <button type="button" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1} className="text-gray-400 hover:text-gray-600">
            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />

      {confirmPw && confirmPw !== password && (
        <p className="text-xs text-red-600 -mt-3 flex items-center gap-1">
          <AlertTriangle size={11} /> As senhas não coincidem.
        </p>
      )}

      {finalError && (
        <div className="flex items-center gap-2 text-xs text-red-600">
          <AlertTriangle size={12} className="shrink-0" /> {finalError}
        </div>
      )}

      <div className="flex gap-3">
        <OutlineBtn onClick={onBackStep}><ArrowLeft size={14} /> Voltar</OutlineBtn>
        <GreenBtn type="button" loading={finalLoading} onClick={onFinalize} disabled={!pwStrong || password !== confirmPw}>
          <Check size={14} /> Finalizar Cadastro
        </GreenBtn>
      </div>

      <OutlineBtn onClick={onBackLogin}><ArrowLeft size={14} /> Voltar para Login</OutlineBtn>
    </>
  );
}
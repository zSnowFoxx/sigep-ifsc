import { CheckCircle2, AlertTriangle, Check, ArrowLeft } from "lucide-react";
import { GreenBtn } from "../../ui/GreenBtn";
import { OutlineBtn } from "../../ui/OutlineBtn";
import { OtpBoxes } from "../../ui/OtpBoxes";
import { OtpTimer } from "../../ui/OtpTimer";

interface ForgotVerifyProps {
  email: string;
  otpValue: string;
  setOtpValue: (v: string) => void;
  otpError: string;
  setOtpError: (v: string) => void;
  timer: number;
  loading: boolean;
  onVerify: () => void;
  onBackStep: () => void;
}

export function ForgotVerify({
  email, otpValue, setOtpValue, otpError, setOtpError, timer, loading, onVerify, onBackStep
}: ForgotVerifyProps) {
  return (
    <>
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Verificação de Código</p>
        <p className="text-xs text-gray-500">Enviamos um código de verificação para o seu e-mail cadastrado.</p>
      </div>

      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border text-xs" style={{ background: "#f0faf4", borderColor: "#bbf7d0", color: "#166534" }}>
        <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
        <span>Código enviado para <strong>{email}</strong>. (Use <strong>123456</strong> para teste).</span>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-3 text-center">Código de verificação (6 dígitos)</label>
        <OtpBoxes value={otpValue} onChange={(v) => { setOtpValue(v); setOtpError(""); }} />
        {otpError && (
          <p className="text-xs text-red-600 text-center mt-2 flex items-center justify-center gap-1">
            <AlertTriangle size={11} /> {otpError}
          </p>
        )}
        <OtpTimer seconds={timer} onResend={onBackStep} />
      </div>

      <GreenBtn type="button" loading={loading} onClick={onVerify} disabled={otpValue.replace(/\s/g, "").length < 6}>
        <Check size={14} /> Verificar Código
      </GreenBtn>
      <OutlineBtn onClick={onBackStep}>
        <ArrowLeft size={14} /> Voltar
      </OutlineBtn>
    </>
  );
}
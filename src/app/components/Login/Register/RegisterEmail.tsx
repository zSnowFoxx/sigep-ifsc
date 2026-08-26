import { Mail, Shield, CheckCircle2, AlertTriangle, Check, ArrowLeft } from "lucide-react";
import { GreenBtn } from "../../ui/GreenBtn";
import { OutlineBtn } from "../../ui/OutlineBtn";
import { OtpBoxes } from "../../ui/OtpBoxes";
import { OtpTimer } from "../../ui/OtpTimer";

interface RegisterEmailProps {
  regEmail: string;
  setRegEmail: (v: string) => void;
  emailError: string;
  setEmailError: (v: string) => void;
  otpSent: boolean;
  setOtpSent: (v: boolean) => void;
  otpValue: string;
  setOtpValue: (v: string) => void;
  otpError: string;
  setOtpError: (v: string) => void;
  timer: number;
  otpLoading: boolean;
  onSendOtp: () => void;
  onVerifyOtp: () => void;
  onBack: () => void;
}

export function RegisterEmail({
  regEmail, setRegEmail, emailError, setEmailError,
  otpSent, setOtpSent, otpValue, setOtpValue, otpError,
  setOtpError, timer, otpLoading, onSendOtp, onVerifyOtp, onBack
}: RegisterEmailProps) {
  return (
    <>
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Verificação de E-mail Institucional</p>
        <p className="text-xs text-gray-500">Informe seu e-mail do IFSC para receber o código de ativação.</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">E-mail Institucional do SIGAA</label>
        <div className="relative">
          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={regEmail}
            onChange={(e) => {
              setRegEmail(e.target.value);
              setEmailError("");
              setOtpSent(false);
              setOtpValue("");
            }}
            placeholder="seu.nome@ifsc.edu.br"
            disabled={otpSent}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all disabled:opacity-60"
            style={{
              borderColor: emailError ? "#fca5a5" : "#e5e7eb",
              color: "#111827",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)"
            }}
          />
        </div>
        {emailError && (
          <div className="flex items-center gap-1.5 mt-2">
            <AlertTriangle size={12} className="text-red-500 shrink-0" />
            <p className="text-xs text-red-600">{emailError}</p>
          </div>
        )}
      </div>

      {!otpSent ? (
        <GreenBtn type="button" loading={otpLoading} onClick={onSendOtp}>
          <Shield size={14} /> Enviar Código de Verificação
        </GreenBtn>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs" style={{ background: "#f0faf4", borderColor: "#bbf7d0", color: "#166534" }}>
            <CheckCircle2 size={14} className="shrink-0" />
            <span>Código enviado para <strong>{regEmail}</strong>. (Use <strong>123456</strong> para teste).</span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-3 text-center">Código de verificação (6 dígitos)</label>
            <OtpBoxes value={otpValue} onChange={(v) => { setOtpValue(v); setOtpError(""); }} />
            {otpError && (
              <p className="text-xs text-red-600 text-center mt-2 flex items-center justify-center gap-1">
                <AlertTriangle size={11} /> {otpError}
              </p>
            )}
            <OtpTimer seconds={timer} onResend={() => { setOtpSent(false); setOtpValue(""); }} />
          </div>
          <GreenBtn type="button" onClick={onVerifyOtp} disabled={otpValue.replace(/\s/g, "").length < 6}>
            <Check size={14} /> Validar Código
          </GreenBtn>
        </div>
      )}

      <OutlineBtn onClick={onBack}>
        <ArrowLeft size={14} /> Voltar para Login
      </OutlineBtn>
    </>
  );
}
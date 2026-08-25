import { useState, useEffect } from "react";
import {
  Mail,
  AlertTriangle,
  Shield,
  CheckCircle2,
  Lock,
  ArrowLeft,
  LogIn,
  Check,
  Eye,
  EyeOff
} from "lucide-react";
import { StepDots } from "../ui/StepDots";
import { OtpBoxes } from "../ui/OtpBoxes";
import { OtpTimer } from "../ui/OtpTimer";
import { PasswordStrength } from "../ui/PasswordStrength";
import { GreenBtn } from "../ui/GreenBtn";
import { OutlineBtn } from "../ui/OutlineBtn";
import { FieldInput } from "../ui/FieldInput";

export function ForgotForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);

  // Estados da Etapa 1
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sendLoading, setSendLoading] = useState(false);

  // Estados da Etapa 2
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Estados da Etapa 3
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [done, setDone] = useState(false);

  // Cronômetro do código de verificação
  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  // API 1: Solicitar envio do código de recuperação
  const sendInstructions = async () => {
    if (!email.trim()) {
      setEmailError("Informe seu e-mail cadastrado.");
      return;
    }
    if (!email.trim().toLowerCase().endsWith("@ifsc.edu.br")) {
      setEmailError("O e-mail deve ser do domínio @ifsc.edu.br");
      return;
    }

    setEmailError("");
    setSendLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao enviar código de recuperação.");
      }

      setStep(2);
      setTimer(90);
    } catch (err: any) {
      setEmailError(err.message || "Falha na comunicação com o servidor.");
    } finally {
      setSendLoading(false);
    }
  };

  // API 2: Validar o código OTP digitado
  const verifyOtp = async () => {
    const cleanCode = otpValue.trim().replace(/\s/g, "");
    if (cleanCode.length < 6) return;

    setOtpError("");
    setOtpLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: cleanCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Código inválido ou expirado.");
      }

      setStep(3);
    } catch (err: any) {
      setOtpError(err.message || "Erro ao verificar o código.");
    } finally {
      setOtpLoading(false);
    }
  };

  const pwStrong = newPw.length >= 8 && /\d/.test(newPw) && /[@#$%^&*!?]/.test(newPw);

  // API 3: Salvar nova senha no backend
  const resetPassword = async () => {
    if (!pwStrong) {
      setResetError("A senha não atende aos requisitos mínimos.");
      return;
    }
    if (newPw !== confirmPw) {
      setResetError("As senhas não coincidem.");
      return;
    }

    setResetError("");
    setResetLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: otpValue.trim().replace(/\s/g, ""),
          newPassword: newPw,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao redefinir a senha.");
      }

      setDone(true);
    } catch (err: any) {
      setResetError(err.message || "Falha ao conectar com o servidor.");
    } finally {
      setResetLoading(false);
    }
  };

  if (done) {
    return (
      <div className="px-10 py-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: "#e8f0eb" }}>
          <CheckCircle2 size={32} style={{ color: "#15622f" }} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">Senha redefinida com sucesso!</p>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Você já pode acessar a plataforma com sua nova senha.
          </p>
        </div>
        <div
          className="px-4 py-3 rounded-xl border text-xs text-left"
          style={{ background: "#f0faf4", borderColor: "#bbf7d0", color: "#166534" }}
        >
          <p className="font-semibold mb-0.5">Senha atualizada com sucesso!</p>
          <p>Sua nova senha foi salva. Use-a no próximo acesso ao SIGEP.</p>
        </div>
        <GreenBtn type="button" onClick={onBack}>
          <LogIn size={14} />
          Ir para o Login
        </GreenBtn>
      </div>
    );
  }

  return (
    <div>
      <StepDots step={step} total={3} />

      <div className="px-10 py-7 space-y-5">
        {step === 1 && (
          <>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">Identificação da Conta</p>
              <p className="text-xs text-gray-500">Informe o e-mail vinculado à sua conta SIGEP.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">E-mail Cadastrado</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  placeholder="seu.email@ifsc.edu.br"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all"
                  style={{ borderColor: emailError ? "#fca5a5" : "#e5e7eb", color: "#111827", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)" }}
                  onFocus={(e) => { if (!emailError) e.currentTarget.style.borderColor = "#15622f"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = emailError ? "#fca5a5" : "#e5e7eb"; }}
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertTriangle size={11} />
                  {emailError}
                </p>
              )}
            </div>

            <GreenBtn type="button" loading={sendLoading} onClick={sendInstructions}>
              <Shield size={14} />
              Enviar Instruções de Recuperação
            </GreenBtn>
            <OutlineBtn onClick={onBack}>
              <ArrowLeft size={14} />
              Voltar para Login
            </OutlineBtn>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">Verificação de Código</p>
              <p className="text-xs text-gray-500">
                Enviamos um código de verificação para o seu e-mail cadastrado.
              </p>
            </div>

            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl border text-xs"
              style={{ background: "#f0faf4", borderColor: "#bbf7d0", color: "#166534" }}
            >
              <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
              <span>Código enviado para <strong>{email}</strong>. Verifique sua caixa de entrada.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-3 text-center">
                Código de verificação (6 dígitos)
              </label>
              <OtpBoxes value={otpValue} onChange={(v) => { setOtpValue(v); setOtpError(""); }} />
              {otpError && (
                <p className="text-xs text-red-600 text-center mt-2 flex items-center justify-center gap-1">
                  <AlertTriangle size={11} />
                  {otpError}
                </p>
              )}
              <OtpTimer seconds={timer} onResend={() => { setStep(1); setOtpValue(""); }} />
            </div>

            <GreenBtn type="button" loading={otpLoading} onClick={verifyOtp} disabled={otpValue.replace(/\s/g, "").length < 6}>
              <Check size={14} />
              Verificar Código
            </GreenBtn>
            <OutlineBtn onClick={() => setStep(1)}>
              <ArrowLeft size={14} />
              Voltar
            </OutlineBtn>
          </>
        )}

        {step === 3 && (
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
                <AlertTriangle size={11} />
                {resetError}
              </p>
            )}

            <GreenBtn
              type="button"
              loading={resetLoading}
              onClick={resetPassword}
              disabled={!pwStrong || newPw !== confirmPw}
            >
              <Shield size={14} />
              Redefinir Senha
            </GreenBtn>
            <OutlineBtn onClick={() => setStep(2)}>
              <ArrowLeft size={14} />
              Voltar
            </OutlineBtn>
          </>
        )}
      </div>
    </div>
  );
}
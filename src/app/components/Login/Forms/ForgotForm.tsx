import { useState, useEffect } from "react";
import { StepDots } from "../../ui/StepDots";
import { forgotPassword, verifyOtp, resetPassword } from "../../../services/authService";

import { ForgotIdentify } from "../Reset/ForgotIdentify";
import { ForgotVerify } from "../Reset/ForgotVerify";
import { ForgotNewPassword } from "../Reset/ForgotPassword";
import { ForgotDone } from "../Reset/ForgotDone";

export function ForgotForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);

  // Etapa 1
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sendLoading, setSendLoading] = useState(false);

  // Etapa 2
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Etapa 3
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleSendInstructions = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return setEmailError("Informe seu e-mail cadastrado.");
    if (!cleanEmail.endsWith("@ifsc.edu.br")) return setEmailError("O e-mail deve ser do domínio @ifsc.edu.br");

    setEmailError("");
    setSendLoading(true);

    try {
      await forgotPassword(cleanEmail);
      setStep(2);
      setTimer(90);
    } catch (err: any) {
      setEmailError(err.message);
    } finally {
      setSendLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const cleanCode = otpValue.trim().replace(/\s/g, "");
    if (cleanCode.length < 6) return;

    setOtpError("");
    setOtpLoading(true);

    try {
      await verifyOtp(email.trim().toLowerCase(), cleanCode);
      setStep(3);
    } catch (err: any) {
      setOtpError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const pwStrong = newPw.length >= 8 && /\d/.test(newPw) && /[@#$%^&*!?]/.test(newPw);

  const handleResetPassword = async () => {
    if (!pwStrong) return setResetError("A senha não atende aos requisitos mínimos.");
    if (newPw !== confirmPw) return setResetError("As senhas não coincidem.");

    setResetError("");
    setResetLoading(true);

    try {
      await resetPassword(email.trim().toLowerCase(), otpValue.trim().replace(/\s/g, ""), newPw);
      setDone(true);
    } catch (err: any) {
      setResetError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  if (done) return <ForgotDone onBack={onBack} />;

  return (
    <div>
      <StepDots step={step} total={3} />

      <div className="px-10 py-7 space-y-5">
        {step === 1 && (
          <ForgotIdentify
            email={email}
            setEmail={setEmail}
            emailError={emailError}
            setEmailError={setEmailError}
            loading={sendLoading}
            onSubmit={handleSendInstructions}
            onBack={onBack}
          />
        )}

        {step === 2 && (
          <ForgotVerify
            email={email}
            otpValue={otpValue}
            setOtpValue={setOtpValue}
            otpError={otpError}
            setOtpError={setOtpError}
            timer={timer}
            loading={otpLoading}
            onVerify={handleVerifyOtp}
            onBackStep={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <ForgotNewPassword
            newPw={newPw}
            setNewPw={setNewPw}
            confirmPw={confirmPw}
            setConfirmPw={setConfirmPw}
            showPw={showPw}
            setShowPw={setShowPw}
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
            resetError={resetError}
            loading={resetLoading}
            pwStrong={pwStrong}
            onReset={handleResetPassword}
            onBackStep={() => setStep(2)}
          />
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";

import {
  fetchSystemOptions,
  sendOtp,
  verifyOtp,
  fetchSigaaData,
  registerUser,
} from "../../../services/authService";
import type { Role } from "../../../types/auth";
import { StepDots } from "../../ui/StepDots";

import { RegisterEmail } from "../Register/RegisterEmail";
import { RegisterData } from "../Register/RegisterData";
import { RegisterRoles } from "../Register/RegisterRoles";
import { RegisterPassword } from "../Register/RegisterPassword";

interface RegisterFormProps {
  onBack: () => void;
  onComplete: (email: string) => void;
}

export function RegisterForm({ onBack, onComplete }: RegisterFormProps) {
  const [step, setStep] = useState(1);

  // Opções vindas da API
  const [roleOptions, setRoleOptions] = useState<string[]>([]);
  const [courseOptions, setCourseOptions] = useState<string[]>([]);
  const [funcoesOptions, setFuncoesOptions] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Step 1
  const [regEmail, setRegEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);

  // Step 2
  const [sigaaLoading, setSigaaLoading] = useState(false);
  const [sigaaFetched, setSigaaFetched] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [name, setName] = useState("");
  const [siape, setSiape] = useState("");
  const [role, setRole] = useState<Role | "">("");

  // Step 3
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [course, setCourse] = useState("");
  const [funcoes, setFuncoes] = useState<string[]>([]);

  // Step 4
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [finalError, setFinalError] = useState("");
  const [finalLoading, setFinalLoading] = useState(false);

  useEffect(() => {
    fetchSystemOptions()
      .then((data) => {
        setRoleOptions(data.roles || []);
        setCourseOptions((data.courses || []).map((c) => c.nome));
        setFuncoesOptions((data.funcoes || []).map((f) => f.nome));
      })
      .catch((err) => console.error("Erro ao carregar opções:", err))
      .finally(() => setLoadingOptions(false));
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleSendOtp = async () => {
    const cleanEmail = regEmail.trim().toLowerCase();
    if (!cleanEmail) return setEmailError("Informe um e-mail institucional.");
    if (!cleanEmail.endsWith("@ifsc.edu.br")) {
      return setEmailError("O e-mail deve ser do domínio @ifsc.edu.br");
    }

    setEmailError("");
    setOtpLoading(true);
    try {
      await sendOtp(cleanEmail);
      setOtpSent(true);
      setTimer(90);
    } catch (err: any) {
      setEmailError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const cleanCode = otpValue.trim().replace(/\s/g, "");
    setOtpError("");
    try {
      await verifyOtp(regEmail.trim().toLowerCase(), cleanCode);
      setStep(2);
    } catch (err: any) {
      setOtpError(err.message);
    }
  };

  const handleFetchSigaa = async () => {
    setSigaaLoading(true);
    try {
      const data = await fetchSigaaData(regEmail.trim().toLowerCase());
      setName(data.name || "");
      setSiape(data.siape || "");
      if (data.role) setRole(data.role as Role);
      if (data.disciplines) setDisciplines(data.disciplines);
      if (data.course) setCourse(data.course);
      if (data.funcoes) setFuncoes(data.funcoes);
      setSigaaFetched(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSigaaLoading(false);
    }
  };

  const handleClearSigaa = () => {
    setSigaaFetched(false);
    setName("");
    setSiape("");
    setRole("");
    setDisciplines([]);
    setCourse("");
    setFuncoes([]);
    setManualMode(false);
  };

  const handleFinalize = async () => {
    const pwStrong =
      password.length >= 8 && /\d/.test(password) && /[@#$%^&*!?]/.test(password);
    if (!pwStrong) return setFinalError("A senha não atende aos requisitos mínimos.");
    if (password !== confirmPw) return setFinalError("As senhas não coincidem.");

    setFinalError("");
    setFinalLoading(true);
    try {
      const cleanEmail = regEmail.trim().toLowerCase();
      await registerUser({
        email: cleanEmail,
        password,
        name: name.trim(),
        siape: siape.trim(),
        role,
        disciplines,
        course: role === "Coordenador de Curso" ? course : undefined,
        funcoes:
          role === "Equipe Pedagógica/NAE" || role === "Servidor Geral"
            ? funcoes
            : undefined,
      });
      onComplete(cleanEmail);
    } catch (err: any) {
      setFinalError(err.message);
    } finally {
      setFinalLoading(false);
    }
  };

  return (
    <div>
      <StepDots step={step} total={4} />
      <div className="px-10 py-7 space-y-5">
        {step === 1 && (
          <RegisterEmail
            regEmail={regEmail}
            setRegEmail={setRegEmail}
            emailError={emailError}
            setEmailError={setEmailError}
            otpSent={otpSent}
            setOtpSent={setOtpSent}
            otpValue={otpValue}
            setOtpValue={setOtpValue}
            otpError={otpError}
            setOtpError={setOtpError}
            timer={timer}
            otpLoading={otpLoading}
            onSendOtp={handleSendOtp}
            onVerifyOtp={handleVerifyOtp}
            onBack={onBack}
          />
        )}

        {step === 2 && (
          <RegisterData
            name={name}
            setName={setName}
            siape={siape}
            setSiape={setSiape}
            role={role}
            setRole={(r) => {
              setRole(r);
              setDisciplines([]);
              setCourse("");
              setFuncoes([]);
            }}
            roleOptions={roleOptions}
            loadingOptions={loadingOptions}
            sigaaLoading={sigaaLoading}
            sigaaFetched={sigaaFetched}
            manualMode={manualMode}
            setManualMode={setManualMode}
            onFetchSigaa={handleFetchSigaa}
            onClearSigaa={handleClearSigaa}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <RegisterRoles
            role={role}
            disciplines={disciplines}
            setDisciplines={setDisciplines}
            course={course}
            setCourse={setCourse}
            courseOptions={courseOptions}
            allFuncoesOptions={funcoesOptions}
            funcoes={funcoes}
            setFuncoes={setFuncoes}
            loadingOptions={loadingOptions}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <RegisterPassword
            password={password}
            setPassword={setPassword}
            confirmPw={confirmPw}
            setConfirmPw={setConfirmPw}
            showPw={showPw}
            setShowPw={setShowPw}
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
            finalError={finalError}
            finalLoading={finalLoading}
            onFinalize={handleFinalize}
            onBackStep={() => setStep(3)}
            onBackLogin={onBack}
          />
        )}
      </div>
    </div>
  );
}
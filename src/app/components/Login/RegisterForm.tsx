import { useState, useEffect } from "react";
import {
  Mail,
  AlertTriangle,
  Shield,
  CheckCircle2,
  Check,
  Database,
  Zap,
  ChevronDown,
  User,
  Hash,
  ArrowLeft,
  Lock,
  EyeOff,
  Eye,
  Loader2
} from "lucide-react";
import type { Role } from "../../types/auth";
import { StepDots } from "../ui/StepDots";
import { OtpBoxes } from "../ui/OtpBoxes";
import { OtpTimer } from "../ui/OtpTimer";
import { DisciplineTagInput } from "../ui/DisciplineTagInput";
import { PasswordStrength } from "../ui/PasswordStrength";
import { GreenBtn } from "../ui/GreenBtn";
import { OutlineBtn } from "../ui/OutlineBtn";
import { FieldInput } from "../ui/FieldInput";

interface RegisterFormProps {
  onBack: () => void;
  onComplete: (email: string) => void;
}

export function RegisterForm({ onBack, onComplete }: RegisterFormProps) {
  const [step, setStep] = useState(1);

  // Opções vindas da API
  const [roleOptions, setRoleOptions] = useState<string[]>([]);
  const [courseOptions, setCourseOptions] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Step 1: E-mail e Verificação
  const [regEmail, setRegEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);

  // Step 2: Dados do Servidor (SIGAA ou Manual)
  const [sigaaLoading, setSigaaLoading] = useState(false);
  const [sigaaFetched, setSigaaFetched] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [name, setName] = useState("");
  const [siape, setSiape] = useState("");
  const [role, setRole] = useState<Role | "">("");

  // Step 3: Atribuição Acadêmica (Condicional)
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [course, setCourse] = useState("");

  // Step 4: Definir Senha
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [finalError, setFinalError] = useState("");
  const [finalLoading, setFinalLoading] = useState(false);

  // Carrega Cargos e Cursos da API no carregamento do componente
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/options");
        const data = await response.json();

        if (response.ok) {
          setRoleOptions(data.roles || []);
          setCourseOptions(data.courses || []);
        }
      } catch (err) {
        console.error("Erro ao carregar opções do formulário:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // Cronômetro para o código OTP
  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  // API 1: Solicitante e-mail e envio de OTP via backend
  const sendOtp = async () => {
    if (!regEmail.trim()) {
      setEmailError("Informe um e-mail institucional.");
      return;
    }
    if (!regEmail.trim().toLowerCase().endsWith("@ifsc.edu.br")) {
      setEmailError("O e-mail deve ser obrigatoriamente do domínio @ifsc.edu.br");
      return;
    }

    setEmailError("");
    setOtpLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao enviar código de verificação.");
      }

      setOtpSent(true);
      setTimer(90);
    } catch (err: any) {
      setEmailError(err.message || "Falha na comunicação com o servidor.");
    } finally {
      setOtpLoading(false);
    }
  };

  // API 2: Validação do código OTP via backend
  const verifyOtp = async () => {
    const cleanCode = otpValue.trim().replace(/\s/g, "");
    if (cleanCode.length < 6) return;

    setOtpError("");
    try {
      const response = await fetch("http://localhost:3001/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail.trim().toLowerCase(),
          code: cleanCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Código inválido.");
      }

      setStep(2);
    } catch (err: any) {
      setOtpError(err.message || "Erro ao verificar código.");
    }
  };

  // API 3: Consulta aos dados no SIGAA via backend
  const fetchSigaa = async () => {
    setSigaaLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/sigaa/${encodeURIComponent(regEmail.trim().toLowerCase())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Não foi possível carregar os dados do SIGAA.");
      }

      setName(data.name || "");
      setSiape(data.siape || "");
      if (data.role) setRole(data.role as Role);
      if (data.disciplines) setDisciplines(data.disciplines);
      if (data.course) setCourse(data.course);

      setSigaaFetched(true);
    } catch (err: any) {
      alert(err.message || "Erro ao buscar dados do SIGAA.");
    } finally {
      setSigaaLoading(false);
    }
  };

  const clearSigaaData = () => {
    setSigaaFetched(false);
    setName("");
    setSiape("");
    setRole("");
    setDisciplines([]);
    setCourse("");
    setManualMode(false);
  };

  const step2Valid = name.trim() && siape.trim() && role;

  const step3Valid = () => {
    if (role === "Professor") return disciplines.length > 0;
    if (role === "Coordenador de Curso") return !!course;
    return true;
  };

  const pwStrong = password.length >= 8 && /\d/.test(password) && /[@#$%^&*!?]/.test(password);

  // API 4: Finalização e persistência no banco de dados backend
  const finalize = async () => {
    if (!pwStrong) {
      setFinalError("A senha não atende aos requisitos mínimos de segurança.");
      return;
    }
    if (password !== confirmPw) {
      setFinalError("As senhas não coincidem.");
      return;
    }

    setFinalError("");
    setFinalLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail.trim().toLowerCase(),
          password,
          name: name.trim(),
          siape: siape.trim(),
          role,
          disciplines: role === "Professor" ? disciplines : undefined,
          course: role === "Coordenador de Curso" ? course : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao realizar o cadastro.");
      }

      onComplete(regEmail.trim().toLowerCase());
    } catch (err: any) {
      setFinalError(err.message || "Falha ao conectar com o servidor.");
    } finally {
      setFinalLoading(false);
    }
  };

  return (
    <div>
      <StepDots step={step} total={4} />

      <div className="px-10 py-7 space-y-5">
        {/* ── ETAPA 1: E-mail + Validação OTP ── */}
        {step === 1 && (
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
              <GreenBtn type="button" loading={otpLoading} onClick={sendOtp}>
                <Shield size={14} />
                Enviar Código de Verificação
              </GreenBtn>
            ) : (
              <div className="space-y-4">
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs"
                  style={{ background: "#f0faf4", borderColor: "#bbf7d0", color: "#166534" }}
                >
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>
                    Código enviado para <strong>{regEmail}</strong>. Verifique sua caixa de entrada.
                  </span>
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
                  <OtpTimer seconds={timer} onResend={() => { setOtpSent(false); setOtpValue(""); }} />
                </div>

                <GreenBtn type="button" onClick={verifyOtp} disabled={otpValue.replace(/\s/g, "").length < 6}>
                  <Check size={14} />
                  Validar Código
                </GreenBtn>
              </div>
            )}

            <OutlineBtn onClick={onBack}>
              <ArrowLeft size={14} />
              Voltar para Login
            </OutlineBtn>
          </>
        )}

        {/* ── ETAPA 2: SIGAA / Preenchimento Manual ── */}
        {step === 2 && (
          <>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">Importação de Dados do Servidor</p>
              <p className="text-xs text-gray-500">Busque automaticamente via SIGAA ou preencha manualmente.</p>
            </div>

            {!sigaaFetched && (
              <button
                type="button"
                onClick={fetchSigaa}
                disabled={sigaaLoading}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all hover:border-[#15622f] hover:bg-[#f8faf9] disabled:opacity-60"
                style={{ borderColor: "#d1e8d9", background: "#f8faf9" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #0f4a23, #15622f)" }}>
                  {sigaaLoading ? <Loader2 size={18} className="animate-spin text-white" /> : <Database size={18} className="text-white" />}
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-800">Buscar Dados no SIGAA</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#fef3c7", color: "#92400e" }}>
                      <Zap size={10} className="fill-amber-500 text-amber-500" /> Rápido
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Importa SIAPE, nome, cargo e disciplinas automaticamente</p>
                </div>
              </button>
            )}

            {sigaaFetched && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs" style={{ background: "#f0faf4", borderColor: "#bbf7d0", color: "#166534" }}>
                <CheckCircle2 size={14} className="shrink-0" />
                <span>Dados importados com sucesso do SIGAA</span>
                <button type="button" onClick={clearSigaaData} className="ml-auto underline text-xs">
                  Limpar
                </button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 shrink-0">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={() => setManualMode((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all hover:bg-gray-50 text-sm font-semibold text-gray-700"
              style={{ borderColor: manualMode ? "#15622f" : "#e5e7eb", background: manualMode ? "#f8faf9" : "white" }}
            >
              <span>Preencher Dados Manualmente</span>
              <ChevronDown size={15} className={`transition-transform ${manualMode ? "rotate-180" : ""}`} />
            </button>

            {(manualMode || sigaaFetched) && (
              <div className="space-y-4">
                <FieldInput label="Nome Completo" type="text" value={name} onChange={setName} placeholder="Nome completo do servidor" icon={User} />
                <FieldInput label="SIAPE" type="text" value={siape} onChange={setSiape} placeholder="0000000" icon={Hash} />

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Cargo / Função</label>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value as Role);
                        setDisciplines([]);
                        setCourse("");
                      }}
                      disabled={loadingOptions}
                      className="w-full pl-3 pr-8 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none appearance-none cursor-pointer disabled:opacity-50"
                      style={{ borderColor: "#e5e7eb", color: role ? "#111827" : "#9ca3af" }}
                    >
                      <option value="">{loadingOptions ? "Carregando cargos..." : "Selecione um cargo..."}</option>
                      {roleOptions.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <OutlineBtn onClick={() => setStep(1)}>
                <ArrowLeft size={14} />
                Voltar
              </OutlineBtn>
              <GreenBtn type="button" onClick={() => setStep(3)} disabled={!step2Valid}>
                Continuar
              </GreenBtn>
            </div>
          </>
        )}

        {/* ── ETAPA 3: Atribuição Acadêmica ── */}
        {step === 3 && (
          <>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">Atribuição Acadêmica</p>
              <p className="text-xs text-gray-500">
                {role === "Professor"
                  ? "Selecione as disciplinas que você leciona no câmpus."
                  : role === "Coordenador de Curso"
                  ? "Indique o curso que você coordena."
                  : "Nenhuma atribuição acadêmica específica para este cargo."}
              </p>
            </div>

            {role === "Professor" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Disciplinas Lecionadas</label>
                <DisciplineTagInput value={disciplines} onChange={setDisciplines} />
                {disciplines.length === 0 && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <AlertTriangle size={11} />
                    Adicione pelo menos uma disciplina para continuar.
                  </p>
                )}
              </div>
            )}

            {role === "Coordenador de Curso" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Curso Coordenado</label>
                <div className="relative">
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    disabled={loadingOptions}
                    className="w-full pl-3 pr-8 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none appearance-none cursor-pointer disabled:opacity-50"
                    style={{ borderColor: "#e5e7eb", color: course ? "#111827" : "#9ca3af" }}
                  >
                    <option value="">{loadingOptions ? "Carregando cursos..." : "Selecione o curso..."}</option>
                    {courseOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {(role === "Equipe Pedagógica/NAE" || role === "Servidor Geral") && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: "#f0faf4", borderColor: "#bbf7d0" }}>
                <CheckCircle2 size={16} style={{ color: "#15622f" }} className="shrink-0" />
                <p className="text-xs text-gray-600">
                  Cargo de <strong style={{ color: "#0f4a23" }}>{role}</strong> não requer atribuição acadêmica específica.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <OutlineBtn onClick={() => setStep(2)}>
                <ArrowLeft size={14} />
                Voltar
              </OutlineBtn>
              <GreenBtn type="button" onClick={() => step3Valid() && setStep(4)} disabled={!step3Valid()}>
                Continuar
              </GreenBtn>
            </div>
          </>
        )}

        {/* ── ETAPA 4: Definição de Senha ── */}
        {step === 4 && (
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
                <AlertTriangle size={11} />
                As senhas não coincidem.
              </p>
            )}

            {finalError && (
              <div className="flex items-center gap-2 text-xs text-red-600">
                <AlertTriangle size={12} className="shrink-0" />
                {finalError}
              </div>
            )}

            <div className="flex gap-3">
              <OutlineBtn onClick={() => setStep(3)}>
                <ArrowLeft size={14} />
                Voltar
              </OutlineBtn>
              <GreenBtn type="button" loading={finalLoading} onClick={finalize} disabled={!pwStrong || password !== confirmPw}>
                <Check size={14} />
                Finalizar Cadastro
              </GreenBtn>
            </div>

            <OutlineBtn onClick={onBack}>
              <ArrowLeft size={14} />
              Voltar para Login
            </OutlineBtn>
          </>
        )}
      </div>
    </div>
  );
}
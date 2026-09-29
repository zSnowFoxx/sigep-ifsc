import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import type { UserSession } from "../../../types/auth";
import { loginUser } from "../../../services/authService";

interface LoginFormProps {
  initialEmail?: string;
  onLoginSuccess: (p: UserSession) => void;
  onRegister: () => void;
  onForgot: () => void;
  onError: (msg: string) => void;
  onErrorStateChange?: (hasError: boolean) => void;
  clearError?: () => void;
}

export default function LoginForm({
  initialEmail = "",
  onLoginSuccess,
  onRegister,
  onForgot,
  onError,
  onErrorStateChange,
  clearError,
}: LoginFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  // Preenche o campo de e-mail automaticamente quando finaliza o cadastro
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleClearError = () => {
    if (clearError) clearError();
    if (onErrorStateChange) onErrorStateChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    handleClearError();

    try {
      const response = await loginUser(email.trim(), password);

      // Se "Permanecer Conectado" estiver ativo, salva no localStorage
      // Se não estiver ativo, salva no sessionStorage
      if (remember) {
        localStorage.setItem("userEmail", response.user.email);
        sessionStorage.removeItem("userEmail");
      } else {
        sessionStorage.setItem("userEmail", response.user.email);
        localStorage.removeItem("userEmail");
      }

      onLoginSuccess(response.user as unknown as UserSession);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "E-mail não cadastrado ou senha incorreta. Verifique os dados e tente novamente.";
      onError(errorMsg);
      if (onErrorStateChange) onErrorStateChange(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-10 py-7 space-y-5">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          E-mail Institucional
        </label>
        <div className="relative">
          <Mail
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleClearError();
            }}
            placeholder="servidor@ifsc.edu.br"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all"
            style={{
              borderColor: "#e5e7eb",
              color: "#111827",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
            }}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Senha
        </label>
        <div className="relative">
          <Lock
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              handleClearError();
            }}
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all"
            style={{
              borderColor: "#e5e7eb",
              color: "#111827",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            className="w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0"
            style={{
              borderColor: remember ? "#15622f" : "#d1d5db",
              background: remember ? "#15622f" : "white",
            }}
            onClick={() => setRemember((v) => !v)}
          >
            {remember && (
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                <polyline
                  points="2 6 5 9 10 3"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-xs text-gray-600">Permanecer conectado</span>
        </label>
        <button
          type="button"
          onClick={onForgot}
          className="text-xs font-semibold hover:underline"
          style={{ color: "#15622f" }}
        >
          Esqueci minha senha
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
        style={{
          background: "linear-gradient(135deg, #0f4a23 0%, #15622f 100%)",
          boxShadow: "0 4px 14px rgba(15,74,35,0.35)",
        }}
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Aguarde...
          </>
        ) : (
          <>
            <LogIn size={15} />
            Acessar Plataforma
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        Servidor do IFSC e ainda não possui acesso?{" "}
        <button
          type="button"
          onClick={onRegister}
          className="font-semibold hover:underline text-[12px]"
          style={{ color: "#15622f" }}
        >
          Cadastre sua conta
        </button>
      </p>
    </form>
  );
}
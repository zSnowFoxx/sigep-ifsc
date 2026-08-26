import { useState, type SetStateAction } from "react";
import type { LoginProps } from "../types/auth";

// Importações com default export
import LoginBackground from "../components/Login/LoginBackground";
import LoginHeader from "../components/Login/LoginHeader";
import LoginError from "../components/Login/LoginError";
import LoginForm from "../components/Login/LoginForm";
import LoginTeste from "../components/Login/LoginTeste";

// Registro e Recuperação de Senha
import { RegisterForm } from "../components/Login/Register/RegisterForm";
import { ForgotForm } from "../components/Login/Reset/ForgotForm";

type Mode = "login" | "register" | "forgot";

export default function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [registeredEmail, setRegisteredEmail] = useState<string>("");

  const handleModeChange = (newMode: Mode) => {
    setErrorMessage("");
    setSuccessMessage("");
    setMode(newMode);
  };

  const handleRegisterComplete = (email: string) => {
    setRegisteredEmail(email);
    setSuccessMessage("Cadastro realizado com sucesso! Insira sua senha para acessar.");
    setErrorMessage("");
    setMode("login");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "#f0f2f5" }}
    >
      <LoginBackground />

      <div
        className="relative z-10 w-full bg-white flex flex-col transition-all duration-200"
        style={{
          maxWidth: mode === "register" ? "540px" : "460px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.07), 0 10px 40px -4px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      >
        <LoginHeader
          hasError={!!errorMessage}
          subtitle={
            mode === "register"
              ? "Cadastro de Novo Servidor"
              : mode === "forgot"
              ? "Recuperação de Senha"
              : undefined
          }
        />

        {/* Banner de Sucesso pós-cadastro */}
        {successMessage && mode === "login" && (
          <div className="mx-6 mt-4 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center justify-between">
            <span>{successMessage}</span>
            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              className="text-emerald-600 hover:text-emerald-900 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {errorMessage && mode === "login" && (
          <LoginError message={errorMessage} />
        )}

        {mode === "login" && (
          <>
            <LoginForm
              initialEmail={registeredEmail}
              onLoginSuccess={onLogin}
              onErrorStateChange={(hasErr: any) => {
                if (!hasErr) setErrorMessage("");
              }}
              onRegister={() => handleModeChange("register")}
              onForgot={() => handleModeChange("forgot")}
              onError={(msg: SetStateAction<string>) => {
                setSuccessMessage("");
                setErrorMessage(msg);
              }}
            />
            <LoginTeste />
          </>
        )}

        {mode === "register" && (
          <RegisterForm
            onBack={() => handleModeChange("login")}
            onComplete={handleRegisterComplete}
          />
        )}

        {mode === "forgot" && (
          <ForgotForm onBack={() => handleModeChange("login")} />
        )}
      </div>
    </div>
  );
}
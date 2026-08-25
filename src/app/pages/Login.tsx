import { useState, type SetStateAction } from "react";
import type { LoginProps } from "../types/auth";

// Importações com default export (padrão do seu projeto)
import LoginBackground from "../components/Login/LoginBackground";
import LoginHeader from "../components/Login/LoginHeader";
import LoginError from "../components/Login/LoginError";
import LoginForm from "../components/Login/LoginForm";
import LoginTeste from "../components/Login/LoginTeste";

// Novos formulários
import { RegisterForm } from "../components/Login/RegisterForm";
import { ForgotForm } from "../components/Login/ForgotForm";

type Mode = "login" | "register" | "forgot";

export default function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleModeChange = (newMode: Mode) => {
    setErrorMessage("");
    setMode(newMode);
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

        {errorMessage && mode === "login" && (
          <LoginError message={errorMessage} />
        )}

        {mode === "login" && (
          <>
            <LoginForm
              onLoginSuccess={onLogin}
              onErrorStateChange={(hasErr: any) => {
                if (!hasErr) setErrorMessage("");
              }}
              onRegister={() => handleModeChange("register")}
              onForgot={() => handleModeChange("forgot")}
              onError={(msg: SetStateAction<string>) => setErrorMessage(msg)}
            />
            <LoginTeste />
          </>
        )}

        {mode === "register" && (
          <RegisterForm
            onBack={() => handleModeChange("login")}
            onComplete={() => handleModeChange("login")}
          />
        )}

        {mode === "forgot" && (
          <ForgotForm onBack={() => handleModeChange("login")} />
        )}
      </div>
    </div>
  );
}
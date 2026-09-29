import { Mail, AlertTriangle, Shield, ArrowLeft } from "lucide-react";
import { GreenBtn } from "../../ui/GreenBtn";
import { OutlineBtn } from "../../ui/OutlineBtn";

interface ForgotIdentifyProps {
  email: string;
  setEmail: (v: string) => void;
  emailError: string;
  setEmailError: (v: string) => void;
  loading: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export function ForgotIdentify({
  email, setEmail, emailError, setEmailError, loading, onSubmit, onBack
}: ForgotIdentifyProps) {
  return (
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
            style={{ borderColor: emailError ? "#fca5a5" : "#e5e7eb", color: "#111827" }}
          />
        </div>
        {emailError && (
          <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
            <AlertTriangle size={11} /> {emailError}
          </p>
        )}
      </div>

      <GreenBtn type="button" loading={loading} onClick={onSubmit}>
        <Shield size={14} /> Enviar Instruções de Recuperação
      </GreenBtn>
      <OutlineBtn onClick={onBack}>
        <ArrowLeft size={14} /> Voltar para Login
      </OutlineBtn>
    </>
  );
}
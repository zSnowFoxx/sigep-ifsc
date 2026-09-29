import { AlertTriangle } from "lucide-react";

interface LoginErrorProps {
  message?: string;
}

export default function LoginError({ message }: LoginErrorProps) {
  return (
    <div
      className="mx-8 mt-5 flex items-start gap-3 px-4 py-3 rounded-xl border"
      style={{ background: "#fef2f2", borderColor: "#fca5a5" }}
    >
      <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-bold text-red-800 leading-snug">
          Credenciais inválidas
        </p>
        <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
          {message ||
            "O e-mail informado não está cadastrado ou a senha está incorreta. Verifique os dados e tente novamente."}
        </p>
      </div>
    </div>
  );
}
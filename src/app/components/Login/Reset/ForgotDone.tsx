import { CheckCircle2, LogIn } from "lucide-react";
import { GreenBtn } from "../../ui/GreenBtn";

export function ForgotDone({ onBack }: { onBack: () => void }) {
  return (
    <div className="px-10 py-8 text-center space-y-5">
      <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-emerald-100 text-emerald-700">
        <CheckCircle2 size={32} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">Senha redefinida com sucesso!</p>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          Você já pode acessar a plataforma com sua nova senha.
        </p>
      </div>
      <div className="px-4 py-3 rounded-xl border text-xs text-left bg-emerald-50 border-emerald-200 text-emerald-800">
        <p className="font-semibold mb-0.5">Senha atualizada!</p>
        <p>Sua nova senha foi salva. Use-a no próximo acesso ao sistema.</p>
      </div>
      <GreenBtn type="button" onClick={onBack}>
        <LogIn size={14} /> Ir para o Login
      </GreenBtn>
    </div>
  );
}
import { GraduationCap } from "lucide-react";

interface LoginHeaderProps {
  subtitle?: string;
  hasError?: boolean;
}

export default function LoginHeader({ subtitle, hasError }: LoginHeaderProps) {
  return (
    <div className="px-10 pt-10 pb-7 flex flex-col items-center text-center border-b border-gray-100">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-all duration-200"
        style={{
          background: hasError
            ? "linear-gradient(135deg, #991b1b 0%, #dc2626 100%)"
            : "linear-gradient(135deg, #0f4a23 0%, #15622f 100%)",
        }}
      >
        <GraduationCap size={28} color="white" />
      </div>
      <h1
        className="text-2xl font-bold tracking-tight"
        style={{ color: "#0f4a23", fontFamily: "'Inter', sans-serif" }}
      >
        SIGEP
      </h1>
      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed max-w-xs">
        Sistema de Gestão Estratégica Pedagógica<br />
        <span className="font-semibold text-gray-600">IFSC Câmpus Lages</span>
      </p>
      {subtitle && (
        <span
          className="mt-3 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: "#e8f0eb", color: "#0f4a23" }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
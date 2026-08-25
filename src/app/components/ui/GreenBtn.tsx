import { Loader2 } from "lucide-react";

interface GreenBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
}

export function GreenBtn({ children, onClick, disabled, loading, type = "button" }: GreenBtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 hover:opacity-95"
      style={{ background: "linear-gradient(135deg, #0f4a23, #15622f)" }}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : children}
    </button>
  );
}
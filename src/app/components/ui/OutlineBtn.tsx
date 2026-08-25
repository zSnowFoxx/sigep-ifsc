interface OutlineBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function OutlineBtn({ children, onClick }: OutlineBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
    >
      {children}
    </button>
  );
}
export function OtpTimer({ seconds, onResend }: { seconds: number; onResend: () => void }) {
  return (
    <p className="text-xs text-center text-gray-500 mt-3">
      {seconds > 0 ? (
        <>Reenviar código em <span className="font-semibold" style={{ color: "#0f4a23" }}>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</span></>
      ) : (
        <button type="button" onClick={onResend} className="font-semibold hover:underline" style={{ color: "#15622f" }}>
          Reenviar código de verificação
        </button>
      )}
    </p>
  );
}
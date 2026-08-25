export default function LoginBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.035 }}
      >
        <defs>
          <pattern id="mesh" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0f4a23" strokeWidth="1" />
          </pattern>
          <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="1.2" fill="#0f4a23" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mesh)" />
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #0f4a23 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #15622f 0%, transparent 70%)" }}
      />
    </div>
  );
}
interface ParticipantesBarraProps {
  presentCount: number;
  totalCount: number;
}

export function ParticipantesBarra({
  presentCount,
  totalCount,
}: ParticipantesBarraProps) {
  const percentage = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;
  const absentCount = totalCount - presentCount;

  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
      <div className="flex-1">
        <p className="text-xs text-muted-foreground mb-1">Confirmados presentes</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${percentage}%`,
                background: "var(--primary)",
              }}
            />
          </div>
          <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>
            {presentCount}/{totalCount}
          </span>
        </div>
      </div>
      <div className="h-10 w-px bg-border" />
      <div className="text-center px-2">
        <p className="text-2xl font-bold text-emerald-600">{presentCount}</p>
        <p className="text-xs text-muted-foreground">Presentes</p>
      </div>
      <div className="text-center px-2">
        <p className="text-2xl font-bold text-muted-foreground/60">{absentCount}</p>
        <p className="text-xs text-muted-foreground">Ausentes</p>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import {
  CalendarDays,
  Clock,
  X,
  Tag,
  Pencil,
  UserCheck,
} from "lucide-react";
import type { Conselho } from "../../../types/conselho";
import {
  toDataRealizacao,
  type ConselhoRefs,
  type ServidorRef,
  type TurmaRef,
} from "../../../services/conselhoService";

interface AgendarConselhoProps {
  agendarFinalFor: Conselho | null;
  refs: ConselhoRefs;
  onClose: () => void;
  onConfirm: (dados: {
    origemId: number;
    nome: string;
    turmaIds: number[];
    servidorIds: number[];
    dataRealizacao: string;
  }) => Promise<void>;
}

export function AgendarConselho({
  agendarFinalFor,
  refs,
  onClose,
  onConfirm,
}: AgendarConselhoProps) {
  const [afNomeEdit, setAfNomeEdit] = useState(false);
  const [afNome, setAfNome] = useState("");
  const [afTurmasEdit, setAfTurmasEdit] = useState(false);
  const [afTurmas, setAfTurmas] = useState<TurmaRef[]>([]);
  const [afTurmaInput, setAfTurmaInput] = useState("");
  const [afTurmaOpen, setAfTurmaOpen] = useState(false);
  const [afData, setAfData] = useState("");
  const [afHora, setAfHora] = useState("");
  const [afPartBusca, setAfPartBusca] = useState("");
  const [afPartOpen, setAfPartOpen] = useState(false);
  const [afParticipantes, setAfParticipantes] = useState<ServidorRef[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (agendarFinalFor) {
      setAfNome(agendarFinalFor.nome.replace("Intermediário", "Final"));
      setAfTurmas(
        refs.turmas.filter((t) => agendarFinalFor.turmaIds.includes(t.id))
      );
      setAfData("");
      setAfHora("");
      setAfNomeEdit(false);
      setAfTurmasEdit(false);
      setAfTurmaInput("");
      setAfTurmaOpen(false);
      setAfPartBusca("");
      setAfPartOpen(false);
      setAfParticipantes(
        refs.servidores.filter((s) =>
          agendarFinalFor.servidores.some((x) => x.usuarioId === s.id)
        )
      );
      setError("");
    }
  }, [agendarFinalFor, refs]);

  if (!agendarFinalFor) return null;

  const removeAfParticipante = (id: number) =>
    setAfParticipantes((prev) => prev.filter((p) => p.id !== id));

  const addAfParticipante = (servidor: ServidorRef) => {
    if (afParticipantes.some((p) => p.id === servidor.id)) return;
    setAfParticipantes((prev) => [...prev, servidor]);
    setAfPartBusca("");
    setAfPartOpen(false);
  };

  const afTurmasSugeridas = refs.turmas.filter(
    (t) =>
      !afTurmas.some((x) => x.id === t.id) &&
      t.nome.toLowerCase().includes(afTurmaInput.toLowerCase())
  );

  const afPartSugeridos = refs.servidores.filter(
    (s) =>
      !afParticipantes.some((p) => p.id === s.id) &&
      s.nome.toLowerCase().includes(afPartBusca.toLowerCase())
  );

  const handleConfirm = async () => {
    setSaving(true);
    setError("");
    try {
      await onConfirm({
        origemId: agendarFinalFor.id,
        nome: afNome.trim(),
        turmaIds: afTurmas.map((t) => t.id),
        servidorIds: afParticipantes.map((p) => p.id),
        dataRealizacao: toDataRealizacao(afData, afHora),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao agendar o conselho.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full flex flex-col bg-card rounded-2xl shadow-2xl"
        style={{ maxWidth: "560px", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 rounded-t-2xl flex items-center justify-between shrink-0"
          style={{
            background:
              "linear-gradient(135deg, #0b3d1e 0%, #15622f 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <CalendarDays size={18} color="white" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/60">
                Conselho de Classe · Agendar Etapa Final
              </p>
              <h2 className="text-sm font-bold text-white">
                Agendar conselho final
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 min-h-0">
          {/* Dados herdados */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-2.5 bg-[#f7f8fa] border-b border-border">
              <p className="text-xs font-bold text-foreground">
                Dados do conselho intermediário de origem
              </p>
            </div>

            {/* Nome */}
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                    Nome de Identificação
                  </p>
                  {afNomeEdit ? (
                    <input
                      autoFocus
                      type="text"
                      value={afNome}
                      onChange={(e) => setAfNome(e.target.value)}
                      onBlur={() => setAfNomeEdit(false)}
                      className="w-full text-sm px-2 py-1.5 rounded-lg border border-primary bg-white outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-foreground truncate">
                      {afNome}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setAfNomeEdit((v) => !v)}
                  className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-[#f0f9f4] transition-all"
                  title="Editar nome"
                >
                  <Pencil size={13} />
                </button>
              </div>
            </div>

            {/* Turmas */}
            <div className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Turmas Vinculadas
                  </p>
                  {afTurmasEdit ? (
                    <div>
                      <div
                        className="min-h-9.5 flex flex-wrap gap-1.5 px-3 py-1.5 rounded-lg border border-primary bg-white cursor-text focus-within:ring-2 focus-within:ring-primary/10 transition-all"
                        onClick={() => setAfTurmaOpen(true)}
                      >
                        {afTurmas.map((t) => (
                          <span
                            key={t.id}
                            className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: "var(--secondary)",
                              color: "var(--primary)",
                            }}
                          >
                            {t.nome}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAfTurmas((p) => p.filter((x) => x.id !== t.id));
                              }}
                              className="hover:text-red-500 transition-colors"
                            >
                              <X size={9} />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={afTurmaInput}
                          onChange={(e) => {
                            setAfTurmaInput(e.target.value);
                            setAfTurmaOpen(true);
                          }}
                          onFocus={() => setAfTurmaOpen(true)}
                          placeholder={
                            afTurmas.length === 0 ? "Buscar turma..." : ""
                          }
                          className="flex-1 min-w-20 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                        />
                      </div>
                      {afTurmaOpen && afTurmasSugeridas.length > 0 && (
                        <div className="mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10 relative">
                          {afTurmasSugeridas.slice(0, 5).map((t) => (
                            <button
                              key={t.id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setAfTurmas((p) => [...p, t]);
                                setAfTurmaInput("");
                                setAfTurmaOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-[#f7f8fa] transition-colors border-b border-border last:border-0 flex items-center gap-2"
                            >
                              <Tag
                                size={11}
                                className="text-muted-foreground shrink-0"
                              />{" "}
                              {t.nome}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {afTurmas.map((t) => (
                        <span
                          key={t.id}
                          className="text-xs bg-[#f0f2f5] text-foreground px-2 py-0.5 rounded-md font-medium"
                        >
                          {t.nome}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setAfTurmasEdit((v) => !v)}
                  className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-[#f0f9f4] transition-all mt-5"
                  title="Editar turmas"
                >
                  <Pencil size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Data e Horário */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Data do Conselho Final <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CalendarDays
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="date"
                  value={afData}
                  onChange={(e) => setAfData(e.target.value)}
                  className="w-full text-sm pl-9 pr-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-foreground transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Horário <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="time"
                  value={afHora}
                  onChange={(e) => setAfHora(e.target.value)}
                  className="w-full text-sm pl-9 pr-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-foreground transition-all"
                />
              </div>
            </div>
          </div>

          {/* Participantes */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div
              className="px-4 py-3 border-b border-border flex items-center justify-between"
              style={{ background: "#f7f8fa" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-1 h-4 rounded-full shrink-0"
                  style={{ background: "var(--primary)" }}
                />
                <span className="text-xs font-bold text-foreground">
                  Participantes Convocados
                </span>
              </div>
              <span
                className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--primary)",
                  color: "white",
                }}
              >
                {afParticipantes.length}
              </span>
            </div>
            <div className="px-4 py-3 space-y-3 bg-card">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Os participantes do conselho intermediário foram mantidos.
                Adicione ou remova conforme necessário.
              </p>
              <div className="relative">
                <UserCheck
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={afPartBusca}
                  onChange={(e) => {
                    setAfPartBusca(e.target.value);
                    setAfPartOpen(true);
                  }}
                  onFocus={() => setAfPartOpen(true)}
                  placeholder="Buscar servidor por nome..."
                  className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
                />
                {afPartOpen && afPartSugeridos.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10">
                    {afPartSugeridos.slice(0, 5).map((s) => (
                      <button
                        key={s.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addAfParticipante(s);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#f7f8fa] border-b border-border last:border-0 flex items-center gap-2 transition-colors"
                      >
                        <UserCheck
                          size={11}
                          className="text-muted-foreground shrink-0"
                        />{" "}
                        {s.nome}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div
                className="min-h-13 flex flex-wrap gap-1.5 p-3 rounded-lg border border-border bg-[#f7f8fa]"
                onClick={() => setAfPartOpen(false)}
              >
                {afParticipantes.map((p) => (
                  <span
                    key={p.id}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border"
                    style={{
                      background: "var(--secondary)",
                      color: "var(--primary)",
                      borderColor: "var(--accent)",
                    }}
                  >
                    {p.nome}
                    <button
                      onClick={() => removeAfParticipante(p.id)}
                      className="hover:opacity-60 transition-opacity ml-0.5"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                {afParticipantes.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">
                    Nenhum participante adicionado.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="px-6 pb-3 text-xs font-semibold text-red-600">{error}</p>
        )}

        {/* Footer */}
        <div
          className="px-6 py-4 border-t border-border flex gap-2 shrink-0 rounded-b-2xl"
          style={{ background: "#fafbfc" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!afData || !afHora || !afNome.trim() || saving}
            onClick={handleConfirm}
            className="flex-1 py-2.5 text-sm font-bold rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(135deg, #0f4a23 0%, #15622f 100%)",
              boxShadow: "0 4px 12px rgba(15,74,35,0.25)",
            }}
          >
            {saving ? "Agendando..." : "Agendar e convocar participantes"}
          </button>
        </div>
      </div>
    </div>
  );
}
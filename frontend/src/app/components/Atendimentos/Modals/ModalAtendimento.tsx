import {
  HeartHandshake,
  Lock,
  X,
  CheckCircle,
  Search,
  Calendar,
  User,
  ChevronDown,
  AlertCircle,
  FileText,
} from "lucide-react";
import type { AlunoSugestao } from "../../../types/atendimentos";

interface ModalAtendimentoProps {
  onClose: () => void;
  fSaved: boolean;
  fAlunoBusca: string;
  setFAlunoBusca: (value: string) => void;
  fAlunoSelecionado: AlunoSugestao | null;
  setFAlunoSelecionado: (aluno: AlunoSugestao | null) => void;
  showSugestoes: boolean;
  setShowSugestoes: (show: boolean) => void;
  sugestoesFiltradas: AlunoSugestao[];
  fData: string;
  setFData: (value: string) => void;
  fServidor: string;
  setFServidor: (value: string) => void;
  servidoresOptions: string[];
  fMotivo: string;
  setFMotivo: (value: string) => void;
  motivoOptions: string[];
  fContato: string;
  setFContato: (value: string) => void;
  contatoOptions: string[];
  fRelato: string;
  setFRelato: (value: string) => void;
  handleSave: () => void;
}

export default function ModalAtendimento({
  onClose,
  fSaved,
  fAlunoBusca,
  setFAlunoBusca,
  fAlunoSelecionado,
  setFAlunoSelecionado,
  showSugestoes,
  setShowSugestoes,
  sugestoesFiltradas,
  fData,
  setFData,
  fServidor,
  setFServidor,
  servidoresOptions,
  fMotivo,
  setFMotivo,
  motivoOptions,
  fContato,
  setFContato,
  contatoOptions,
  fRelato,
  setFRelato,
  handleSave,
}: ModalAtendimentoProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full flex flex-col bg-card rounded-2xl shadow-2xl"
        style={{ maxWidth: "600px", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="px-6 py-4 rounded-t-2xl flex items-center justify-between shrink-0"
          style={{
            background: "linear-gradient(135deg, #0b3d1e 0%, #15622f 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <HeartHandshake size={18} color="white" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/60 flex items-center gap-1">
                <Lock size={9} /> NAE · Registro Sigiloso
              </p>
              <h2 className="text-sm font-bold text-white">
                Registrar Novo Atendimento
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 min-h-0">
          {fSaved ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "var(--secondary)" }}
              >
                <CheckCircle
                  size={28}
                  style={{ color: "var(--primary)" }}
                />
              </div>
              <p className="text-sm font-bold text-foreground">
                Atendimento registrado!
              </p>
              <p className="text-xs text-muted-foreground">
                O registro foi salvo com sucesso no sistema.
              </p>
            </div>
          ) : (
            <>
              {/* Student search */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Discente Atendido <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Digite a matrícula ou nome do discente..."
                    value={
                      fAlunoSelecionado
                        ? `${fAlunoSelecionado.nome} (${fAlunoSelecionado.matricula})`
                        : fAlunoBusca
                    }
                    onChange={(e) => {
                      if (fAlunoSelecionado) setFAlunoSelecionado(null);
                      setFAlunoBusca(e.target.value);
                      setShowSugestoes(true);
                    }}
                    onFocus={() => setShowSugestoes(true)}
                    className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground transition-all"
                  />
                  {fAlunoSelecionado && (
                    <button
                      onClick={() => {
                        setFAlunoSelecionado(null);
                        setFAlunoBusca("");
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={12} />
                    </button>
                  )}
                  {showSugestoes &&
                    sugestoesFiltradas.length > 0 &&
                    !fAlunoSelecionado && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                        {sugestoesFiltradas.map((s) => (
                          <button
                            key={s.matricula}
                            className="w-full text-left px-3 py-2.5 hover:bg-[#f7f8fa] transition-colors border-b border-border last:border-0"
                            onClick={() => {
                              setFAlunoSelecionado(s);
                              setFAlunoBusca("");
                              setShowSugestoes(false);
                            }}
                          >
                            <p className="text-sm font-medium text-foreground">
                              {s.nome}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {s.matricula} · {s.turma}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                </div>
                {fAlunoSelecionado && (
                  <div
                    className="mt-1.5 flex items-center gap-1.5 text-xs"
                    style={{ color: "var(--primary)" }}
                  >
                    <CheckCircle size={11} />
                    {fAlunoSelecionado.turma}
                  </div>
                )}
              </div>

              {/* Date + Servidor (2-col) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Data do Atendimento <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="date"
                      value={fData}
                      onChange={(e) => setFData(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-foreground transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Servidor Responsável <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <select
                      value={fServidor}
                      onChange={(e) => setFServidor(e.target.value)}
                      className="w-full appearance-none pl-9 pr-8 py-2.5 text-sm rounded-xl border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                      style={{
                        color: fServidor
                          ? "var(--foreground)"
                          : "var(--muted-foreground)",
                      }}
                    >
                      <option value="">Selecione...</option>
                      {servidoresOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Motivo + Contato (2-col) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Motivo / Queixa Inicial{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <AlertCircle
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <select
                      value={fMotivo}
                      onChange={(e) => setFMotivo(e.target.value)}
                      className="w-full appearance-none pl-9 pr-8 py-2.5 text-sm rounded-xl border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                      style={{
                        color: fMotivo
                          ? "var(--foreground)"
                          : "var(--muted-foreground)",
                      }}
                    >
                      <option value="">Selecione...</option>
                      {motivoOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Motivo do Contato
                  </label>
                  <div className="relative">
                    <FileText
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <select
                      value={fContato}
                      onChange={(e) => setFContato(e.target.value)}
                      className="w-full appearance-none pl-9 pr-8 py-2.5 text-sm rounded-xl border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer transition-all"
                      style={{
                        color: fContato
                          ? "var(--foreground)"
                          : "var(--muted-foreground)",
                      }}
                    >
                      <option value="">Selecione...</option>
                      {contatoOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Relato */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 items-center gap-1.5">
                  <Lock size={11} className="text-muted-foreground" />
                  Relato Detalhado do Atendimento
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div
                  className="rounded-xl border overflow-hidden transition-all"
                  style={{
                    borderColor: fRelato ? "var(--primary)" : "var(--border)",
                    boxShadow: fRelato
                      ? "0 0 0 3px rgba(21,98,47,0.08)"
                      : undefined,
                  }}
                >
                  <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 flex items-center gap-1.5">
                    <Lock size={10} className="text-amber-600" />
                    <span className="text-xs text-amber-700 font-medium">
                      Sigiloso — Restrito à Equipe Pedagógica
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={fRelato}
                    onChange={(e) => setFRelato(e.target.value)}
                    placeholder="Descreva detalhadamente o conteúdo do atendimento: contexto, intervenções realizadas, encaminhamentos e próximos passos..."
                    className="w-full px-3 py-2.5 text-sm bg-[#f7f8fa] outline-none resize-none placeholder:text-muted-foreground leading-relaxed"
                  />
                  <div className="px-3 py-1.5 bg-[#f7f8fa] border-t border-border flex justify-end">
                    <span className="text-xs text-muted-foreground">
                      {fRelato.length} caracteres
                    </span>
                  </div>
                </div>
              </div>

              {(!fAlunoSelecionado || !fMotivo || !fRelato) && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-red-500">*</span> Campos obrigatórios
                </p>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!fSaved && (
          <div
            className="px-6 py-4 border-t border-gray-100 flex gap-2 shrink-0 rounded-b-2xl"
            style={{ background: "#fafbfc" }}
          >
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold rounded-xl border text-gray-700 hover:bg-gray-100 transition-colors"
              style={{ borderColor: "#e5e7eb" }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!fAlunoSelecionado || !fMotivo || !fRelato}
              className="flex-1 py-2.5 text-sm font-bold rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(135deg, #0f4a23 0%, #15622f 100%)",
                boxShadow: "0 4px 12px rgba(15,74,35,0.25)",
              }}
            >
              Salvar Registro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
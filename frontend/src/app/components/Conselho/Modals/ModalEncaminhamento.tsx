import { X, Send } from "lucide-react";
import { alunos, alunosTurmaB, turmasData, CATEGORIAS_REGISTRO, SERVIDORES_OPTIONS as servidores } from "../../../data/conselhoData";

interface ModalEncaminhamentoProps {
  novoEncOpen: boolean;
  setNovoEncOpen: (open: boolean) => void;
  neAluno: string;
  selectNeAluno: (nome: string) => void;
  neTurma: string;
  neTitulo: string;
  setNeTitulo: (titulo: string) => void;
  neCategoria: string;
  setNeCategoria: (categoria: string) => void;
  neServidor: string;
  setNeServidor: (servidor: string) => void;
  neDescricao: string;
  setNeDescricao: (descricao: string) => void;
  submitNovoEnc: () => void;
}

export default function ModalEncaminhamento({
  novoEncOpen,
  setNovoEncOpen,
  neAluno,
  selectNeAluno,
  neTurma,
  neTitulo,
  setNeTitulo,
  neCategoria,
  setNeCategoria,
  neServidor,
  setNeServidor,
  neDescricao,
  setNeDescricao,
  submitNovoEnc,
}: ModalEncaminhamentoProps) {

  const alunosComTurma  = [
    ...alunos.map((a) => ({ ...a, turma: turmasData[0].nome })),
    ...alunosTurmaB.map((a) => ({ ...a, risco: false as boolean, turma: turmasData[1].nome })),
  ];
  
  return (
    <>
      {/* ── Modal: Novo Encaminhamento ──────────────────────────────────────── */}
      {novoEncOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setNovoEncOpen(false)}>
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Encaminhamentos · Novo</p>
                <h2 className="text-base font-bold text-foreground mt-0.5">Novo Encaminhamento</h2>
              </div>
              <button onClick={() => setNovoEncOpen(false)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Estudante <span className="text-red-500">*</span></label>
                  <select value={neAluno} onChange={(e) => selectNeAluno(e.target.value)} className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer">
                    <option value="">— Selecione —</option>
                    {alunosComTurma.map((a) => <option key={a.matricula} value={a.nome}>{a.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Turma</label>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
                    {neTurma || <span className="italic">Automática</span>}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Título <span className="text-red-500">*</span></label>
                <input type="text" value={neTitulo} onChange={(e) => setNeTitulo(e.target.value)} placeholder="Título do encaminhamento..." className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary placeholder:text-muted-foreground transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Categoria <span className="text-red-500">*</span></label>
                <select value={neCategoria} onChange={(e) => setNeCategoria(e.target.value)} className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer">
                  <option value="">— Selecione —</option>
                  {CATEGORIAS_REGISTRO.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Servidor responsável</label>
                <select value={neServidor} onChange={(e) => setNeServidor(e.target.value)} className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer">
                  {servidores.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Descrição</label>
                <textarea rows={3} value={neDescricao} onChange={(e) => setNeDescricao(e.target.value)} placeholder="Descreva o contexto e o objetivo do encaminhamento..." className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none placeholder:text-muted-foreground transition-all" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setNovoEncOpen(false)} className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl transition-all hover:bg-muted">Cancelar</button>
              <button
                onClick={submitNovoEnc}
                disabled={!neAluno || !neTitulo || !neCategoria}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "var(--primary)" }}
              >
                <Send size={13} />Criar Encaminhamento
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
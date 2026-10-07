import { X, Send } from "lucide-react";
import { CATEGORIAS_REGISTRO } from "../../../data/conselhoData";
import type { Aluno } from "../../../types/conselho";
import type { ServidorRef } from "../../../services/conselhoService";

interface ModalEncaminhamentoProps {
  setNovoEncOpen: (open: boolean) => void;
  alunos: Aluno[];
  servidores: ServidorRef[];
  neMatricula: string;
  setNeMatricula: (matricula: string) => void;
  neTitulo: string;
  setNeTitulo: (titulo: string) => void;
  neCategoria: string;
  setNeCategoria: (categoria: string) => void;
  neServidorId: string;
  setNeServidorId: (id: string) => void;
  neDescricao: string;
  setNeDescricao: (descricao: string) => void;
  salvando: boolean;
  submitNovoEnc: () => void;
}

export default function ModalEncaminhamento({
  setNovoEncOpen,
  alunos,
  servidores,
  neMatricula,
  setNeMatricula,
  neTitulo,
  setNeTitulo,
  neCategoria,
  setNeCategoria,
  neServidorId,
  setNeServidorId,
  neDescricao,
  setNeDescricao,
  salvando,
  submitNovoEnc,
}: ModalEncaminhamentoProps) {
  const neTurma = alunos.find((a) => a.matricula === neMatricula)?.turma ?? "";

  return (
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
              <select value={neMatricula} onChange={(e) => setNeMatricula(e.target.value)} className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer">
                <option value="">— Selecione —</option>
                {alunos.map((a) => <option key={a.matricula} value={a.matricula}>{a.nome}</option>)}
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
            <select value={neServidorId} onChange={(e) => setNeServidorId(e.target.value)} className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-[#f7f8fa] outline-none focus:border-primary cursor-pointer">
              <option value="">— Selecione —</option>
              {servidores.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
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
            disabled={!neMatricula || !neTitulo.trim() || !neCategoria || salvando}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--primary)" }}
          >
            <Send size={13} />{salvando ? "Salvando..." : "Criar Encaminhamento"}
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState, useMemo } from "react";
import {
  GraduationCap, Users, LayoutGrid, Award, BookMarked, ClipboardList,
  Search, ChevronDown, Plus, Pencil, X, Trash2, Check, AlertTriangle,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type CategoryKey = "alunos" | "servidores" | "cursos" | "disciplinas" | "turmas" | "diarios";
type ModalMode = "create" | "edit" | null;

interface Aluno      { matricula: string; nome: string; email: string; turma: string; status: string }
interface Servidor   { siape: string; nome: string; email: string; cargo: string; funcoes: string[] }
interface Curso      { nome: string; tipo: string; grau: string; modalidade: string; ppc: string; fases: number; cargaHoraria: string; coordenador: string }
interface Disciplina { sigla: string; nome: string; cargaHoraria: string; faseOferta: string; curso: string }
interface Turma      { nome: string; periodo: string; curso: string; alunos: number }
interface Diario     { codigo: string; disciplina: string; turma: string; professor: string; cargaHoraria: string; aulasPrevistas: number }

// ── Category metadata ─────────────────────────────────────────────────────────

const CATEGORIES: { key: CategoryKey; label: string; badge: string; icon: React.ElementType; entity: string; entityPlural: string }[] = [
  { key: "alunos",      label: "Alunos",               icon: GraduationCap, badge: "620 cadastrados", entity: "Aluno",      entityPlural: "Alunos Cadastrados"    },
  { key: "servidores",  label: "Usuários / Servidores", icon: Users,         badge: "48 cadastrados",  entity: "Servidor",   entityPlural: "Usuários e Servidores" },
  { key: "cursos",      label: "Cursos",                icon: Award,         badge: "6 cursos",        entity: "Curso",      entityPlural: "Cursos"                },
  { key: "disciplinas", label: "Disciplinas",           icon: BookMarked,    badge: "82 disciplinas",  entity: "Disciplina", entityPlural: "Disciplinas"           },
  { key: "turmas",      label: "Turmas",                icon: LayoutGrid,    badge: "24 turmas",       entity: "Turma",      entityPlural: "Turmas Cadastradas"    },
  { key: "diarios",     label: "Diários de Classe",     icon: ClipboardList, badge: "82 diários",      entity: "Diário",     entityPlural: "Diários de Classe"     },
];

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED_ALUNOS: Aluno[] = [
  { matricula: "202110806528", nome: "João Pedro Silva",       email: "joao.silva@aluno.ifsc.edu.br",      turma: "TDS 2026/1",         status: "Ativo"   },
  { matricula: "202210809911", nome: "Maria Eduarda Oliveira", email: "maria.oliveira@aluno.ifsc.edu.br",  turma: "TDS 2026/2",         status: "Ativo"   },
  { matricula: "202310804422", nome: "Carlos Henrique Souza",  email: "carlos.souza@aluno.ifsc.edu.br",    turma: "MEC 4ª Fase 2026/1", status: "Ativo"   },
  { matricula: "202110801345", nome: "Ana Beatriz Ferreira",   email: "ana.ferreira@aluno.ifsc.edu.br",    turma: "TDS 3ª Fase 2026/1", status: "Ativo"   },
  { matricula: "202210812788", nome: "Lucas Mendes Costa",     email: "lucas.costa@aluno.ifsc.edu.br",     turma: "MEC 2026/1",         status: "Inativo" },
  { matricula: "202310807654", nome: "Fernanda Costa Lima",    email: "fernanda.lima@aluno.ifsc.edu.br",   turma: "ADM 2026/1",         status: "Ativo"   },
  { matricula: "202110811234", nome: "Rafael Augusto Neves",   email: "rafael.neves@aluno.ifsc.edu.br",    turma: "TDS 4ª Fase 2026/1", status: "Ativo"   },
  { matricula: "202210803321", nome: "Isabela Rocha Martins",  email: "isabela.martins@aluno.ifsc.edu.br", turma: "MEC 3ª Fase 2026/1", status: "Ativo"   },
  { matricula: "202310809876", nome: "Thiago Alves Pereira",   email: "thiago.pereira@aluno.ifsc.edu.br",  turma: "TDS 2026/1",         status: "Ativo"   },
  { matricula: "202110814499", nome: "Camila Dias Santos",     email: "camila.santos@aluno.ifsc.edu.br",   turma: "ADM 2ª Fase 2026/2", status: "Inativo" },
];

const SEED_SERVIDORES: Servidor[] = [
  { siape: "1234567", nome: "Ana Clara Souza",  email: "ana.souza@ifsc.edu.br",    cargo: "Equipe Pedagógica/NAE", funcoes: ["Psicóloga Educacional", "Secretaria Acadêmica"]                          },
  { siape: "7654321", nome: "Carlos Lima",      email: "carlos.lima@ifsc.edu.br",  cargo: "Professor",             funcoes: ["Turma: TDS 2026/1", "Turma: TDS 2026/2"]                                },
  { siape: "9876543", nome: "Maria Santos",     email: "maria.santos@ifsc.edu.br", cargo: "Coordenador de Curso",  funcoes: ["Coord. Desenvolvimento de Sistemas", "Prof. Banco de Dados"]            },
  { siape: "3456789", nome: "Marcos Pereira",   email: "marcos@ifsc.edu.br",       cargo: "Coordenador de Curso",  funcoes: ["Coord. Mecatrônica", "Prof. Automação Industrial"]                     },
  { siape: "5678901", nome: "Juliana Rocha",    email: "juliana@ifsc.edu.br",      cargo: "Professor",             funcoes: ["Turma: MEC 2026/1", "Turma: ADM 2026/1", "Turma: TDS 3ª Fase 2026/1"] },
  { siape: "6789012", nome: "Fernanda Lima",    email: "fernanda@ifsc.edu.br",     cargo: "Equipe Pedagógica/NAE", funcoes: ["Pedagoga", "Coord. de Turno Vespertino"]                               },
  { siape: "2345678", nome: "Roberto Andrade",  email: "roberto@ifsc.edu.br",      cargo: "Servidor Geral",        funcoes: ["Assistente Administrativo", "Apoio à Secretaria"]                      },
  { siape: "8901234", nome: "Patrícia Gomes",   email: "patricia@ifsc.edu.br",     cargo: "Professor",             funcoes: ["Turma: MEC 2026/2", "Turma: MEC 3ª Fase 2026/1"]                      },
];

const SEED_CURSOS: Curso[] = [
  { nome: "Técnico em Desenvolvimento de Sistemas", tipo: "Técnico", grau: "Integrado ao EM", modalidade: "Presencial", ppc: "PPC 2023", fases: 4, cargaHoraria: "3.200h", coordenador: "Maria Santos"   },
  { nome: "Técnico em Mecatrônica",                 tipo: "Técnico", grau: "Integrado ao EM", modalidade: "Presencial", ppc: "PPC 2022", fases: 4, cargaHoraria: "3.400h", coordenador: "Marcos Pereira" },
  { nome: "Técnico em Administração",               tipo: "Técnico", grau: "Concomitante",    modalidade: "Presencial", ppc: "PPC 2021", fases: 3, cargaHoraria: "1.200h", coordenador: "Fernanda Lima"  },
  { nome: "Técnico em Enfermagem",                  tipo: "Técnico", grau: "Subsequente",     modalidade: "Presencial", ppc: "PPC 2020", fases: 3, cargaHoraria: "1.600h", coordenador: "—"              },
  { nome: "Técnico em Eletrotécnica",               tipo: "Técnico", grau: "Integrado ao EM", modalidade: "Presencial", ppc: "PPC 2019", fases: 4, cargaHoraria: "3.000h", coordenador: "Roberto Andrade"},
  { nome: "Técnico em Agroindústria",               tipo: "Técnico", grau: "Subsequente",     modalidade: "Presencial", ppc: "PPC 2021", fases: 3, cargaHoraria: "1.400h", coordenador: "—"              },
];

const SEED_DISCIPLINAS: Disciplina[] = [
  { sigla: "ALG",  nome: "Algoritmos e Programação", cargaHoraria: "80h", faseOferta: "1ª Fase", curso: "Técnico em Desenvolvimento de Sistemas" },
  { sigla: "BD",   nome: "Banco de Dados",           cargaHoraria: "60h", faseOferta: "2ª Fase", curso: "Técnico em Desenvolvimento de Sistemas" },
  { sigla: "PW",   nome: "Programação Web",          cargaHoraria: "80h", faseOferta: "2ª Fase", curso: "Técnico em Desenvolvimento de Sistemas" },
  { sigla: "ED",   nome: "Estrutura de Dados",       cargaHoraria: "80h", faseOferta: "3ª Fase", curso: "Técnico em Desenvolvimento de Sistemas" },
  { sigla: "SO",   nome: "Sistemas Operacionais",    cargaHoraria: "72h", faseOferta: "4ª Fase", curso: "Técnico em Desenvolvimento de Sistemas" },
  { sigla: "ES",   nome: "Engenharia de Software",   cargaHoraria: "72h", faseOferta: "4ª Fase", curso: "Técnico em Desenvolvimento de Sistemas" },
  { sigla: "ING",  nome: "Inglês Técnico",           cargaHoraria: "40h", faseOferta: "1ª Fase", curso: "Técnico em Desenvolvimento de Sistemas" },
  { sigla: "ELE",  nome: "Eletrônica Digital",       cargaHoraria: "72h", faseOferta: "3ª Fase", curso: "Técnico em Mecatrônica"                },
  { sigla: "MAT",  nome: "Matemática Aplicada",      cargaHoraria: "60h", faseOferta: "2ª Fase", curso: "Técnico em Mecatrônica"                },
  { sigla: "HID",  nome: "Hidráulica e Pneumática",  cargaHoraria: "60h", faseOferta: "3ª Fase", curso: "Técnico em Mecatrônica"                },
  { sigla: "GES",  nome: "Gestão Empresarial",       cargaHoraria: "60h", faseOferta: "1ª Fase", curso: "Técnico em Administração"              },
  { sigla: "CONT", nome: "Contabilidade Básica",     cargaHoraria: "60h", faseOferta: "2ª Fase", curso: "Técnico em Administração"              },
];

const SEED_TURMAS: Turma[] = [
  { nome: "TDS 2026/1",         periodo: "2026.1", curso: "Técnico em Desenvolvimento de Sistemas", alunos: 28 },
  { nome: "TDS 2026/2",         periodo: "2026.2", curso: "Técnico em Desenvolvimento de Sistemas", alunos: 32 },
  { nome: "TDS 3ª Fase 2026/1", periodo: "2026.1", curso: "Técnico em Desenvolvimento de Sistemas", alunos: 24 },
  { nome: "TDS 4ª Fase 2026/1", periodo: "2026.1", curso: "Técnico em Desenvolvimento de Sistemas", alunos: 19 },
  { nome: "MEC 2026/1",         periodo: "2026.1", curso: "Técnico em Mecatrônica",                 alunos: 30 },
  { nome: "MEC 3ª Fase 2026/1", periodo: "2026.1", curso: "Técnico em Mecatrônica",                 alunos: 26 },
  { nome: "MEC 4ª Fase 2026/1", periodo: "2026.1", curso: "Técnico em Mecatrônica",                 alunos: 22 },
  { nome: "ADM 2026/1",         periodo: "2026.1", curso: "Técnico em Administração",               alunos: 35 },
  { nome: "ADM 2ª Fase 2026/2", periodo: "2026.2", curso: "Técnico em Administração",               alunos: 31 },
];

const SEED_DIARIOS: Diario[] = [
  { codigo: "DIR-2026-01", disciplina: "Banco de Dados",          turma: "TDS 2026/1",         professor: "Juliana Rocha",  cargaHoraria: "60h", aulasPrevistas: 72 },
  { codigo: "DIR-2026-02", disciplina: "Programação Web",         turma: "TDS 2026/1",         professor: "Carlos Lima",    cargaHoraria: "80h", aulasPrevistas: 96 },
  { codigo: "DIR-2026-03", disciplina: "Estrutura de Dados",      turma: "TDS 3ª Fase 2026/1", professor: "Carlos Lima",    cargaHoraria: "80h", aulasPrevistas: 96 },
  { codigo: "DIR-2026-04", disciplina: "Matemática Aplicada",     turma: "MEC 2026/1",         professor: "Patrícia Gomes", cargaHoraria: "60h", aulasPrevistas: 72 },
  { codigo: "DIR-2026-05", disciplina: "Eletrônica Digital",      turma: "MEC 3ª Fase 2026/1", professor: "Patrícia Gomes", cargaHoraria: "72h", aulasPrevistas: 86 },
  { codigo: "DIR-2026-06", disciplina: "Gestão Empresarial",      turma: "ADM 2026/1",         professor: "Juliana Rocha",  cargaHoraria: "60h", aulasPrevistas: 72 },
  { codigo: "DIR-2026-07", disciplina: "Inglês Técnico",          turma: "TDS 2026/1",         professor: "Carlos Lima",    cargaHoraria: "40h", aulasPrevistas: 48 },
  { codigo: "DIR-2026-08", disciplina: "Sistemas Operacionais",   turma: "TDS 4ª Fase 2026/1", professor: "Patrícia Gomes", cargaHoraria: "72h", aulasPrevistas: 86 },
  { codigo: "DIR-2026-09", disciplina: "Hidráulica e Pneumática", turma: "MEC 3ª Fase 2026/1", professor: "Juliana Rocha",  cargaHoraria: "60h", aulasPrevistas: 72 },
];

const FASES = ["1ª Fase","2ª Fase","3ª Fase","4ª Fase","5ª Fase","6ª Fase","7ª Fase","8ª Fase"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).map((n) => n[0].toUpperCase()).slice(0, 2).join("");
}
const PALETTE = ["#15622f","#1d6b9a","#7c3aed","#b45309","#0f766e","#be185d","#1e40af","#92400e","#4c1d95"];
function avatarColor(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
}
function stripPrefix(nome: string) {
  return nome.replace(/^Técnico em\s+/i,"").replace(/^Técnico\s+/i,"").replace(/^Superior em\s+/i,"").replace(/^Bacharelado em\s+/i,"").trim();
}
function unique<T>(arr: T[]): T[] { return [...new Set(arr)]; }

// ── Badge components ──────────────────────────────────────────────────────────

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white shrink-0"
      style={{ width: size, height: size, fontSize: size <= 28 ? 10 : 12, background: avatarColor(name) }}>
      {getInitials(name)}
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  const ok = label === "Ativo" || label === "Ativa";
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: ok ? "#dcfce7" : "#f3f4f6", color: ok ? "#166534" : "#6b7280" }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: ok ? "#16a34a" : "#9ca3af" }} />
      {label}
    </span>
  );
}

function CargoBadge({ label }: { label: string }) {
  const map: Record<string,{bg:string;color:string}> = {
    "Professor":             {bg:"#eff6ff",color:"#1d4ed8"},
    "Coordenador de Curso":  {bg:"#f0fdf4",color:"#15803d"},
    "Equipe Pedagógica/NAE": {bg:"#faf5ff",color:"#7e22ce"},
    "Servidor Geral":        {bg:"#f9fafb",color:"#4b5563"},
  };
  const c = map[label] ?? {bg:"#f3f4f6",color:"#374151"};
  return <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap" style={{background:c.bg,color:c.color}}>{label}</span>;
}

function FuncaoBadge({ tag }: { tag: string }) {
  const s = tag.startsWith("Turma:") ? {bg:"#eff6ff",color:"#1d4ed8",border:"#bfdbfe"}
           : tag.startsWith("Coord.") ? {bg:"#f0fdf4",color:"#15803d",border:"#bbf7d0"}
           : tag.startsWith("Prof.") ?  {bg:"#eef2ff",color:"#4338ca",border:"#c7d2fe"}
           :                             {bg:"#faf5ff",color:"#7e22ce",border:"#e9d5ff"};
  return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap border" style={{background:s.bg,color:s.color,borderColor:s.border}}>{tag}</span>;
}

function PeriodBadge({ label }: { label: string }) {
  return <span className="inline-block px-2 py-0.5 rounded-md text-xs font-bold" style={{background:"#e8f0eb",color:"#0f4a23",fontFamily:"'JetBrains Mono', monospace"}}>{label}</span>;
}
function SiglaBadge({ label }: { label: string }) {
  return <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider" style={{background:"#f0f2f5",color:"#374151",fontFamily:"'JetBrains Mono', monospace"}}>{label}</span>;
}
function PpcBadge({ label }: { label: string }) {
  return <span className="inline-block px-2 py-0.5 rounded-md text-xs font-bold" style={{background:"#fef9c3",color:"#713f12"}}>{label}</span>;
}
function GrauBadge({ label }: { label: string }) {
  const map: Record<string,{bg:string;color:string}> = {
    "Integrado ao EM":{bg:"#eff6ff",color:"#1d4ed8"},"Concomitante":{bg:"#fef3c7",color:"#92400e"},
    "Subsequente":{bg:"#f0fdf4",color:"#15803d"},"Bacharelado":{bg:"#faf5ff",color:"#7e22ce"},
    "Licenciatura":{bg:"#fff1f2",color:"#be123c"},"Tecnólogo":{bg:"#f0fdfa",color:"#0f766e"},
  };
  const c = map[label] ?? {bg:"#f3f4f6",color:"#374151"};
  return <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap" style={{background:c.bg,color:c.color}}>{label}</span>;
}
function FaseBadge({ label }: { label: string }) {
  return <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold" style={{background:"#f5f3ff",color:"#6d28d9"}}>{label}</span>;
}

// ── Table primitives ──────────────────────────────────────────────────────────

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{children}</th>;
}
function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return <td className="px-4 py-3.5 text-sm" style={{color:"#111827",fontFamily:mono?"'JetBrains Mono', monospace":undefined}}>{children}</td>;
}
function TRow({ children, i }: { children: React.ReactNode; i: number }) {
  return <tr className="transition-colors hover:bg-[#f8faf9]" style={{borderBottom:"1px solid #f5f5f5",background:i%2===0?"white":"#fafcfb"}}>{children}</tr>;
}
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{background:"#f0f2f5"}}>
        <Search size={20} className="text-gray-300" />
      </div>
      <p className="text-sm font-semibold text-gray-500">Nenhum resultado encontrado</p>
      <p className="text-xs text-gray-400 mt-1">Tente ajustar os filtros ou o termo de busca.</p>
    </div>
  );
}

function RowEditBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all hover:bg-[#f0faf4] hover:border-[#15622f] hover:text-[#15622f] active:scale-95"
      style={{borderColor:"#e5e7eb",color:"#374151"}}>
      <Pencil size={11} /> {label}
    </button>
  );
}

// ── Form primitives ───────────────────────────────────────────────────────────

function FLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">{children}</label>;
}

const inputBase = "w-full px-3 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all";
const inputStyle = { borderColor: "#e5e7eb", color: "#111827", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)" };
const focusCss  = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#15622f";
  e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(21,98,47,0.08), inset 0 1px 2px rgba(0,0,0,0.03)";
};
const blurCss   = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#e5e7eb";
  e.currentTarget.style.boxShadow   = "inset 0 1px 2px rgba(0,0,0,0.03)";
};

function FInput({ value, onChange, placeholder, mono }: { value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={inputBase} style={{...inputStyle, fontFamily: mono ? "'JetBrains Mono', monospace" : undefined}}
      onFocus={focusCss} onBlur={blurCss} />
  );
}
function FNumber({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={inputBase} style={inputStyle} onFocus={focusCss} onBlur={blurCss} />
  );
}
function FSelect({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className={inputBase + " appearance-none cursor-pointer pr-8"} style={{...inputStyle,color:value?"#111827":"#9ca3af"}}
        onFocus={focusCss} onBlur={blurCss}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}
function FRow({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return <div className={`grid gap-4 ${cols === 2 ? "grid-cols-2" : "grid-cols-1"}`}>{children}</div>;
}

function ToggleStatus({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2">
      {["Ativo","Inativo"].map(s => (
        <button key={s} type="button" onClick={() => onChange(s)}
          className="flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all"
          style={{
            borderColor: value === s ? (s === "Ativo" ? "#16a34a" : "#dc2626") : "#e5e7eb",
            background:  value === s ? (s === "Ativo" ? "#f0fdf4" : "#fff8f8") : "white",
            color:       value === s ? (s === "Ativo" ? "#166534" : "#dc2626") : "#9ca3af",
          }}>
          {s}
        </button>
      ))}
    </div>
  );
}

// ── Creatable Tag Input ───────────────────────────────────────────────────────

function CreatableTagInput({ value, onChange, allTags, placeholder = "Adicionar função..." }: {
  value: string[]; onChange: (v: string[]) => void; allTags: string[]; placeholder?: string;
}) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const suggestions = allTags.filter(t => !value.includes(t) && t.toLowerCase().includes(text.toLowerCase()));
  const canCreate = text.trim().length > 0 && !allTags.some(t => t.toLowerCase() === text.trim().toLowerCase()) && !value.includes(text.trim());
  const showMenu = open && (suggestions.length > 0 || canCreate);

  const add = (tag: string) => { if (!value.includes(tag)) onChange([...value, tag]); setText(""); setOpen(false); };
  const remove = (tag: string) => onChange(value.filter(v => v !== tag));

  return (
    <div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border"
              style={{background:"#faf5ff",color:"#7e22ce",borderColor:"#e9d5ff"}}>
              {tag}
              <button type="button" onClick={() => remove(tag)} className="hover:opacity-60 ml-0.5"><X size={9} strokeWidth={3}/></button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <input type="text" value={text}
          onChange={e => { setText(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={e => { if (e.key === "Enter" && text.trim()) { e.preventDefault(); add(text.trim()); } }}
          placeholder={placeholder}
          className={inputBase} style={inputStyle} />
        {showMenu && (
          <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
            {suggestions.map(s => (
              <button key={s} type="button" onMouseDown={() => add(s)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors">
                {s}
              </button>
            ))}
            {canCreate && (
              <button type="button" onMouseDown={() => add(text.trim())}
                className="w-full text-left px-3 py-2 text-xs hover:bg-purple-50 transition-colors flex items-center gap-2 border-t border-gray-100"
                style={{color:"#7e22ce"}}>
                <Plus size={11} /> Criar nova função: &ldquo;{text.trim()}&rdquo;
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Multi-select pills (bounded options) ──────────────────────────────────────

function MultiSelectPills({ value, onChange, options, placeholder }: {
  value: string[]; onChange: (v: string[]) => void; options: string[]; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (opt: string) => value.includes(opt) ? onChange(value.filter(v => v !== opt)) : onChange([...value, opt]);

  return (
    <div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map(v => (
            <span key={v} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border"
              style={{background:"#eff6ff",color:"#1d4ed8",borderColor:"#bfdbfe"}}>
              {v}
              <button type="button" onClick={() => toggle(v)} className="hover:opacity-60"><X size={9} strokeWidth={3}/></button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <button type="button" onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-xl border bg-gray-50 transition-all"
          style={{borderColor: open ? "#15622f" : "#e5e7eb", color: value.length ? "#111827" : "#9ca3af"}}>
          <span>{value.length ? `${value.length} turma(s) selecionada(s)` : (placeholder || "Selecionar turmas...")}</span>
          <ChevronDown size={13} className="text-gray-400" />
        </button>
        {open && (
          <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-44 overflow-y-auto">
            {options.map(opt => (
              <button key={opt} type="button" onClick={() => toggle(opt)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors flex items-center gap-2">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${value.includes(opt) ? "bg-[#15622f] border-[#15622f]" : "border-gray-300"}`}>
                  {value.includes(opt) && <Check size={9} color="white" strokeWidth={3} />}
                </div>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Filter bar primitives ─────────────────────────────────────────────────────

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative flex-1 max-w-xs">
      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border bg-gray-50 outline-none transition-all"
        style={{borderColor:"#e5e7eb",color:"#111827"}}
        onFocus={e => { e.currentTarget.style.borderColor="#15622f"; e.currentTarget.style.boxShadow="0 0 0 3px rgba(21,98,47,0.07)"; }}
        onBlur={e  => { e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.boxShadow="none"; }} />
    </div>
  );
}
function FilterSelect({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <div className="relative shrink-0">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 text-xs rounded-xl border bg-gray-50 outline-none cursor-pointer font-medium"
        style={{borderColor: value ? "#15622f" : "#e5e7eb", color: value ? "#0f4a23" : "#374151"}}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ── Modal shell ───────────────────────────────────────────────────────────────

function Modal({ title, entity, mode, children, onClose, onSave, onRequestDelete, deleteConfirm, onConfirmDelete, onCancelDelete }: {
  title: string; entity: string; mode: "create" | "edit";
  children: React.ReactNode; onClose: () => void; onSave: () => void;
  onRequestDelete: () => void; deleteConfirm: boolean;
  onConfirmDelete: () => void; onCancelDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: "88vh" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl shrink-0"
          style={{ background: "linear-gradient(135deg, #0b3d1e 0%, #15622f 100%)" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{color:"rgba(255,255,255,0.5)"}}>
              {mode === "create" ? "Novo registro" : "Editar registro"}
            </p>
            <h2 className="text-sm font-bold text-white mt-0.5">{title}</h2>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:bg-white/10 text-white/60 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 min-h-0">
          {children}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 rounded-b-2xl shrink-0" style={{background:"#fafbfc"}}>
          {deleteConfirm ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl border"
                style={{background:"#fff8f8",borderColor:"#fecaca"}}>
                <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 font-medium leading-relaxed">
                  Deseja realmente excluir este registro? Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={onCancelDelete}
                  className="flex-1 py-2 rounded-xl border text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  style={{borderColor:"#e5e7eb"}}>
                  Cancelar
                </button>
                <button onClick={onConfirmDelete}
                  className="flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-all hover:bg-red-50 flex items-center justify-center gap-2"
                  style={{borderColor:"#dc2626",color:"#dc2626"}}>
                  <Trash2 size={13} /> Confirmar Exclusão
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {mode === "edit" && (
                <button onClick={onRequestDelete}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-xs font-bold transition-all hover:bg-red-50"
                  style={{borderColor:"#dc2626",color:"#dc2626"}}>
                  <Trash2 size={12} /> Excluir {entity}
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button onClick={onClose}
                  className="px-4 py-2 rounded-xl border text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  style={{borderColor:"#e5e7eb"}}>
                  Cancelar
                </button>
                <button onClick={onSave}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.99]"
                  style={{background:"linear-gradient(135deg, #0f4a23 0%, #15622f 100%)",boxShadow:"0 4px 12px rgba(15,74,35,0.28)"}}>
                  {mode === "create" ? "Salvar Registro" : "Salvar Alterações"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Cadastros() {
  // ── Mutable data state ────────────────────────────────────────────────────
  const [alunosData,      setAlunosData]      = useState<Aluno[]>([...SEED_ALUNOS]);
  const [servidoresData,  setServidoresData]  = useState<Servidor[]>([...SEED_SERVIDORES]);
  const [cursosData,      setCursosData]      = useState<Curso[]>([...SEED_CURSOS]);
  const [disciplinasData, setDisciplinasData] = useState<Disciplina[]>([...SEED_DISCIPLINAS]);
  const [turmasData,      setTurmasData]      = useState<Turma[]>([...SEED_TURMAS]);
  const [diariosData,     setDiariosData]     = useState<Diario[]>([...SEED_DIARIOS]);

  // ── Navigation / filter state ─────────────────────────────────────────────
  const [active,  setActive]  = useState<CategoryKey>("alunos");
  const [search,  setSearch]  = useState("");
  const [fStatus,     setFStatus]     = useState("");
  const [fCargo,      setFCargo]      = useState("");
  const [fFuncao,     setFFuncao]     = useState("");
  const [fTipo,       setFTipo]       = useState("");
  const [fGrau,       setFGrau]       = useState("");
  const [fModalidade, setFModalidade] = useState("");
  const [fDiscCurso,  setFDiscCurso]  = useState("");
  const [fFase,       setFFase]       = useState("");
  const [fTurmaPer,   setFTurmaPer]   = useState("");
  const [fTurmaCurso, setFTurmaCurso] = useState("");
  const [fDiarioTurma, setFDiarioTurma] = useState("");
  const [fDiarioProf,  setFDiarioProf]  = useState("");

  // ── Modal state ───────────────────────────────────────────────────────────
  const [modalMode,     setModalMode]     = useState<ModalMode>(null);
  const [editingItem,   setEditingItem]   = useState<any>(null);
  const [formState,     setFormState]     = useState<Record<string,any>>({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const sf = (k: string, v: any) => setFormState(s => ({...s,[k]:v}));
  const fs = formState;

  const cat = CATEGORIES.find(c => c.key === active)!;

  // ── Derived option lists ──────────────────────────────────────────────────
  const turmaNames      = useMemo(() => turmasData.map(t => t.nome), [turmasData]);
  const cursoNames      = useMemo(() => cursosData.map(c => c.nome), [cursosData]);
  const disciplinaNames = useMemo(() => disciplinasData.map(d => d.nome), [disciplinasData]);
  const professorNames  = useMemo(() => servidoresData.filter(s => s.cargo === "Professor").map(s => s.nome), [servidoresData]);
  const servidorNames   = useMemo(() => servidoresData.map(s => s.nome), [servidoresData]);
  const allFuncoes      = useMemo(() => unique(servidoresData.flatMap(s => s.funcoes)).sort(), [servidoresData]);
  const discCursos      = useMemo(() => unique(disciplinasData.map(d => d.curso)), [disciplinasData]);
  const discFases       = useMemo(() => unique(disciplinasData.map(d => d.faseOferta)).sort(), [disciplinasData]);
  const turmaPers       = useMemo(() => unique(turmasData.map(t => t.periodo)).sort(), [turmasData]);
  const turmaCursos     = useMemo(() => unique(turmasData.map(t => t.curso)), [turmasData]);
  const diarioTurmas    = useMemo(() => unique(diariosData.map(d => d.turma)).sort(), [diariosData]);

  // ── Filter logic ──────────────────────────────────────────────────────────
  const q = search.trim().toLowerCase();
  const matchQ = (...fields: string[]) => !q || fields.some(f => f.toLowerCase().includes(q));
  const matchS = (s: string) => !fStatus || (fStatus==="ativo" ? s==="Ativo" : s==="Inativo");

  const filteredAlunos      = alunosData.filter(r => matchQ(r.matricula,r.nome,r.email) && matchS(r.status));
  const filteredServidores  = servidoresData.filter(r => matchQ(r.siape,r.nome,r.email,r.cargo,...r.funcoes) && (!fCargo||r.cargo===fCargo) && (!fFuncao||r.funcoes.some(f=>f===fFuncao)));
  const filteredCursos      = cursosData.filter(r => matchQ(r.nome,r.tipo,r.grau,r.coordenador) && (!fTipo||r.tipo===fTipo) && (!fGrau||r.grau===fGrau) && (!fModalidade||r.modalidade===fModalidade));
  const filteredDisciplinas = disciplinasData.filter(r => matchQ(r.sigla,r.nome,r.curso) && (!fDiscCurso||r.curso===fDiscCurso) && (!fFase||r.faseOferta===fFase));
  const filteredTurmas      = turmasData.filter(r => matchQ(r.nome,r.curso) && (!fTurmaPer||r.periodo===fTurmaPer) && (!fTurmaCurso||r.curso===fTurmaCurso));
  const filteredDiarios     = diariosData.filter(r => matchQ(r.codigo,r.disciplina,r.turma,r.professor) && (!fDiarioTurma||r.turma===fDiarioTurma) && (!fDiarioProf||r.professor===fDiarioProf));

  const rowCount = {alunos:filteredAlunos.length,servidores:filteredServidores.length,cursos:filteredCursos.length,disciplinas:filteredDisciplinas.length,turmas:filteredTurmas.length,diarios:filteredDiarios.length}[active];

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const defaultFS = (k: CategoryKey): Record<string,any> => ({
    alunos:      {nome:"",matricula:"",email:"",turma:"",status:"Ativo"},
    servidores:  {siape:"",nome:"",email:"",cargo:"",turmasLecionadas:[],cursoCoord:"",funcoes:[]},
    cursos:      {nome:"",tipo:"",grau:"",modalidade:"",ppc:"",fases:"",cargaHoraria:"",coordenador:""},
    disciplinas: {sigla:"",nome:"",cargaHoraria:"",faseOferta:"",curso:""},
    turmas:      {nome:"",periodo:"",curso:"",alunos:""},
    diarios:     {codigo:"",disciplina:"",turma:"",professor:"",cargaHoraria:"",aulasPrevistas:""},
  }[k]);

  const itemToFS = (k: CategoryKey, item: any): Record<string,any> => {
    if (k === "alunos")      return {nome:item.nome,matricula:item.matricula,email:item.email,turma:item.turma||"",status:item.status};
    if (k === "cursos")      return {nome:item.nome,tipo:item.tipo,grau:item.grau,modalidade:item.modalidade,ppc:item.ppc.replace("PPC ",""),fases:String(item.fases),cargaHoraria:item.cargaHoraria,coordenador:item.coordenador==="—"?"":item.coordenador};
    if (k === "disciplinas") return {sigla:item.sigla,nome:item.nome,cargaHoraria:item.cargaHoraria,faseOferta:item.faseOferta,curso:item.curso};
    if (k === "turmas")      return {nome:item.nome,periodo:item.periodo,curso:item.curso,alunos:String(item.alunos)};
    if (k === "diarios")     return {codigo:item.codigo,disciplina:item.disciplina,turma:item.turma,professor:item.professor,cargaHoraria:item.cargaHoraria,aulasPrevistas:String(item.aulasPrevistas)};
    if (k === "servidores") {
      const cargo = item.cargo;
      const turmasLecionadas = cargo==="Professor" ? item.funcoes.filter((f:string)=>f.startsWith("Turma: ")).map((f:string)=>f.replace("Turma: ","")) : [];
      const coordFunc = cargo==="Coordenador de Curso" ? item.funcoes.find((f:string)=>f.startsWith("Coord. ")) : "";
      const cursoCoord = coordFunc ? cursosData.find(c=>stripPrefix(c.nome)===coordFunc.replace("Coord. ",""))?.nome||"" : "";
      const funcoes = (cargo==="Equipe Pedagógica/NAE"||cargo==="Servidor Geral") ? [...item.funcoes] : [];
      return {siape:item.siape,nome:item.nome,email:item.email,cargo,turmasLecionadas,cursoCoord,funcoes};
    }
    return {};
  };

  const fsToItem = (k: CategoryKey, f: Record<string,any>): any => {
    if (k === "alunos")      return {matricula:f.matricula,nome:f.nome,email:f.email,turma:f.turma,status:f.status};
    if (k === "cursos")      return {nome:f.nome.trim(),tipo:f.tipo,grau:f.grau,modalidade:f.modalidade,ppc:`PPC ${f.ppc}`,fases:parseInt(f.fases)||0,cargaHoraria:f.cargaHoraria,coordenador:f.coordenador||"—"};
    if (k === "disciplinas") return {sigla:f.sigla.toUpperCase(),nome:f.nome,cargaHoraria:f.cargaHoraria,faseOferta:f.faseOferta,curso:f.curso};
    if (k === "turmas")      return {nome:f.nome,periodo:f.periodo,curso:f.curso,alunos:parseInt(f.alunos)||0};
    if (k === "diarios")     return {codigo:f.codigo,disciplina:f.disciplina,turma:f.turma,professor:f.professor,cargaHoraria:f.cargaHoraria,aulasPrevistas:parseInt(f.aulasPrevistas)||0};
    if (k === "servidores") {
      const cargo = f.cargo;
      const funcoes = cargo==="Professor" ? (f.turmasLecionadas||[]).map((t:string)=>`Turma: ${t}`)
                    : cargo==="Coordenador de Curso" ? (f.cursoCoord ? [`Coord. ${stripPrefix(f.cursoCoord)}`] : [])
                    : f.funcoes||[];
      return {siape:f.siape,nome:f.nome,email:f.email,cargo,funcoes};
    }
    return {};
  };

  const getKey = (k: CategoryKey, item: any): string => {
    if (k==="alunos")      return item.matricula;
    if (k==="servidores")  return item.siape;
    if (k==="cursos")      return item.nome;
    if (k==="disciplinas") return `${item.sigla}__${item.curso}`;
    if (k==="turmas")      return `${item.nome}__${item.periodo}`;
    if (k==="diarios")     return item.codigo;
    return "";
  };

  const openCreate = () => { setFormState(defaultFS(active)); setEditingItem(null); setDeleteConfirm(false); setModalMode("create"); };
  const openEdit   = (item: any) => { setFormState(itemToFS(active,item)); setEditingItem(item); setDeleteConfirm(false); setModalMode("edit"); };
  const closeModal = () => { setModalMode(null); setEditingItem(null); setDeleteConfirm(false); };

  const handleSave = () => {
    const newItem = fsToItem(active, fs);
    const key = editingItem ? getKey(active, editingItem) : "";
    if (active==="alunos") {
      if (modalMode==="create") setAlunosData(d=>[...d,newItem]);
      else setAlunosData(d=>d.map(x=>getKey("alunos",x)===key?newItem:x));
    } else if (active==="servidores") {
      if (modalMode==="create") setServidoresData(d=>[...d,newItem]);
      else setServidoresData(d=>d.map(x=>getKey("servidores",x)===key?newItem:x));
    } else if (active==="cursos") {
      if (modalMode==="create") setCursosData(d=>[...d,newItem]);
      else setCursosData(d=>d.map(x=>getKey("cursos",x)===key?newItem:x));
    } else if (active==="disciplinas") {
      if (modalMode==="create") setDisciplinasData(d=>[...d,newItem]);
      else setDisciplinasData(d=>d.map(x=>getKey("disciplinas",x)===key?newItem:x));
    } else if (active==="turmas") {
      if (modalMode==="create") setTurmasData(d=>[...d,newItem]);
      else setTurmasData(d=>d.map(x=>getKey("turmas",x)===key?newItem:x));
    } else if (active==="diarios") {
      if (modalMode==="create") setDiariosData(d=>[...d,newItem]);
      else setDiariosData(d=>d.map(x=>getKey("diarios",x)===key?newItem:x));
    }
    closeModal();
  };

  const handleDelete = () => {
    const key = getKey(active, editingItem);
    if (active==="alunos")      setAlunosData(d=>d.filter(x=>getKey("alunos",x)!==key));
    else if (active==="servidores")  setServidoresData(d=>d.filter(x=>getKey("servidores",x)!==key));
    else if (active==="cursos")      setCursosData(d=>d.filter(x=>getKey("cursos",x)!==key));
    else if (active==="disciplinas") setDisciplinasData(d=>d.filter(x=>getKey("disciplinas",x)!==key));
    else if (active==="turmas")      setTurmasData(d=>d.filter(x=>getKey("turmas",x)!==key));
    else if (active==="diarios")     setDiariosData(d=>d.filter(x=>getKey("diarios",x)!==key));
    closeModal();
  };

  const switchCategory = (k: CategoryKey) => {
    setActive(k); setSearch("");
    setFStatus(""); setFCargo(""); setFFuncao(""); setFTipo(""); setFGrau(""); setFModalidade("");
    setFDiscCurso(""); setFFase(""); setFTurmaPer(""); setFTurmaCurso(""); setFDiarioTurma(""); setFDiarioProf("");
  };

  const countLabel = (() => {
    const labels:Record<CategoryKey,[string,string]> = {alunos:["aluno","alunos"],servidores:["servidor","servidores"],cursos:["curso","cursos"],disciplinas:["disciplina","disciplinas"],turmas:["turma","turmas"],diarios:["diário","diários"]};
    const [s,p] = labels[active];
    return `${rowCount} ${rowCount===1?s:p}`;
  })();

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="w-full px-6 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Cadastros Institucionais</h1>
            <p className="text-sm text-gray-500 mt-0.5">Gerenciamento de dados de alunos, servidores, turmas, cursos e diários do Câmpus Lages.</p>
          </div>
          <button type="button" onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shrink-0 transition-all hover:opacity-90 active:scale-[0.99]"
            style={{background:"linear-gradient(135deg, #0f4a23 0%, #15622f 100%)",boxShadow:"0 4px 12px rgba(15,74,35,0.28)"}}>
            <Plus size={14} /> Cadastrar Novo {cat.entity}
          </button>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-6 gap-3">
          {CATEGORIES.map(c => {
            const isActive = c.key === active;
            const Icon = c.icon;
            return (
              <button key={c.key} type="button" onClick={() => switchCategory(c.key)}
                className="flex flex-col items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md"
                style={{borderColor:isActive?"#15622f":"#e5e7eb",background:isActive?"#f0faf4":"white",boxShadow:isActive?"0 0 0 1px rgba(21,98,47,0.1), 0 4px 12px rgba(21,98,47,0.09)":undefined}}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{background:isActive?"linear-gradient(135deg, #0f4a23, #15622f)":"#f0f2f5"}}>
                  <Icon size={17} color={isActive?"white":"#6b7280"} />
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-xs font-bold leading-tight" style={{color:isActive?"#0f4a23":"#374151"}}>{c.label}</p>
                  <p className="text-[10px] mt-1 font-medium" style={{color:isActive?"#15622f":"#9ca3af"}}>{c.badge}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Panel header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100" style={{background:"#fafbfc"}}>
            <h2 className="text-sm font-bold text-gray-800">{cat.entityPlural}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{background:"#e8f0eb",color:"#0f4a23"}}>{countLabel}</span>
          </div>

          {/* Filter toolbar */}
          <div className="flex items-center gap-3 flex-wrap px-5 py-3 border-b border-gray-100" style={{background:"#fdfdfd"}}>
            {active==="alunos" && <>
              <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome ou matrícula..." />
              <FilterSelect value={fStatus} onChange={setFStatus} placeholder="Status: Todos" options={["ativo","inativo"]} />
            </>}
            {active==="servidores" && <>
              <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome, SIAPE ou e-mail..." />
              <FilterSelect value={fCargo} onChange={setFCargo} placeholder="Cargo: Todos" options={["Professor","Coordenador de Curso","Equipe Pedagógica/NAE","Servidor Geral"]} />
              <FilterSelect value={fFuncao} onChange={setFFuncao} placeholder="Função/Área: Todas" options={allFuncoes} />
            </>}
            {active==="cursos" && <>
              <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome do curso..." />
              <FilterSelect value={fTipo} onChange={setFTipo} placeholder="Tipo: Todos" options={["Técnico","Superior","Pós-Graduação"]} />
              <FilterSelect value={fGrau} onChange={setFGrau} placeholder="Grau: Todos" options={["Integrado ao EM","Concomitante","Subsequente","Bacharelado","Licenciatura","Tecnólogo"]} />
              <FilterSelect value={fModalidade} onChange={setFModalidade} placeholder="Modalidade: Todas" options={["Presencial","EAD","Semipresencial"]} />
            </>}
            {active==="disciplinas" && <>
              <SearchInput value={search} onChange={setSearch} placeholder="Buscar por sigla ou nome da disciplina..." />
              <FilterSelect value={fDiscCurso} onChange={setFDiscCurso} placeholder="Curso: Todos" options={discCursos} />
              <FilterSelect value={fFase} onChange={setFFase} placeholder="Fase: Todas" options={discFases} />
            </>}
            {active==="turmas" && <>
              <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome da turma..." />
              <FilterSelect value={fTurmaPer} onChange={setFTurmaPer} placeholder="Período: Todos" options={turmaPers} />
              <FilterSelect value={fTurmaCurso} onChange={setFTurmaCurso} placeholder="Curso: Todos" options={turmaCursos} />
            </>}
            {active==="diarios" && <>
              <SearchInput value={search} onChange={setSearch} placeholder="Buscar por código ou disciplina..." />
              <FilterSelect value={fDiarioTurma} onChange={setFDiarioTurma} placeholder="Turma: Todas" options={diarioTurmas} />
              <FilterSelect value={fDiarioProf} onChange={setFDiarioProf} placeholder="Professor: Todos" options={professorNames} />
            </>}
          </div>

          {/* Tables */}
          <div className="overflow-x-auto">
            {active==="alunos" && (
              filteredAlunos.length===0 ? <EmptyState /> :
              <table className="w-full border-collapse">
                <thead><tr style={{background:"#fafbfc",borderBottom:"1px solid #efefef"}}><Th>Matrícula</Th><Th>Nome do Aluno</Th><Th>Status</Th><Th>Ações</Th></tr></thead>
                <tbody>{filteredAlunos.map((r,i)=>(
                  <TRow key={r.matricula} i={i}>
                    <Td mono><span className="text-xs text-gray-500">{r.matricula}</span></Td>
                    <Td><div className="flex items-center gap-2.5"><Avatar name={r.nome}/><div><p className="font-semibold text-gray-800 leading-tight">{r.nome}</p><p className="text-xs text-gray-400 mt-0.5">{r.email}</p></div></div></Td>
                    <Td><StatusBadge label={r.status}/></Td>
                    <Td><RowEditBtn label="Editar Aluno" onClick={()=>openEdit(r)}/></Td>
                  </TRow>
                ))}</tbody>
              </table>
            )}

            {active==="servidores" && (
              filteredServidores.length===0 ? <EmptyState /> :
              <table className="w-full border-collapse">
                <thead><tr style={{background:"#fafbfc",borderBottom:"1px solid #efefef"}}><Th>SIAPE</Th><Th>Servidor</Th><Th>Cargo</Th><Th>Função / Área</Th><Th>Ações</Th></tr></thead>
                <tbody>{filteredServidores.map((r,i)=>(
                  <TRow key={r.siape} i={i}>
                    <Td mono><span className="text-xs text-gray-500">{r.siape}</span></Td>
                    <Td><div className="flex items-center gap-2.5"><Avatar name={r.nome}/><div><p className="font-semibold text-gray-800 leading-tight">{r.nome}</p><p className="text-xs text-gray-400 mt-0.5">{r.email}</p></div></div></Td>
                    <Td><CargoBadge label={r.cargo}/></Td>
                    <Td><div className="flex flex-wrap gap-1.5">{r.funcoes.map(f=><FuncaoBadge key={f} tag={f}/>)}</div></Td>
                    <Td><RowEditBtn label="Editar Servidor" onClick={()=>openEdit(r)}/></Td>
                  </TRow>
                ))}</tbody>
              </table>
            )}

            {active==="cursos" && (
              filteredCursos.length===0 ? <EmptyState /> :
              <table className="w-full border-collapse">
                <thead><tr style={{background:"#fafbfc",borderBottom:"1px solid #efefef"}}><Th>Nome do Curso</Th><Th>Tipo</Th><Th>Grau</Th><Th>Modalidade</Th><Th>PPC</Th><Th>Fases</Th><Th>Carga Horária</Th><Th>Coordenador</Th><Th>Ações</Th></tr></thead>
                <tbody>{filteredCursos.map((r,i)=>(
                  <TRow key={r.nome} i={i}>
                    <Td><span className="font-semibold text-gray-800">{stripPrefix(r.nome)}</span></Td>
                    <Td><span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold" style={{background:"#f0f2f5",color:"#374151"}}>{r.tipo}</span></Td>
                    <Td><GrauBadge label={r.grau}/></Td>
                    <Td><span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold" style={{background:"#f0f2f5",color:"#374151"}}>{r.modalidade}</span></Td>
                    <Td><PpcBadge label={r.ppc}/></Td>
                    <Td><span className="font-semibold text-gray-700">{r.fases} fases</span></Td>
                    <Td><span className="font-semibold" style={{color:"#15622f"}}>{r.cargaHoraria}</span></Td>
                    <Td>{r.coordenador!=="—"?<div className="flex items-center gap-2"><Avatar name={r.coordenador} size={22}/><span className="text-xs text-gray-700">{r.coordenador}</span></div>:<span className="text-xs text-gray-400 italic">Não atribuído</span>}</Td>
                    <Td><RowEditBtn label="Editar Curso" onClick={()=>openEdit(r)}/></Td>
                  </TRow>
                ))}</tbody>
              </table>
            )}

            {active==="disciplinas" && (
              filteredDisciplinas.length===0 ? <EmptyState /> :
              <table className="w-full border-collapse">
                <thead><tr style={{background:"#fafbfc",borderBottom:"1px solid #efefef"}}><Th>Sigla</Th><Th>Nome da Disciplina</Th><Th>Carga Horária</Th><Th>Fase Oferta</Th><Th>Curso Vinculado</Th><Th>Ações</Th></tr></thead>
                <tbody>{filteredDisciplinas.map((r,i)=>(
                  <TRow key={`${r.sigla}-${i}`} i={i}>
                    <Td><SiglaBadge label={r.sigla}/></Td>
                    <Td><span className="font-semibold text-gray-800">{r.nome}</span></Td>
                    <Td><span className="font-semibold" style={{color:"#15622f"}}>{r.cargaHoraria}</span></Td>
                    <Td><FaseBadge label={r.faseOferta}/></Td>
                    <Td><span className="text-xs text-gray-600">{stripPrefix(r.curso)}</span></Td>
                    <Td><RowEditBtn label="Editar Disciplina" onClick={()=>openEdit(r)}/></Td>
                  </TRow>
                ))}</tbody>
              </table>
            )}

            {active==="turmas" && (
              filteredTurmas.length===0 ? <EmptyState /> :
              <table className="w-full border-collapse">
                <thead><tr style={{background:"#fafbfc",borderBottom:"1px solid #efefef"}}><Th>Nome da Turma</Th><Th>Período Letivo</Th><Th>Curso Vinculado</Th><Th>Qtd. Alunos</Th><Th>Ações</Th></tr></thead>
                <tbody>{filteredTurmas.map((r,i)=>(
                  <TRow key={`${r.nome}-${r.periodo}`} i={i}>
                    <Td><span className="font-semibold text-gray-800">{r.nome}</span></Td>
                    <Td><PeriodBadge label={r.periodo}/></Td>
                    <Td><span className="text-xs text-gray-600">{stripPrefix(r.curso)}</span></Td>
                    <Td><span className="font-bold" style={{color:"#15622f"}}>{r.alunos}</span><span className="text-xs text-gray-400 ml-1">alunos</span></Td>
                    <Td><RowEditBtn label="Editar Turma" onClick={()=>openEdit(r)}/></Td>
                  </TRow>
                ))}</tbody>
              </table>
            )}

            {active==="diarios" && (
              filteredDiarios.length===0 ? <EmptyState /> :
              <table className="w-full border-collapse">
                <thead><tr style={{background:"#fafbfc",borderBottom:"1px solid #efefef"}}><Th>Código Diário</Th><Th>Disciplina</Th><Th>Turma</Th><Th>Professor Responsável</Th><Th>CH / Aulas Previstas</Th><Th>Ações</Th></tr></thead>
                <tbody>{filteredDiarios.map((r,i)=>(
                  <TRow key={r.codigo} i={i}>
                    <Td mono><span className="text-xs text-gray-500">{r.codigo}</span></Td>
                    <Td><span className="font-semibold text-gray-800">{r.disciplina}</span></Td>
                    <Td><span className="text-xs text-gray-600">{r.turma}</span></Td>
                    <Td><div className="flex items-center gap-2"><Avatar name={r.professor} size={22}/><span className="text-xs text-gray-700">{r.professor}</span></div></Td>
                    <Td><span className="font-semibold" style={{color:"#15622f"}}>{r.cargaHoraria}</span><span className="text-xs text-gray-400 mx-1">/</span><span className="text-xs text-gray-600">{r.aulasPrevistas} aulas</span></Td>
                    <Td><RowEditBtn label="Editar Diário" onClick={()=>openEdit(r)}/></Td>
                  </TRow>
                ))}</tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {modalMode && (
        <Modal
          title={modalMode==="create" ? `Cadastrar Novo ${cat.entity}` : `Editar ${cat.entity}`}
          entity={cat.entity}
          mode={modalMode}
          onClose={closeModal}
          onSave={handleSave}
          onRequestDelete={() => setDeleteConfirm(true)}
          deleteConfirm={deleteConfirm}
          onConfirmDelete={handleDelete}
          onCancelDelete={() => setDeleteConfirm(false)}
        >
          {/* ── Alunos form ── */}
          {active==="alunos" && (
            <div className="space-y-4">
              <div><FLabel>Nome Completo do Aluno</FLabel><FInput value={fs.nome||""} onChange={v=>sf("nome",v)} placeholder="Nome completo" /></div>
              <FRow>
                <div><FLabel>Matrícula</FLabel><FInput value={fs.matricula||""} onChange={v=>sf("matricula",v)} placeholder="202110806528" mono /></div>
                <div><FLabel>Status</FLabel><ToggleStatus value={fs.status||"Ativo"} onChange={v=>sf("status",v)} /></div>
              </FRow>
              <div><FLabel>E-mail Institucional</FLabel><FInput value={fs.email||""} onChange={v=>sf("email",v)} placeholder="nome@aluno.ifsc.edu.br" /></div>
              <div><FLabel>Curso / Turma Vinculada</FLabel><FSelect value={fs.turma||""} onChange={v=>sf("turma",v)} placeholder="Selecionar turma..." options={turmaNames} /></div>
            </div>
          )}

          {/* ── Servidores form ── */}
          {active==="servidores" && (
            <div className="space-y-4">
              <FRow>
                <div><FLabel>SIAPE</FLabel><FInput value={fs.siape||""} onChange={v=>sf("siape",v)} placeholder="0000000" mono /></div>
                <div><FLabel>Cargo / Perfil</FLabel>
                  <FSelect value={fs.cargo||""} onChange={v=>{ sf("cargo",v); sf("turmasLecionadas",[]); sf("cursoCoord",""); sf("funcoes",[]); }}
                    placeholder="Selecionar cargo..." options={["Professor","Coordenador de Curso","Equipe Pedagógica/NAE","Servidor Geral"]} />
                </div>
              </FRow>
              <div><FLabel>Nome Completo</FLabel><FInput value={fs.nome||""} onChange={v=>sf("nome",v)} placeholder="Nome completo do servidor" /></div>
              <div><FLabel>E-mail Institucional</FLabel><FInput value={fs.email||""} onChange={v=>sf("email",v)} placeholder="nome@ifsc.edu.br" /></div>
              {fs.cargo==="Professor" && (
                <div><FLabel>Turmas / Disciplinas Lecionadas</FLabel>
                  <MultiSelectPills value={fs.turmasLecionadas||[]} onChange={v=>sf("turmasLecionadas",v)} options={turmaNames} placeholder="Selecionar turmas..." />
                </div>
              )}
              {fs.cargo==="Coordenador de Curso" && (
                <div><FLabel>Curso Coordenado</FLabel>
                  <FSelect value={fs.cursoCoord||""} onChange={v=>sf("cursoCoord",v)} placeholder="Selecionar curso..." options={cursoNames} />
                </div>
              )}
              {(fs.cargo==="Equipe Pedagógica/NAE"||fs.cargo==="Servidor Geral") && (
                <div><FLabel>Função / Área</FLabel>
                  <CreatableTagInput value={fs.funcoes||[]} onChange={v=>sf("funcoes",v)} allTags={allFuncoes} placeholder="Adicionar função ou área..." />
                </div>
              )}
            </div>
          )}

          {/* ── Cursos form ── */}
          {active==="cursos" && (
            <div className="space-y-4">
              <div><FLabel>Nome do Curso</FLabel><FInput value={fs.nome||""} onChange={v=>sf("nome",v)} placeholder="Ex: Técnico em Desenvolvimento de Sistemas" /></div>
              <FRow>
                <div><FLabel>Tipo</FLabel><FSelect value={fs.tipo||""} onChange={v=>sf("tipo",v)} placeholder="Selecionar tipo..." options={["Técnico","Superior","Pós-Graduação"]} /></div>
                <div><FLabel>Grau</FLabel><FSelect value={fs.grau||""} onChange={v=>sf("grau",v)} placeholder="Selecionar grau..." options={["Integrado ao EM","Concomitante","Subsequente","Bacharelado","Licenciatura","Tecnólogo"]} /></div>
              </FRow>
              <FRow>
                <div><FLabel>Modalidade</FLabel><FSelect value={fs.modalidade||""} onChange={v=>sf("modalidade",v)} placeholder="Selecionar modalidade..." options={["Presencial","EAD","Semipresencial"]} /></div>
                <div><FLabel>Código PPC</FLabel><FInput value={fs.ppc||""} onChange={v=>sf("ppc",v)} placeholder="Ex: 2023" mono /></div>
              </FRow>
              <FRow>
                <div><FLabel>Quantidade de Fases</FLabel><FNumber value={fs.fases||""} onChange={v=>sf("fases",v)} placeholder="4" /></div>
                <div><FLabel>Carga Horária Total</FLabel><FInput value={fs.cargaHoraria||""} onChange={v=>sf("cargaHoraria",v)} placeholder="Ex: 3.200h" /></div>
              </FRow>
              <div><FLabel>Coordenador Responsável</FLabel><FSelect value={fs.coordenador||""} onChange={v=>sf("coordenador",v)} placeholder="Selecionar coordenador..." options={servidorNames} /></div>
            </div>
          )}

          {/* ── Disciplinas form ── */}
          {active==="disciplinas" && (
            <div className="space-y-4">
              <FRow>
                <div><FLabel>Sigla</FLabel><FInput value={fs.sigla||""} onChange={v=>sf("sigla",v.toUpperCase())} placeholder="ALG" mono /></div>
                <div><FLabel>Fase de Oferta</FLabel><FSelect value={fs.faseOferta||""} onChange={v=>sf("faseOferta",v)} placeholder="Selecionar fase..." options={FASES} /></div>
              </FRow>
              <div><FLabel>Nome da Disciplina</FLabel><FInput value={fs.nome||""} onChange={v=>sf("nome",v)} placeholder="Ex: Algoritmos e Programação" /></div>
              <FRow>
                <div><FLabel>Carga Horária</FLabel><FInput value={fs.cargaHoraria||""} onChange={v=>sf("cargaHoraria",v)} placeholder="Ex: 60h" /></div>
                <div><FLabel>Curso Vinculado</FLabel><FSelect value={fs.curso||""} onChange={v=>sf("curso",v)} placeholder="Selecionar curso..." options={cursoNames} /></div>
              </FRow>
            </div>
          )}

          {/* ── Turmas form ── */}
          {active==="turmas" && (
            <div className="space-y-4">
              <div><FLabel>Nome da Turma</FLabel><FInput value={fs.nome||""} onChange={v=>sf("nome",v)} placeholder="Ex: TDS 2026/1" /></div>
              <FRow>
                <div><FLabel>Período Letivo</FLabel><FSelect value={fs.periodo||""} onChange={v=>sf("periodo",v)} placeholder="Selecionar período..." options={["2026.1","2026.2","2025.1","2025.2"]} /></div>
                <div><FLabel>Quantidade de Alunos</FLabel><FNumber value={fs.alunos||""} onChange={v=>sf("alunos",v)} placeholder="0" /></div>
              </FRow>
              <div><FLabel>Curso Vinculado</FLabel><FSelect value={fs.curso||""} onChange={v=>sf("curso",v)} placeholder="Selecionar curso..." options={cursoNames} /></div>
            </div>
          )}

          {/* ── Diários form ── */}
          {active==="diarios" && (
            <div className="space-y-4">
              <FRow>
                <div><FLabel>Código do Diário</FLabel><FInput value={fs.codigo||""} onChange={v=>sf("codigo",v)} placeholder="DIR-2026-99" mono /></div>
                <div><FLabel>Disciplina</FLabel><FSelect value={fs.disciplina||""} onChange={v=>sf("disciplina",v)} placeholder="Selecionar disciplina..." options={disciplinaNames} /></div>
              </FRow>
              <FRow>
                <div><FLabel>Turma</FLabel><FSelect value={fs.turma||""} onChange={v=>sf("turma",v)} placeholder="Selecionar turma..." options={turmaNames} /></div>
                <div><FLabel>Professor Responsável</FLabel><FSelect value={fs.professor||""} onChange={v=>sf("professor",v)} placeholder="Selecionar professor..." options={professorNames} /></div>
              </FRow>
              <FRow>
                <div><FLabel>Carga Horária</FLabel><FInput value={fs.cargaHoraria||""} onChange={v=>sf("cargaHoraria",v)} placeholder="Ex: 60h" /></div>
                <div><FLabel>Aulas Previstas</FLabel><FNumber value={fs.aulasPrevistas||""} onChange={v=>sf("aulasPrevistas",v)} placeholder="72" /></div>
              </FRow>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

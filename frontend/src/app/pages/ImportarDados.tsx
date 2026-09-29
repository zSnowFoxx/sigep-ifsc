import { useState, useRef, useCallback } from "react";
import {
  X,
  RefreshCw,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wifi,
  WifiOff,
  ShieldCheck,
  Info,
  ChevronRight,
  Database,
} from "lucide-react";

type SyncState = "idle" | "syncing" | "success" | "error";
type ImportState = "idle" | "dragging" | "file_ready" | "importing" | "success" | "error";

interface Props {
  isOpen?: boolean;
  onClose: () => void;
}

const syncSteps = [
  "Autenticando com a API SIGAA...",
  "Buscando registros de alunos...",
  "Importando turmas e matrículas...",
  "Sincronizando notas parciais...",
  "Atualizando frequências...",
  "Validando integridade dos dados...",
  "Concluindo sincronização...",
];

export default function ImportarDados({ isOpen, onClose }: Props) {
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStep, setSyncStep] = useState("");
  const [importState, setImportState] = useState<ImportState>("idle");
  const [importProgress, setImportProgress] = useState(0);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [modeloImport, setModeloImport] = useState("notas");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runSync = useCallback(() => {
    if (syncState === "syncing") return;
    setSyncState("syncing");
    setSyncProgress(0);
    setSyncStep(syncSteps[0]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = Math.round((step / syncSteps.length) * 100);
      setSyncProgress(progress);
      if (step < syncSteps.length) {
        setSyncStep(syncSteps[step]);
      } else {
        clearInterval(interval);
        setSyncState("success");
        setSyncStep("");
      }
    }, 520);
  }, [syncState]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setImportState("idle");
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const valid = [".xls", ".xlsx", ".csv"].some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!valid) {
      setImportErrors(["Formato inválido. Aceitos: .xls, .xlsx, .csv"]);
      setImportState("error");
      return;
    }
    setDroppedFile(file);
    setImportErrors([]);
    setImportState("file_ready");
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDroppedFile(file);
    setImportErrors([]);
    setImportState("file_ready");
  }, []);

  const runImport = useCallback(() => {
    if (!droppedFile) return;
    setImportState("importing");
    setImportProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.floor(Math.random() * 18) + 8;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setImportProgress(100);
        setImportState("success");
      } else {
        setImportProgress(p);
      }
    }, 400);
  }, [droppedFile]);

  const resetImport = () => {
    setImportState("idle");
    setDroppedFile(null);
    setImportErrors([]);
    setImportProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const anyProgress = syncState === "syncing" || importState === "importing";
  const overallProgress =
    syncState === "syncing"
      ? syncProgress
      : importState === "importing"
      ? importProgress
      : syncState === "success" || importState === "success"
      ? 100
      : 0;
  const showProgress = anyProgress || syncState === "success" || importState === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
      <div
        className="bg-card rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
        style={{ maxWidth: "780px", maxHeight: "90vh", margin: "16px" }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0" style={{ background: "var(--primary)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Database size={16} color="white" />
            </div>
            <div>
              <p className="text-xs text-white/60 font-medium">SIGEP · Gestão de Dados</p>
              <h2 className="text-sm font-bold text-white">Importação e Sincronização de Dados Acadêmicos</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X size={16} color="white" />
          </button>
        </div>

        {/* Explanatory text */}
        <div className="px-6 py-4 border-b border-border bg-[#f7f8fa] shrink-0">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Selecione o método de entrada para atualizar os registros de alunos, turmas, notas e frequências do{" "}
            <span className="font-semibold text-foreground">Câmpus Lages</span>.
            Os dados importados passarão por validação automática (RN08) antes de serem persistidos no sistema.
          </p>
        </div>

        {/* Two-column options */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-5 h-full">

            {/* Option A — SIGAA API */}
            <div
              className="flex flex-col rounded-xl border-2 overflow-hidden transition-all"
              style={{
                borderColor: syncState === "success" ? "#22c55e" : syncState === "error" ? "#ef4444" : "var(--primary)",
                boxShadow: "0 0 0 4px rgba(21,98,47,0.07)",
              }}
            >
              {/* Option A Header */}
              <div className="px-5 py-3.5 flex items-center gap-3" style={{ background: "var(--secondary)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--primary)" }}>
                  <Wifi size={15} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">Sincronização via API do SIGAA</h3>
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: "var(--primary)", color: "white" }}>RF03</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Método primário recomendado</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  API Online
                </span>
              </div>

              <div className="flex-1 px-5 py-4 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Puxa dados atualizados em tempo real diretamente do sistema institucional, incluindo matrículas, turmas, notas parciais e registros de frequência.
                </p>

                {/* Sync status area */}
                {syncState === "syncing" && (
                  <div className="rounded-xl border border-border bg-[#f7f8fa] p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <RefreshCw size={13} className="animate-spin" style={{ color: "var(--primary)" }} />
                      <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>Sincronizando...</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${syncProgress}%`, background: "var(--primary)" }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{syncStep}</p>
                  </div>
                )}

                {syncState === "success" && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">Sincronização concluída!</p>
                      <p className="text-xs text-emerald-700 mt-0.5">620 alunos · 24 turmas · 2.480 registros de nota · 1.860 registros de frequência atualizados.</p>
                    </div>
                  </div>
                )}

                {syncState === "error" && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                    <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">Falha na conexão com a API</p>
                      <p className="text-xs text-red-700 mt-0.5">Verifique a conectividade ou utilize o método de importação manual.</p>
                    </div>
                  </div>
                )}

                {/* Meta info rows */}
                <div className="space-y-2">
                  {[
                    { icon: ShieldCheck, text: "Autenticação segura via OAuth 2.0 institucional" },
                    { icon: Database, text: "Dados: alunos, turmas, notas, frequências, grade" },
                    { icon: Clock, text: "Duração estimada: 30–90 segundos" },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <m.icon size={12} className="shrink-0" style={{ color: "var(--primary)" }} />
                      {m.text}
                    </div>
                  ))}
                </div>

                {/* Main CTA */}
                <button
                  onClick={runSync}
                  disabled={syncState === "syncing" || syncState === "success"}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  style={{ background: syncState === "success" ? "#22c55e" : "var(--primary)" }}
                >
                  {syncState === "syncing" ? (
                    <><RefreshCw size={15} className="animate-spin" /> Sincronizando...</>
                  ) : syncState === "success" ? (
                    <><CheckCircle2 size={15} /> Sincronizado com Sucesso</>
                  ) : (
                    <><RefreshCw size={15} /> Sincronizar Agora com o SIGAA</>
                  )}
                </button>

                {/* Last sync info */}
                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <Clock size={11} />
                  Última sincronização bem-sucedida: <strong>24/06/2026 às 18:30</strong> por Coord. Pedagógica
                </p>
              </div>
            </div>

            {/* Option B — Manual Import */}
            <div
              className="flex flex-col rounded-xl border-2 border-border overflow-hidden"
              style={{ borderStyle: "dashed" }}
            >
              {/* Option B Header */}
              <div className="px-5 py-3.5 flex items-center gap-3 bg-[#f7f8fa] border-b border-border">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-muted">
                  <WifiOff size={15} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">Importação Manual de Planilhas</h3>
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">RF04</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Contingência — API indisponível</p>
                </div>
              </div>

              <div className="flex-1 px-5 py-4 space-y-4">

                {/* Step 1 — Model selector */}
                {(() => {
                  const modelos: Record<string, { label: string; colunas: string[]; descricao: string; parser: string }> = {
                    notas: {
                      label: "Mapa de Conceito / Notas Parciais",
                      descricao: "Colunas obrigatórias esperadas para validação do SGBD:",
                      colunas: ["matricula_discente", "cod_disciplina", "id_turma", "media_parcial", "faltas_acumuladas", "total_aulas"],
                      parser: "Parser: nota_parcial_v2 → MySQL: tb_lancamento_nota",
                    },
                    nae: {
                      label: "Histórico de Atendimentos (NAE)",
                      descricao: "Colunas obrigatórias esperadas:",
                      colunas: ["matricula_discente", "siape_servidor", "data_atendimento", "motivo_principal", "queixa_relato"],
                      parser: "Parser: nae_historico_v1 → MySQL: tb_atendimento_nae",
                    },
                    frequencia: {
                      label: "Frequência por Disciplina",
                      descricao: "Colunas obrigatórias esperadas para validação do SGBD:",
                      colunas: ["matricula_discente", "cod_disciplina", "id_turma", "aulas_dadas", "faltas_brutas", "faltas_justificadas"],
                      parser: "Parser: frequencia_v3 → MySQL: tb_frequencia_disciplina",
                    },
                    turmas: {
                      label: "Cadastro de Turmas e Matrículas",
                      descricao: "Colunas obrigatórias esperadas para validação do SGBD:",
                      colunas: ["id_turma", "cod_curso", "fase", "semestre_letivo", "matricula_discente", "nome_discente", "situacao"],
                      parser: "Parser: turma_matricula_v2 → MySQL: tb_turma, tb_matricula",
                    },
                  };
                  const modelo = modelos[modeloImport];
                  return (
                    <>
                      {/* Step 1 */}
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white" style={{ background: "var(--primary)" }}>1</span>
                          Selecione o Tipo de Modelo para Importação:
                        </label>
                        <div className="relative">
                          <FileSpreadsheet size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <select
                            value={modeloImport}
                            onChange={(e) => { setModeloImport(e.target.value); resetImport(); }}
                            className="w-full appearance-none text-sm font-medium pl-9 pr-8 py-2.5 rounded-lg border-2 bg-white outline-none cursor-pointer transition-all"
                            style={{ borderColor: "var(--primary)", color: "var(--foreground)" }}
                          >
                            <option value="notas">Mapa de Conceito / Notas Parciais</option>
                            <option value="nae">Histórico de Atendimentos (NAE)</option>
                            <option value="frequencia">Frequência por Disciplina</option>
                            <option value="turmas">Cadastro de Turmas e Matrículas</option>
                          </select>
                          <ChevronRight size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90" />
                        </div>
                      </div>

                      {/* Step 2 — Dynamic schema box */}
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white" style={{ background: "var(--primary)" }}>2</span>
                          Esquema de Validação Esperado:
                        </label>
                        <div className="rounded-lg border border-border bg-[#f7f8fa] px-3.5 py-3 space-y-2">
                          <div className="flex items-start gap-2">
                            <Info size={13} className="text-muted-foreground shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {modelo.descricao}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {modelo.colunas.map((col) => (
                              <code
                                key={col}
                                className="text-xs px-2 py-0.5 rounded font-mono font-semibold"
                                style={{ background: "var(--secondary)", color: "var(--primary)" }}
                              >
                                {col}
                              </code>
                            ))}
                          </div>
                          <div className="pt-1 border-t border-border flex items-center gap-1.5">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/60 shrink-0"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>
                            <span className="text-xs text-muted-foreground/70 font-mono">{modelo.parser}</span>
                          </div>
                        </div>
                      </div>

                      {/* Step 3 label */}
                      <label className="block text-xs font-bold text-foreground flex items-center gap-1.5 mx-[0px] mt-[0px] mb-[5px]">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white" style={{ background: "var(--primary)" }}>3</span>
                        Selecione o Arquivo da Planilha:
                        <span className="font-normal text-muted-foreground ml-1">.xls · .xlsx · .csv</span>
                      </label>
                    </>
                  );
                })()}

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setImportState("dragging"); }}
                  onDragLeave={() => { if (importState === "dragging") setImportState("idle"); }}
                  onDrop={handleDrop}
                  onClick={() => importState === "idle" && fileInputRef.current?.click()}
                  className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-8 px-4 text-center transition-all cursor-pointer"
                  style={{
                    borderColor: importState === "dragging"
                      ? "var(--primary)"
                      : importState === "file_ready" || importState === "success"
                      ? "#22c55e"
                      : importState === "error"
                      ? "#ef4444"
                      : "var(--border)",
                    background: importState === "dragging"
                      ? "var(--secondary)"
                      : importState === "file_ready" || importState === "success"
                      ? "#f0fdf4"
                      : importState === "error"
                      ? "#fef2f2"
                      : "#f7f8fa",
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xls,.xlsx,.csv"
                    className="hidden"
                    onChange={handleFileInput}
                  />

                  {importState === "idle" || importState === "dragging" ? (
                    <>
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: importState === "dragging" ? "var(--primary)" : "var(--muted)" }}
                      >
                        <FileSpreadsheet size={22} style={{ color: importState === "dragging" ? "white" : "var(--muted-foreground)" }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {importState === "dragging" ? "Solte o arquivo aqui" : "Arraste as planilhas aqui"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ou <span className="underline" style={{ color: "var(--primary)" }}>clique para procurar no computador</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">.xls · .xlsx · .csv</p>
                      </div>
                    </>
                  ) : importState === "file_ready" ? (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <FileSpreadsheet size={22} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-800">{droppedFile?.name}</p>
                        <p className="text-xs text-emerald-600 mt-0.5">
                          {droppedFile ? (droppedFile.size / 1024).toFixed(1) : "—"} KB · Pronto para importar
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); resetImport(); }}
                          className="text-xs text-muted-foreground hover:text-foreground underline mt-1"
                        >
                          Remover arquivo
                        </button>
                      </div>
                    </>
                  ) : importState === "importing" ? (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Upload size={22} className="text-blue-600 animate-bounce" />
                      </div>
                      <div className="w-full space-y-2">
                        <p className="text-sm font-semibold text-foreground">Importando planilha...</p>
                        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${importProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{importProgress}% concluído</p>
                      </div>
                    </>
                  ) : importState === "success" ? (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 size={22} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-800">Importação concluída!</p>
                        <p className="text-xs text-emerald-600 mt-0.5">Dados validados e persistidos com sucesso.</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); resetImport(); }}
                          className="text-xs underline mt-1" style={{ color: "var(--primary)" }}
                        >
                          Importar outro arquivo
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                        <AlertTriangle size={22} className="text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-red-800">Erro no arquivo</p>
                        {importErrors.map((err, i) => (
                          <p key={i} className="text-xs text-red-600 mt-0.5">{err}</p>
                        ))}
                        <button
                          onClick={(e) => { e.stopPropagation(); resetImport(); }}
                          className="text-xs underline mt-1" style={{ color: "var(--primary)" }}
                        >
                          Tentar novamente
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* RN08 warning */}
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 flex items-start gap-2">
                  <Info size={13} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800">Integridade e Parser (RN08)</p>
                    <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                      O tipo de modelo selecionado determina as regras do parser aplicadas antes de persistir os dados no MySQL. Arquivos com esquema divergente do modelo ativo serão rejeitados automaticamente.
                    </p>
                  </div>
                </div>

                {/* Import CTA */}
                {importState === "file_ready" && (
                  <button
                    onClick={runImport}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "var(--primary)" }}
                  >
                    <Upload size={14} /> Iniciar Importação
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-[#f7f8fa] shrink-0">
          <div className="flex items-center gap-4">
            {/* Progress bar */}
            <div className="flex-1 space-y-1">
              {showProgress ? (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-foreground">
                      {syncState === "syncing" ? "Sincronizando com SIGAA" :
                       importState === "importing" ? "Importando planilha" :
                       syncState === "success" ? "Sincronização concluída" :
                       importState === "success" ? "Importação concluída" : ""}
                    </span>
                    <span className="text-xs font-bold" style={{ color: overallProgress === 100 ? "#22c55e" : "var(--primary)" }}>
                      {overallProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${overallProgress}%`,
                        background: overallProgress === 100 ? "#22c55e" : "var(--primary)",
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck size={12} style={{ color: "var(--primary)" }} />
                  Todos os dados são processados com criptografia e registrados no log de auditoria do sistema.
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold rounded-lg border border-border text-foreground hover:bg-muted transition-colors shrink-0"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

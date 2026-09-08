import React, { useState, useMemo, useCallback, useEffect } from "react";
import type { CategoryKey, ModalMode, Aluno, Servidor, Curso, Disciplina, Turma, Diario } from "../types/cadastros";
import { unique, stripPrefix } from "../utils/cadastrosUtils";
import { CATEGORIES, fetchAllInitialData } from "../data/cadastrosData";
import { entityServices } from "../services/cadastrosService";

// Componentes da Página
import { CadastrosHeader } from "../components/Cadastros/CadastrosHeader";
import { CadastrosCards } from "../components/Cadastros/CadastrosCards";
import { CadastrosFilters } from "../components/Cadastros/CadastrosFilters";

// Tabelas
import { AlunosTable } from "../components/Cadastros/Tables/AlunosTable";
import { ServidoresTable } from "../components/Cadastros/Tables/ServidoresTable";
import { CursosTable } from "../components/Cadastros/Tables/CursosTable";
import { DisciplinasTable } from "../components/Cadastros/Tables/DisciplinasTable";
import { TurmasTable } from "../components/Cadastros/Tables/TurmasTable";
import { DiariosTable } from "../components/Cadastros/Tables/DiariosTable";

// Modal e Formulários
import { ModalShell } from "../components/Cadastros/ModalShell";
import { AlunoForm } from "../components/Cadastros/Forms/AlunoForm";
import { ServidorForm } from "../components/Cadastros/Forms/ServidorForm";
import { CursoForm } from "../components/Cadastros/Forms/CursoForm";
import { DisciplinaForm } from "../components/Cadastros/Forms/DisciplinaForm";
import { TurmaForm } from "../components/Cadastros/Forms/TurmaForm";
import { DiarioForm } from "../components/Cadastros/Forms/DiarioForm";

export const CadastrosPage: React.FC = () => {
  // Estados de Dados
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [diarios, setDiarios] = useState<Diario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Navegação e Filtros
  const [activeTab, setActiveTab] = useState<CategoryKey>("alunos");
  const [searchQuery, setSearchQuery] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fCargo, setFCargo] = useState("");
  const [fFuncao, setFFuncao] = useState("");
  const [fTipo, setFTipo] = useState("");
  const [fGrau, setFGrau] = useState("");
  const [fModalidade, setFModalidade] = useState("");
  const [fDiscCurso, setFDiscCurso] = useState("");
  const [fFase, setFFase] = useState("");
  const [fTurmaPer, setFTurmaPer] = useState("");
  const [fTurmaCurso, setFTurmaCurso] = useState("");
  const [fDiarioTurma, setFDiarioTurma] = useState("");
  const [fDiarioProf, setFDiarioProf] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // Carregamento dos dados via REST API
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllInitialData();
      setAlunos(data.alunos);
      setServidores(data.servidores);
      setCursos(data.cursos);
      setDisciplinas(data.disciplinas);
      setTurmas(data.turmas);
      setDiarios(data.diarios);
    } catch (error) {
      console.error("Erro ao carregar dados do servidor:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const currentCategory = useMemo(() => CATEGORIES.find((c) => c.key === activeTab)!, [activeTab]);

  // Listas para Selects
  const turmasList = useMemo(() => turmas.map((t) => t.nome), [turmas]);
  const cursosList = useMemo(() => cursos.map((c) => c.nome), [cursos]);
  const disciplinasList = useMemo(() => disciplinas.map((d) => d.nome), [disciplinas]);
  const professoresList = useMemo(() => servidores.filter((s) => s.cargo === "Professor").map((s) => s.nome), [servidores]);
  const servidoresList = useMemo(() => servidores.map((s) => s.nome), [servidores]);
  const allFuncoes = useMemo(() => unique(servidores.flatMap((s) => s.funcoes || [])).sort(), [servidores]);
  const discCursos = useMemo(() => unique(disciplinas.map((d) => d.curso || "")), [disciplinas]);
  const discFases = useMemo(() => unique(disciplinas.map((d) => d.faseOferta || "")).sort(), [disciplinas]);
  const turmaPers = useMemo(() => unique(turmas.map((t) => t.periodo || "")).sort(), [turmas]);
  const turmaCursos = useMemo(() => unique(turmas.map((t) => t.curso || "")), [turmas]);
  const diarioTurmas = useMemo(() => unique(diarios.map((d) => d.turma || "")).sort(), [diarios]);

  const handleTabChange = (tab: CategoryKey) => {
    setActiveTab(tab);
    setSearchQuery("");
    setFStatus(""); setFCargo(""); setFFuncao(""); setFTipo(""); setFGrau(""); setFModalidade("");
    setFDiscCurso(""); setFFase(""); setFTurmaPer(""); setFTurmaCurso(""); setFDiarioTurma(""); setFDiarioProf("");
  };

  const matchQ = useCallback(
    (...fields: (string | undefined)[]) => {
      const cleanQuery = stripPrefix(searchQuery.trim().toLowerCase());
      if (!cleanQuery) return true;

      return fields.some((f) => {
        if (!f) return false;
        return stripPrefix(f.toLowerCase()).includes(cleanQuery);
      });
    },
    [searchQuery]
  );

  // Filtragem
  const filteredAlunos = useMemo(
    () => alunos.filter((a) => matchQ(a.nome, a.matricula, a.email) && (!fStatus || (a.status && a.status.toLowerCase() === fStatus.toLowerCase()))),
    [alunos, matchQ, fStatus]
  );

  const filteredServidores = useMemo(
    () => servidores.filter((s) => matchQ(s.nome, s.siape, s.email) && (!fCargo || s.cargo === fCargo)),
    [servidores, matchQ, fCargo]
  );

  const filteredCursos = useMemo(
    () => cursos.filter((c) => matchQ(c.nome, c.tipo, c.grau, c.coordenador) && (!fTipo || c.tipo === fTipo) && (!fGrau || c.grau === fGrau) && (!fModalidade || c.modalidade === fModalidade)),
    [cursos, matchQ, fTipo, fGrau, fModalidade]
  );

  const filteredDisciplinas = useMemo(
    () => disciplinas.filter((d) => matchQ(d.sigla, d.nome, d.curso) && (!fDiscCurso || d.curso === fDiscCurso) && (!fFase || d.faseOferta === fFase)),
    [disciplinas, matchQ, fDiscCurso, fFase]
  );

  const filteredTurmas = useMemo(
    () => turmas.filter((t) => matchQ(t.nome, t.curso) && (!fTurmaPer || t.periodo === fTurmaPer) && (!fTurmaCurso || t.curso === fTurmaCurso)),
    [turmas, matchQ, fTurmaPer, fTurmaCurso]
  );

  const filteredDiarios = useMemo(
    () => diarios.filter((d) => matchQ(d.codigo, d.disciplina, d.turma, d.professor) && (!fDiarioTurma || d.turma === fDiarioTurma) && (!fDiarioProf || d.professor === fDiarioProf)),
    [diarios, matchQ, fDiarioTurma, fDiarioProf]
  );

  const rowCount = {
    alunos: filteredAlunos.length,
    servidores: filteredServidores.length,
    cursos: filteredCursos.length,
    disciplinas: filteredDisciplinas.length,
    turmas: filteredTurmas.length,
    diarios: filteredDiarios.length,
  }[activeTab];

  const countLabel = useMemo(() => {
    const labels: Record<CategoryKey, [string, string]> = {
      alunos: ["aluno", "alunos"],
      servidores: ["servidor", "servidores"],
      cursos: ["curso", "cursos"],
      disciplinas: ["disciplina", "disciplinas"],
      turmas: ["turma", "turmas"],
      diarios: ["diário", "diários"],
    };
    const [sing, plur] = labels[activeTab];
    return `${rowCount} ${rowCount === 1 ? sing : plur}`;
  }, [activeTab, rowCount]);

  // Handlers
  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingItem(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setModalMode("edit");
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
    setModalMode(null);
  };

  const handleSave = async () => {
    try {
      const service = entityServices[activeTab];
      if (modalMode === "create") {
        await service.create(formData);
      } else if (modalMode === "edit" && editingItem?.id) {
        await service.update(editingItem.id, formData);
      }
      await loadInitialData();
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      alert("Não foi possível salvar os dados no servidor.");
    }
  };

  const handleDelete = async () => {
    if (!editingItem?.id) return;
    if (!confirm("Tem certeza que deseja remover este cadastro?")) return;

    try {
      const service = entityServices[activeTab];
      await service.delete(editingItem.id);
      await loadInitialData();
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao excluir o registro:", error);
      alert("Não foi possível excluir o registro no servidor.");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="w-full px-6 py-6 space-y-5">
        <CadastrosHeader entityName={currentCategory.entity} onOpenCreate={handleOpenCreate} />

        <CadastrosCards activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-[#fafbfc]">
            <h2 className="text-sm font-bold text-gray-800">{currentCategory.entityPlural}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e8f0eb] text-[#0f4a23]">
              {loading ? "Carregando..." : countLabel}
            </span>
          </div>

          <CadastrosFilters
            activeTab={activeTab}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            fStatus={fStatus} setFStatus={setFStatus}
            fCargo={fCargo} setFCargo={setFCargo}
            fFuncao={fFuncao} setFFuncao={setFFuncao}
            fTipo={fTipo} setFTipo={setFTipo}
            fGrau={fGrau} setFGrau={setFGrau}
            fModalidade={fModalidade} setFModalidade={setFModalidade}
            fDiscCurso={fDiscCurso} setFDiscCurso={setFDiscCurso}
            fFase={fFase} setFFase={setFFase}
            fTurmaPer={fTurmaPer} setFTurmaPer={setFTurmaPer}
            fTurmaCurso={fTurmaCurso} setFTurmaCurso={setFTurmaCurso}
            fDiarioTurma={fDiarioTurma} setFDiarioTurma={setFDiarioTurma}
            fDiarioProf={fDiarioProf} setFDiarioProf={setFDiarioProf}
            allFuncoes={allFuncoes} discCursos={discCursos} discFases={discFases}
            turmaPers={turmaPers} turmaCursos={turmaCursos} diarioTurmas={diarioTurmas}
            professoresList={professoresList}
          />

          {activeTab === "alunos" && <AlunosTable data={filteredAlunos} onEdit={handleOpenEdit} onDelete={handleOpenEdit} />}
          {activeTab === "servidores" && <ServidoresTable data={filteredServidores} onEdit={handleOpenEdit} onDelete={handleOpenEdit} />}
          {activeTab === "cursos" && <CursosTable data={filteredCursos} onEdit={handleOpenEdit} onDelete={handleOpenEdit} />}
          {activeTab === "disciplinas" && <DisciplinasTable data={filteredDisciplinas} onEdit={handleOpenEdit} onDelete={handleOpenEdit} />}
          {activeTab === "turmas" && <TurmasTable data={filteredTurmas} onEdit={handleOpenEdit} onDelete={handleOpenEdit} />}
          {activeTab === "diarios" && <DiariosTable data={filteredDiarios} onEdit={handleOpenEdit} onDelete={handleOpenEdit} />}
        </div>
      </div>

      <ModalShell
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`${modalMode === "create" ? "Cadastrar Novo" : "Editar"} ${currentCategory.entity}`}
        subtitle={`Preencha as informações abaixo para ${modalMode === "create" ? "criar um novo cadastro" : "atualizar o registro existente"}.`}
        onSave={handleSave}
        saveLabel={modalMode === "create" ? "Salvar Cadastro" : "Atualizar Dados"}
        onDelete={modalMode === "edit" ? handleDelete : undefined}
      >
        {activeTab === "alunos" && <AlunoForm formData={formData} onChange={setFormData} turmasOptions={turmasList} />}
        {activeTab === "servidores" && <ServidorForm formData={formData} onChange={setFormData} />}
        {activeTab === "cursos" && <CursoForm formData={formData} onChange={setFormData} servidoresOptions={servidoresList} />}
        {activeTab === "disciplinas" && <DisciplinaForm formData={formData} onChange={setFormData} cursosOptions={cursosList} />}
        {activeTab === "turmas" && <TurmaForm formData={formData} onChange={setFormData} cursosOptions={cursosList} />}
        {activeTab === "diarios" && <DiarioForm formData={formData} onChange={setFormData} disciplinasOptions={disciplinasList} turmasOptions={turmasList} professoresOptions={professoresList} />}
      </ModalShell>
    </div>
  );
};

export default CadastrosPage;
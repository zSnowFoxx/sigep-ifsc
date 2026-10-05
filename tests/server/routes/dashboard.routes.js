const express = require("express");
const router = express.Router();

const turmasDB = require("../data/turmas");
const alunosDB = require("../data/alunos");
const situacaoRiscoDB = require("../data/situacao_risco");
const cursosDB = require("../data/cursos");
const disciplinasDB = require("../data/disciplinas");

router.get("/stats", (req, res) => {
  // Mapeia os IDs dos alunos presentes na tabela de situação de risco
  const alunoIdsComRisco = new Set(situacaoRiscoDB.map((sr) => sr.aluno_id));

  // Filtra a lista de alunos para considerar apenas quem está em situação de risco
  const alunosValidos = alunosDB.filter((aluno) => alunoIdsComRisco.has(aluno.id));

  const totalTurmas = turmasDB.length;
  const totalAlunos = alunosValidos.length;

  // Contabiliza alunos com nível de risco ("critico", "alto" ou "medio")
  const atencaoPedagogica = situacaoRiscoDB.filter((sr) =>
    ["critico", "alto", "medio"].includes(sr.risco)
  ).length;

  const percentualAtencao =
    totalAlunos > 0
      ? ((atencaoPedagogica / totalAlunos) * 100).toFixed(1)
      : "0.0";

  const encaminhamentosAtivos = situacaoRiscoDB.filter(
    (sr) => Array.isArray(sr.fatores) && sr.fatores.length > 0
  ).length;

  return res.json({
    totalTurmas,
    totalAlunos,
    atencaoPedagogica,
    percentualAtencao,
    encaminhamentosAtivos,
  });
});

router.get("/filter-options", (req, res) => {
  return res.json({
    courses: cursosDB.map((c) => ({ nome: c.nome, fases: c.fases })),
    turmas: turmasDB.map((t) => t.nome),
    disciplines: disciplinasDB.map((d) => d.nome),
  });
});

module.exports = router;
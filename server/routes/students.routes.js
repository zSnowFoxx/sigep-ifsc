const express = require("express");
const router = express.Router();

const alunosDB = require("../data/alunos");
const matriculasDB = require("../data/matriculas");
const turmasDB = require("../data/turmas");
const notasFrequenciasDB = require("../data/notas_frequencias");
const situacaoRiscoDB = require("../data/situacao_risco");

// GET /api/students/risk
router.get("/risk", (req, res) => {
  const response = alunosDB.map((aluno) => {
    const matricula = matriculasDB.find((m) => m.aluno_id === aluno.id);
    const turma = turmasDB.find((t) => t.id === matricula?.turma_id);
    const notaFreq = notasFrequenciasDB.find((nf) => nf.matricula_id === matricula?.id);
    const risco = situacaoRiscoDB.find((sr) => sr.aluno_id === aluno.id);

    return {
      matricula: aluno.matricula,
      nome: aluno.nome,
      turma: turma ? turma.nome : "Sem Turma",
      media: notaFreq ? notaFreq.media : 0,
      infrequencia: notaFreq ? notaFreq.infrequencia : 0,
      fatores: risco ? risco.fatores : [],
      risco: risco ? risco.risco : "medio",
    };
  });

  return res.json(response);
});

module.exports = router;
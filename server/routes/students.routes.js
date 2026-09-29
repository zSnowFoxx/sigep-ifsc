const express = require("express");
const router = express.Router();

const alunosDB = require("../data/alunos");
const situacaoRiscoDB = require("../data/situacao_risco");
const turmasDB = require("../data/turmas");
const notas_frequenciasDB = require("../data/notas_frequencias"); // Ou a base onde estão media/infrequencia

// GET /api/students/risk
router.get("/risk", (req, res) => {
  // Itera estritamente sobre a tabela situacao_riscoDB
  const alunosEmRisco = situacaoRiscoDB
    .map((riscoItem) => {
      // Busca o aluno correspondente ao aluno_id da tabela de risco
      const aluno = alunosDB.find((a) => a.id === riscoItem.aluno_id);
      if (!aluno) return null;

      // Busca dados complementares (turma e notas/frequência)
      const turma = turmasDB.find((t) => aluno.turmas_id?.includes(t.id));
      const desempenho = notas_frequenciasDB ? notas_frequenciasDB.find((d) => d.matricula_id === aluno.id) : null;

      return {
        id: aluno.id,
        matricula: aluno.matricula,
        nome: aluno.nome,
        turma: turma ? turma.nome : "Sem Turma",
        media: desempenho ? desempenho.media : 0,
        infrequencia: desempenho ? desempenho.infrequencia : 0,
        fatores: riscoItem.fatores,
        risco: riscoItem.risco,
      };
    })
    .filter(Boolean); // Remove eventuais registros nulos

  return res.json(alunosEmRisco);
});

module.exports = router;
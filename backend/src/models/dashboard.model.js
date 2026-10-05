const pool = require('../config/database');

function roundOne(value) {
  return value === null || value === undefined ? null : Math.round(value * 10) / 10;
}

function classificarRisco(media, infrequencia) {
  let risco = 'baixo';
  const fatores = [];

  if (media < 3) {
    risco = 'critico';
    fatores.push('Média muito baixa');
  } else if (media < 5) {
    risco = 'alto';
    fatores.push('Média baixa');
  } else if (media < 6) {
    risco = 'medio';
    fatores.push('Baixo rendimento acadêmico');
  }

  if (infrequencia > 20) {
    risco = risco === 'critico' || risco === 'alto' ? 'critico' : 'alto';
    fatores.push('Risco de evasão');
  } else if (infrequencia > 15) {
    if (risco === 'baixo') risco = 'medio';
    fatores.push('Baixa frequência');
  }

  return { risco, fatores };
}

// Um item por aluno e turma: média abaixo de 6 ou infrequência acima de 15%.
async function findRiskStudents() {
  const [rows] = await pool.query(
    `SELECT a.id, a.matricula, a.nome, t.nome AS turma,
       AVG(nf.media) AS media,
       AVG(nf.infrequencia) AS infrequencia
     FROM alunos a
     JOIN matriculas m ON m.aluno_id = a.id
     JOIN turmas t ON t.id = m.turma_id
     JOIN notas_frequencias nf ON nf.matricula_id = m.id
     GROUP BY a.id, a.matricula, a.nome, t.nome
     HAVING AVG(nf.media) < 6 OR AVG(nf.infrequencia) > 15
     ORDER BY a.nome`
  );

  return rows.map((row) => {
    const media = roundOne(row.media);
    const infrequencia = roundOne(row.infrequencia);

    return {
      id: row.id,
      matricula: row.matricula,
      nome: row.nome,
      turma: row.turma,
      media,
      infrequencia,
      ...classificarRisco(media, infrequencia)
    };
  });
}

async function getStats() {
  const [[[contagens]], alunosEmRisco] = await Promise.all([
    pool.query(
      `SELECT
         (SELECT COUNT(*) FROM turmas) AS totalTurmas,
         (SELECT COUNT(*) FROM alunos) AS totalAlunos,
         (SELECT COUNT(*) FROM encaminhamentos WHERE status <> 'finalizado') AS encaminhamentosAtivos`
    ),
    findRiskStudents()
  ]);

  const { totalTurmas, totalAlunos, encaminhamentosAtivos } = contagens;
  const atencaoPedagogica = new Set(alunosEmRisco.map((aluno) => aluno.id)).size;
  const percentualAtencao =
    totalAlunos > 0 ? ((atencaoPedagogica / totalAlunos) * 100).toFixed(1) : '0.0';

  return {
    totalTurmas,
    totalAlunos,
    atencaoPedagogica,
    percentualAtencao,
    encaminhamentosAtivos
  };
}

async function getFilterOptions() {
  const [[cursos], [turmas], [disciplinas]] = await Promise.all([
    pool.query('SELECT nome, fases FROM cursos ORDER BY nome'),
    pool.query('SELECT nome FROM turmas ORDER BY nome'),
    pool.query('SELECT nome FROM disciplinas ORDER BY nome')
  ]);

  return {
    courses: cursos.map((c) => ({ nome: c.nome, fases: c.fases ?? 0 })),
    turmas: turmas.map((t) => t.nome),
    disciplines: disciplinas.map((d) => d.nome)
  };
}

module.exports = {
  getStats,
  getFilterOptions,
  findRiskStudents
};

const pool = require('../config/database');

function roundOne(value) {
  return value === null || value === undefined ? null : Math.round(value * 10) / 10;
}

function classificarRisco(media, infrequencia) {
  let risco = 'baixo';
  const fatores = [];

  // Sem média lançada (null), só a frequência conta.
  const temMedia = media !== null && media !== undefined;

  if (temMedia && media <= 4) {
    risco = 'critico';
    fatores.push('Média muito baixa');
  } else if (temMedia && media < 5) {
    risco = 'alto';
    fatores.push('Média baixa');
  } else if (temMedia && media < 6) {
    risco = 'medio';
    fatores.push('Baixo rendimento');
  }

  if (infrequencia > 15 && infrequencia < 20) {
    if (risco === 'baixo') risco = 'medio';
    fatores.push('Baixa frequência');
  }

  if (infrequencia >= 20 || (temMedia && media < 4)) {
    risco = risco === 'critico' || risco === 'alto' ? 'critico' : 'alto';
    fatores.push('Risco alto de evasão');
  }

  return { risco, fatores };
}

// Filtros do painel de risco (todos opcionais). Com disciplina, o risco é calculado só com
// as notas dessa disciplina. A fase chega como "2ª Fase" ou "2" e é comparada com turmas.fase.
function buildRiskFilters({ periodo, curso, fase, turma, disciplina } = {}) {
  const conditions = [];
  const params = [];

  if (periodo) {
    conditions.push("CONCAT(p.ano, '.', p.semestre) = ?");
    params.push(periodo);
  }
  if (curso) {
    conditions.push('c.nome = ?');
    params.push(curso);
  }
  if (fase) {
    conditions.push('t.fase = ?');
    params.push(parseInt(fase, 10) || 0);
  }
  if (turma) {
    conditions.push('t.nome = ?');
    params.push(turma);
  }
  if (disciplina) {
    conditions.push('d.nome = ?');
    params.push(disciplina);
  }

  return { where: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '', params };
}

// Abono legal: as horas abonadas em conselho (conselhos_abonos) deixam de ser faltas, então saem
// da infrequência da nota. A carga horária segue a regra da tela do conselho: diário, disciplina
// ou horas lançadas ("80h" vira 80).
const INFREQUENCIA_EFETIVA = `GREATEST(nf.infrequencia - COALESCE(ab.horas, 0) * 100 / COALESCE(
    NULLIF(CAST(di.carga_horaria AS UNSIGNED), 0),
    NULLIF(CAST(d.carga_horaria AS UNSIGNED), 0),
    NULLIF(nf.presencas + nf.faltas_justificadas + nf.faltas_nao_justificadas, 0),
    1), 0)`;

// Um item por aluno e turma: média abaixo de 6 ou infrequência acima de 15%.
async function findRiskStudents(filters) {
  const { where, params } = buildRiskFilters(filters);
  const [rows] = await pool.query(
    `SELECT a.id, a.matricula, a.nome, t.nome AS turma,
       AVG(nf.media) AS media,
       AVG(${INFREQUENCIA_EFETIVA}) AS infrequencia
     FROM alunos a
     JOIN matriculas m ON m.aluno_id = a.id
     JOIN turmas t ON t.id = m.turma_id
     JOIN cursos c ON c.id = t.curso_id
     JOIN periodos p ON p.id = t.periodo_id
     JOIN notas_frequencias nf ON nf.matricula_id = m.id
     JOIN diarios di ON di.id = nf.diario_id
     JOIN disciplinas d ON d.id = di.disciplina_id
     LEFT JOIN (
       SELECT nota_frequencia_id, SUM(horas) AS horas FROM conselhos_abonos GROUP BY nota_frequencia_id
     ) ab ON ab.nota_frequencia_id = nf.id
     ${where}
     GROUP BY a.id, a.matricula, a.nome, t.id, t.nome
     HAVING
      AVG(nf.media) < 6
      OR (AVG(${INFREQUENCIA_EFETIVA}) > 15 AND AVG(nf.media) < 7)
      OR AVG(${INFREQUENCIA_EFETIVA}) >= 20
     ORDER BY a.nome`,
    params
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

// Turmas de um período ("2026.1"); sem período, todas.
function turmasDoPeriodo(periodo) {
  return periodo
    ? {
        sql: `SELECT t.id FROM turmas t JOIN periodos p ON p.id = t.periodo_id
              WHERE CONCAT(p.ano, '.', p.semestre) = ?`,
        params: [periodo]
      }
    : { sql: 'SELECT id FROM turmas', params: [] };
}

// Com período, as contagens se restringem às turmas dele (alunos matriculados nelas e
// encaminhamentos abertos nelas); sem período, contam tudo.
async function getStats(periodo) {
  const turmas = turmasDoPeriodo(periodo);
  const [[[contagens]], alunosEmRisco] = await Promise.all([
    pool.query(
      `SELECT
         (SELECT COUNT(*) FROM (${turmas.sql}) tp) AS totalTurmas,
         ${
           periodo
             ? `(SELECT COUNT(DISTINCT m.aluno_id) FROM matriculas m WHERE m.turma_id IN (${turmas.sql}))`
             : '(SELECT COUNT(*) FROM alunos)'
         } AS totalAlunos,
         (SELECT COUNT(*) FROM encaminhamentos
          WHERE status <> 'finalizado' AND turma_id IN (${turmas.sql})) AS encaminhamentosAtivos`,
      [...turmas.params, ...(periodo ? turmas.params : []), ...turmas.params]
    ),
    findRiskStudents({ periodo })
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

// Com período, turmas e disciplinas se restringem às do período (disciplinas pelos diários das turmas).
async function getFilterOptions(periodo) {
  const turmasPeriodo = turmasDoPeriodo(periodo);
  const [[cursos], [turmas], [disciplinas]] = await Promise.all([
    pool.query('SELECT nome, fases FROM cursos ORDER BY nome'),
    // O mesmo nome de turma se repete em períodos diferentes.
    pool.query(
      `SELECT DISTINCT nome FROM turmas WHERE id IN (${turmasPeriodo.sql}) ORDER BY nome`,
      turmasPeriodo.params
    ),
    periodo
      ? pool.query(
          `SELECT DISTINCT d.nome FROM disciplinas d
           JOIN diarios di ON di.disciplina_id = d.id
           WHERE di.turma_id IN (${turmasPeriodo.sql})
           ORDER BY d.nome`,
          turmasPeriodo.params
        )
      : pool.query('SELECT nome FROM disciplinas ORDER BY nome')
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

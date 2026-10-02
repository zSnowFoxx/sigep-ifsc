const pool = require('../config/database');

// Níveis que contam como "atenção pedagógica" nos cards do dashboard.
const NIVEIS_ATENCAO = ['critico', 'alto', 'medio'];

function normalizeRisco(risco) {
  return String(risco ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();
}

function roundOne(value) {
  return value === null || value === undefined ? null : Math.round(value * 10) / 10;
}

function toFatores(fatores) {
  return Array.isArray(fatores) ? fatores : [];
}

async function getStats() {
  const [[turmasRows], [situacoes]] = await Promise.all([
    pool.query('SELECT COUNT(*) AS totalTurmas FROM turmas'),
    pool.query(
      `SELECT sr.aluno_id, sr.risco, sr.fatores
       FROM situacoes_risco sr
       JOIN alunos a ON a.id = sr.aluno_id`
    )
  ]);

  const { totalTurmas } = turmasRows[0];

  // Considera apenas alunos com situação de risco registrada.
  const totalAlunos = new Set(situacoes.map((s) => s.aluno_id)).size;

  const atencaoPedagogica = situacoes.filter((s) =>
    NIVEIS_ATENCAO.includes(normalizeRisco(s.risco))
  ).length;

  const percentualAtencao =
    totalAlunos > 0 ? ((atencaoPedagogica / totalAlunos) * 100).toFixed(1) : '0.0';

  const encaminhamentosAtivos = situacoes.filter((s) => toFatores(s.fatores).length > 0).length;

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

// Alunos em situação de risco em todas as turmas (mesmo repetidos)
// Filtra por média baixa (< 6) ou infrequência alta (> 30%) e calcula o nível de risco
async function findRiskStudents() {



  //REMOVER TABELA SITUACAO_RISCO DE TODO BACK/FRONTEND, POIS NÃO ESTÁ SENDO USADA. AQUI ESTAMOS CALCULANDO O RISCO COM BASE NOS DADOS DE NOTAS E INFREQUÊNCIA.


  const [rows] = await pool.query(
    `SELECT DISTINCT
       a.id, a.matricula, a.nome,
       t.nome AS turma,
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

    // Calcula nível de risco baseado na média e infrequência
    let risco = 'baixo';
    let fatores = [];

    if (media < 3) {
      risco = 'critico';
      fatores.push('media_muito_baixa');
    } else if (media < 5) {
      risco = 'alto';
      fatores.push('media_baixa');
    } else if (media < 6) {
      risco = 'medio';
      fatores.push('media_abaixo_media');
    }

    if (infrequencia > 20) {
      if (risco === 'critico' || risco === 'alto') risco = 'critico';
      else if (risco === 'medio') risco = 'alto';
      fatores.push('infrequencia_muito_alta');
    } else if (infrequencia > 15) {
      if (risco === 'critico') risco = 'critico';
      else if (risco === 'alto') risco = 'alto';
      else risco = 'medio';
      fatores.push('infrequencia_alta');
    }

    return {
      id: row.id,
      matricula: row.matricula,
      nome: row.nome,
      turma: row.turma ?? 'Sem Turma',
      media,
      infrequencia,
      fatores,
      risco
    };
  });
}

module.exports = {
  getStats,
  getFilterOptions,
  findRiskStudents
};

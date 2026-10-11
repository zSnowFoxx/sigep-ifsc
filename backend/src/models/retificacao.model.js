const pool = require('../config/database');

const COLUMNS = 'id, conselho_id, nota_frequencia_id, media_retificada, usuario_id, data_registro';

async function findAllByConselho(conselhoId) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM conselhos_retificacoes WHERE conselho_id = ? ORDER BY id`,
    [conselhoId]
  );
  return rows;
}

async function findOne(conselhoId, notaFrequenciaId) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM conselhos_retificacoes WHERE conselho_id = ? AND nota_frequencia_id = ?`,
    [conselhoId, notaFrequenciaId]
  );
  return rows[0] ?? null;
}

// A nota precisa ser de um aluno matriculado em uma das turmas do conselho.
async function notaDoConselho(conselhoId, notaFrequenciaId) {
  const [rows] = await pool.query(
    `SELECT 1
     FROM notas_frequencias nf
     JOIN matriculas m ON m.id = nf.matricula_id
     JOIN conselhos_turmas ct ON ct.turma_id = m.turma_id AND ct.conselho_id = ?
     WHERE nf.id = ?
     LIMIT 1`,
    [conselhoId, notaFrequenciaId]
  );
  return rows.length > 0;
}

// Uma retificação por nota em cada conselho: salvar de novo substitui a anterior.
async function salvar(conselhoId, notaFrequenciaId, { mediaRetificada, usuarioId }) {
  await pool.query(
    `INSERT INTO conselhos_retificacoes (conselho_id, nota_frequencia_id, media_retificada, usuario_id)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE media_retificada = ?, usuario_id = ?, data_registro = CURRENT_TIMESTAMP`,
    [conselhoId, notaFrequenciaId, mediaRetificada, usuarioId ?? null, mediaRetificada, usuarioId ?? null]
  );
  return findOne(conselhoId, notaFrequenciaId);
}

async function remove(conselhoId, notaFrequenciaId) {
  const [result] = await pool.query(
    'DELETE FROM conselhos_retificacoes WHERE conselho_id = ? AND nota_frequencia_id = ?',
    [conselhoId, notaFrequenciaId]
  );
  return result.affectedRows > 0;
}

module.exports = {
  findAllByConselho,
  findOne,
  notaDoConselho,
  salvar,
  remove
};

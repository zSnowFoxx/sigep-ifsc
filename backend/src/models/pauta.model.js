const pool = require('../config/database');

const COLUMNS = 'conselho_id, turma_id, sintese_turma, demandas_turma, observacoes_turma';

async function findAllByConselho(conselhoId) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM pautas_conselho WHERE conselho_id = ? ORDER BY turma_id`,
    [conselhoId]
  );
  return rows;
}

async function findOne(conselhoId, turmaId) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM pautas_conselho WHERE conselho_id = ? AND turma_id = ?`,
    [conselhoId, turmaId]
  );
  return rows[0] ?? null;
}

async function create(conselhoId, { turmaId, sinteseTurma, demandasTurma, observacoesTurma }) {
  await pool.query(
    `INSERT INTO pautas_conselho (conselho_id, turma_id, sintese_turma, demandas_turma, observacoes_turma)
     VALUES (?, ?, ?, ?, ?)`,
    [conselhoId, turmaId, sinteseTurma ?? null, demandasTurma ?? null, observacoesTurma ?? null]
  );
  return findOne(conselhoId, turmaId);
}

async function update(conselhoId, turmaId, data) {
  const fieldMap = {
    sinteseTurma: 'sintese_turma',
    demandasTurma: 'demandas_turma',
    observacoesTurma: 'observacoes_turma'
  };

  const columns = [];
  const values = [];

  for (const [key, column] of Object.entries(fieldMap)) {
    if (data[key] !== undefined) {
      columns.push(`${column} = ?`);
      values.push(data[key]);
    }
  }

  if (columns.length > 0) {
    values.push(conselhoId, turmaId);
    await pool.query(
      `UPDATE pautas_conselho SET ${columns.join(', ')} WHERE conselho_id = ? AND turma_id = ?`,
      values
    );
  }

  return findOne(conselhoId, turmaId);
}

async function remove(conselhoId, turmaId) {
  const [result] = await pool.query(
    'DELETE FROM pautas_conselho WHERE conselho_id = ? AND turma_id = ?',
    [conselhoId, turmaId]
  );
  return result.affectedRows > 0;
}

module.exports = {
  findAllByConselho,
  findOne,
  create,
  update,
  remove
};

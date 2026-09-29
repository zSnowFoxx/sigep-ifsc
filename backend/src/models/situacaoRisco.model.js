const pool = require('../config/database');

const COLUMNS = 'id, aluno_id, risco, fatores';

function toJsonColumn(value) {
  return value === null || value === undefined ? value : JSON.stringify(value);
}

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM situacoes_risco ORDER BY id`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM situacoes_risco WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

async function create({ alunoId, risco, fatores }) {
  const [result] = await pool.query(
    'INSERT INTO situacoes_risco (aluno_id, risco, fatores) VALUES (?, ?, ?)',
    [alunoId, risco ?? null, toJsonColumn(fatores) ?? null]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const columns = [];
  const values = [];

  if (data.alunoId !== undefined) {
    columns.push('aluno_id = ?');
    values.push(data.alunoId);
  }
  if (data.risco !== undefined) {
    columns.push('risco = ?');
    values.push(data.risco);
  }
  if (data.fatores !== undefined) {
    columns.push('fatores = ?');
    values.push(toJsonColumn(data.fatores));
  }

  if (columns.length > 0) {
    values.push(id);
    await pool.query(`UPDATE situacoes_risco SET ${columns.join(', ')} WHERE id = ?`, values);
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM situacoes_risco WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};

const pool = require('../config/database');

const COLUMNS = 'id, aluno_id, turma_id';

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM matriculas ORDER BY id`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM matriculas WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

async function create({ alunoId, turmaId }) {
  const [result] = await pool.query(
    'INSERT INTO matriculas (aluno_id, turma_id) VALUES (?, ?)',
    [alunoId, turmaId]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fieldMap = { alunoId: 'aluno_id', turmaId: 'turma_id' };

  const columns = [];
  const values = [];

  for (const [key, column] of Object.entries(fieldMap)) {
    if (data[key] !== undefined) {
      columns.push(`${column} = ?`);
    }
  }

  if (columns.length > 0) {
    values.push(id);
    await pool.query(`UPDATE matriculas SET ${columns.join(', ')} WHERE id = ?`, values);
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM matriculas WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};

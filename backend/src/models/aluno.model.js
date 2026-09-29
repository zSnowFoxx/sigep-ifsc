const pool = require('../config/database');

const COLUMNS = 'id, matricula, nome, email, status';

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM alunos ORDER BY nome`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM alunos WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

async function findByMatricula(matricula) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM alunos WHERE matricula = ?`, [matricula]);
  return rows[0] ?? null;
}

async function create({ matricula, nome, email, status }) {
  const [result] = await pool.query(
    'INSERT INTO alunos (matricula, nome, email, status) VALUES (?, ?, ?, ?)',
    [matricula, nome, email ?? null, status ?? null]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fields = ['matricula', 'nome', 'email', 'status'];

  const columns = [];
  const values = [];

  for (const field of fields) {
    if (data[field] !== undefined) {
      columns.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (columns.length > 0) {
    values.push(id);
    await pool.query(`UPDATE alunos SET ${columns.join(', ')} WHERE id = ?`, values);
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM alunos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByMatricula,
  create,
  update,
  remove
};

const pool = require('../config/database');

async function findAll() {
  const [rows] = await pool.query('SELECT id, nome FROM funcoes ORDER BY nome');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT id, nome FROM funcoes WHERE id = ?', [id]);
  return rows[0] ?? null;
}

async function findByNome(nome) {
  const [rows] = await pool.query('SELECT id, nome FROM funcoes WHERE nome = ?', [nome]);
  return rows[0] ?? null;
}

async function create({ nome }) {
  const [result] = await pool.query('INSERT INTO funcoes (nome) VALUES (?)', [nome]);
  return findById(result.insertId);
}

async function update(id, { nome }) {
  const [result] = await pool.query('UPDATE funcoes SET nome = ? WHERE id = ?', [nome, id]);

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM funcoes WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByNome,
  create,
  update,
  remove
};

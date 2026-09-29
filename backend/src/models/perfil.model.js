const pool = require('../config/database');

async function findAll() {
  const [rows] = await pool.query('SELECT id, nome FROM perfis ORDER BY nome');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT id, nome FROM perfis WHERE id = ?', [id]);
  return rows[0] ?? null;
}

async function findByNome(nome) {
  const [rows] = await pool.query('SELECT id, nome FROM perfis WHERE nome = ?', [nome]);
  return rows[0] ?? null;
}

async function create({ nome }) {
  const [result] = await pool.query('INSERT INTO perfis (nome) VALUES (?)', [nome]);
  return findById(result.insertId);
}

async function update(id, { nome }) {
  const [result] = await pool.query('UPDATE perfis SET nome = ? WHERE id = ?', [nome, id]);

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM perfis WHERE id = ?', [id]);
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

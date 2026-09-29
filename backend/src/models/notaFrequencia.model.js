const pool = require('../config/database');

const COLUMNS = 'id, matricula_id, diario_id, media, infrequencia';

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM notas_frequencias ORDER BY id`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM notas_frequencias WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

async function create({ matriculaId, diarioId, media, infrequencia }) {
  const [result] = await pool.query(
    'INSERT INTO notas_frequencias (matricula_id, diario_id, media, infrequencia) VALUES (?, ?, ?, ?)',
    [matriculaId, diarioId, media ?? null, infrequencia ?? null]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fieldMap = {
    matriculaId: 'matricula_id',
    diarioId: 'diario_id',
    media: 'media',
    infrequencia: 'infrequencia'
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
    values.push(id);
    await pool.query(`UPDATE notas_frequencias SET ${columns.join(', ')} WHERE id = ?`, values);
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM notas_frequencias WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};

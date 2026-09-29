const pool = require('../config/database');

// ativo is TINYINT(1), which mysql2 returns as 0/1.
function toPeriodo(row) {
  return row && { ...row, ativo: Boolean(row.ativo) };
}

async function findAll() {
  const [rows] = await pool.query(
    'SELECT id, ano, semestre, ativo FROM periodos ORDER BY ano DESC, semestre DESC'
  );
  return rows.map(toPeriodo);
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, ano, semestre, ativo FROM periodos WHERE id = ?',
    [id]
  );
  return toPeriodo(rows[0] ?? null);
}

async function create({ ano, semestre, ativo }) {
  const [result] = await pool.query(
    'INSERT INTO periodos (ano, semestre, ativo) VALUES (?, ?, ?)',
    [ano, semestre, ativo ? 1 : 0]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fieldMap = { ano: 'ano', semestre: 'semestre', ativo: 'ativo' };

  const columns = [];
  const values = [];

  for (const [key, column] of Object.entries(fieldMap)) {
    if (data[key] !== undefined) {
      columns.push(`${column} = ?`);
      values.push(key === 'ativo' ? (data[key] ? 1 : 0) : data[key]);
    }
  }

  if (columns.length === 0) {
    return findById(id);
  }

  values.push(id);
  const [result] = await pool.query(`UPDATE periodos SET ${columns.join(', ')} WHERE id = ?`, values);

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM periodos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};

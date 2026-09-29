const pool = require('../config/database');

const COLUMNS = 'id, codigo, disciplina_id, turma_id, professor_id, cargaHoraria, aulasPrevistas';

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM diarios ORDER BY codigo`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM diarios WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

async function findByCodigo(codigo) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM diarios WHERE codigo = ?`, [codigo]);
  return rows[0] ?? null;
}

async function create({ codigo, disciplinaId, turmaId, professorId, cargaHoraria, aulasPrevistas }) {
  const [result] = await pool.query(
    `INSERT INTO diarios (codigo, disciplina_id, turma_id, professor_id, cargaHoraria, aulasPrevistas)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [codigo, disciplinaId, turmaId, professorId, cargaHoraria ?? null, aulasPrevistas ?? null]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fieldMap = {
    codigo: 'codigo',
    disciplinaId: 'disciplina_id',
    turmaId: 'turma_id',
    professorId: 'professor_id',
    cargaHoraria: 'cargaHoraria',
    aulasPrevistas: 'aulasPrevistas'
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
    await pool.query(`UPDATE diarios SET ${columns.join(', ')} WHERE id = ?`, values);
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM diarios WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByCodigo,
  create,
  update,
  remove
};

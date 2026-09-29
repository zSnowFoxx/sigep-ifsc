const pool = require('../config/database');
const toDateTime = require('../utils/dateTime');

const COLUMNS = 'id, encaminhamento_id, usuario_id, data_registro, relato';

async function findAll() {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM historico_encaminhamentos ORDER BY data_registro DESC, id DESC`
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM historico_encaminhamentos WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

async function create({ encaminhamentoId, usuarioId, dataRegistro, relato }) {
  const [result] = await pool.query(
    `INSERT INTO historico_encaminhamentos (encaminhamento_id, usuario_id, data_registro, relato)
     VALUES (?, ?, ?, ?)`,
    [encaminhamentoId, usuarioId, dataRegistro ? toDateTime(dataRegistro) : new Date(), relato ?? null]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fieldMap = {
    encaminhamentoId: 'encaminhamento_id',
    usuarioId: 'usuario_id',
    dataRegistro: 'data_registro',
    relato: 'relato'
  };

  const columns = [];
  const values = [];

  for (const [key, column] of Object.entries(fieldMap)) {
    if (data[key] !== undefined) {
      columns.push(`${column} = ?`);
      values.push(key === 'dataRegistro' ? toDateTime(data[key]) : data[key]);
    }
  }

  if (columns.length > 0) {
    values.push(id);
    await pool.query(`UPDATE historico_encaminhamentos SET ${columns.join(', ')} WHERE id = ?`, values);
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM historico_encaminhamentos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};

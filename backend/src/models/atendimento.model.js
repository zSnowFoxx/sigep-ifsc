const pool = require('../config/database');
const toDateTime = require('../utils/dateTime');

const COLUMNS =
  'id, usuario_id, aluno_id, data_atendimento, motivo_atendimento, motivo_contato, relato_atendimento';

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM atendimentos ORDER BY data_atendimento DESC, id DESC`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM atendimentos WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

async function create(data) {
  const {
    usuarioId,
    alunoId,
    dataAtendimento,
    motivoAtendimento,
    motivoContato,
    relatoAtendimento
  } = data;

  const [result] = await pool.query(
    `INSERT INTO atendimentos
       (usuario_id, aluno_id, data_atendimento, motivo_atendimento, motivo_contato, relato_atendimento)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      usuarioId,
      alunoId,
      toDateTime(dataAtendimento) ?? null,
      motivoAtendimento ?? null,
      motivoContato ?? null,
      relatoAtendimento ?? null
    ]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fieldMap = {
    usuarioId: 'usuario_id',
    alunoId: 'aluno_id',
    dataAtendimento: 'data_atendimento',
    motivoAtendimento: 'motivo_atendimento',
    motivoContato: 'motivo_contato',
    relatoAtendimento: 'relato_atendimento'
  };

  const columns = [];
  const values = [];

  for (const [key, column] of Object.entries(fieldMap)) {
    if (data[key] !== undefined) {
      columns.push(`${column} = ?`);
      values.push(key === 'dataAtendimento' ? toDateTime(data[key]) : data[key]);
    }
  }

  if (columns.length > 0) {
    values.push(id);
    await pool.query(`UPDATE atendimentos SET ${columns.join(', ')} WHERE id = ?`, values);
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM atendimentos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};

const pool = require('../config/database');
const toDateTime = require('../utils/dateTime');
const buildSet = require('../utils/buildSet');

const COLUMNS = 'id, aluno_id, turma_id, servidor_id, data_atendimento, motivo, forma_contato, relato';

// turmaId omitido: o banco preenche com a turma do aluno (trigger).
const FIELD_MAP = {
  alunoId: 'aluno_id',
  turmaId: 'turma_id',
  servidorId: 'servidor_id',
  dataAtendimento: 'data_atendimento',
  motivo: 'motivo',
  formaContato: 'forma_contato',
  relato: 'relato'
};

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM atendimentos ORDER BY data_atendimento DESC, id DESC`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM atendimentos WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

async function create(data) {
  const { alunoId, turmaId, servidorId, dataAtendimento, motivo, formaContato, relato } = data;

  const [result] = await pool.query(
    `INSERT INTO atendimentos (aluno_id, turma_id, servidor_id, data_atendimento, motivo, forma_contato, relato)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      alunoId,
      turmaId ?? null,
      servidorId ?? null,
      dataAtendimento ? toDateTime(dataAtendimento) : new Date(),
      motivo,
      formaContato ?? null,
      relato
    ]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const { columns, values } = buildSet(FIELD_MAP, data, { dataAtendimento: toDateTime });

  if (columns.length > 0) {
    await pool.query(`UPDATE atendimentos SET ${columns.join(', ')} WHERE id = ?`, [...values, id]);
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM atendimentos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  FIELDS: Object.keys(FIELD_MAP),
  findAll,
  findById,
  create,
  update,
  remove
};

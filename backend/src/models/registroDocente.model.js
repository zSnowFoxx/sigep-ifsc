const pool = require('../config/database');
const buildSet = require('../utils/buildSet');

const COLUMNS = `id, conselho_id, aluno_id, docente_id, DATE_FORMAT(data_registro, '%Y-%m-%d') AS data_registro,
  turma_id, titulo, categoria, registro, encaminhamento_id`;

// turmaId omitido: o banco preenche com a turma do aluno (trigger).
const FIELD_MAP = {
  alunoId: 'aluno_id',
  docenteId: 'docente_id',
  turmaId: 'turma_id',
  titulo: 'titulo',
  categoria: 'categoria',
  registro: 'registro',
  encaminhamentoId: 'encaminhamento_id'
};

async function findAllByConselho(conselhoId) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM registros_docentes WHERE conselho_id = ? ORDER BY data_registro DESC, id DESC`,
    [conselhoId]
  );
  return rows;
}

async function findOne(conselhoId, id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM registros_docentes WHERE conselho_id = ? AND id = ?`, [
    conselhoId,
    id
  ]);
  return rows[0] ?? null;
}

async function create(conselhoId, data) {
  const { alunoId, docenteId, turmaId, titulo, categoria, registro, encaminhamentoId } = data;

  const [result] = await pool.query(
    `INSERT INTO registros_docentes
       (conselho_id, aluno_id, docente_id, turma_id, titulo, categoria, registro, encaminhamento_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [conselhoId, alunoId, docenteId, turmaId ?? null, titulo, categoria, registro, encaminhamentoId ?? null]
  );
  return findOne(conselhoId, result.insertId);
}

async function update(conselhoId, id, data) {
  const { columns, values } = buildSet(FIELD_MAP, data);

  if (columns.length > 0) {
    await pool.query(`UPDATE registros_docentes SET ${columns.join(', ')} WHERE conselho_id = ? AND id = ?`, [
      ...values,
      conselhoId,
      id
    ]);
  }

  return findOne(conselhoId, id);
}

async function remove(conselhoId, id) {
  const [result] = await pool.query('DELETE FROM registros_docentes WHERE conselho_id = ? AND id = ?', [
    conselhoId,
    id
  ]);
  return result.affectedRows > 0;
}

module.exports = {
  FIELDS: Object.keys(FIELD_MAP),
  findAllByConselho,
  findOne,
  create,
  update,
  remove
};

const pool = require('../config/database');
const buildSet = require('../utils/buildSet');
const { comTurmaNoInsert, comTurmaNoUpdate } = require('../utils/turmaDoAluno');

const COLUMNS = 'id, conselho_id, aluno_id, turma_id, alteracoes_realizadas, data_registro';

// turmaId omitido: usa a turma do aluno, priorizando as do conselho (utils/turmaDoAluno).
const FIELD_MAP = {
  alunoId: 'aluno_id',
  turmaId: 'turma_id',
  alteracoesRealizadas: 'alteracoes_realizadas'
};

async function findAllByConselho(conselhoId) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM conselhos_deliberacoes WHERE conselho_id = ? ORDER BY id`,
    [conselhoId]
  );
  return rows;
}

async function findOne(conselhoId, id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM conselhos_deliberacoes WHERE conselho_id = ? AND id = ?`, [
    conselhoId,
    id
  ]);
  return rows[0] ?? null;
}

async function create(conselhoId, data) {
  const { alunoId, turmaId, alteracoesRealizadas } = await comTurmaNoInsert(data, conselhoId);
  const [result] = await pool.query(
    `INSERT INTO conselhos_deliberacoes (conselho_id, aluno_id, turma_id, alteracoes_realizadas)
     VALUES (?, ?, ?, ?)`,
    [conselhoId, alunoId, turmaId ?? null, alteracoesRealizadas]
  );
  return findOne(conselhoId, result.insertId);
}

async function update(conselhoId, id, dados) {
  const atual = dados.alunoId !== undefined ? await findOne(conselhoId, id) : null;
  const data = await comTurmaNoUpdate(atual, dados, conselhoId);
  const { columns, values } = buildSet(FIELD_MAP, data);

  if (columns.length > 0) {
    await pool.query(`UPDATE conselhos_deliberacoes SET ${columns.join(', ')} WHERE conselho_id = ? AND id = ?`, [
      ...values,
      conselhoId,
      id
    ]);
  }

  return findOne(conselhoId, id);
}

async function remove(conselhoId, id) {
  const [result] = await pool.query('DELETE FROM conselhos_deliberacoes WHERE conselho_id = ? AND id = ?', [
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

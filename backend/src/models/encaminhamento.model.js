const pool = require('../config/database');

const COLUMNS =
  'id, conselho_id, atendimento_id, aluno_id, categoria, observacoes, descricao_acao, usuario_responsavel_id, status';

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM encaminhamentos ORDER BY id DESC`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM encaminhamentos WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

async function create(data) {
  const {
    conselhoId,
    atendimentoId,
    alunoId,
    categoria,
    observacoes,
    descricaoAcao,
    usuarioResponsavelId,
    status
  } = data;

  const [result] = await pool.query(
    `INSERT INTO encaminhamentos
       (conselho_id, atendimento_id, aluno_id, categoria, observacoes, descricao_acao,
        usuario_responsavel_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      conselhoId,
      atendimentoId,
      alunoId,
      categoria ?? null,
      observacoes ?? null,
      descricaoAcao ?? null,
      usuarioResponsavelId,
      status ?? null
    ]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fieldMap = {
    conselhoId: 'conselho_id',
    atendimentoId: 'atendimento_id',
    alunoId: 'aluno_id',
    categoria: 'categoria',
    observacoes: 'observacoes',
    descricaoAcao: 'descricao_acao',
    usuarioResponsavelId: 'usuario_responsavel_id',
    status: 'status'
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
    await pool.query(`UPDATE encaminhamentos SET ${columns.join(', ')} WHERE id = ?`, values);
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM encaminhamentos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};

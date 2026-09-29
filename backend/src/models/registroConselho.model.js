const pool = require('../config/database');

const COLUMNS =
  'id, conselho_id, aluno_id, usuario_id, observacao, risco_evasao, informacoes_adicionais, retorno';

// risco_evasao is a nullable TINYINT(1), which mysql2 returns as 0/1.
function toRegistro(row) {
  if (!row || row.risco_evasao === null) {
    return row;
  }
  return { ...row, risco_evasao: Boolean(row.risco_evasao) };
}

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM registros_conselho ORDER BY id`);
  return rows.map(toRegistro);
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM registros_conselho WHERE id = ?`, [id]);
  return toRegistro(rows[0] ?? null);
}

async function create(data) {
  const {
    conselhoId,
    alunoId,
    usuarioId,
    observacao,
    riscoEvasao,
    informacoesAdicionais,
    retorno
  } = data;

  const [result] = await pool.query(
    `INSERT INTO registros_conselho
       (conselho_id, aluno_id, usuario_id, observacao, risco_evasao, informacoes_adicionais, retorno)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      conselhoId,
      alunoId,
      usuarioId,
      observacao ?? null,
      riscoEvasao ?? null,
      informacoesAdicionais ?? null,
      retorno ?? null
    ]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fieldMap = {
    conselhoId: 'conselho_id',
    alunoId: 'aluno_id',
    usuarioId: 'usuario_id',
    observacao: 'observacao',
    riscoEvasao: 'risco_evasao',
    informacoesAdicionais: 'informacoes_adicionais',
    retorno: 'retorno'
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
    await pool.query(`UPDATE registros_conselho SET ${columns.join(', ')} WHERE id = ?`, values);
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM registros_conselho WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};

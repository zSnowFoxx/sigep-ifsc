const pool = require('../config/database');
const toDateTime = require('../utils/dateTime');

const COLUMNS = `id_log, usuario_id, acao, tabela_afetada, registro_id, dados_anteriores, dados_novos,
  data_hora, endereco_ip, user_agent`;

// mysql2 expands a plain object bound to ? into `key = value` pairs, so JSON columns must be serialized.
function toJson(value) {
  return value === null || value === undefined ? value : JSON.stringify(value);
}

function toRegistroId(value) {
  return value === null || value === undefined ? value : String(value);
}

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM logs_auditoria ORDER BY data_hora DESC, id_log DESC`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM logs_auditoria WHERE id_log = ?`, [id]);
  return rows[0] ?? null;
}

async function create({
  usuarioId,
  acao,
  tabelaAfetada,
  registroId,
  dadosAnteriores,
  dadosNovos,
  dataHora,
  enderecoIp,
  userAgent
}) {
  const [result] = await pool.query(
    `INSERT INTO logs_auditoria
       (usuario_id, acao, tabela_afetada, registro_id, dados_anteriores, dados_novos, data_hora, endereco_ip, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      usuarioId ?? null,
      acao,
      tabelaAfetada,
      toRegistroId(registroId) ?? null,
      toJson(dadosAnteriores) ?? null,
      toJson(dadosNovos) ?? null,
      dataHora ? toDateTime(dataHora) : new Date(),
      enderecoIp ?? null,
      userAgent ?? null
    ]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fieldMap = {
    usuarioId: 'usuario_id',
    acao: 'acao',
    tabelaAfetada: 'tabela_afetada',
    registroId: 'registro_id',
    dadosAnteriores: 'dados_anteriores',
    dadosNovos: 'dados_novos',
    dataHora: 'data_hora',
    enderecoIp: 'endereco_ip',
    userAgent: 'user_agent'
  };

  const converters = {
    registroId: toRegistroId,
    dadosAnteriores: toJson,
    dadosNovos: toJson,
    dataHora: toDateTime
  };

  const columns = [];
  const values = [];

  for (const [key, column] of Object.entries(fieldMap)) {
    if (data[key] !== undefined) {
      columns.push(`${column} = ?`);
      values.push(converters[key] ? converters[key](data[key]) : data[key]);
    }
  }

  if (columns.length > 0) {
    values.push(id);
    await pool.query(`UPDATE logs_auditoria SET ${columns.join(', ')} WHERE id_log = ?`, values);
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM logs_auditoria WHERE id_log = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};

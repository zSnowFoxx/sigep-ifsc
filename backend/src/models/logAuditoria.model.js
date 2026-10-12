const pool = require('../config/database');

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
      new Date(),
      enderecoIp ?? null,
      userAgent ?? null
    ]
  );
  return findById(result.insertId);
}

// Sem update/remove: logs de auditoria são somente inclusão.
module.exports = {
  findAll,
  findById,
  create
};

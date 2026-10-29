const pool = require('../config/database');

// Inclui quem fez a ação: o usuário pode ter sido removido depois (usuario_id fica NULL).
const SELECT_COM_USUARIO = `
  SELECT l.id_log, l.usuario_id, u.nome AS usuario_nome, u.siape AS usuario_siape, l.acao, l.tabela_afetada,
    l.registro_id, l.dados_anteriores, l.dados_novos, l.data_hora, l.endereco_ip, l.user_agent
  FROM logs_auditoria l
  LEFT JOIN usuarios u ON u.id = l.usuario_id`;

// mysql2 expands a plain object bound to ? into `key = value` pairs, so JSON columns must be serialized.
function toJson(value) {
  return value === null || value === undefined ? value : JSON.stringify(value);
}

function toRegistroId(value) {
  return value === null || value === undefined ? value : String(value);
}

const escapeLike = (texto) => texto.replace(/[\\%_]/g, (c) => `\\${c}`);

// Filtros já validados (validators/logAuditoria.validator.js); de/ate são Date.
function montarWhere({ usuarioId, acao, tabela, registroId, de, ate, busca }) {
  const condicoes = [];
  const valores = [];

  if (usuarioId !== undefined) {
    condicoes.push('l.usuario_id = ?');
    valores.push(usuarioId);
  }
  if (acao !== undefined) {
    condicoes.push('l.acao = ?');
    valores.push(acao);
  }
  if (tabela !== undefined) {
    condicoes.push('l.tabela_afetada = ?');
    valores.push(tabela);
  }
  if (registroId !== undefined) {
    condicoes.push('l.registro_id = ?');
    valores.push(registroId);
  }
  if (de !== undefined) {
    condicoes.push('l.data_hora >= ?');
    valores.push(de);
  }
  if (ate !== undefined) {
    condicoes.push('l.data_hora <= ?');
    valores.push(ate);
  }
  if (busca !== undefined) {
    const termo = `%${escapeLike(busca)}%`;
    condicoes.push(`(u.nome LIKE ? OR u.siape LIKE ? OR l.registro_id LIKE ? OR l.endereco_ip LIKE ?
      OR CAST(l.dados_anteriores AS CHAR) LIKE ? OR CAST(l.dados_novos AS CHAR) LIKE ?)`);
    valores.push(termo, termo, termo, termo, termo, termo);
  }

  return { where: condicoes.length > 0 ? `WHERE ${condicoes.join(' AND ')}` : '', valores };
}

// Página de logs (mais recentes primeiro) e o total que atende aos filtros.
async function findAll({ pagina = 1, limite = 50, ...filtros } = {}) {
  const { where, valores } = montarWhere(filtros);

  const [[rows], [[{ total }]]] = await Promise.all([
    pool.query(`${SELECT_COM_USUARIO} ${where} ORDER BY l.data_hora DESC, l.id_log DESC LIMIT ? OFFSET ?`, [
      ...valores,
      limite,
      (pagina - 1) * limite
    ]),
    pool.query(`SELECT COUNT(*) AS total FROM logs_auditoria l LEFT JOIN usuarios u ON u.id = l.usuario_id ${where}`, valores)
  ]);

  return { itens: rows, total: Number(total), pagina, limite };
}

// Valores existentes para os filtros da tela de consulta.
async function findOpcoes() {
  const [[acoes], [tabelas], [usuarios]] = await Promise.all([
    pool.query('SELECT DISTINCT acao FROM logs_auditoria ORDER BY acao'),
    pool.query('SELECT DISTINCT tabela_afetada FROM logs_auditoria ORDER BY tabela_afetada'),
    pool.query(
      `SELECT u.id, u.nome, u.siape FROM usuarios u
       WHERE EXISTS (SELECT 1 FROM logs_auditoria l WHERE l.usuario_id = u.id)
       ORDER BY u.nome`
    )
  ]);

  return {
    acoes: acoes.map((row) => row.acao),
    tabelas: tabelas.map((row) => row.tabela_afetada),
    usuarios
  };
}

async function findById(id) {
  const [rows] = await pool.query(`${SELECT_COM_USUARIO} WHERE l.id_log = ?`, [id]);
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
  findOpcoes,
  findById,
  create
};

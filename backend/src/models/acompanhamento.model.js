const pool = require('../config/database');
const buildSet = require('../utils/buildSet');

const COLUMNS = `ac.id, ac.encaminhamento_id, ac.autor_id, u.nome AS autor_nome, ac.tipo, ac.relato, ac.data_registro`;
const FROM = 'FROM encaminhamentos_acompanhamento ac LEFT JOIN usuarios u ON u.id = ac.autor_id';

const FIELD_MAP = {
  autorId: 'autor_id',
  tipo: 'tipo',
  relato: 'relato'
};

async function findAllByEncaminhamento(encaminhamentoId) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} ${FROM}
     WHERE ac.encaminhamento_id = ? ORDER BY ac.data_registro, ac.id`,
    [encaminhamentoId]
  );
  return rows;
}

async function findOne(encaminhamentoId, id) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} ${FROM} WHERE ac.encaminhamento_id = ? AND ac.id = ?`,
    [encaminhamentoId, id]
  );
  return rows[0] ?? null;
}

async function create(encaminhamentoId, { autorId, tipo, relato }) {
  const [result] = await pool.query(
    `INSERT INTO encaminhamentos_acompanhamento (encaminhamento_id, autor_id, tipo, relato)
     VALUES (?, ?, ?, ?)`,
    [encaminhamentoId, autorId ?? null, tipo ?? 'relato', relato]
  );
  return findOne(encaminhamentoId, result.insertId);
}

async function update(encaminhamentoId, id, data) {
  const { columns, values } = buildSet(FIELD_MAP, data, { tipo: (tipo) => tipo ?? 'relato' });

  if (columns.length > 0) {
    await pool.query(
      `UPDATE encaminhamentos_acompanhamento SET ${columns.join(', ')} WHERE encaminhamento_id = ? AND id = ?`,
      [...values, encaminhamentoId, id]
    );
  }

  return findOne(encaminhamentoId, id);
}

async function remove(encaminhamentoId, id) {
  const [result] = await pool.query(
    'DELETE FROM encaminhamentos_acompanhamento WHERE encaminhamento_id = ? AND id = ?',
    [encaminhamentoId, id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  FIELDS: Object.keys(FIELD_MAP),
  findAllByEncaminhamento,
  findOne,
  create,
  update,
  remove
};

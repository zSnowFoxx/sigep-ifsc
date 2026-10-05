const pool = require('../config/database');
const buildSet = require('../utils/buildSet');

const COLUMNS = 'id, encaminhamento_id, autor_id, tipo, relato, data_registro';

const FIELD_MAP = {
  autorId: 'autor_id',
  tipo: 'tipo',
  relato: 'relato'
};

async function findAllByEncaminhamento(encaminhamentoId) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM encaminhamentos_acompanhamento
     WHERE encaminhamento_id = ? ORDER BY data_registro, id`,
    [encaminhamentoId]
  );
  return rows;
}

async function findOne(encaminhamentoId, id) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM encaminhamentos_acompanhamento WHERE encaminhamento_id = ? AND id = ?`,
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

const pool = require('../config/database');
const withTransaction = require('../utils/transaction');
const toDateTime = require('../utils/dateTime');

const COLUMNS = 'id, nome, etapa, data_realizacao, local, status';

async function attachParticipantes(conselho) {
  if (!conselho) {
    return conselho;
  }

  const [rows] = await pool.query(
    'SELECT usuario_id FROM participantes_conselho WHERE conselho_id = ?',
    [conselho.id]
  );

  return { ...conselho, participanteIds: rows.map((row) => row.usuario_id) };
}

async function setParticipantes(connection, conselhoId, participanteIds) {
  await connection.query('DELETE FROM participantes_conselho WHERE conselho_id = ?', [conselhoId]);

  if (!participanteIds || participanteIds.length === 0) {
    return;
  }

  const values = [...new Set(participanteIds)].map((usuarioId) => [conselhoId, usuarioId]);
  await connection.query(
    'INSERT INTO participantes_conselho (conselho_id, usuario_id) VALUES ?',
    [values]
  );
}

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM conselhos ORDER BY data_realizacao DESC, id DESC`);
  return Promise.all(rows.map(attachParticipantes));
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM conselhos WHERE id = ?`, [id]);
  return attachParticipantes(rows[0] ?? null);
}

async function create({ nome, etapa, dataRealizacao, local, status, participanteIds }) {
  const id = await withTransaction(async (connection) => {
    const [result] = await connection.query(
      `INSERT INTO conselhos (nome, etapa, data_realizacao, local, status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nome,
        etapa ?? null,
        toDateTime(dataRealizacao) ?? null,
        local ?? null,
        status ?? null
      ]
    );

    await setParticipantes(connection, result.insertId, participanteIds);
    return result.insertId;
  });

  return findById(id);
}

async function update(id, data) {
  const fieldMap = {
    nome: 'nome',
    etapa: 'etapa',
    dataRealizacao: 'data_realizacao',
    local: 'local',
    status: 'status'
  };

  const columns = [];
  const values = [];

  for (const [key, column] of Object.entries(fieldMap)) {
    if (data[key] !== undefined) {
      columns.push(`${column} = ?`);
      values.push(key === 'dataRealizacao' ? toDateTime(data[key]) : data[key]);
    }
  }

  await withTransaction(async (connection) => {
    if (columns.length > 0) {
      await connection.query(`UPDATE conselhos SET ${columns.join(', ')} WHERE id = ?`, [...values, id]);
    }

    if (data.participanteIds !== undefined) {
      await setParticipantes(connection, id, data.participanteIds);
    }
  });

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM conselhos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};

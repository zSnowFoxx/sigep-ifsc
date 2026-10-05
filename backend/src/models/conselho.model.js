const pool = require('../config/database');
const withTransaction = require('../utils/transaction');
const toDateTime = require('../utils/dateTime');
const buildSet = require('../utils/buildSet');

const COLUMNS = 'id, nome, tipo, status, conselho_origem_id, data_criacao, data_realizacao';

const FIELD_MAP = {
  nome: 'nome',
  tipo: 'tipo',
  status: 'status',
  conselhoOrigemId: 'conselho_origem_id',
  dataRealizacao: 'data_realizacao'
};

async function attachRelacoes(conselho) {
  if (!conselho) {
    return conselho;
  }

  const [[turmas], [servidores]] = await Promise.all([
    pool.query('SELECT turma_id FROM conselhos_turmas WHERE conselho_id = ? ORDER BY turma_id', [conselho.id]),
    pool.query(
      'SELECT usuario_id, presente FROM conselhos_servidores WHERE conselho_id = ? ORDER BY usuario_id',
      [conselho.id]
    )
  ]);

  return {
    ...conselho,
    turmaIds: turmas.map((row) => row.turma_id),
    servidores: servidores.map((row) => ({
      usuarioId: row.usuario_id,
      presente: row.presente === null ? null : Boolean(row.presente)
    }))
  };
}

// Mantém as turmas que continuam: remover uma turma apaga as demandas dela neste conselho.
async function setTurmas(connection, conselhoId, turmaIds) {
  const ids = [...new Set(turmaIds)];

  if (ids.length > 0) {
    await connection.query('DELETE FROM conselhos_turmas WHERE conselho_id = ? AND turma_id NOT IN (?)', [
      conselhoId,
      ids
    ]);
  } else {
    await connection.query('DELETE FROM conselhos_turmas WHERE conselho_id = ?', [conselhoId]);
  }

  const [rows] = await connection.query('SELECT turma_id FROM conselhos_turmas WHERE conselho_id = ?', [conselhoId]);
  const existentes = new Set(rows.map((row) => row.turma_id));
  const novas = ids.filter((id) => !existentes.has(id)).map((turmaId) => [conselhoId, turmaId]);

  if (novas.length > 0) {
    await connection.query('INSERT INTO conselhos_turmas (conselho_id, turma_id) VALUES ?', [novas]);
  }
}

// presente omitido mantém a presença já registrada do servidor.
async function setServidores(connection, conselhoId, servidores) {
  const ids = [...new Set(servidores.map((s) => s.usuarioId))];

  if (ids.length === 0) {
    await connection.query('DELETE FROM conselhos_servidores WHERE conselho_id = ?', [conselhoId]);
    return;
  }

  await connection.query('DELETE FROM conselhos_servidores WHERE conselho_id = ? AND usuario_id NOT IN (?)', [
    conselhoId,
    ids
  ]);
  await connection.query(
    `INSERT INTO conselhos_servidores (conselho_id, usuario_id, presente) VALUES ? AS novo
     ON DUPLICATE KEY UPDATE presente = COALESCE(novo.presente, conselhos_servidores.presente)`,
    [servidores.map((s) => [conselhoId, s.usuarioId, s.presente ?? null])]
  );
}

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM conselhos_lista ORDER BY data_criacao DESC, id DESC`);
  return Promise.all(rows.map(attachRelacoes));
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM conselhos_lista WHERE id = ?`, [id]);
  return attachRelacoes(rows[0] ?? null);
}

async function create(data) {
  const { nome, tipo, status, conselhoOrigemId, dataRealizacao, turmaIds, servidores } = data;

  const id = await withTransaction(async (connection) => {
    const [result] = await connection.query(
      `INSERT INTO conselhos_lista (nome, tipo, status, conselho_origem_id, data_realizacao)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, tipo, status ?? 'agendado', conselhoOrigemId ?? null, toDateTime(dataRealizacao) ?? null]
    );

    await setTurmas(connection, result.insertId, turmaIds ?? []);
    await setServidores(connection, result.insertId, servidores ?? []);
    return result.insertId;
  });

  return findById(id);
}

async function update(id, data) {
  const { columns, values } = buildSet(FIELD_MAP, data, {
    status: (status) => status ?? 'agendado',
    dataRealizacao: toDateTime
  });

  await withTransaction(async (connection) => {
    if (columns.length > 0) {
      await connection.query(`UPDATE conselhos_lista SET ${columns.join(', ')} WHERE id = ?`, [...values, id]);
    }
    if (data.turmaIds !== undefined) {
      await setTurmas(connection, id, data.turmaIds);
    }
    if (data.servidores !== undefined) {
      await setServidores(connection, id, data.servidores);
    }
  });

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM conselhos_lista WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};

const pool = require('../config/database');
const withTransaction = require('../utils/transaction');
const buildSet = require('../utils/buildSet');

const COLUMNS = `id, conselho_id, turma_id, aluno_representante_id, sintese_diagnostico,
  pontos_positivos, dificuldades_apontadas, registros_observacoes`;

const FIELD_MAP = {
  alunoRepresentanteId: 'aluno_representante_id',
  sinteseDiagnostico: 'sintese_diagnostico',
  pontosPositivos: 'pontos_positivos',
  dificuldadesApontadas: 'dificuldades_apontadas',
  registrosObservacoes: 'registros_observacoes'
};

// mysql2 expande objetos/arrays ligados a "?", então colunas JSON precisam ir serializadas.
const toJsonArray = (value) => JSON.stringify(value ?? []);

async function attachDemandasGerais(demandas) {
  if (demandas.length === 0) {
    return demandas;
  }

  const [gerais] = await pool.query(
    `SELECT id, conselho_demanda_id, situacao, gravidade
     FROM conselhos_demandas_gerais WHERE conselho_demanda_id IN (?) ORDER BY id`,
    [demandas.map((d) => d.id)]
  );

  return demandas.map((demanda) => ({
    ...demanda,
    demandasGerais: gerais
      .filter((g) => g.conselho_demanda_id === demanda.id)
      .map(({ id, situacao, gravidade }) => ({ id, situacao, gravidade }))
  }));
}

async function setDemandasGerais(connection, demandaId, demandasGerais) {
  await connection.query('DELETE FROM conselhos_demandas_gerais WHERE conselho_demanda_id = ?', [demandaId]);

  if (demandasGerais.length === 0) {
    return;
  }

  await connection.query(
    'INSERT INTO conselhos_demandas_gerais (conselho_demanda_id, situacao, gravidade) VALUES ?',
    [demandasGerais.map((d) => [demandaId, d.situacao, d.gravidade ?? 'nao-urgente'])]
  );
}

async function findAllByConselho(conselhoId) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM conselhos_demandas WHERE conselho_id = ? ORDER BY turma_id`,
    [conselhoId]
  );
  return attachDemandasGerais(rows);
}

async function findOne(conselhoId, turmaId) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM conselhos_demandas WHERE conselho_id = ? AND turma_id = ?`,
    [conselhoId, turmaId]
  );
  const [demanda] = await attachDemandasGerais(rows);
  return demanda ?? null;
}

async function create(conselhoId, data) {
  const {
    turmaId,
    alunoRepresentanteId,
    sinteseDiagnostico,
    pontosPositivos,
    dificuldadesApontadas,
    registrosObservacoes,
    demandasGerais
  } = data;

  await withTransaction(async (connection) => {
    const [result] = await connection.query(
      `INSERT INTO conselhos_demandas
         (conselho_id, turma_id, aluno_representante_id, sintese_diagnostico,
          pontos_positivos, dificuldades_apontadas, registros_observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        conselhoId,
        turmaId,
        alunoRepresentanteId ?? null,
        sinteseDiagnostico ?? null,
        toJsonArray(pontosPositivos),
        toJsonArray(dificuldadesApontadas),
        registrosObservacoes ?? null
      ]
    );

    await setDemandasGerais(connection, result.insertId, demandasGerais ?? []);
  });

  return findOne(conselhoId, turmaId);
}

async function update(conselhoId, turmaId, data) {
  const existing = await findOne(conselhoId, turmaId);
  const { columns, values } = buildSet(FIELD_MAP, data, {
    pontosPositivos: toJsonArray,
    dificuldadesApontadas: toJsonArray
  });

  await withTransaction(async (connection) => {
    if (columns.length > 0) {
      await connection.query(`UPDATE conselhos_demandas SET ${columns.join(', ')} WHERE id = ?`, [
        ...values,
        existing.id
      ]);
    }
    if (data.demandasGerais !== undefined) {
      await setDemandasGerais(connection, existing.id, data.demandasGerais ?? []);
    }
  });

  return findOne(conselhoId, turmaId);
}

async function remove(conselhoId, turmaId) {
  const [result] = await pool.query('DELETE FROM conselhos_demandas WHERE conselho_id = ? AND turma_id = ?', [
    conselhoId,
    turmaId
  ]);
  return result.affectedRows > 0;
}

module.exports = {
  FIELDS: [...Object.keys(FIELD_MAP), 'demandasGerais'],
  findAllByConselho,
  findOne,
  create,
  update,
  remove
};

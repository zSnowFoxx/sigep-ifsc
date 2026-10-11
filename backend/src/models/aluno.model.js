const pool = require('../config/database');
const withTransaction = require('../utils/transaction');

const COLUMNS = 'id, matricula, nome, email, status';

// As turmas atuais do aluno vêm das matrículas ativas (as inativas são o histórico).
async function attachTurmas(aluno) {
  if (!aluno) {
    return aluno;
  }

  const [rows] = await pool.query(
    "SELECT turma_id FROM matriculas WHERE aluno_id = ? AND status = 'Ativo' ORDER BY id",
    [aluno.id]
  );

  return { ...aluno, turmaIds: rows.map((row) => row.turma_id) };
}

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM alunos ORDER BY nome`);
  return Promise.all(rows.map(attachTurmas));
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM alunos WHERE id = ?`, [id]);
  return attachTurmas(rows[0] ?? null);
}

async function findByMatricula(matricula) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM alunos WHERE matricula = ?`, [matricula]);
  return rows[0] ?? null;
}

// Sincroniza as matrículas com a lista de turmas: inativa as retiradas (preservando o histórico,
// as notas/frequências e os encaminhamentos), reativa as que voltaram e cria as novas.
async function setTurmas(connection, alunoId, turmaIds) {
  const ids = [...new Set(turmaIds)];

  if (ids.length > 0) {
    await connection.query(
      "UPDATE matriculas SET status = 'Inativo' WHERE aluno_id = ? AND turma_id NOT IN (?)",
      [alunoId, ids]
    );
    await connection.query(
      "UPDATE matriculas SET status = 'Ativo' WHERE aluno_id = ? AND turma_id IN (?)",
      [alunoId, ids]
    );
  } else {
    await connection.query("UPDATE matriculas SET status = 'Inativo' WHERE aluno_id = ?", [alunoId]);
  }

  const [rows] = await connection.query('SELECT turma_id FROM matriculas WHERE aluno_id = ?', [alunoId]);
  const existentes = new Set(rows.map((row) => row.turma_id));

  const novas = ids
    .filter((turmaId) => !existentes.has(turmaId))
    .map((turmaId) => [alunoId, turmaId, 'Ativo']);

  if (novas.length > 0) {
    await connection.query('INSERT INTO matriculas (aluno_id, turma_id, status) VALUES ?', [novas]);
  }
}

async function create({ matricula, nome, email, status, turmaIds }) {
  const id = await withTransaction(async (connection) => {
    const [result] = await connection.query(
      'INSERT INTO alunos (matricula, nome, email, status) VALUES (?, ?, ?, ?)',
      [matricula, nome, email ?? null, status ?? 'Ativo']
    );

    if (turmaIds !== undefined) {
      await setTurmas(connection, result.insertId, turmaIds);
    }
    return result.insertId;
  });

  return findById(id);
}

async function update(id, data) {
  const fields = ['matricula', 'nome', 'email', 'status'];

  const columns = [];
  const values = [];

  for (const field of fields) {
    if (data[field] !== undefined) {
      columns.push(`${field} = ?`);
      values.push(field === 'status' ? data[field] ?? 'Ativo' : data[field]);
    }
  }

  await withTransaction(async (connection) => {
    if (columns.length > 0) {
      values.push(id);
      await connection.query(`UPDATE alunos SET ${columns.join(', ')} WHERE id = ?`, values);
    }

    if (data.turmaIds !== undefined) {
      await setTurmas(connection, id, data.turmaIds);
    }
  });

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM alunos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByMatricula,
  create,
  update,
  remove
};

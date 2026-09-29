const pool = require('../config/database');

async function findAll() {
  const [rows] = await pool.query(
    'SELECT id, nome, curso_id, periodo_id, alunos_qtd FROM turmas ORDER BY nome'
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, nome, curso_id, periodo_id, alunos_qtd FROM turmas WHERE id = ?',
    [id]
  );
  return rows[0] ?? null;
}

async function create({ nome, cursoId, periodoId, alunosQtd }) {
  const [result] = await pool.query(
    'INSERT INTO turmas (nome, curso_id, periodo_id, alunos_qtd) VALUES (?, ?, ?, ?)',
    [nome, cursoId, periodoId, alunosQtd ?? 0]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fieldMap = {
    nome: 'nome',
    cursoId: 'curso_id',
    periodoId: 'periodo_id',
    alunosQtd: 'alunos_qtd'
  };

  const columns = [];
  const values = [];

  for (const [key, column] of Object.entries(fieldMap)) {
    if (data[key] !== undefined) {
      columns.push(`${column} = ?`);
      values.push(data[key]);
    }
  }

  if (columns.length === 0) {
    return findById(id);
  }

  values.push(id);
  const [result] = await pool.query(`UPDATE turmas SET ${columns.join(', ')} WHERE id = ?`, values);

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM turmas WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};

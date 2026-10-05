const pool = require('../config/database');
const withTransaction = require('../utils/transaction');

const PUBLIC_COLUMNS = [
  'id', 'sigla', 'codigo', 'nome', 'carga_horaria AS cargaHoraria', 'fase_oferta AS faseOferta', 'curso_id'
];

async function attachUsuarios(disciplina) {
  if (!disciplina) {
    return disciplina;
  }

  const [rows] = await pool.query(
    'SELECT usuario_id FROM usuarios_disciplinas WHERE disciplina_id = ?',
    [disciplina.id]
  );

  return { ...disciplina, usuarioIds: rows.map((row) => row.usuario_id) };
}

async function findAll() {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_COLUMNS.join(', ')} FROM disciplinas ORDER BY nome`
  );
  return Promise.all(rows.map(attachUsuarios));
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_COLUMNS.join(', ')} FROM disciplinas WHERE id = ?`,
    [id]
  );
  return attachUsuarios(rows[0] ?? null);
}

async function findByCodigo(codigo) {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_COLUMNS.join(', ')} FROM disciplinas WHERE codigo = ?`,
    [codigo]
  );
  return rows[0] ?? null;
}

async function setUsuarios(connection, disciplinaId, usuarioIds) {
  await connection.query('DELETE FROM usuarios_disciplinas WHERE disciplina_id = ?', [disciplinaId]);

  if (!usuarioIds || usuarioIds.length === 0) {
    return;
  }

  const values = [...new Set(usuarioIds)].map((usuarioId) => [usuarioId, disciplinaId]);
  await connection.query('INSERT INTO usuarios_disciplinas (usuario_id, disciplina_id) VALUES ?', [values]);
}

async function create(data) {
  const { sigla, codigo, nome, cargaHoraria, faseOferta, cursoId, usuarioIds } = data;

  const id = await withTransaction(async (connection) => {
    const [result] = await connection.query(
      `INSERT INTO disciplinas (sigla, codigo, nome, carga_horaria, fase_oferta, curso_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sigla ?? null, codigo, nome, cargaHoraria ?? null, faseOferta ?? null, cursoId]
    );

    await setUsuarios(connection, result.insertId, usuarioIds);
    return result.insertId;
  });

  return findById(id);
}

async function update(id, data) {
  const fieldMap = {
    sigla: 'sigla',
    codigo: 'codigo',
    nome: 'nome',
    cargaHoraria: 'carga_horaria',
    faseOferta: 'fase_oferta',
    cursoId: 'curso_id'
  };

  const columns = [];
  const values = [];

  for (const [key, column] of Object.entries(fieldMap)) {
    if (data[key] !== undefined) {
      columns.push(`${column} = ?`);
      values.push(data[key]);
    }
  }

  await withTransaction(async (connection) => {
    if (columns.length > 0) {
      values.push(id);
      await connection.query(`UPDATE disciplinas SET ${columns.join(', ')} WHERE id = ?`, values);
    }

    if (data.usuarioIds !== undefined) {
      await setUsuarios(connection, id, data.usuarioIds);
    }
  });

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM disciplinas WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findByCodigo,
  create,
  update,
  remove
};

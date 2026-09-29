const pool = require('../config/database');

const PUBLIC_COLUMNS = ['id', 'codigo', 'nome', 'tipo', 'grau', 'modalidade', 'ppc', 'fases', 'coordenador_id'];

async function findAll() {
  const [rows] = await pool.query(`SELECT ${PUBLIC_COLUMNS.join(', ')} FROM cursos ORDER BY nome`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${PUBLIC_COLUMNS.join(', ')} FROM cursos WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

async function findByCodigo(codigo) {
  const [rows] = await pool.query(`SELECT ${PUBLIC_COLUMNS.join(', ')} FROM cursos WHERE codigo = ?`, [codigo]);
  return rows[0] ?? null;
}

async function create({ codigo, nome, tipo, grau, modalidade, ppc, fases, coordenadorId }) {
  const [result] = await pool.query(
    `INSERT INTO cursos (codigo, nome, tipo, grau, modalidade, ppc, fases, coordenador_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [codigo, nome, tipo ?? null, grau ?? null, modalidade ?? null, ppc ?? null, fases ?? null, coordenadorId ?? null]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fieldMap = {
    codigo: 'codigo',
    nome: 'nome',
    tipo: 'tipo',
    grau: 'grau',
    modalidade: 'modalidade',
    ppc: 'ppc',
    fases: 'fases',
    coordenadorId: 'coordenador_id'
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
  const [result] = await pool.query(`UPDATE cursos SET ${columns.join(', ')} WHERE id = ?`, values);

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM cursos WHERE id = ?', [id]);
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

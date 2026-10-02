const pool = require('../config/database');

const PUBLIC_COLUMNS = ['id', 'codigo', 'nome', 'tipo', 'grau', 'modalidade', 'ppc', 'fases', 'coordenador_id'];

// A carga horária do curso não é armazenada: é a soma das cargas horárias das disciplinas
// (texto como "80h", convertido para número pelo CAST).
const SELECT_WITH_CARGA_HORARIA = `
  SELECT ${PUBLIC_COLUMNS.map((column) => `c.${column}`).join(', ')},
    (SELECT SUM(CAST(d.cargaHoraria AS UNSIGNED)) FROM disciplinas d WHERE d.curso_id = c.id) AS horas
  FROM cursos c`;

function toCurso(row) {
  if (!row) {
    return null;
  }

  const { horas, ...curso } = row;
  return { ...curso, cargaHoraria: horas ? `${horas}h` : null };
}

async function findAll() {
  const [rows] = await pool.query(`${SELECT_WITH_CARGA_HORARIA} ORDER BY c.nome`);
  return rows.map(toCurso);
}

async function findById(id) {
  const [rows] = await pool.query(`${SELECT_WITH_CARGA_HORARIA} WHERE c.id = ?`, [id]);
  return toCurso(rows[0]);
}

// Versão anterior, sem a carga horária calculada.
// async function findAll() {
//   const [rows] = await pool.query(`SELECT ${PUBLIC_COLUMNS.join(', ')} FROM cursos ORDER BY nome`);
//   return rows;
// }
//
// async function findById(id) {
//   const [rows] = await pool.query(`SELECT ${PUBLIC_COLUMNS.join(', ')} FROM cursos WHERE id = ?`, [id]);
//   return rows[0] ?? null;
// }

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

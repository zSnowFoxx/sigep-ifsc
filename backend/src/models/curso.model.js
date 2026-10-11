const pool = require('../config/database');
const withTransaction = require('../utils/transaction');

// usuarios.curso_id acompanha cursos.coordenador_id (antes feito por triggers; o TiDB não as suporta):
// o coordenador anterior perde o vínculo com o curso e o novo passa a apontar para ele.
async function sincronizarCoordenador(db, cursoId, anteriorId, novoId) {
  if ((anteriorId ?? null) === (novoId ?? null)) {
    return;
  }
  if (anteriorId) {
    await db.query('UPDATE usuarios SET curso_id = NULL WHERE id = ? AND curso_id = ?', [anteriorId, cursoId]);
  }
  if (novoId) {
    await db.query('UPDATE usuarios SET curso_id = ? WHERE id = ?', [cursoId, novoId]);
  }
}

const PUBLIC_COLUMNS = ['id', 'codigo', 'nome', 'tipo', 'grau', 'modalidade', 'ppc', 'fases', 'coordenador_id'];

// A carga horária do curso não é armazenada: é a soma das cargas horárias das disciplinas
// (texto como "80h", convertido para número pelo CAST).
const SELECT_WITH_CARGA_HORARIA = `
  SELECT ${PUBLIC_COLUMNS.map((column) => `c.${column}`).join(', ')},
    (SELECT SUM(CAST(d.carga_horaria AS UNSIGNED)) FROM disciplinas d WHERE d.curso_id = c.id) AS horas
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

async function findByCodigo(codigo) {
  const [rows] = await pool.query(`SELECT ${PUBLIC_COLUMNS.join(', ')} FROM cursos WHERE codigo = ?`, [codigo]);
  return rows[0] ?? null;
}

async function create({ codigo, nome, tipo, grau, modalidade, ppc, fases, coordenadorId }) {
  const id = await withTransaction(async (connection) => {
    const [result] = await connection.query(
      `INSERT INTO cursos (codigo, nome, tipo, grau, modalidade, ppc, fases, coordenador_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [codigo, nome, tipo ?? null, grau ?? null, modalidade ?? null, ppc ?? null, fases ?? null, coordenadorId ?? null]
    );
    await sincronizarCoordenador(connection, result.insertId, null, coordenadorId);
    return result.insertId;
  });
  return findById(id);
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
  const encontrado = await withTransaction(async (connection) => {
    const [[anterior]] = await connection.query('SELECT coordenador_id FROM cursos WHERE id = ? FOR UPDATE', [id]);
    const [result] = await connection.query(`UPDATE cursos SET ${columns.join(', ')} WHERE id = ?`, values);

    if (result.affectedRows === 0) {
      return false;
    }
    if (data.coordenadorId !== undefined) {
      await sincronizarCoordenador(connection, Number(id), anterior?.coordenador_id, data.coordenadorId);
    }
    return true;
  });

  return encontrado ? findById(id) : null;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM cursos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  sincronizarCoordenador,
  findAll,
  findById,
  findByCodigo,
  create,
  update,
  remove
};

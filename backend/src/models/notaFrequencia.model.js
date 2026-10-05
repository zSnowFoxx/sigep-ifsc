const pool = require('../config/database');

const COLUMNS =
  'id, matricula_id, diario_id, media, infrequencia, presencas, faltas_justificadas, faltas_nao_justificadas';

const FIELD_MAP = {
  matriculaId: 'matricula_id',
  diarioId: 'diario_id',
  media: 'media',
  infrequencia: 'infrequencia',
  presencas: 'presencas',
  faltasJustificadas: 'faltas_justificadas',
  faltasNaoJustificadas: 'faltas_nao_justificadas'
};

const COUNTERS = ['presencas', 'faltasJustificadas', 'faltasNaoJustificadas'];

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM notas_frequencias ORDER BY id`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM notas_frequencias WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

async function create(data) {
  const {
    matriculaId,
    diarioId,
    media,
    infrequencia,
    presencas,
    faltasJustificadas,
    faltasNaoJustificadas
  } = data;

  const [result] = await pool.query(
    `INSERT INTO notas_frequencias
       (matricula_id, diario_id, media, infrequencia, presencas, faltas_justificadas, faltas_nao_justificadas)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      matriculaId,
      diarioId,
      media ?? null,
      infrequencia ?? null,
      presencas ?? 0,
      faltasJustificadas ?? 0,
      faltasNaoJustificadas ?? 0
    ]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const columns = [];
  const values = [];

  for (const [key, column] of Object.entries(FIELD_MAP)) {
    if (data[key] !== undefined) {
      columns.push(`${column} = ?`);
      values.push(COUNTERS.includes(key) ? data[key] ?? 0 : data[key]);
    }
  }

  if (columns.length > 0) {
    values.push(id);
    await pool.query(`UPDATE notas_frequencias SET ${columns.join(', ')} WHERE id = ?`, values);
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM notas_frequencias WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  FIELDS: Object.keys(FIELD_MAP),
  findAll,
  findById,
  create,
  update,
  remove
};

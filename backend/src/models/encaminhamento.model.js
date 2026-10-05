const pool = require('../config/database');
const buildSet = require('../utils/buildSet');

const COLUMNS = `id, aluno_id, turma_id, conselho_id, titulo, categoria, origem, servidor_responsavel_id,
  descricao_inicial, status, urgente, DATE_FORMAT(prazo, '%Y-%m-%d') AS prazo, data_criacao`;

// turmaId omitido: o banco preenche com a turma do aluno (trigger).
const FIELD_MAP = {
  alunoId: 'aluno_id',
  turmaId: 'turma_id',
  conselhoId: 'conselho_id',
  titulo: 'titulo',
  categoria: 'categoria',
  origem: 'origem',
  servidorResponsavelId: 'servidor_responsavel_id',
  descricaoInicial: 'descricao_inicial',
  status: 'status',
  urgente: 'urgente',
  prazo: 'prazo'
};

// urgente é TINYINT(1), que o mysql2 devolve como 0/1.
function toEncaminhamento(row) {
  return row && { ...row, urgente: Boolean(row.urgente) };
}

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM encaminhamentos ORDER BY data_criacao DESC, id DESC`);
  return rows.map(toEncaminhamento);
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM encaminhamentos WHERE id = ?`, [id]);
  return toEncaminhamento(rows[0] ?? null);
}

async function create(data) {
  const {
    alunoId,
    turmaId,
    conselhoId,
    titulo,
    categoria,
    origem,
    servidorResponsavelId,
    descricaoInicial,
    status,
    urgente,
    prazo
  } = data;

  const [result] = await pool.query(
    `INSERT INTO encaminhamentos
       (aluno_id, turma_id, conselho_id, titulo, categoria, origem, servidor_responsavel_id,
        descricao_inicial, status, urgente, prazo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      alunoId,
      turmaId ?? null,
      conselhoId ?? null,
      titulo,
      categoria,
      origem ?? null,
      servidorResponsavelId ?? null,
      descricaoInicial ?? null,
      status ?? 'pendente',
      urgente ?? false,
      prazo ?? null
    ]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const { columns, values } = buildSet(FIELD_MAP, data, {
    status: (status) => status ?? 'pendente',
    urgente: (urgente) => urgente ?? false
  });

  if (columns.length > 0) {
    await pool.query(`UPDATE encaminhamentos SET ${columns.join(', ')} WHERE id = ?`, [...values, id]);
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM encaminhamentos WHERE id = ?', [id]);
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

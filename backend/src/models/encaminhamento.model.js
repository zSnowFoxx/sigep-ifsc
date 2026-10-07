const pool = require('../config/database');
const buildSet = require('../utils/buildSet');

// Colunas da tabela + dados para exibição (aluno, turma, responsável e resumo da linha do tempo).
const COLUMNS = `e.id, e.aluno_id, e.turma_id, e.conselho_id, e.titulo, e.categoria, e.origem,
  e.servidor_responsavel_id, e.descricao_inicial, e.status, e.urgente,
  DATE_FORMAT(e.prazo, '%Y-%m-%d') AS prazo, e.data_criacao,
  a.nome AS aluno_nome, a.matricula AS aluno_matricula, t.nome AS turma_nome,
  u.nome AS servidor_responsavel_nome,
  (SELECT COUNT(*) FROM encaminhamentos_acompanhamento ac WHERE ac.encaminhamento_id = e.id) AS total_acompanhamentos,
  (SELECT MAX(ac.data_registro) FROM encaminhamentos_acompanhamento ac
    WHERE ac.encaminhamento_id = e.id AND ac.tipo = 'relato') AS ultimo_relato,
  (SELECT ac.relato FROM encaminhamentos_acompanhamento ac
    WHERE ac.encaminhamento_id = e.id AND ac.tipo = 'conclusao'
    ORDER BY ac.data_registro DESC, ac.id DESC LIMIT 1) AS parecer`;

const FROM = `FROM encaminhamentos e
  JOIN alunos a ON a.id = e.aluno_id
  JOIN turmas t ON t.id = e.turma_id
  LEFT JOIN usuarios u ON u.id = e.servidor_responsavel_id`;

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
  const [rows] = await pool.query(`SELECT ${COLUMNS} ${FROM} ORDER BY e.data_criacao DESC, e.id DESC`);
  return rows.map(toEncaminhamento);
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} ${FROM} WHERE e.id = ?`, [id]);
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

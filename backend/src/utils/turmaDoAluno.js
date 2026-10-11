const pool = require('../config/database');

// turma_id automático a partir do aluno (antes feito por function/triggers; o TiDB não as suporta).
// Prioridade: turma que faz parte do conselho > matrícula ativa > período mais recente.
// Retorna null se o aluno não tiver matrícula: o INSERT falha porque turma_id é NOT NULL.
async function turmaDoAluno(alunoId, conselhoId = null) {
  const [rows] = await pool.query(
    `SELECT m.turma_id
     FROM matriculas m
     JOIN turmas t   ON t.id = m.turma_id
     JOIN periodos p ON p.id = t.periodo_id
     LEFT JOIN conselhos_turmas ct ON ct.turma_id = m.turma_id AND ct.conselho_id = ?
     WHERE m.aluno_id = ?
     ORDER BY ct.turma_id IS NULL, m.status = 'Ativo' DESC, p.ano DESC, p.semestre DESC, m.id DESC
     LIMIT 1`,
    [conselhoId, alunoId]
  );
  return rows[0]?.turma_id ?? null;
}

// INSERT: turmaId omitido usa a turma do aluno.
async function comTurmaNoInsert(data, conselhoId = null) {
  return data.turmaId !== undefined && data.turmaId !== null
    ? data
    : { ...data, turmaId: await turmaDoAluno(data.alunoId, conselhoId) };
}

// UPDATE: troca de aluno sem turmaId informado passa a usar a turma do novo aluno.
async function comTurmaNoUpdate(atual, data, conselhoId = null) {
  if (!atual || data.alunoId === undefined || data.turmaId !== undefined || data.alunoId === atual.aluno_id) {
    return data;
  }
  return { ...data, turmaId: await turmaDoAluno(data.alunoId, conselhoId) };
}

module.exports = {
  turmaDoAluno,
  comTurmaNoInsert,
  comTurmaNoUpdate
};

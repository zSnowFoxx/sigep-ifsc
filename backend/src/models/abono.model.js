const pool = require('../config/database');

const COLUMNS = 'a.id, a.conselho_id, a.nota_frequencia_id, a.horas, a.tipo, a.fundamentacao, a.usuario_id, a.data_registro';

// Abonos das notas dos alunos matriculados nas turmas do conselho, inclusive os registrados
// em outro conselho (ex.: no intermediário, vistos no final): o abono vale para a nota.
async function findAllByConselho(conselhoId) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS}
     FROM conselhos_abonos a
     JOIN notas_frequencias nf ON nf.id = a.nota_frequencia_id
     JOIN matriculas m ON m.id = nf.matricula_id
     JOIN conselhos_turmas ct ON ct.turma_id = m.turma_id AND ct.conselho_id = ?
     ORDER BY a.data_registro, a.id`,
    [conselhoId]
  );
  return rows;
}

async function findOne(conselhoId, id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM conselhos_abonos a WHERE a.conselho_id = ? AND a.id = ?`, [
    conselhoId,
    id
  ]);
  return rows[0] ?? null;
}

const horas = (valor) => parseInt(valor ?? '', 10) || 0;

// Faltas não justificadas ainda abonáveis da nota, pela mesma regra da tela do conselho: sem horas
// lançadas, as faltas vêm do percentual de infrequência sobre a carga horária (diário ou disciplina).
// Retorna null se a nota não for de um aluno das turmas do conselho.
async function horasDisponiveis(conselhoId, notaFrequenciaId) {
  const [[nota]] = await pool.query(
    `SELECT nf.infrequencia, nf.presencas, nf.faltas_justificadas, nf.faltas_nao_justificadas,
       di.carga_horaria AS ch_diario, d.carga_horaria AS ch_disciplina,
       (SELECT COALESCE(SUM(a.horas), 0) FROM conselhos_abonos a WHERE a.nota_frequencia_id = nf.id) AS abonadas
     FROM notas_frequencias nf
     JOIN matriculas m ON m.id = nf.matricula_id
     JOIN conselhos_turmas ct ON ct.turma_id = m.turma_id AND ct.conselho_id = ?
     JOIN diarios di ON di.id = nf.diario_id
     JOIN disciplinas d ON d.id = di.disciplina_id
     WHERE nf.id = ?`,
    [conselhoId, notaFrequenciaId]
  );
  if (!nota) {
    return null;
  }

  const contadas = nota.presencas + nota.faltas_justificadas + nota.faltas_nao_justificadas;
  const naoJustificadas =
    contadas === 0 && nota.infrequencia !== null
      ? Math.round(((horas(nota.ch_diario) || horas(nota.ch_disciplina) || 1) * nota.infrequencia) / 100)
      : nota.faltas_nao_justificadas;

  return Math.max(naoJustificadas - Number(nota.abonadas), 0);
}

async function create(conselhoId, { notaFrequenciaId, horas: horasAbono, tipo, fundamentacao, usuarioId }) {
  const [result] = await pool.query(
    `INSERT INTO conselhos_abonos (conselho_id, nota_frequencia_id, horas, tipo, fundamentacao, usuario_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [conselhoId, notaFrequenciaId, horasAbono, tipo, fundamentacao ?? null, usuarioId ?? null]
  );
  return findOne(conselhoId, result.insertId);
}

async function remove(conselhoId, id) {
  const [result] = await pool.query('DELETE FROM conselhos_abonos WHERE conselho_id = ? AND id = ?', [conselhoId, id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAllByConselho,
  findOne,
  horasDisponiveis,
  create,
  remove
};

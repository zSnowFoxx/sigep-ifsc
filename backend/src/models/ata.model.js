const pool = require('../config/database');
const demandaModel = require('./conselhoDemanda.model');
const deliberacaoModel = require('./deliberacao.model');
const dashboardModel = require('./dashboard.model');

// Busca com lista de ids; lista vazia não vai ao banco (IN () é inválido).
async function consultaPorIds(sql, ids) {
  if (ids.length === 0) {
    return [];
  }
  const [rows] = await pool.query(sql, [ids]);
  return rows;
}

const indexarPorId = (rows) => new Map(rows.map((row) => [row.id, row]));

// Dados da ata de um conselho. Registros docentes e atendimentos do NAE ficam de fora:
// são registros individuais e sigilosos.
async function findDadosAta(conselho) {
  const conselhoId = conselho.id;

  const [turmas, servidores, demandas, deliberacoes, retificacoes, abonos] = await Promise.all([
    consultaPorIds('SELECT id, nome FROM turmas WHERE id IN (?)', conselho.turmaIds),
    consultaPorIds(
      `SELECT u.id, u.nome, p.nome AS cargo
       FROM usuarios u
       LEFT JOIN perfis p ON p.id = u.perfil_id
       WHERE u.id IN (?)`,
      conselho.servidores.map((s) => s.usuarioId)
    ),
    demandaModel.findAllByConselho(conselhoId),
    deliberacaoModel.findAllByConselho(conselhoId),
    pool
      .query(
        `SELECT r.media_retificada, nf.media AS media_original, a.nome AS aluno, a.matricula, d.nome AS disciplina
         FROM conselhos_retificacoes r
         JOIN notas_frequencias nf ON nf.id = r.nota_frequencia_id
         JOIN matriculas m ON m.id = nf.matricula_id
         JOIN alunos a ON a.id = m.aluno_id
         JOIN diarios di ON di.id = nf.diario_id
         JOIN disciplinas d ON d.id = di.disciplina_id
         WHERE r.conselho_id = ?
         ORDER BY a.nome, d.nome`,
        [conselhoId]
      )
      .then(([rows]) => rows),
    pool
      .query(
        `SELECT ab.horas, ab.tipo, ab.fundamentacao, a.nome AS aluno, a.matricula, d.nome AS disciplina
         FROM conselhos_abonos ab
         JOIN notas_frequencias nf ON nf.id = ab.nota_frequencia_id
         JOIN matriculas m ON m.id = nf.matricula_id
         JOIN alunos a ON a.id = m.aluno_id
         JOIN diarios di ON di.id = nf.diario_id
         JOIN disciplinas d ON d.id = di.disciplina_id
         WHERE ab.conselho_id = ?
         ORDER BY a.nome, d.nome`,
        [conselhoId]
      )
      .then(([rows]) => rows)
  ]);

  const alunoIds = [
    ...deliberacoes.map((d) => d.aluno_id),
    ...demandas.map((d) => d.aluno_representante_id).filter((id) => id !== null)
  ];
  const alunos = indexarPorId(
    await consultaPorIds('SELECT id, nome, matricula FROM alunos WHERE id IN (?)', [...new Set(alunoIds)])
  );

  // Coordenação, período e matriculados vêm do cadastro; a situação de risco usa o painel de risco.
  const [coordenacao, matriculados] = await Promise.all([
    consultaPorIds(
      `SELECT t.id AS turma_id, c.nome AS curso, u.nome AS coordenador, CONCAT(p.ano, '.', p.semestre) AS periodo
       FROM turmas t
       JOIN cursos c ON c.id = t.curso_id
       JOIN periodos p ON p.id = t.periodo_id
       LEFT JOIN usuarios u ON u.id = c.coordenador_id
       WHERE t.id IN (?)`,
      conselho.turmaIds
    ),
    consultaPorIds(
      `SELECT turma_id, COUNT(*) AS total FROM matriculas
       WHERE status = 'Ativo' AND turma_id IN (?) GROUP BY turma_id`,
      conselho.turmaIds
    )
  ]);

  // O painel de risco filtra turma pelo nome; turmas com o mesmo nome em períodos diferentes
  // se misturariam. Por isso só entram os alunos matriculados nesta turma.
  const matriculasDaTurma = await consultaPorIds(
    `SELECT t.id AS turma_id, a.matricula
     FROM matriculas m
     JOIN alunos a ON a.id = m.aluno_id
     JOIN turmas t ON t.id = m.turma_id
     WHERE m.status = 'Ativo' AND t.id IN (?)`,
    conselho.turmaIds
  );
  const riscosPorTurma = new Map();
  for (const turma of turmas) {
    const matriculas = new Set(matriculasDaTurma.filter((m) => m.turma_id === turma.id).map((m) => m.matricula));
    if (matriculas.size === 0) {
      riscosPorTurma.set(turma.id, []);
      continue;
    }
    const riscos = await dashboardModel.findRiskStudents({ turma: turma.nome });
    riscosPorTurma.set(
      turma.id,
      riscos.filter((r) => r.risco !== 'baixo' && matriculas.has(r.matricula))
    );
  }

  return {
    conselho,
    turmas: indexarPorId(turmas),
    servidores: indexarPorId(servidores),
    alunos,
    demandas,
    deliberacoes,
    retificacoes,
    abonos,
    coordenacao,
    matriculados: new Map(matriculados.map((m) => [m.turma_id, m.total])),
    riscosPorTurma
  };
}

module.exports = { findDadosAta };

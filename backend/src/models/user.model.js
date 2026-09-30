const pool = require('../config/database');
const withTransaction = require('../utils/transaction');

const PUBLIC_COLUMNS = ['id', 'siape', 'nome', 'email', 'perfil_id'];

async function attachFuncoes(user) {
  if (!user) {
    return user;
  }

  const [rows] = await pool.query(
    'SELECT funcao_id FROM usuario_funcoes WHERE usuario_id = ?',
    [user.id]
  );

  return { ...user, funcaoIds: rows.map((row) => row.funcao_id) };
}

async function findAll() {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_COLUMNS.join(', ')} FROM usuarios ORDER BY nome`
  );
  return Promise.all(rows.map(attachFuncoes));
}

async function findBySiape(siape) {
  const [rows] = await pool.query(
    `SELECT ${PUBLIC_COLUMNS.join(', ')} FROM usuarios WHERE siape = ?`,
    [siape]
  );
  return attachFuncoes(rows[0] ?? null);
}

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0] ?? null;
}

// Dados da sessão do usuário: perfil, funções, disciplinas e cursos coordenados por nome.
async function findProfileBySiape(siape) {
  const [rows] = await pool.query(
    `SELECT u.id, u.siape, u.nome, u.email, p.id AS perfilId, p.nome AS perfilNome
     FROM usuarios u
     JOIN perfis p ON p.id = u.perfil_id
     WHERE u.siape = ?`,
    [siape]
  );

  const user = rows[0];
  if (!user) {
    return null;
  }

  const [[funcoes], [disciplinas], [cursos]] = await Promise.all([
    pool.query(
      `SELECT f.nome FROM usuario_funcoes uf
       JOIN funcoes f ON f.id = uf.funcao_id
       WHERE uf.usuario_id = ? ORDER BY f.nome`,
      [user.id]
    ),
    pool.query(
      `SELECT d.nome FROM usuario_disciplinas ud
       JOIN disciplinas d ON d.id = ud.disciplina_id
       WHERE ud.usuario_id = ? ORDER BY d.nome`,
      [user.id]
    ),
    pool.query('SELECT nome FROM cursos WHERE coordenador_id = ? ORDER BY nome', [user.id])
  ]);

  return {
    id: user.id,
    siape: user.siape,
    nome: user.nome,
    email: user.email,
    perfil: { id: user.perfilId, nome: user.perfilNome },
    funcoes: funcoes.map((row) => row.nome),
    disciplinas: disciplinas.map((row) => row.nome),
    cursosCoordenados: cursos.map((row) => row.nome)
  };
}

async function updatePassword(id, passwordHash) {
  await pool.query('UPDATE usuarios SET password = ? WHERE id = ?', [passwordHash, id]);
}

async function setFuncoes(connection, usuarioId, funcaoIds) {
  await connection.query('DELETE FROM usuario_funcoes WHERE usuario_id = ?', [usuarioId]);

  if (!funcaoIds || funcaoIds.length === 0) {
    return;
  }

  const values = [...new Set(funcaoIds)].map((funcaoId) => [usuarioId, funcaoId]);
  await connection.query('INSERT INTO usuario_funcoes (usuario_id, funcao_id) VALUES ?', [values]);
}

async function addDisciplinas(connection, usuarioId, disciplinaIds) {
  if (!disciplinaIds || disciplinaIds.length === 0) {
    return;
  }

  const values = [...new Set(disciplinaIds)].map((disciplinaId) => [usuarioId, disciplinaId]);
  await connection.query('INSERT INTO usuario_disciplinas (usuario_id, disciplina_id) VALUES ?', [values]);
}

// disciplinaIds (disciplinas lecionadas) e cursoIds (cursos coordenados) são usados no autocadastro.
async function create(data) {
  const { siape, nome, email, passwordHash, perfilId, funcaoIds, disciplinaIds, cursoIds } = data;

  await withTransaction(async (connection) => {
    const [result] = await connection.query(
      `INSERT INTO usuarios (siape, nome, email, password, perfil_id)
       VALUES (?, ?, ?, ?, ?)`,
      [siape, nome, email, passwordHash, perfilId]
    );

    await setFuncoes(connection, result.insertId, funcaoIds);
    await addDisciplinas(connection, result.insertId, disciplinaIds);

    if (cursoIds && cursoIds.length > 0) {
      await connection.query('UPDATE cursos SET coordenador_id = ? WHERE id IN (?)', [
        result.insertId,
        cursoIds
      ]);
    }
  });

  return findBySiape(siape);
}

async function update(siape, data) {
  const existing = await findBySiape(siape);
  if (!existing) {
    return null;
  }

  const fieldMap = {
    nome: 'nome',
    email: 'email',
    passwordHash: 'password',
    perfilId: 'perfil_id'
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
      values.push(existing.id);
      await connection.query(`UPDATE usuarios SET ${columns.join(', ')} WHERE id = ?`, values);
    }

    if (data.funcaoIds !== undefined) {
      await setFuncoes(connection, existing.id, data.funcaoIds);
    }
  });

  return findBySiape(siape);
}

async function remove(siape) {
  const [result] = await pool.query('DELETE FROM usuarios WHERE siape = ?', [siape]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findBySiape,
  findByEmail,
  findProfileBySiape,
  updatePassword,
  create,
  update,
  remove
};

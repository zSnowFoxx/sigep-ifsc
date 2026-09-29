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

async function setFuncoes(connection, usuarioId, funcaoIds) {
  await connection.query('DELETE FROM usuario_funcoes WHERE usuario_id = ?', [usuarioId]);

  if (!funcaoIds || funcaoIds.length === 0) {
    return;
  }

  const values = [...new Set(funcaoIds)].map((funcaoId) => [usuarioId, funcaoId]);
  await connection.query('INSERT INTO usuario_funcoes (usuario_id, funcao_id) VALUES ?', [values]);
}

async function create(data) {
  const { siape, nome, email, passwordHash, perfilId, funcaoIds } = data;

  await withTransaction(async (connection) => {
    const [result] = await connection.query(
      `INSERT INTO usuarios (siape, nome, email, password, perfil_id)
       VALUES (?, ?, ?, ?, ?)`,
      [siape, nome, email, passwordHash, perfilId]
    );

    await setFuncoes(connection, result.insertId, funcaoIds);
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
  create,
  update,
  remove
};

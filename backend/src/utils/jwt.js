require('dotenv').config();

const jwt = require('jsonwebtoken');

const ALGORITHM = 'HS256';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const SECRET = process.env.JWT_SECRET;

// Sem segredo não há como assinar tokens: impede o servidor de subir.
if (!SECRET) {
  throw new Error('JWT_SECRET não definido nas variáveis de ambiente');
}

// O token carrega só o necessário para identificar o usuário; o resto vem do banco.
function signToken(user) {
  return jwt.sign({ siape: user.siape, perfilId: user.perfil_id }, SECRET, {
    algorithm: ALGORITHM,
    subject: String(user.id),
    expiresIn: EXPIRES_IN
  });
}

// Lança JsonWebTokenError/TokenExpiredError se o token for inválido ou expirado.
function verifyToken(token) {
  const payload = jwt.verify(token, SECRET, { algorithms: [ALGORITHM] });
  return { id: Number(payload.sub), siape: payload.siape, perfilId: payload.perfilId };
}

module.exports = { signToken, verifyToken };

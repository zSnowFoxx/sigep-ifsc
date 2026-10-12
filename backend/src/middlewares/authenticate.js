const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/jwt');

// Exige "Authorization: Bearer <token>" e expõe o usuário autenticado em req.user.
function authenticate(req, res, next) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Autenticação necessária'));
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Sessão expirada. Faça login novamente'));
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
      return next(new ApiError(401, 'Token inválido'));
    }
    next(error);
  }
}

// Leitura pública, escrita autenticada.
function authenticateWrites(req, res, next) {
  if (req.method === 'GET') {
    return next();
  }
  authenticate(req, res, next);
}

module.exports = authenticate;
module.exports.authenticateWrites = authenticateWrites;

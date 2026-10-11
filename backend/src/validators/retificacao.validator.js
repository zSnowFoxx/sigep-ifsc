const { isPresent } = require('./rules');
const ApiError = require('../utils/ApiError');

function validateSave(req, res, next) {
  const { mediaRetificada, usuarioId } = req.body;
  const errors = [];

  if (typeof mediaRetificada !== 'number' || !Number.isFinite(mediaRetificada) || mediaRetificada < 0 || mediaRetificada > 10) {
    errors.push('mediaRetificada é obrigatória e deve ser um número entre 0 e 10');
  }
  if (isPresent(usuarioId) && !Number.isInteger(usuarioId)) {
    errors.push('usuarioId deve ser um número inteiro');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Dados inválidos', errors));
  }

  next();
}

module.exports = { validateSave };

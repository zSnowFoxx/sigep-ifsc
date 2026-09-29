const ApiError = require('../utils/ApiError');

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function validateCreate(req, res, next) {
  const { nome } = req.body;
  const errors = [];

  if (!isNonEmptyString(nome, 100)) {
    errors.push('nome é obrigatório e deve ter no máximo 100 caracteres');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Dados inválidos', errors));
  }

  next();
}

function validateUpdate(req, res, next) {
  const { nome } = req.body;
  const errors = [];

  if (nome === undefined) {
    errors.push('Informe ao menos um campo para atualizar');
  } else if (!isNonEmptyString(nome, 100)) {
    errors.push('nome deve ter no máximo 100 caracteres');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Dados inválidos', errors));
  }

  next();
}

module.exports = {
  validateCreate,
  validateUpdate
};

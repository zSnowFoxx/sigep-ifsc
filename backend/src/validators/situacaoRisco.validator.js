const ApiError = require('../utils/ApiError');

const FIELDS = ['alunoId', 'risco', 'fatores'];

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function collectErrors(body, isCreate) {
  const { alunoId, risco, fatores } = body;
  const errors = [];

  if ((isCreate || alunoId !== undefined) && !Number.isInteger(alunoId)) {
    errors.push('alunoId é obrigatório e deve ser um número inteiro');
  }
  if (risco !== undefined && risco !== null && !isNonEmptyString(risco, 20)) {
    errors.push('risco deve ter no máximo 20 caracteres');
  }
  if (fatores !== undefined && fatores !== null && typeof fatores !== 'object') {
    errors.push('fatores deve ser um objeto ou uma lista JSON');
  }

  return errors;
}

function validateCreate(req, res, next) {
  const errors = collectErrors(req.body, true);

  if (errors.length > 0) {
    return next(new ApiError(400, 'Dados inválidos', errors));
  }

  next();
}

function validateUpdate(req, res, next) {
  const errors = collectErrors(req.body, false);

  if (FIELDS.every((field) => req.body[field] === undefined)) {
    errors.push('Informe ao menos um campo para atualizar');
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

const ApiError = require('../utils/ApiError');

const FIELDS = ['encaminhamentoId', 'usuarioId', 'dataRegistro', 'relato'];

function isPresent(value) {
  return value !== undefined && value !== null;
}

function isValidDate(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function collectErrors(body, isCreate) {
  const { encaminhamentoId, usuarioId, dataRegistro, relato } = body;
  const errors = [];

  if ((isCreate || encaminhamentoId !== undefined) && !Number.isInteger(encaminhamentoId)) {
    errors.push('encaminhamentoId é obrigatório e deve ser um número inteiro');
  }
  if ((isCreate || usuarioId !== undefined) && !Number.isInteger(usuarioId)) {
    errors.push('usuarioId é obrigatório e deve ser um número inteiro');
  }
  if (isPresent(dataRegistro) && !isValidDate(dataRegistro)) {
    errors.push('dataRegistro deve ser uma data válida (ISO 8601)');
  }
  if (isPresent(relato) && typeof relato !== 'string') {
    errors.push('relato deve ser um texto');
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

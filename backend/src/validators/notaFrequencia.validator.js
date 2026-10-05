const ApiError = require('../utils/ApiError');
const { FIELDS } = require('../models/notaFrequencia.model');

const COUNTERS = ['presencas', 'faltasJustificadas', 'faltasNaoJustificadas'];

function isPresent(value) {
  return value !== undefined && value !== null;
}

function isNumberInRange(value, min, max) {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

function collectErrors(body, isCreate) {
  const { matriculaId, diarioId, media, infrequencia } = body;
  const errors = [];

  if ((isCreate || matriculaId !== undefined) && !Number.isInteger(matriculaId)) {
    errors.push('matriculaId é obrigatório e deve ser um número inteiro');
  }
  if ((isCreate || diarioId !== undefined) && !Number.isInteger(diarioId)) {
    errors.push('diarioId é obrigatório e deve ser um número inteiro');
  }
  if (isPresent(media) && !isNumberInRange(media, 0, 10)) {
    errors.push('media deve ser um número entre 0 e 10');
  }
  if (isPresent(infrequencia) && !isNumberInRange(infrequencia, 0, 100)) {
    errors.push('infrequencia deve ser um percentual entre 0 e 100');
  }
  for (const field of COUNTERS) {
    if (isPresent(body[field]) && !(Number.isInteger(body[field]) && isNumberInRange(body[field], 0, 65535))) {
      errors.push(`${field} deve ser um número inteiro não negativo`);
    }
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

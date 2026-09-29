const ApiError = require('../utils/ApiError');

const FIELDS = ['matriculaId', 'diarioId', 'media', 'infrequencia'];

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
  if (media !== undefined && media !== null && !isNumberInRange(media, 0, 10)) {
    errors.push('media deve ser um número entre 0 e 10');
  }
  if (infrequencia !== undefined && infrequencia !== null && !isNumberInRange(infrequencia, 0, 100)) {
    errors.push('infrequencia deve ser um percentual entre 0 e 100');
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

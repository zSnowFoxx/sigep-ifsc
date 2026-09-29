const ApiError = require('../utils/ApiError');

const FIELDS = ['nome', 'etapa', 'dataRealizacao', 'local', 'status', 'participanteIds'];

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function isValidDate(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isIntegerList(value) {
  return Array.isArray(value) && value.every((id) => Number.isInteger(id));
}

function collectErrors(body, isCreate) {
  const { nome, etapa, dataRealizacao, local, status, participanteIds } = body;
  const errors = [];

  if ((isCreate || nome !== undefined) && !isNonEmptyString(nome, 150)) {
    errors.push('nome é obrigatório e deve ter no máximo 150 caracteres');
  }
  if (etapa !== undefined && etapa !== null && !isNonEmptyString(etapa, 50)) {
    errors.push('etapa deve ter no máximo 50 caracteres');
  }
  if (dataRealizacao !== undefined && dataRealizacao !== null && !isValidDate(dataRealizacao)) {
    errors.push('dataRealizacao deve ser uma data válida (ISO 8601)');
  }
  if (local !== undefined && local !== null && !isNonEmptyString(local, 100)) {
    errors.push('local deve ter no máximo 100 caracteres');
  }
  if (status !== undefined && status !== null && !isNonEmptyString(status, 50)) {
    errors.push('status deve ter no máximo 50 caracteres');
  }
  if (participanteIds !== undefined && !isIntegerList(participanteIds)) {
    errors.push('participanteIds deve ser uma lista de números inteiros');
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

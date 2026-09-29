const ApiError = require('../utils/ApiError');

const FIELDS = [
  'usuarioId',
  'alunoId',
  'dataAtendimento',
  'motivoAtendimento',
  'motivoContato',
  'relatoAtendimento'
];

function isPresent(value) {
  return value !== undefined && value !== null;
}

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function isValidDate(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function collectErrors(body, isCreate) {
  const {
    usuarioId,
    alunoId,
    dataAtendimento,
    motivoAtendimento,
    motivoContato,
    relatoAtendimento
  } = body;
  const errors = [];

  if ((isCreate || usuarioId !== undefined) && !Number.isInteger(usuarioId)) {
    errors.push('usuarioId é obrigatório e deve ser um número inteiro');
  }
  if ((isCreate || alunoId !== undefined) && !Number.isInteger(alunoId)) {
    errors.push('alunoId é obrigatório e deve ser um número inteiro');
  }
  if (isPresent(dataAtendimento) && !isValidDate(dataAtendimento)) {
    errors.push('dataAtendimento deve ser uma data válida (ISO 8601)');
  }
  if (isPresent(motivoAtendimento) && !isNonEmptyString(motivoAtendimento, 255)) {
    errors.push('motivoAtendimento deve ter no máximo 255 caracteres');
  }
  if (isPresent(motivoContato) && !isNonEmptyString(motivoContato, 255)) {
    errors.push('motivoContato deve ter no máximo 255 caracteres');
  }
  if (isPresent(relatoAtendimento) && typeof relatoAtendimento !== 'string') {
    errors.push('relatoAtendimento deve ser um texto');
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

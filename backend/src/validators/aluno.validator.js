const ApiError = require('../utils/ApiError');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS = ['matricula', 'nome', 'email', 'status', 'turmaIds'];
const STATUS = ['Ativo', 'Inativo'];

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function collectErrors(body, isCreate) {
  const { matricula, nome, email, status, turmaIds } = body;
  const errors = [];

  if ((isCreate || matricula !== undefined) && !isNonEmptyString(matricula, 20)) {
    errors.push('matricula é obrigatória e deve ter no máximo 20 caracteres');
  }
  if ((isCreate || nome !== undefined) && !isNonEmptyString(nome, 150)) {
    errors.push('nome é obrigatório e deve ter no máximo 150 caracteres');
  }
  if (
    email !== undefined &&
    email !== null &&
    (!isNonEmptyString(email, 150) || !EMAIL_REGEX.test(email))
  ) {
    errors.push('email deve ser um e-mail válido com no máximo 150 caracteres');
  }
  if (status !== undefined && status !== null && !STATUS.includes(status)) {
    errors.push(`status deve ser um destes valores: ${STATUS.join(', ')}`);
  }

  if (turmaIds !== undefined && (!Array.isArray(turmaIds) || !turmaIds.every((id) => Number.isInteger(id)))) {
    errors.push('turmaIds deve ser uma lista de números inteiros');
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

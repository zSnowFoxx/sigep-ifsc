const ApiError = require('../utils/ApiError');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function isFuncaoIdsValid(funcaoIds) {
  return Array.isArray(funcaoIds) && funcaoIds.every((id) => Number.isInteger(id));
}

function validateCreate(req, res, next) {
  const { siape, nome, email, senha, perfilId, funcaoIds } = req.body;
  const errors = [];

  if (!isNonEmptyString(siape, 7)) {
    errors.push('siape é obrigatório e deve ter no máximo 7 caracteres');
  }
  if (!isNonEmptyString(nome, 100)) {
    errors.push('nome é obrigatório e deve ter no máximo 100 caracteres');
  }
  if (!isNonEmptyString(email, 100) || !EMAIL_REGEX.test(email)) {
    errors.push('email é obrigatório e deve ser um e-mail válido');
  }
  if (typeof senha !== 'string' || senha.length < 6) {
    errors.push('senha é obrigatória e deve ter ao menos 6 caracteres');
  }
  if (!Number.isInteger(perfilId)) {
    errors.push('perfilId é obrigatório e deve ser um número inteiro');
  }
  if (funcaoIds !== undefined && !isFuncaoIdsValid(funcaoIds)) {
    errors.push('funcaoIds deve ser uma lista de números inteiros');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Dados inválidos', errors));
  }

  next();
}

function validateUpdate(req, res, next) {
  const { nome, email, senha, perfilId, funcaoIds } = req.body;
  const errors = [];

  if (nome !== undefined && !isNonEmptyString(nome, 100)) {
    errors.push('nome deve ter no máximo 100 caracteres');
  }
  if (email !== undefined && (!isNonEmptyString(email, 100) || !EMAIL_REGEX.test(email))) {
    errors.push('email deve ser um e-mail válido');
  }
  if (senha !== undefined && (typeof senha !== 'string' || senha.length < 6)) {
    errors.push('senha deve ter ao menos 6 caracteres');
  }
  if (perfilId !== undefined && !Number.isInteger(perfilId)) {
    errors.push('perfilId deve ser um número inteiro');
  }
  if (funcaoIds !== undefined && !isFuncaoIdsValid(funcaoIds)) {
    errors.push('funcaoIds deve ser uma lista de números inteiros');
  }

  if (
    nome === undefined &&
    email === undefined &&
    senha === undefined &&
    perfilId === undefined &&
    funcaoIds === undefined
  ) {
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

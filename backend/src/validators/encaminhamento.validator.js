const ApiError = require('../utils/ApiError');

const ID_FIELDS = ['conselhoId', 'atendimentoId', 'alunoId', 'usuarioResponsavelId'];
const TEXT_FIELDS = ['observacoes', 'descricaoAcao'];
const FIELDS = [...ID_FIELDS, ...TEXT_FIELDS, 'categoria', 'status'];

function isPresent(value) {
  return value !== undefined && value !== null;
}

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function collectErrors(body, isCreate) {
  const errors = [];

  for (const field of ID_FIELDS) {
    if ((isCreate || body[field] !== undefined) && !Number.isInteger(body[field])) {
      errors.push(`${field} é obrigatório e deve ser um número inteiro`);
    }
  }
  for (const field of TEXT_FIELDS) {
    if (isPresent(body[field]) && typeof body[field] !== 'string') {
      errors.push(`${field} deve ser um texto`);
    }
  }
  if (isPresent(body.categoria) && !isNonEmptyString(body.categoria, 100)) {
    errors.push('categoria deve ter no máximo 100 caracteres');
  }
  if (isPresent(body.status) && !isNonEmptyString(body.status, 50)) {
    errors.push('status deve ter no máximo 50 caracteres');
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

const ApiError = require('../utils/ApiError');

const TEXT_FIELDS = ['sinteseTurma', 'demandasTurma', 'observacoesTurma'];

function collectTextErrors(body) {
  return TEXT_FIELDS
    .filter((field) => body[field] !== undefined && body[field] !== null && typeof body[field] !== 'string')
    .map((field) => `${field} deve ser um texto`);
}

function validateCreate(req, res, next) {
  const errors = collectTextErrors(req.body);

  if (!Number.isInteger(req.body.turmaId)) {
    errors.unshift('turmaId é obrigatório e deve ser um número inteiro');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Dados inválidos', errors));
  }

  next();
}

function validateUpdate(req, res, next) {
  const errors = collectTextErrors(req.body);

  if (TEXT_FIELDS.every((field) => req.body[field] === undefined)) {
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

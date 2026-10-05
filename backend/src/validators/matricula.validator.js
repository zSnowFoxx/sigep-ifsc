const ApiError = require('../utils/ApiError');

const FIELDS = ['alunoId', 'turmaId', 'status'];
const STATUS = ['Ativo', 'Inativo'];

function collectErrors(body, isCreate) {
  const { alunoId, turmaId, status } = body;
  const errors = [];

  if ((isCreate || alunoId !== undefined) && !Number.isInteger(alunoId)) {
    errors.push('alunoId é obrigatório e deve ser um número inteiro');
  }
  if ((isCreate || turmaId !== undefined) && !Number.isInteger(turmaId)) {
    errors.push('turmaId é obrigatório e deve ser um número inteiro');
  }
  if (status !== undefined && status !== null && !STATUS.includes(status)) {
    errors.push(`status deve ser um destes valores: ${STATUS.join(', ')}`);
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

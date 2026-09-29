const ApiError = require('../utils/ApiError');

const ID_FIELDS = ['conselhoId', 'alunoId', 'usuarioId'];
const TEXT_FIELDS = ['observacao', 'informacoesAdicionais', 'retorno'];
const FIELDS = [...ID_FIELDS, ...TEXT_FIELDS, 'riscoEvasao'];

function isPresent(value) {
  return value !== undefined && value !== null;
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
  if (isPresent(body.riscoEvasao) && typeof body.riscoEvasao !== 'boolean') {
    errors.push('riscoEvasao deve ser um valor booleano');
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

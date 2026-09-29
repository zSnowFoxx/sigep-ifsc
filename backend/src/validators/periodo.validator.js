const ApiError = require('../utils/ApiError');

const ANO_REGEX = /^\d{4}$/;
const SEMESTRE_REGEX = /^[12]$/;

function validateCreate(req, res, next) {
  const { ano, semestre, ativo } = req.body;
  const errors = [];

  if (typeof ano !== 'string' || !ANO_REGEX.test(ano)) {
    errors.push('ano é obrigatório e deve conter 4 dígitos');
  }
  if (typeof semestre !== 'string' || !SEMESTRE_REGEX.test(semestre)) {
    errors.push('semestre é obrigatório e deve ser "1" ou "2"');
  }
  if (ativo !== undefined && typeof ativo !== 'boolean') {
    errors.push('ativo deve ser um valor booleano');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Dados inválidos', errors));
  }

  next();
}

function validateUpdate(req, res, next) {
  const { ano, semestre, ativo } = req.body;
  const errors = [];

  if (ano !== undefined && (typeof ano !== 'string' || !ANO_REGEX.test(ano))) {
    errors.push('ano deve conter 4 dígitos');
  }
  if (semestre !== undefined && (typeof semestre !== 'string' || !SEMESTRE_REGEX.test(semestre))) {
    errors.push('semestre deve ser "1" ou "2"');
  }
  if (ativo !== undefined && typeof ativo !== 'boolean') {
    errors.push('ativo deve ser um valor booleano');
  }

  if (ano === undefined && semestre === undefined && ativo === undefined) {
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

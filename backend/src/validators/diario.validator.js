const ApiError = require('../utils/ApiError');

const FIELDS = ['codigo', 'disciplinaId', 'turmaId', 'professorId', 'cargaHoraria', 'aulasPrevistas'];

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function collectErrors(body, isCreate) {
  const { codigo, disciplinaId, turmaId, professorId, cargaHoraria, aulasPrevistas } = body;
  const errors = [];

  if ((isCreate || codigo !== undefined) && !isNonEmptyString(codigo, 30)) {
    errors.push('codigo é obrigatório e deve ter no máximo 30 caracteres');
  }
  if ((isCreate || disciplinaId !== undefined) && !Number.isInteger(disciplinaId)) {
    errors.push('disciplinaId é obrigatório e deve ser um número inteiro');
  }
  if ((isCreate || turmaId !== undefined) && !Number.isInteger(turmaId)) {
    errors.push('turmaId é obrigatório e deve ser um número inteiro');
  }
  if ((isCreate || professorId !== undefined) && !Number.isInteger(professorId)) {
    errors.push('professorId é obrigatório e deve ser um número inteiro');
  }
  if (cargaHoraria !== undefined && cargaHoraria !== null && !isNonEmptyString(cargaHoraria, 10)) {
    errors.push('cargaHoraria deve ter no máximo 10 caracteres');
  }
  if (
    aulasPrevistas !== undefined &&
    aulasPrevistas !== null &&
    (!Number.isInteger(aulasPrevistas) || aulasPrevistas < 0)
  ) {
    errors.push('aulasPrevistas deve ser um número inteiro não negativo');
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

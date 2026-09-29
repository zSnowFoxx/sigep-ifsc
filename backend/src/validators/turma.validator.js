const ApiError = require('../utils/ApiError');

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function validateCreate(req, res, next) {
  const { nome, cursoId, periodoId, alunosQtd } = req.body;
  const errors = [];

  if (!isNonEmptyString(nome, 100)) {
    errors.push('nome é obrigatório e deve ter no máximo 100 caracteres');
  }
  if (!Number.isInteger(cursoId)) {
    errors.push('cursoId é obrigatório e deve ser um número inteiro');
  }
  if (!Number.isInteger(periodoId)) {
    errors.push('periodoId é obrigatório e deve ser um número inteiro');
  }
  if (alunosQtd !== undefined && (!Number.isInteger(alunosQtd) || alunosQtd < 0)) {
    errors.push('alunosQtd deve ser um número inteiro não negativo');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Dados inválidos', errors));
  }

  next();
}

function validateUpdate(req, res, next) {
  const { nome, cursoId, periodoId, alunosQtd } = req.body;
  const errors = [];

  if (nome !== undefined && !isNonEmptyString(nome, 100)) {
    errors.push('nome deve ter no máximo 100 caracteres');
  }
  if (cursoId !== undefined && !Number.isInteger(cursoId)) {
    errors.push('cursoId deve ser um número inteiro');
  }
  if (periodoId !== undefined && !Number.isInteger(periodoId)) {
    errors.push('periodoId deve ser um número inteiro');
  }
  if (alunosQtd !== undefined && (!Number.isInteger(alunosQtd) || alunosQtd < 0)) {
    errors.push('alunosQtd deve ser um número inteiro não negativo');
  }

  if (
    nome === undefined &&
    cursoId === undefined &&
    periodoId === undefined &&
    alunosQtd === undefined
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

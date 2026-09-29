const ApiError = require('../utils/ApiError');

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function isUsuarioIdsValid(usuarioIds) {
  return Array.isArray(usuarioIds) && usuarioIds.every((id) => Number.isInteger(id));
}

function validateCreate(req, res, next) {
  const { sigla, codigo, nome, cargaHoraria, faseOferta, cursoId, usuarioIds } = req.body;
  const errors = [];

  if (sigla !== undefined && sigla !== null && !isNonEmptyString(sigla, 10)) {
    errors.push('sigla deve ter no máximo 10 caracteres');
  }
  if (!isNonEmptyString(codigo, 20)) {
    errors.push('codigo é obrigatório e deve ter no máximo 20 caracteres');
  }
  if (!isNonEmptyString(nome, 100)) {
    errors.push('nome é obrigatório e deve ter no máximo 100 caracteres');
  }
  if (cargaHoraria !== undefined && cargaHoraria !== null && !isNonEmptyString(cargaHoraria, 10)) {
    errors.push('cargaHoraria deve ter no máximo 10 caracteres');
  }
  if (faseOferta !== undefined && faseOferta !== null && !isNonEmptyString(faseOferta, 20)) {
    errors.push('faseOferta deve ter no máximo 20 caracteres');
  }
  if (!Number.isInteger(cursoId)) {
    errors.push('cursoId é obrigatório e deve ser um número inteiro');
  }
  if (usuarioIds !== undefined && !isUsuarioIdsValid(usuarioIds)) {
    errors.push('usuarioIds deve ser uma lista de números inteiros');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Dados inválidos', errors));
  }

  next();
}

function validateUpdate(req, res, next) {
  const { sigla, codigo, nome, cargaHoraria, faseOferta, cursoId, usuarioIds } = req.body;
  const errors = [];

  if (sigla !== undefined && sigla !== null && !isNonEmptyString(sigla, 10)) {
    errors.push('sigla deve ter no máximo 10 caracteres');
  }
  if (codigo !== undefined && !isNonEmptyString(codigo, 20)) {
    errors.push('codigo deve ter no máximo 20 caracteres');
  }
  if (nome !== undefined && !isNonEmptyString(nome, 100)) {
    errors.push('nome deve ter no máximo 100 caracteres');
  }
  if (cargaHoraria !== undefined && cargaHoraria !== null && !isNonEmptyString(cargaHoraria, 10)) {
    errors.push('cargaHoraria deve ter no máximo 10 caracteres');
  }
  if (faseOferta !== undefined && faseOferta !== null && !isNonEmptyString(faseOferta, 20)) {
    errors.push('faseOferta deve ter no máximo 20 caracteres');
  }
  if (cursoId !== undefined && !Number.isInteger(cursoId)) {
    errors.push('cursoId deve ser um número inteiro');
  }
  if (usuarioIds !== undefined && !isUsuarioIdsValid(usuarioIds)) {
    errors.push('usuarioIds deve ser uma lista de números inteiros');
  }

  if (
    sigla === undefined &&
    codigo === undefined &&
    nome === undefined &&
    cargaHoraria === undefined &&
    faseOferta === undefined &&
    cursoId === undefined &&
    usuarioIds === undefined
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

const ApiError = require('../utils/ApiError');

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function validateCreate(req, res, next) {
  const { codigo, nome, tipo, grau, modalidade, ppc, fases, coordenadorId } = req.body;
  const errors = [];

  if (!isNonEmptyString(codigo, 20)) {
    errors.push('codigo é obrigatório e deve ter no máximo 20 caracteres');
  }
  if (!isNonEmptyString(nome, 150)) {
    errors.push('nome é obrigatório e deve ter no máximo 150 caracteres');
  }
  if (tipo !== undefined && tipo !== null && !isNonEmptyString(tipo, 50)) {
    errors.push('tipo deve ter no máximo 50 caracteres');
  }
  if (grau !== undefined && grau !== null && !isNonEmptyString(grau, 50)) {
    errors.push('grau deve ter no máximo 50 caracteres');
  }
  if (modalidade !== undefined && modalidade !== null && !isNonEmptyString(modalidade, 50)) {
    errors.push('modalidade deve ter no máximo 50 caracteres');
  }
  if (ppc !== undefined && ppc !== null && !isNonEmptyString(ppc, 40)) {
    errors.push('ppc deve ter no máximo 40 caracteres');
  }
  if (fases !== undefined && fases !== null && !Number.isInteger(fases)) {
    errors.push('fases deve ser um número inteiro');
  }
  if (coordenadorId !== undefined && coordenadorId !== null && !Number.isInteger(coordenadorId)) {
    errors.push('coordenadorId deve ser um número inteiro');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Dados inválidos', errors));
  }

  next();
}

function validateUpdate(req, res, next) {
  const { codigo, nome, tipo, grau, modalidade, ppc, fases, coordenadorId } = req.body;
  const errors = [];

  if (codigo !== undefined && !isNonEmptyString(codigo, 20)) {
    errors.push('codigo deve ter no máximo 20 caracteres');
  }
  if (nome !== undefined && !isNonEmptyString(nome, 150)) {
    errors.push('nome deve ter no máximo 150 caracteres');
  }
  if (tipo !== undefined && tipo !== null && !isNonEmptyString(tipo, 50)) {
    errors.push('tipo deve ter no máximo 50 caracteres');
  }
  if (grau !== undefined && grau !== null && !isNonEmptyString(grau, 50)) {
    errors.push('grau deve ter no máximo 50 caracteres');
  }
  if (modalidade !== undefined && modalidade !== null && !isNonEmptyString(modalidade, 50)) {
    errors.push('modalidade deve ter no máximo 50 caracteres');
  }
  if (ppc !== undefined && ppc !== null && !isNonEmptyString(ppc, 40)) {
    errors.push('ppc deve ter no máximo 40 caracteres');
  }
  if (fases !== undefined && fases !== null && !Number.isInteger(fases)) {
    errors.push('fases deve ser um número inteiro');
  }
  if (coordenadorId !== undefined && coordenadorId !== null && !Number.isInteger(coordenadorId)) {
    errors.push('coordenadorId deve ser um número inteiro');
  }

  if (
    codigo === undefined &&
    nome === undefined &&
    tipo === undefined &&
    grau === undefined &&
    modalidade === undefined &&
    ppc === undefined &&
    fases === undefined &&
    coordenadorId === undefined
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

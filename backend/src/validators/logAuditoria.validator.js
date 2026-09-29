const ApiError = require('../utils/ApiError');

const FIELDS = [
  'usuarioId',
  'acao',
  'tabelaAfetada',
  'registroId',
  'dadosAnteriores',
  'dadosNovos',
  'dataHora',
  'enderecoIp',
  'userAgent'
];

function isPresent(value) {
  return value !== undefined && value !== null;
}

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function isValidDate(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isValidRegistroId(value) {
  return Number.isInteger(value) || isNonEmptyString(value, 255);
}

function isJsonObject(value) {
  return typeof value === 'object' && value !== null;
}

function collectErrors(body, isCreate) {
  const {
    usuarioId,
    acao,
    tabelaAfetada,
    registroId,
    dadosAnteriores,
    dadosNovos,
    dataHora,
    enderecoIp,
    userAgent
  } = body;
  const errors = [];

  if (isPresent(usuarioId) && !Number.isInteger(usuarioId)) {
    errors.push('usuarioId deve ser um número inteiro');
  }
  if ((isCreate || acao !== undefined) && !isNonEmptyString(acao, 20)) {
    errors.push('acao é obrigatória e deve ter no máximo 20 caracteres');
  }
  if ((isCreate || tabelaAfetada !== undefined) && !isNonEmptyString(tabelaAfetada, 100)) {
    errors.push('tabelaAfetada é obrigatória e deve ter no máximo 100 caracteres');
  }
  if (isPresent(registroId) && !isValidRegistroId(registroId)) {
    errors.push('registroId deve ser um número inteiro ou um texto de até 255 caracteres');
  }
  if (isPresent(dadosAnteriores) && !isJsonObject(dadosAnteriores)) {
    errors.push('dadosAnteriores deve ser um objeto ou uma lista JSON');
  }
  if (isPresent(dadosNovos) && !isJsonObject(dadosNovos)) {
    errors.push('dadosNovos deve ser um objeto ou uma lista JSON');
  }
  // data_hora is NOT NULL, so null is rejected here instead of failing in the database.
  if (dataHora !== undefined && !isValidDate(dataHora)) {
    errors.push('dataHora deve ser uma data válida (ISO 8601)');
  }
  if (isPresent(enderecoIp) && !isNonEmptyString(enderecoIp, 45)) {
    errors.push('enderecoIp deve ter no máximo 45 caracteres');
  }
  if (isPresent(userAgent) && !isNonEmptyString(userAgent, 500)) {
    errors.push('userAgent deve ter no máximo 500 caracteres');
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

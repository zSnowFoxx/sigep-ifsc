const ApiError = require('../utils/ApiError');

function isPresent(value) {
  return value !== undefined && value !== null;
}

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function isValidRegistroId(value) {
  return Number.isInteger(value) || isNonEmptyString(value, 255);
}

function isJsonObject(value) {
  return typeof value === 'object' && value !== null;
}

// usuarioId, enderecoIp, userAgent e dataHora descrevem a origem da requisição e são preenchidos pelo backend.
function validateCreate(req, res, next) {
  const { acao, tabelaAfetada, registroId, dadosAnteriores, dadosNovos } = req.body;
  const errors = [];

  if (!isNonEmptyString(acao, 20)) {
    errors.push('acao é obrigatória e deve ter no máximo 20 caracteres');
  }
  if (!isNonEmptyString(tabelaAfetada, 100)) {
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

  if (errors.length > 0) {
    return next(new ApiError(400, 'Dados inválidos', errors));
  }

  next();
}

module.exports = {
  validateCreate
};

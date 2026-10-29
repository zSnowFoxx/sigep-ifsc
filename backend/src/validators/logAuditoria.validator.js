const ApiError = require('../utils/ApiError');
const toDateTime = require('../utils/dateTime');

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

const POSITIVE_INT_REGEX = /^[1-9]\d*$/;
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const LIMITE_MAXIMO = 200;

// Data (YYYY-MM-DD) ou data e hora ISO. Um `ate` só com a data inclui o dia inteiro.
function toInstante(value, fimDoDia) {
  const data = toDateTime(value);
  if (fimDoDia && DATE_ONLY_REGEX.test(value)) {
    data.setHours(23, 59, 59, 999);
  }
  return data;
}

// Filtros de GET /logs-auditoria. Os valores convertidos ficam em req.filtros.
function validateQuery(req, res, next) {
  const { usuarioId, acao, tabela, registroId, de, ate, busca, pagina, limite } = req.query;
  const errors = [];
  const filtros = {};

  const texto = (campo, valor, maxLength) => {
    if (valor === undefined || valor === '') return;
    if (!isNonEmptyString(valor, maxLength)) {
      errors.push(`${campo} deve ser um texto de até ${maxLength} caracteres`);
      return;
    }
    filtros[campo] = valor.trim();
  };

  const inteiro = (campo, valor, maximo) => {
    if (valor === undefined || valor === '') return;
    if (typeof valor !== 'string' || !POSITIVE_INT_REGEX.test(valor) || (maximo && Number(valor) > maximo)) {
      errors.push(`${campo} deve ser um número inteiro positivo${maximo ? ` de até ${maximo}` : ''}`);
      return;
    }
    filtros[campo] = Number(valor);
  };

  const instante = (campo, valor) => {
    if (valor === undefined || valor === '') return;
    const data = typeof valor === 'string' ? toInstante(valor, campo === 'ate') : null;
    if (!data || Number.isNaN(data.getTime())) {
      errors.push(`${campo} deve ser uma data (AAAA-MM-DD) ou data e hora ISO`);
      return;
    }
    filtros[campo] = data;
  };

  inteiro('usuarioId', usuarioId);
  texto('acao', acao, 20);
  texto('tabela', tabela, 100);
  texto('registroId', registroId, 255);
  instante('de', de);
  instante('ate', ate);
  texto('busca', busca, 100);
  inteiro('pagina', pagina);
  inteiro('limite', limite, LIMITE_MAXIMO);

  if (filtros.de && filtros.ate && filtros.de > filtros.ate) {
    errors.push('de deve ser anterior a ate');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Filtros inválidos', errors));
  }

  req.filtros = filtros;
  next();
}

module.exports = {
  validateCreate,
  validateQuery
};

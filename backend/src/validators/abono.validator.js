const { isPresent, isNonEmptyString } = require('./rules');
const ApiError = require('../utils/ApiError');

const TIPOS = ['Atestado Médico', 'Luto', 'Serviço Militar', 'Representação Discente', 'Decisão do Conselho'];

// Abonos não são editados: para corrigir, remove-se e registra-se outro.
function validateCreate(req, res, next) {
  const { notaFrequenciaId, horas, tipo, fundamentacao } = req.body;
  const errors = [];

  if (!Number.isInteger(notaFrequenciaId)) {
    errors.push('notaFrequenciaId é obrigatório e deve ser um número inteiro');
  }
  if (!Number.isInteger(horas) || horas <= 0) {
    errors.push('horas é obrigatório e deve ser um número inteiro maior que zero');
  }
  if (!TIPOS.includes(tipo)) {
    errors.push(`tipo deve ser um destes valores: ${TIPOS.join(', ')}`);
  }
  if (isPresent(fundamentacao) && !isNonEmptyString(fundamentacao, 65535)) {
    errors.push('fundamentacao deve ser um texto');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Dados inválidos', errors));
  }

  next();
}

module.exports = { validateCreate, TIPOS };

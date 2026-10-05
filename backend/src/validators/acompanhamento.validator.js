const { isPresent, isNonEmptyString, buildValidators } = require('./rules');
const { FIELDS } = require('../models/acompanhamento.model');

const TIPOS = ['criacao', 'triagem', 'relato', 'conclusao'];

function collectErrors(body, isCreate) {
  const errors = [];

  if (isPresent(body.autorId) && !Number.isInteger(body.autorId)) {
    errors.push('autorId deve ser um número inteiro');
  }
  if (isPresent(body.tipo) && !TIPOS.includes(body.tipo)) {
    errors.push(`tipo deve ser um destes valores: ${TIPOS.join(', ')}`);
  }
  if ((isCreate || body.relato !== undefined) && !isNonEmptyString(body.relato, 65535)) {
    errors.push('relato é obrigatório');
  }

  return errors;
}

module.exports = buildValidators(collectErrors, FIELDS);

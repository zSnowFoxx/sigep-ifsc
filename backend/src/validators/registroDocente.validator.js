const { isPresent, isNonEmptyString, buildValidators } = require('./rules');
const { FIELDS } = require('../models/registroDocente.model');

function collectErrors(body, isCreate) {
  const errors = [];

  for (const field of ['alunoId', 'docenteId']) {
    if ((isCreate || body[field] !== undefined) && !Number.isInteger(body[field])) {
      errors.push(`${field} é obrigatório e deve ser um número inteiro`);
    }
  }
  if (body.turmaId !== undefined && !Number.isInteger(body.turmaId)) {
    errors.push('turmaId deve ser um número inteiro (omita para usar a turma do aluno)');
  }
  if (isPresent(body.encaminhamentoId) && !Number.isInteger(body.encaminhamentoId)) {
    errors.push('encaminhamentoId deve ser um número inteiro');
  }
  if ((isCreate || body.titulo !== undefined) && !isNonEmptyString(body.titulo, 255)) {
    errors.push('titulo é obrigatório e deve ter no máximo 255 caracteres');
  }
  if ((isCreate || body.categoria !== undefined) && !isNonEmptyString(body.categoria, 80)) {
    errors.push('categoria é obrigatória e deve ter no máximo 80 caracteres');
  }
  if ((isCreate || body.registro !== undefined) && !isNonEmptyString(body.registro, 65535)) {
    errors.push('registro é obrigatório');
  }

  return errors;
}

module.exports = buildValidators(collectErrors, FIELDS);

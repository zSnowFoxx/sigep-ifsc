const { isPresent, isNonEmptyString, isValidDate, buildValidators } = require('./rules');
const { FIELDS } = require('../models/atendimento.model');

function collectErrors(body, isCreate) {
  const errors = [];

  if ((isCreate || body.alunoId !== undefined) && !Number.isInteger(body.alunoId)) {
    errors.push('alunoId é obrigatório e deve ser um número inteiro');
  }
  if (body.turmaId !== undefined && !Number.isInteger(body.turmaId)) {
    errors.push('turmaId deve ser um número inteiro (omita para usar a turma do aluno)');
  }
  if (isPresent(body.servidorId) && !Number.isInteger(body.servidorId)) {
    errors.push('servidorId deve ser um número inteiro');
  }
  if (body.dataAtendimento !== undefined && !isValidDate(body.dataAtendimento)) {
    errors.push('dataAtendimento deve ser uma data válida (ISO 8601)');
  }
  if ((isCreate || body.motivo !== undefined) && !isNonEmptyString(body.motivo, 80)) {
    errors.push('motivo é obrigatório e deve ter no máximo 80 caracteres');
  }
  if (isPresent(body.formaContato) && !isNonEmptyString(body.formaContato, 80)) {
    errors.push('formaContato deve ter no máximo 80 caracteres');
  }
  if ((isCreate || body.relato !== undefined) && !isNonEmptyString(body.relato, 65535)) {
    errors.push('relato é obrigatório');
  }

  return errors;
}

module.exports = buildValidators(collectErrors, FIELDS);

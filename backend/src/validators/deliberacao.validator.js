const { isNonEmptyString, buildValidators } = require('./rules');
const { FIELDS } = require('../models/deliberacao.model');

function collectErrors(body, isCreate) {
  const errors = [];

  if ((isCreate || body.alunoId !== undefined) && !Number.isInteger(body.alunoId)) {
    errors.push('alunoId é obrigatório e deve ser um número inteiro');
  }
  if (body.turmaId !== undefined && !Number.isInteger(body.turmaId)) {
    errors.push('turmaId deve ser um número inteiro (omita para usar a turma do aluno)');
  }
  if (
    (isCreate || body.alteracoesRealizadas !== undefined) &&
    !isNonEmptyString(body.alteracoesRealizadas, 65535)
  ) {
    errors.push('alteracoesRealizadas é obrigatório');
  }

  return errors;
}

module.exports = buildValidators(collectErrors, FIELDS);

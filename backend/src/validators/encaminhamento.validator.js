const { isPresent, isNonEmptyString, buildValidators } = require('./rules');
const { FIELDS } = require('../models/encaminhamento.model');

const STATUS = ['pendente', 'em-andamento', 'finalizado'];
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function collectErrors(body, isCreate) {
  const errors = [];

  if ((isCreate || body.alunoId !== undefined) && !Number.isInteger(body.alunoId)) {
    errors.push('alunoId é obrigatório e deve ser um número inteiro');
  }
  if (body.turmaId !== undefined && !Number.isInteger(body.turmaId)) {
    errors.push('turmaId deve ser um número inteiro (omita para usar a turma do aluno)');
  }
  for (const field of ['conselhoId', 'servidorResponsavelId']) {
    if (isPresent(body[field]) && !Number.isInteger(body[field])) {
      errors.push(`${field} deve ser um número inteiro`);
    }
  }
  if ((isCreate || body.titulo !== undefined) && !isNonEmptyString(body.titulo, 255)) {
    errors.push('titulo é obrigatório e deve ter no máximo 255 caracteres');
  }
  if ((isCreate || body.categoria !== undefined) && !isNonEmptyString(body.categoria, 80)) {
    errors.push('categoria é obrigatória e deve ter no máximo 80 caracteres');
  }
  if (isPresent(body.origem) && !isNonEmptyString(body.origem, 80)) {
    errors.push('origem deve ter no máximo 80 caracteres');
  }
  if (isPresent(body.descricaoInicial) && typeof body.descricaoInicial !== 'string') {
    errors.push('descricaoInicial deve ser um texto');
  }
  if (isPresent(body.status) && !STATUS.includes(body.status)) {
    errors.push(`status deve ser um destes valores: ${STATUS.join(', ')}`);
  }
  if (isPresent(body.urgente) && typeof body.urgente !== 'boolean') {
    errors.push('urgente deve ser um valor booleano');
  }
  if (isPresent(body.prazo) && !(DATE_ONLY_REGEX.test(body.prazo) && !Number.isNaN(Date.parse(body.prazo)))) {
    errors.push('prazo deve ser uma data no formato AAAA-MM-DD');
  }

  return errors;
}

module.exports = buildValidators(collectErrors, FIELDS);

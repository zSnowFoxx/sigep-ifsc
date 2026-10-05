const { isPresent, isNonEmptyString, isStringList, buildValidators } = require('./rules');
const { FIELDS } = require('../models/conselhoDemanda.model');

const GRAVIDADES = ['nao-urgente', 'urgente', 'critica'];

function isDemandaGeralList(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (d) =>
        d !== null &&
        typeof d === 'object' &&
        isNonEmptyString(d.situacao, 65535) &&
        (d.gravidade === undefined || d.gravidade === null || GRAVIDADES.includes(d.gravidade))
    )
  );
}

function collectErrors(body, isCreate) {
  const errors = [];

  if (isCreate && !Number.isInteger(body.turmaId)) {
    errors.push('turmaId é obrigatório e deve ser um número inteiro');
  }
  if (isPresent(body.alunoRepresentanteId) && !Number.isInteger(body.alunoRepresentanteId)) {
    errors.push('alunoRepresentanteId deve ser um número inteiro');
  }
  for (const field of ['sinteseDiagnostico', 'registrosObservacoes']) {
    if (isPresent(body[field]) && typeof body[field] !== 'string') {
      errors.push(`${field} deve ser um texto`);
    }
  }
  for (const field of ['pontosPositivos', 'dificuldadesApontadas']) {
    if (isPresent(body[field]) && !isStringList(body[field])) {
      errors.push(`${field} deve ser uma lista de textos`);
    }
  }
  if (isPresent(body.demandasGerais) && !isDemandaGeralList(body.demandasGerais)) {
    errors.push(`demandasGerais deve ser uma lista de { situacao: texto, gravidade?: ${GRAVIDADES.join(' | ')} }`);
  }

  return errors;
}

module.exports = buildValidators(collectErrors, FIELDS);

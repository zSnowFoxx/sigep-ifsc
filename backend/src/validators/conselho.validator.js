const { isPresent, isNonEmptyString, isValidDate, isIntegerList, buildValidators } = require('./rules');

const FIELDS = ['nome', 'tipo', 'status', 'conselhoOrigemId', 'dataRealizacao', 'turmaIds', 'servidores'];
const TIPOS = [1, 2];
const STATUS = ['agendado', 'em_andamento', 'encerrado'];

function isServidorList(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (s) =>
        s !== null &&
        typeof s === 'object' &&
        Number.isInteger(s.usuarioId) &&
        (s.presente === undefined || s.presente === null || typeof s.presente === 'boolean')
    )
  );
}

function collectErrors(body, isCreate) {
  const { nome, tipo, status, conselhoOrigemId, dataRealizacao, turmaIds, servidores } = body;
  const errors = [];

  if ((isCreate || nome !== undefined) && !isNonEmptyString(nome, 255)) {
    errors.push('nome é obrigatório e deve ter no máximo 255 caracteres');
  }
  if ((isCreate || tipo !== undefined) && !TIPOS.includes(tipo)) {
    errors.push('tipo é obrigatório e deve ser 1 (intermediário) ou 2 (final)');
  }
  if (isPresent(status) && !STATUS.includes(status)) {
    errors.push(`status deve ser um destes valores: ${STATUS.join(', ')}`);
  }
  if (isPresent(conselhoOrigemId) && !Number.isInteger(conselhoOrigemId)) {
    errors.push('conselhoOrigemId deve ser um número inteiro');
  }
  if (isPresent(dataRealizacao) && !isValidDate(dataRealizacao)) {
    errors.push('dataRealizacao deve ser uma data válida (ISO 8601)');
  }
  if (turmaIds !== undefined && !isIntegerList(turmaIds)) {
    errors.push('turmaIds deve ser uma lista de números inteiros');
  }
  if (servidores !== undefined && !isServidorList(servidores)) {
    errors.push('servidores deve ser uma lista de { usuarioId: número, presente?: boolean }');
  }

  return errors;
}

module.exports = buildValidators(collectErrors, FIELDS);

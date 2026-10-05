const ApiError = require('../utils/ApiError');

const isPresent = (value) => value !== undefined && value !== null;

const isNonEmptyString = (value, maxLength) =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;

const isValidDate = (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value));

const isIntegerList = (value) => Array.isArray(value) && value.every((id) => Number.isInteger(id));

const isStringList = (value) => Array.isArray(value) && value.every((item) => typeof item === 'string');

// Monta validateCreate/validateUpdate a partir de collectErrors(body, isCreate).
function buildValidators(collectErrors, fields) {
  function validate(isCreate) {
    return (req, res, next) => {
      const errors = collectErrors(req.body, isCreate);

      if (!isCreate && fields.every((field) => req.body[field] === undefined)) {
        errors.push('Informe ao menos um campo para atualizar');
      }

      if (errors.length > 0) {
        return next(new ApiError(400, 'Dados inválidos', errors));
      }

      next();
    };
  }

  return { validateCreate: validate(true), validateUpdate: validate(false) };
}

module.exports = {
  isPresent,
  isNonEmptyString,
  isValidDate,
  isIntegerList,
  isStringList,
  buildValidators
};

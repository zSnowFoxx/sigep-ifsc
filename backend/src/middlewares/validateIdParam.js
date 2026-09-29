const ApiError = require('../utils/ApiError');

// MySQL casts '1abc' or '01' to 1, so loose ids would match the wrong row.
const ID_REGEX = /^[1-9]\d*$/;

function validateIdParam(req, res, next, value, name) {
  if (!ID_REGEX.test(value)) {
    return next(new ApiError(400, `Parâmetro ${name} inválido`));
  }

  next();
}

module.exports = validateIdParam;

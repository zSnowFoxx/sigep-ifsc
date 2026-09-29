const ApiError = require('../utils/ApiError');

// Centralized error handler. Any error passed to next(err) — including
// ones thrown inside async handlers wrapped with asyncHandler — ends up here.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message, details: err.details ?? undefined });
  }

  // Client errors raised by body-parser (malformed JSON, payload too large, ...).
  if (err.expose && Number.isInteger(err.status) && err.status >= 400 && err.status < 500) {
    const message = err.type === 'entity.parse.failed' ? 'JSON inválido' : err.message;
    return res.status(err.status).json({ success: false, message });
  }

  res.status(500).json({ success: false, message: 'Internal server error' });
}

module.exports = errorHandler;

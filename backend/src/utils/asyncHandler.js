// Wraps async route/controller functions so rejected promises are
// forwarded to Express' error-handling middleware instead of crashing.
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;

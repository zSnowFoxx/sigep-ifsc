const { Router } = require('express');

const controller = require('../controllers/logAuditoria.controller');
const { validateCreate } = require('../validators/logAuditoria.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const ApiError = require('../utils/ApiError');

const router = Router();

router.param('id', validateIdParam);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateCreate, controller.create);

// Logs de auditoria só aceitam inclusão: nenhum registro pode ser alterado ou apagado.
router.all('/:id', (req, res, next) => {
  res.set('Allow', 'GET');
  next(new ApiError(405, 'Logs de auditoria não podem ser alterados nem removidos'));
});

module.exports = router;

const { Router } = require('express');

const controller = require('../controllers/logAuditoria.controller');
const { validateCreate, validateQuery } = require('../validators/logAuditoria.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const exigirAcessoAuditoria = require('../middlewares/exigirAcessoAuditoria');
const ApiError = require('../utils/ApiError');

const router = Router();

router.param('id', validateIdParam);

// Consulta restrita a alguns perfis; registrar um evento continua aberto a qualquer usuário logado.
router.get('/', exigirAcessoAuditoria, validateQuery, controller.getAll);
// Antes de /:id, senão "opcoes" seria validado como id.
router.get('/opcoes', exigirAcessoAuditoria, controller.getOpcoes);
router.get('/:id', exigirAcessoAuditoria, controller.getById);
router.post('/', validateCreate, controller.create);

// Logs de auditoria só aceitam inclusão: nenhum registro pode ser alterado ou apagado.
router.all('/:id', (req, res, next) => {
  res.set('Allow', 'GET');
  next(new ApiError(405, 'Logs de auditoria não podem ser alterados nem removidos'));
});

module.exports = router;

const { Router } = require('express');

const controller = require('../controllers/conselho.controller');
const { validateCreate, validateUpdate } = require('../validators/conselho.validator');
const validateIdParam = require('../middlewares/validateIdParam');

const router = Router();

router.param('id', validateIdParam);
router.param('conselhoId', validateIdParam);

router.use('/:conselhoId/demandas', require('./conselhoDemanda.routes'));
router.use('/:conselhoId/registros-docentes', require('./registroDocente.routes'));
router.use('/:conselhoId/deliberacoes', require('./deliberacao.routes'));

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateCreate, controller.create);
router.put('/:id', validateUpdate, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;

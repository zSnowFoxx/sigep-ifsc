const { Router } = require('express');

const controller = require('../controllers/conselho.controller');
const { validateCreate, validateUpdate } = require('../validators/conselho.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const conselhoModel = require('../models/conselho.model');
const auditar = require('../middlewares/auditar');

const router = Router();

const audit = auditar('conselhos_lista', (req) => conselhoModel.findById(req.params.id));

router.param('id', validateIdParam);
router.param('conselhoId', validateIdParam);

router.use('/:conselhoId/demandas', require('./conselhoDemanda.routes'));
router.use('/:conselhoId/registros-docentes', require('./registroDocente.routes'));
router.use('/:conselhoId/deliberacoes', require('./deliberacao.routes'));
router.use('/:conselhoId/abonos', require('./abono.routes'));
router.use('/:conselhoId/retificacoes', require('./retificacao.routes'));

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/ata', controller.ata);
router.post('/', validateCreate, audit, controller.create);
router.put('/:id', validateUpdate, audit, controller.update);
router.delete('/:id', audit, controller.remove);

module.exports = router;

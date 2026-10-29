const { Router } = require('express');

const controller = require('../controllers/encaminhamento.controller');
const acompanhamentoController = require('../controllers/acompanhamento.controller');
const { validateCreate, validateUpdate } = require('../validators/encaminhamento.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const encaminhamentoModel = require('../models/encaminhamento.model');
const auditar = require('../middlewares/auditar');

const router = Router();

const audit = auditar('encaminhamentos', (req) => encaminhamentoModel.findById(req.params.id));

router.param('id', validateIdParam);
router.param('encaminhamentoId', validateIdParam);

router.use('/:encaminhamentoId/acompanhamentos', require('./acompanhamento.routes'));

// Antes de /:id, senão "acompanhamentos" seria validado como id.
router.get('/acompanhamentos', acompanhamentoController.getAllFromAllEncaminhamentos);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateCreate, audit, controller.create);
router.put('/:id', validateUpdate, audit, controller.update);
router.delete('/:id', audit, controller.remove);

module.exports = router;

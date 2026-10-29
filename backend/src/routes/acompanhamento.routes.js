const { Router } = require('express');

const controller = require('../controllers/acompanhamento.controller');
const { validateCreate, validateUpdate } = require('../validators/acompanhamento.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const acompanhamentoModel = require('../models/acompanhamento.model');
const auditar = require('../middlewares/auditar');

const router = Router({ mergeParams: true });

const audit = auditar('encaminhamentos_acompanhamento', (req) => acompanhamentoModel.findOne(req.params.encaminhamentoId, req.params.id));

router.param('id', validateIdParam);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateCreate, audit, controller.create);
router.put('/:id', validateUpdate, audit, controller.update);
router.delete('/:id', audit, controller.remove);

module.exports = router;

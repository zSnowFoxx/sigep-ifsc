const { Router } = require('express');

const controller = require('../controllers/atendimento.controller');
const { validateCreate, validateUpdate } = require('../validators/atendimento.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const atendimentoModel = require('../models/atendimento.model');
const auditar = require('../middlewares/auditar');

const router = Router();

const audit = auditar('atendimentos', (req) => atendimentoModel.findById(req.params.id));

router.param('id', validateIdParam);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateCreate, audit, controller.create);
router.put('/:id', validateUpdate, audit, controller.update);
router.delete('/:id', audit, controller.remove);

module.exports = router;

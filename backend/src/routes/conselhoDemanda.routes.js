const { Router } = require('express');

const controller = require('../controllers/conselhoDemanda.controller');
const { validateCreate, validateUpdate } = require('../validators/conselhoDemanda.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const conselhoDemandaModel = require('../models/conselhoDemanda.model');
const auditar = require('../middlewares/auditar');

const router = Router({ mergeParams: true });

const audit = auditar('conselhos_demandas', (req) => conselhoDemandaModel.findOne(req.params.conselhoId, req.params.turmaId));

router.param('turmaId', validateIdParam);

router.get('/', controller.getAll);
router.get('/:turmaId', controller.getById);
router.post('/', validateCreate, audit, controller.create);
router.put('/:turmaId', validateUpdate, audit, controller.update);
router.delete('/:turmaId', audit, controller.remove);

module.exports = router;

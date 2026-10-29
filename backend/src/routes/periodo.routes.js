const { Router } = require('express');

const controller = require('../controllers/periodo.controller');
const { validateCreate, validateUpdate } = require('../validators/periodo.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const periodoModel = require('../models/periodo.model');
const auditar = require('../middlewares/auditar');

const router = Router();

const audit = auditar('periodos', (req) => periodoModel.findById(req.params.id));

router.param('id', validateIdParam);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateCreate, audit, controller.create);
router.put('/:id', validateUpdate, audit, controller.update);
router.delete('/:id', audit, controller.remove);

module.exports = router;

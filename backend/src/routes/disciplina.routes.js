const { Router } = require('express');

const controller = require('../controllers/disciplina.controller');
const { validateCreate, validateUpdate } = require('../validators/disciplina.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const disciplinaModel = require('../models/disciplina.model');
const auditar = require('../middlewares/auditar');

const router = Router();

const audit = auditar('disciplinas', (req) => disciplinaModel.findById(req.params.id));

router.param('id', validateIdParam);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateCreate, audit, controller.create);
router.put('/:id', validateUpdate, audit, controller.update);
router.delete('/:id', audit, controller.remove);

module.exports = router;

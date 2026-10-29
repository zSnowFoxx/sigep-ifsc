const { Router } = require('express');

const controller = require('../controllers/turma.controller');
const { validateCreate, validateUpdate } = require('../validators/turma.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const turmaModel = require('../models/turma.model');
const auditar = require('../middlewares/auditar');

const router = Router();

const audit = auditar('turmas', (req) => turmaModel.findById(req.params.id));

router.param('id', validateIdParam);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateCreate, audit, controller.create);
router.put('/:id', validateUpdate, audit, controller.update);
router.delete('/:id', audit, controller.remove);

module.exports = router;

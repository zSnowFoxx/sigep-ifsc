const { Router } = require('express');

const controller = require('../controllers/registroDocente.controller');
const { validateCreate, validateUpdate } = require('../validators/registroDocente.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const registroDocenteModel = require('../models/registroDocente.model');
const auditar = require('../middlewares/auditar');

const router = Router({ mergeParams: true });

const audit = auditar('registros_docentes', (req) => registroDocenteModel.findOne(req.params.conselhoId, req.params.id));

router.param('id', validateIdParam);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateCreate, audit, controller.create);
router.put('/:id', validateUpdate, audit, controller.update);
router.delete('/:id', audit, controller.remove);

module.exports = router;

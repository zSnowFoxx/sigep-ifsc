const { Router } = require('express');

const controller = require('../controllers/curso.controller');
const { validateCreate, validateUpdate } = require('../validators/curso.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const cursoModel = require('../models/curso.model');
const auditar = require('../middlewares/auditar');

const router = Router();

const audit = auditar('cursos', (req) => cursoModel.findById(req.params.id));

router.param('id', validateIdParam);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateCreate, audit, controller.create);
router.put('/:id', validateUpdate, audit, controller.update);
router.delete('/:id', audit, controller.remove);

module.exports = router;

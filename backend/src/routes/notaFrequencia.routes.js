const { Router } = require('express');

const controller = require('../controllers/notaFrequencia.controller');
const { validateCreate, validateUpdate } = require('../validators/notaFrequencia.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const notaFrequenciaModel = require('../models/notaFrequencia.model');
const auditar = require('../middlewares/auditar');

const router = Router();

const audit = auditar('notas_frequencias', (req) => notaFrequenciaModel.findById(req.params.id));

router.param('id', validateIdParam);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateCreate, audit, controller.create);
router.put('/:id', validateUpdate, audit, controller.update);
router.delete('/:id', audit, controller.remove);

module.exports = router;

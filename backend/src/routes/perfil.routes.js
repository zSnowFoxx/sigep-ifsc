const { Router } = require('express');

const controller = require('../controllers/perfil.controller');
const { validateCreate, validateUpdate } = require('../validators/perfil.validator');
const validateIdParam = require('../middlewares/validateIdParam');
const perfilModel = require('../models/perfil.model');
const auditar = require('../middlewares/auditar');

const router = Router();

const audit = auditar('perfis', (req) => perfilModel.findById(req.params.id));

router.param('id', validateIdParam);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateCreate, audit, controller.create);
router.put('/:id', validateUpdate, audit, controller.update);
router.delete('/:id', audit, controller.remove);

module.exports = router;

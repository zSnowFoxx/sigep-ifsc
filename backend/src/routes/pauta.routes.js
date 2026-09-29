const { Router } = require('express');

const controller = require('../controllers/pauta.controller');
const { validateCreate, validateUpdate } = require('../validators/pauta.validator');
const validateIdParam = require('../middlewares/validateIdParam');

const router = Router({ mergeParams: true });

router.param('turmaId', validateIdParam);

router.get('/', controller.getAll);
router.get('/:turmaId', controller.getById);
router.post('/', validateCreate, controller.create);
router.put('/:turmaId', validateUpdate, controller.update);
router.delete('/:turmaId', controller.remove);

module.exports = router;

const { Router } = require('express');

const controller = require('../controllers/turma.controller');
const { validateCreate, validateUpdate } = require('../validators/turma.validator');
const validateIdParam = require('../middlewares/validateIdParam');

const router = Router();

router.param('id', validateIdParam);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateCreate, controller.create);
router.put('/:id', validateUpdate, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;

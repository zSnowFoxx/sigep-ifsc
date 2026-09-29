const { Router } = require('express');

const controller = require('../controllers/user.controller');
const { validateCreate, validateUpdate } = require('../validators/user.validator');

const router = Router();

router.get('/', controller.getAll);
router.get('/:siape', controller.getById);
router.post('/', validateCreate, controller.create);
router.put('/:siape', validateUpdate, controller.update);
router.delete('/:siape', controller.remove);

module.exports = router;
